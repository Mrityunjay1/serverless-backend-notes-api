const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const jsonBodyParser = require("@middy/http-json-body-parser");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const login = async (event) => {
  const { email, password } = event.body;

  try {
    const result = await dynamoDB
      .get({
        TableName: process.env.USERS_TABLE,
        Key: { email },
      })
      .promise();

    const user = result.Item;

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    // Generate token with userId included in the payload
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error("Error during login:", error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error during login" }),
    };
  }
};

module.exports.handler = middy(login).use(jsonBodyParser()).use(cors());
