# Serverless Notes API

A secure, serverless REST API for managing notes built with Node.js, AWS Lambda, and DynamoDB.

## Features

- 🔐 User authentication with Amazon Cognito
- 📝 CRUD operations for notes
- 🔒 Secure authorization
- 🚀 Serverless architecture
- 📦 DynamoDB storage
- ⚡ Fast and scalable

## API Endpoints

### Authentication (via Amazon Cognito)

- User authentication is handled through Amazon Cognito User Pools
- Client-side authentication flow using Cognito SDK
- Secure token-based access

### Notes

- `GET /notes` - Get all notes for authenticated user
- `GET /notes/{id}` - Get a specific note
- `POST /notes` - Create a new note
- `PUT /notes/{id}` - Update an existing note
- `DELETE /notes/{id}` - Delete a note

## Tech Stack

- Node.js 18.x
- AWS Lambda
- Amazon DynamoDB
- Amazon Cognito
- Serverless Framework
- CORS enabled

## Prerequisites

- Node.js 18.x or later
- AWS account with configured credentials
- Serverless Framework CLI

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure Cognito User Pool settings in `serverless.yml`:
```yaml
resources:
  Resources:
    CognitoUserPool:
      Type: AWS::Cognito::UserPool
      Properties:
        # Your Cognito configuration here
```

## Deployment

Deploy to AWS:
```bash
serverless deploy
```

## Local Development

Run the API locally:
```bash
serverless offline
```

## API Usage

### Authentication Flow

1. Users sign up and sign in through Cognito User Pool
2. Use the Cognito ID token in API requests:
```bash
curl https://your-api-url/notes \
  -H "Authorization: Bearer COGNITO_ID_TOKEN"
```

### Create Note
```bash
curl -X POST https://your-api-url/notes \
  -H "Authorization: Bearer COGNITO_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Note content"}'
```

### Get Notes
```bash
curl https://your-api-url/notes \
  -H "Authorization: Bearer COGNITO_ID_TOKEN"
```

## Security

- Authentication handled by Amazon Cognito User Pools
- Secure token-based authorization
- DynamoDB table-level permissions
- API Gateway authorization with Cognito authorizer

## Project Structure

```
.
├── src/
│   └── handlers/
│       ├── create.js
│       ├── delete.js
│       ├── get.js
│       ├── list.js
│       └── update.js
├── serverless.yml
└── package.json
```

## DynamoDB Schema

### Notes Table
```
{
  id: String (Hash Key),
  userId: String (GSI, Cognito sub),
  title: String,
  content: String,
  createdAt: Number,
  updatedAt: Number
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License