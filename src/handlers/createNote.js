const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();
    const userId = event.requestContext.authorizer.claims.sub;

    const note = {
      id: uuidv4(),
      userId: userId,
      title: data.title,
      content: data.content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await ddbDocClient.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
    );

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(note),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Could not create note" }),
    };
  }
};
