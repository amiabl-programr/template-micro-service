# Template Service API

## Overview

This project is a high-performance microservice designed for efficient template management, leveraging **TypeScript**, **Node.js** with **Fastify**, and **Prisma ORM** for robust data interactions with **PostgreSQL**. It features automatic versioning of templates and comprehensive API endpoints for CRUD operations.

## Features

- **Fastify**: High-performance, low-overhead web framework for building scalable APIs.
- **Prisma**: Type-safe ORM for intuitive and robust database interactions with PostgreSQL.
- **PostgreSQL**: Reliable and powerful relational database for persistent storage.
- **Template Management**: Comprehensive API for creating, retrieving, and updating templates.
- **Template Versioning**: Automatic creation of template versions, ensuring historical data integrity for content changes.
- **Pagination & Search**: Advanced filtering and search capabilities for efficient template retrieval.
- **Transactional Operations**: Ensures atomicity and data consistency for complex template operations.
- **Health Check**: Dedicated endpoint for monitoring service status and readiness.

## Getting Started

To get this Template Service API up and running on your local machine, follow these steps.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/amiabl-programr/template-micro-service.git
    cd template-service-microservice
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Database**:
    Ensure you have a PostgreSQL database instance running and accessible. Update the `DATABASE_URL` in your `.env` file accordingly.
4.  **Run Prisma Migrations**:
    Apply the database schema and create the necessary tables:
    ```bash
    npx prisma migrate dev --name init
    ```
    This command applies any pending migrations and keeps your database schema in sync.
5.  **Start the Service**:
    For a production-like environment:
    ```bash
    npm run dev
    ```

### Environment Variables

All required environment variables must be defined in a `.env` file in the project root. A sample `.env` example is provided.

- `DATABASE_URL`: Your PostgreSQL connection string.
  - Example: `postgresql://user:password@localhost:5432/template_db?schema=public`
- `PORT`: The port number the Fastify server will listen on.
  - Example: `3000` (Defaults to `3000` if not specified)
- `NODE_ENV`: The application environment (e.g., `development`, `production`).
  - Example: `development`

## API Documentation

The Template Service API provides a set of RESTful endpoints for managing templates and their versions.

### Base URL

`http://localhost:3000` (assuming default port)

### Endpoints

#### GET /health

Checks the health status of the API.

**Request**: No payload.

**Response**:

```json
{
  "success": true,
  "message": "Template Service is healthy",
  "timestamp": "2023-10-27T10:00:00.000Z"
}
```

**Errors**:

- `500 Internal Server Error`: An unexpected error occurred while checking service health.

#### GET /templates

Retrieves a list of templates with optional pagination and filtering.

**Request**:
Query Parameters:

- `page` (optional, integer): The page number to retrieve. Defaults to `1`.
- `limit` (optional, integer): The number of templates per page. Defaults to `10`, maximum `100`.
- `language` (optional, string): Filters templates by a specific language (e.g., `en`, `fr`).
- `query` (optional, string): Searches templates by `name` or `subject` (case-insensitive).

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7b8d9-e0a1-4f2b-9c3d-5e6a7b8c9d0e",
      "name": "Welcome Email",
      "subject": "Welcome to our service!",
      "body": "Hi {{user_name}}, welcome to our platform...",
      "language": "en",
      "version_number": 1,
      "createdAt": "2023-10-27T10:00:00.000Z"
    },
    {
      "id": "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
      "name": "Password Reset",
      "subject": "Reset your password",
      "body": "Click the following link to reset your password: {{reset_link}}",
      "language": "en",
      "version_number": 1,
      "createdAt": "2023-10-26T09:30:00.000Z"
    }
  ],
  "message": "Templates fetched successfully",
  "meta": {
    "total": 2,
    "limit": 10,
    "page": 1,
    "total_pages": 1,
    "has_next": false,
    "has_previous": false
  }
}
```

**Errors**:

- `500 Internal Server Error`: An unexpected error occurred while fetching templates.

#### GET /templates/:id

Retrieves a single template by its unique ID.

**Request**:
Path Parameters:

- `id` (required, string): The UUID of the template to retrieve.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "c1f7b8d9-e0a1-4f2b-9c3d-5e6a7b8c9d0e",
    "name": "Welcome Email",
    "subject": "Welcome to our service!",
    "body": "Hi {{user_name}}, welcome to our platform...",
    "language": "en",
    "version_number": 1,
    "createdAt": "2023-10-27T10:00:00.000Z"
  },
  "message": "Template fetched successfully"
}
```

**Errors**:

- `400 Bad Request`: Template ID is required.
- `404 Not Found`: No template found with the provided ID.
- `500 Internal Server Error`: An unexpected error occurred while fetching the template.

