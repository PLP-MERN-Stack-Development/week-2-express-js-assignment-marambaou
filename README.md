[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19864727&assignment_repo_type=AssignmentRepo)

# 🚀 Express.js RESTful API - Product Management System

A comprehensive RESTful API built with Express.js that implements CRUD operations for products, featuring authentication, validation, error handling, and advanced features like filtering, pagination, and search.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

## ✨ Features

- **RESTful CRUD Operations** for products
- **Authentication Middleware** with API key validation
- **Request Validation** for product creation and updates
- **Comprehensive Error Handling** with custom error classes
- **Advanced Filtering** by category and stock status
- **Pagination Support** for product listings
- **Search Functionality** by name and description
- **Product Statistics** and analytics
- **Request Logging** with timestamps

## 🔧 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- API testing tool (Postman, Insomnia, or curl)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd week-2-express-js-assignment-marambaou
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the Server

1. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

2. The server will start on `http://localhost:3000`

3. You should see: `Server is running on http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Most endpoints require authentication using an API key in the request headers:
```
x-api-key: mysecretapikey
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `inStock` (optional): Filter by stock status (true/false)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl http://localhost:3000/api/products?category=electronics&page=1&limit=5
```

**Example Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 5
  }
}
```

#### 2. Get Product by ID
```http
GET /api/products/:id
```

**Example Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

#### 3. Create New Product
```http
POST /api/products
```

**Headers:**
```
Content-Type: application/json
x-api-key: mysecretapikey
```

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling wireless headphones",
  "price": 150,
  "category": "electronics",
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretapikey" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Noise-cancelling wireless headphones",
    "price": 150,
    "category": "electronics",
    "inStock": true
  }'
```

**Example Response:**
```json
{
  "id": "uuid-generated-id",
  "name": "Wireless Headphones",
  "description": "Noise-cancelling wireless headphones",
  "price": 150,
  "category": "electronics",
  "inStock": true
}
```

#### 4. Update Product
```http
PUT /api/products/:id
```

**Headers:**
```
Content-Type: application/json
x-api-key: mysecretapikey
```

**Request Body:**
```json
{
  "price": 140,
  "inStock": false
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretapikey" \
  -d '{
    "price": 140,
    "inStock": false
  }'
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 140,
  "category": "electronics",
  "inStock": false
}
```

#### 5. Delete Product
```http
DELETE /api/products/:id
```

**Headers:**
```
x-api-key: mysecretapikey
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: mysecretapikey"
```

**Example Response:**
```json
{
  "message": "Product deleted successfully",
  "deletedProduct": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 140,
    "category": "electronics",
    "inStock": false
  }
}
```

#### 6. Search Products
```http
GET /api/products/search?q=search_term
```

**Example Request:**
```bash
curl http://localhost:3000/api/products/search?q=laptop
```

**Example Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "query": "laptop"
}
```

#### 7. Get Product Statistics
```http
GET /api/products/stats
```

**Example Request:**
```bash
curl http://localhost:3000/api/products/stats
```

**Example Response:**
```json
{
  "totalProducts": 3,
  "inStock": 2,
  "outOfStock": 1,
  "categories": {
    "electronics": 2,
    "kitchen": 1
  },
  "averagePrice": 683.33
}
```

## 🔐 Authentication

The API uses API key authentication for protected endpoints. Include the API key in the request headers:

```
x-api-key: mysecretapikey
```

**Protected Endpoints:**
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## ⚠️ Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes:

### Error Responses

**400 Bad Request (Validation Error):**
```json
{
  "error": "Validation Error: Missing or invalid fields"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

**404 Not Found:**
```json
{
  "error": "Product not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error"
}
```

## 📝 Examples

### Complete Product Lifecycle

1. **Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretapikey" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse with RGB lighting",
    "price": 80,
    "category": "electronics",
    "inStock": true
  }'
```

2. **Get all products:**
```bash
curl http://localhost:3000/api/products
```

3. **Filter products by category:**
```bash
curl http://localhost:3000/api/products?category=electronics
```

4. **Search for products:**
```bash
curl http://localhost:3000/api/products/search?q=gaming
```

5. **Update product:**
```bash
curl -X PUT http://localhost:3000/api/products/[product-id] \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretapikey" \
  -d '{
    "price": 75,
    "inStock": false
  }'
```

6. **Delete product:**
```bash
curl -X DELETE http://localhost:3000/api/products/[product-id] \
  -H "x-api-key: mysecretapikey"
```

## 🛠️ Development

### Project Structure
```
├── server.js          # Main Express server file
├── package.json       # Project dependencies
├── README.md         # API documentation
└── .env.example      # Environment variables template
```

### Dependencies
- `express`: Web framework
- `body-parser`: Request body parsing
- `uuid`: Unique ID generation

## 📄 License

This project is part of the Week 2 Express.js assignment.

## 🤝 Contributing

This is an assignment submission. Please refer to the assignment instructions for contribution guidelines. 