const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, PutCommand, DynamoDBDocumentClient, BatchWriteCommand  } = require('@aws-sdk/lib-dynamodb');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const features = require('./features');

const { auth } = require('express-oauth2-jwt-bearer');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'upload-csv/' });


const twilioClient = twilio(
	process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN
);

const checkJwt = auth({
	audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
	issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
	tokenSigningAlg: 'RS256'
});

// Create Document client for easier usage
const dynamoDBClient = new DynamoDBClient({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

app.get('/fetch-data', checkJwt, async (req, res) => {
	try {
		let items = [];
		let ExclusiveStartKey;
		
		do {
			const data = await docClient.send(new ScanCommand({
				TableName: 'Clients',
				ExclusiveStartKey, // for pagination
			}));

			items = items.concat(data.Items);
			ExclusiveStartKey = data.LastEvaluatedKey; // continue if more data exists

		} while (ExclusiveStartKey);
		
		res.json({ success: true, items: items });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.get('/fetch-histories', checkJwt , async (req, res) => {
	try {
		// Calculate date 7 days ago in ISO format
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		twilioClient.messages
			.list({
				dateSentAfter: sevenDaysAgo,
				limit: 1000, // Adjust as needed
			})
			.then(messages => {
				let sentMessages = messages.filter(msg => msg.direction.startsWith('outbound'));

				sentMessages = sentMessages.map(msg => {
					const dateSent = msg.dateSent.toISOString().split('T')[0]; // Format: YYYY-MM-DD

					return {
						From: msg.from,
						To: msg.to,
						Body: msg.body,
						Status: msg.status.toUpperCase(),
						Date: dateSent
					}
				});

				res.json({ success: true, sentMessages: sentMessages});
			})
			.catch(error => {
				console.error('Error fetching messages:', error);
				res.status(500).json({ success: false, error: error.message });
			});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post('/send-sms', checkJwt, async (req, res) => {
	const { data, message } = req.body;
	const footer = "\n\nReply STOP to opt out.";
	const fullMessage = `${message}${footer}`;
	const countryCode = '+1'

	// Check outed out phone
	let isSuccess = true;
	let optedOut = [];

	try {
		for (const client of data) {
			try {
				const res = await twilioClient.messages.create({
					body: fullMessage,
					from: process.env.TWILIO_PHONE_NUMBER,
					to: `${countryCode}${client.PhoneNumber.toString()}`
				});

			} catch (error) {
				if (error.code === 21610) {
					// Write to Opted Out table
					optedOut.push(client)

					const params = {
						TableName: "OptedOut",
						Item: client
					};

					const command = new PutCommand(params);
					await docClient.send(command);
				}

				isSuccess = false;
			}
		}

		res.json({ success: isSuccess, optedOut: optedOut});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post('/upload-csv', checkJwt, upload.single('file'), async (req, res) => {

	if (!req.file) {
		return res.status(400).send('No file uploaded');
	}

	const BATCH_SIZE = 25;

	const chunkArray = (arr, size) => {
		return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
			arr.slice(i * size, i * size + size)
		);
	};

	try {
		// Read CSV file buffer
		const filePath = path.resolve(__dirname, req.file.path);
		const fileBuffer = fs.readFileSync(filePath);
		const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		let data = xlsx.utils.sheet_to_json(sheet);

		// Convert PhoneNumber to string
		data = data.map((row) => ({
			...row,
			Name: row['Full Name'] ? row['Full Name'].toString() : row.Phone?.toString(),
			PhoneNumber: row.Phone?.toString(),
			Email: row.Email?.toString(),
		}));

		const chunks = chunkArray(data, BATCH_SIZE);

		fs.unlinkSync(filePath);

		// Delete All existing items
		await features.deleteAllItems();

		for (const chunk of chunks) {
			const requestItems = chunk.map(item => ({
				PutRequest: { Item: item },
			}));
		  
			const command = new BatchWriteCommand({
				RequestItems: {
					Clients: requestItems,
				},
			});

			const response = await docClient.send(command);

			// Retry unprocessed items
			if (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
				console.warn('🔁 Retrying unprocessed items...');
				await batchWriteItems(response.UnprocessedItems.Clients.map(req => req.PutRequest.Item));
			} else {
				console.log(`✅ Successfully wrote ${chunk.length} items`);
			}
		}

		res.json({ success: true, rows: data });

		} catch (err) {
			console.error('Error:', err);
			if (!res.headersSent) {
				res.status(500).json({ success: false, error: err });
			}
		}
});


app.listen(5000, () => console.log('Backend running on port 5000'));