#### POST /templates

Creates a new template and its initial version.

**Request**:

```json
{
  "name": "New User Onboarding",
  "subject": "Getting Started with Our Platform",
  "body": "Hello {{username}}, here are your first steps...",
  "language": "en",
  "version_number": 1
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "f5e9d2c1-b0a3-4e6f-7d8c-9a0b1c2d3e4f",
    "name": "New User Onboarding",
    "subject": "Getting Started with Our Platform",
    "body": "Hello {{username}}, here are your first steps...",
    "language": "en",
    "version_number": 1,
    "createdAt": "2023-10-27T10:30:00.000Z"
  },
  "message": "Template created successfully"
}
```

**Errors**:

- `400 Bad Request`: Missing required fields (`name`, `subject`, `body`, `language`, `version_number`) or `version_number` is not a positive integer.
- `409 Conflict`: A template with the same name and language already exists.
- `500 Internal Server Error`: An unexpected error occurred while creating the template.

#### PATCH /templates/:id

Updates an existing template by its unique ID. If `subject`, `body`, or `version_number` are updated, a new template version is automatically created.

**Request**:
Path Parameters:

- `id` (required, string): The UUID of the template to update.

Payload (partial update):

```json
{
  "subject": "Revised Subject Line for Onboarding",
  "body": "This is the updated body content for onboarding."
}
```

OR

```json
{
  "name": "Onboarding Flow Email",
  "language": "es",
  "version_number": 2
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "f5e9d2c1-b0a3-4e6f-7d8c-9a0b1c2d3e4f",
    "name": "Onboarding Flow Email",
    "subject": "Revised Subject Line for Onboarding",
    "body": "This is the updated body content for onboarding.",
    "language": "es",
    "version_number": 2,
    "createdAt": "2023-10-27T10:30:00.000Z"
  },
  "message": "Template updated successfully"
}
```

**Errors**:

- `400 Bad Request`: Template ID is required, no fields provided for update, or `version_number` is not a positive integer.
- `404 Not Found`: No template found with the provided ID.
- `409 Conflict`: Updating `name` or `language` would result in a duplicate template with an existing name and language combination.
- `500 Internal Server Error`: An unexpected error occurred while updating the template.

## Usage

Once the server is running, you can interact with the API using tools like `curl`, Postman, or any HTTP client.

### Example: Create a New Template

```bash
curl -X POST \
  http://localhost:3000/templates \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Promotional Offer",
    "subject": "Limited Time Discount!",
    "body": "Hi {{customer_name}}, enjoy {{discount_percentage}} off...",
    "language": "en",
    "version_number": 1
  }'
```

### Example: Get All Templates

```bash
curl http://localhost:3000/templates?page=1&limit=5&language=en
```

### Example: Get Template by ID

```bash
curl http://localhost:3000/templates/c1f7b8d9-e0a1-4f2b-9c3d-5e6a7b8c9d0e
```

### Example: Update a Template

```bash
curl -X PATCH \
  http://localhost:3000/templates/f5e9d2c1-b0a3-4e6f-7d8c-9a0b1c2d3e4f \
  -H 'Content-Type: application/json' \
  -d '{
    "subject": "Revised Promotional Offer",
    "version_number": 2
  }'
```

## Technologies Used

This project is built using a modern technology stack to ensure performance, scalability, and maintainability.

| Technology | Description |
| Template Service API
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](package.json)


## Technologies Used

This project is built using a modern technology stack to ensure performance, scalability, and maintainability.

| Technology                                    | Description                                                                            |
| :-------------------------------------------- | :------------------------------------------------------------------------------------- |
| [TypeScript](https://www.typescriptlang.org/) | Primary programming language, providing type safety and enhanced developer experience. |
| [Node.js](https://nodejs.org/)                | JavaScript runtime environment for server-side execution.                              |
| [Fastify](https://www.fastify.io/)            | High-performance, low-overhead, and plugin-oriented web framework.                     |
| [Prisma](https://www.prisma.io/)              | Modern, type-safe ORM for Node.js and TypeScript, simplifying database access.         |
| [PostgreSQL](https://www.postgresql.org/)     | Powerful, open-source object-relational database system.                               |
| [ESLint](https://eslint.org/)                 | Pluggable JavaScript linter to maintain code quality and consistency.                  |
| [Prettier](https://prettier.io/)              | Opinionated code formatter to enforce a consistent style across the codebase.          |

## Author Info

**Victor**

- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/victor-oluwayemi-2b733318a/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BHo4XGyNWQUCw0jykLPqW7Q%3D%3D)

---

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
