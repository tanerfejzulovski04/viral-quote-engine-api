# Viral Quote Engine API

A Node.js API that generates punchy, viral variants of text using OpenAI's GPT models. Perfect for creating engaging, shareable content.

## Features

- **AI-Powered Text Rewriting**: Generate multiple viral variants of any text
- **Style Support**: Optional style parameter for customized tone
- **Input Validation**: Robust validation with detailed error messages
- **Mock Responses**: Works without OpenAI API key using mock data
- **Production Ready**: Security headers, CORS, logging, and error handling

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

3. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

4. **Test the API**:
   ```bash
   curl -X POST http://localhost:3000/api/ai/rewrite \
     -H "Content-Type: application/json" \
     -d '{"text": "This is amazing!"}'
   ```

## API Endpoints

### POST /api/ai/rewrite

Generate viral variants of text.

**Request Body:**
```json
{
  "text": "Your original text here",
  "style": "casual" // optional
}
```

**Success Response (200):**
```json
{
  "variants": [
    "🚀 Breaking: Your original text here",
    "💥 Your original text here - but make it VIRAL!",
    "🔥 Hot take: your original text here",
    "✨ Plot twist: Your original text here",
    "💎 Golden truth: Your original text here"
  ]
}
```

**Validation Errors (422):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "text",
      "message": "Text cannot be empty"
    }
  ]
}
```

**Validation Rules:**
- `text` is required and must be a string
- `text` cannot be empty or only whitespace
- `text` cannot exceed 200 characters
- `style` is optional but must be a string if provided

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-27T17:23:50.702Z",
  "environment": "development",
  "hasOpenAIKey": false
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | None (uses mock responses) |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `OPENAI_TEMPERATURE` | Creativity level (0-1) | `0.8` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## Development

**Run tests:**
```bash
npm test
```

**Development mode with auto-reload:**
```bash
npm run dev
```

**Project Structure:**
```
src/
  ├── server.js           # Main server setup
  ├── routes/
  │   └── ai.js          # AI rewrite routes
  ├── services/
  │   └── OpenAIService.js  # OpenAI integration
  └── middleware/
      └── validation.js   # Request validation
tests/
  └── ai.test.js         # API tests
```

## API Examples

**Basic usage:**
```bash
curl -X POST http://localhost:3000/api/ai/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text": "Life is beautiful"}'
```

**With style:**
```bash
curl -X POST http://localhost:3000/api/ai/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text": "Success requires dedication", "style": "motivational"}'
```

**Error handling:**
```bash
curl -X POST http://localhost:3000/api/ai/rewrite \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'
# Returns 422 with validation error
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.