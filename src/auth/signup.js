const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const jsonBodyParser = require("@middy/http-json-body-parser");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const signup = async (event) => {
  const { email, password } = event.body;

  try {
    // Check if user exists
    const existingUser = await dynamoDB
      .get({
        TableName: process.env.USERS_TABLE,
        Key: { email },
      })
      .promise();

    if (existingUser.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User already exists" }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await dynamoDB
      .put({
        TableName: process.env.USERS_TABLE,
        Item: {
          email,
          password: hashedPassword,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating user" }),
    };
  }
};

module.exports.handler = middy(signup).use(jsonBodyParser()).use(cors());
