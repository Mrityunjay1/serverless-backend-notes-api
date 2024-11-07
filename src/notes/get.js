const AWS = require("aws-sdk");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getNote = async (event) => {
  const userId = event.requestContext.authorizer.principalId;
  const { id } = event.pathParameters;

  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.NOTES_TABLE,
        Key: { id },
      })
      .promise();

    if (!result.Item || result.Item.userId !== userId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Note not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching note" }),
    };
  }
};

module.exports.handler = middy(getNote).use(cors());
