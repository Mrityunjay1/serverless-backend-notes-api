const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const noteId = event.pathParameters.id;
    const { title, content } = JSON.parse(event.body);

    // Input validation
    if (!title || !content) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Title and content are required",
        }),
      };
    }

    // Check if note exists and belongs to user
    const note = await ddbDocClient.send(
      new GetCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
      })
    );

    if (!note.Item || note.Item.userId !== userId) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Note not found",
        }),
      };
    }

    // Update the note
    const timestamp = new Date().getTime();
    const result = await ddbDocClient.send(
      new UpdateCommand({
        TableName: process.env.NOTES_TABLE,
        Key: { id: noteId },
        UpdateExpression:
          "SET title = :title, content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":title": title,
          ":content": content,
          ":updatedAt": timestamp,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error("Error updating note:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Could not update note",
      }),
    };
  }
};
