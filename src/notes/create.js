const AWS = require("aws-sdk");
const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const jsonBodyParser = require("@middy/http-json-body-parser");
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating unique IDs

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const createNote = async (event) => {
  const userId = event.requestContext.authorizer.principalId; // Get userId from the authorizer
  const { title, content } = event.body; // Extract title and content from the request body
  const timestamp = new Date().getTime(); // Get the current timestamp

  // Validate input
  if (!title || !content) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // Change this to your frontend URL in production
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: "Title and content are required" }),
    };
  }

  const note = {
    id: uuidv4(), // Generate a unique ID for the note
    userId, // Associate the note with the user
    title,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    // Save the new note to the database
    await dynamoDB
      .put({
        TableName: process.env.NOTES_TABLE,
        Item: note,
      })
      .promise();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*", // Change this to your frontend URL in production
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify(note), // Return the created note
    };
  } catch (error) {
    console.error("Error creating note:", error); // Log the error for debugging
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Change this to your frontend URL in production
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: "Error creating note" }),
    };
  }
};

module.exports.handler = middy(createNote).use(jsonBodyParser()).use(cors());
