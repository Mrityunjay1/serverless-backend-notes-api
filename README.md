# Serverless Notes API

A secure, serverless REST API for managing notes built with Node.js, AWS Lambda, and DynamoDB.

## Features

- 🔐 User authentication (signup/login)
- 📝 CRUD operations for notes
- 🔒 JWT-based authorization
- 🚀 Serverless architecture
- 📦 DynamoDB storage
- ⚡ Fast and scalable

## API Endpoints

### Authentication

- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login and receive JWT token

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
- Serverless Framework
- JWT for authentication
- Middy middleware
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

3. Update the `JWT_SECRET` in `serverless.yml`:
```yaml
environment:
  JWT_SECRET: your-secret-key-here
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

### Sign Up
```bash
curl -X POST https://your-api-url/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST https://your-api-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create Note
```bash
curl -X POST https://your-api-url/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Note content"}'
```

### Get Notes
```bash
curl https://your-api-url/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- DynamoDB table-level permissions
- API Gateway authorization

## Project Structure

```
.
├── src/
│   ├── auth/
│   │   ├── login.js
│   │   ├── signup.js
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

### Users Table
```
{
  email: String (Hash Key),
  password: String (Hashed)
}
```

### Notes Table
```
{
  id: String (Hash Key),
  userId: String (GSI),
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