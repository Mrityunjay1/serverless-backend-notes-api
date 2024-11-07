const AWS = require("aws-sdk");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const jsonBodyParser = require("@middy/http-json-body-parser");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const updateNote = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const { id } = event.pathParameters;
  const { title, content } = event.body;
  const timestamp = new Date().getTime();

  try {
    // Check if note exists and belongs to user
    const note = await dynamoDB
      .get({
        TableName: process.env.NOTES_TABLE,
        Key: { id },
      })
      .promise();

    if (!note.Item || note.Item.userId !== userId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Note not found" }),
      };
    }

    const updatedNote = await dynamoDB
      .update({
        TableName: process.env.NOTES_TABLE,
        Key: { id },
        UpdateExpression:
          "SET title = :title, content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":title": title,
          ":content": content,
          ":updatedAt": timestamp,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Change this to your frontend URL in production
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify(updatedNote.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Change this to your frontend URL in production
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: "Error updating note" }),
    };
  }
};

module.exports.handler = middy(updateNote).use(jsonBodyParser()).use(cors());
