const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const noteId = event.pathParameters.id;

    // First, verify the note belongs to the user
    const note = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.NOTES_TABLE,
        Key: {
          id: noteId,
        },
      })
    );

    if (!note.Item || note.Item.userId !== userId) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Note not found" }),
      };
    }

    await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.NOTES_TABLE,
        Key: {
          id: noteId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Note deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Could not delete note" }),
    };
  }
};
