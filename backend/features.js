import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
  
// Create Document client for easier usage
const client = DynamoDBDocumentClient.from(dynamoDBClient);

const deleteAllItems = async () => {
  let ExclusiveStartKey;
  do {
    const scanResult = await client.send(
      new ScanCommand({
        TableName: 'Clients',
        ProjectionExpression: 'PhoneNumber, #N',
        ExpressionAttributeNames: { '#N': 'Name' },
        ExclusiveStartKey,
      })
    );
  
    let items = scanResult.Items;
    
    if (items.length > 0) {
      const chunks = Array.from({ length: Math.ceil(items.length / 25) }, (_, i) =>
        items.slice(i * 25, i * 25 + 25)
      );
        
      for (const chunk of chunks) {
        await client.send(new BatchWriteItemCommand({
          RequestItems: {
            Clients: chunk.map((item) => ({
              DeleteRequest: {
                Key: {
                  PhoneNumber: { S: item.PhoneNumber },
                  Name: { S: item.Name },
                },
              },
            })),
          },
        }));
      }
    }
  
    ExclusiveStartKey = scanResult.LastEvaluatedKey;
  } while (ExclusiveStartKey);
};

export {
  deleteAllItems
};