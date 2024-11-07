const AWS = require("aws-sdk");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const deleteNote = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const { id } = event.pathParameters;

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

    await dynamoDB
      .delete({
        TableName: process.env.NOTES_TABLE,
        Key: { id },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting note" }),
    };
  }
};

module.exports.handler = middy(deleteNote).use(cors());
