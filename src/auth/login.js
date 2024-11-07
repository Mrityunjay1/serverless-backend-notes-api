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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error during login" }),
    };
  }
};

module.exports.handler = middy(login).use(jsonBodyParser()).use(cors());
