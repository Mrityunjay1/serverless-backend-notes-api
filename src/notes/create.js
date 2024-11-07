const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const jsonBodyParser = require("@middy/http-json-body-parser");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createNote = async (event) => {
  const { title, content } = event.body;
  const userId = event.requestContext.authorizer.principalId;
  const timestamp = new Date().getTime();

  const note = {
    id: uuidv4(),
    userId,
    title,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(note),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating note" }),
    };
  }
};

module.exports.handler = middy(createNote).use(jsonBodyParser()).use(cors());
