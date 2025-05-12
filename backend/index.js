const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');
const AWS = require('aws-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, GetCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const dynamoDBClient = new DynamoDBClient();
// Create Document client for easier usage
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

app.get('/fetch-data', async (req, res) => {
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

app.post('/send-sms', async (req, res) => {
	const { data, message } = req.body;
	try {
		const response = await twilioClient.messages.create({
			body: message,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: to,
		});
		res.json({ success: true, sid: response.sid });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post('/upload-xlsx', async (req, res) => {
	
	try {
		const csvData = req.body.data;
  		console.log('Received xlsx data:', csvData);
		res.json({ message: 'Xlsx data received', rows: csvData.length });
		// const dynamodb = new AWS.DynamoDB.DocumentClient();
		// const params = {
		// 	TableName: 'Clients',
		// 	Item: {
		// 		ID: '3',
		// 		name: 'Bob',
		// 		phoneNumber: '+084935212713',
		// 		email: 'ntahau1989@gmail.com',
		// 	},
		// };

		// dynamodb.put(params, (err, data) => {
		// 	if (err) {
		// 		res.status(500).json({ success: false, error: err });
		// 	} else {
		// 		res.json({ success: true});
		// 	}
		// });

	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.listen(5000, () => console.log('Backend running on port 5000'));