# Viral Quote Engine API

A RESTful API for managing and sharing viral quotes with standardized response envelopes and comprehensive exception handling.

## Features

- ✅ **Standardized Response Envelopes**
  - Success: `{ data, meta? }`
  - Error: `{ error: { code, message, details? } }`
- ✅ **Global Exception Handler** for validation and authentication errors
- ✅ **Authentication** with JWT tokens
- ✅ **Input Validation** with detailed error reporting
- ✅ **Quote Management** (CRUD operations)
- ✅ **Comprehensive Tests** with 100% envelope format verification

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/verify` - Verify JWT token

### Quotes
- `GET /api/quotes` - Get all quotes (with pagination & filtering)
- `GET /api/quotes/random` - Get random quote
- `GET /api/quotes/categories` - Get available categories
- `GET /api/quotes/:id` - Get specific quote
- `POST /api/quotes` - Create new quote (auth required)
- `PUT /api/quotes/:id` - Update quote (auth required)
- `DELETE /api/quotes/:id` - Delete quote (auth required)
- `POST /api/quotes/:id/like` - Like a quote
- `POST /api/quotes/:id/share` - Share a quote

### System
- `GET /health` - Health check
- `GET /api` - API information

## Response Format

### Success Response
```json
{
  "data": { /* response data */ },
  "meta": { /* optional metadata */ }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { /* optional error details */ }
  }
}
```

## Authentication

Login to get a JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Use the token in subsequent requests:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/quotes
```

## Default Users

- Username: `admin`, Password: `admin123`
- Username: `user`, Password: `user123`

## Example Usage

```bash
# Get all quotes
curl http://localhost:3000/api/quotes

# Create a new quote
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "Your quote text here",
    "author": "Author Name",
    "category": "motivation"
  }'

# Get validation error example
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Short", "author": "A"}'
```

## Testing

The test suite verifies that all endpoints return standardized response envelopes:

```bash
npm test
```

Tests cover:
- ✅ Success responses have `data` property
- ✅ Error responses have `error` property with `code` and `message`
- ✅ Validation errors include `details` array
- ✅ Authentication errors return proper error codes
- ✅ All endpoints maintain consistent envelope format