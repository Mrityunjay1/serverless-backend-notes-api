const AWS = require("aws-sdk");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const listNotes = async (event) => {
  const userId = event.requestContext.authorizer.principalId;

  try {
    const result = await dynamoDB
      .query({
        TableName: process.env.NOTES_TABLE,
        IndexName: "userIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching notes" }),
    };
  }
};

module.exports.handler = middy(listNotes).use(cors());
