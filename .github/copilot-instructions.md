# Viral Quote Engine API

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This is a minimal repository for a viral quote engine API project that is currently in its initial state with only basic files (LICENSE and README.md). The repository name suggests it is intended to be an API for serving viral quotes, but no application code has been implemented yet.

## Current Repository State
- Repository contains only: LICENSE, README.md, and .git directory
- No application code, dependencies, or build configuration exists yet
- No package.json, requirements.txt, or other project configuration files
- Node.js v20.19.4 and npm v10.8.2 are available in the environment
- Python 3.12.3 is available in the environment

## Working Effectively

### Basic Repository Operations
- Clone the repository: `git clone <repository-url>`
- Check repository status: `git status` 
- View repository contents: `ls -la`
- View README: `cat README.md`

### Current Command Limitations
The following commands will FAIL in the current state:
- `npm install` - fails with "Could not read package.json" (no package.json exists)
- `npm run <script>` - fails (no package.json exists)
- `pip install -r requirements.txt` - fails (no requirements.txt exists)
- `python -m <module>` - fails (no Python modules exist)
- `make` - fails (no Makefile exists)
- Any build or test commands - fails (no build system configured)

### Development Setup (For Future Implementation)
When application code is added, these patterns typically apply for API projects:

#### For Node.js/Express API:
- Initialize project: `npm init -y` (takes 1-2 seconds)
- Install dependencies: `npm install express cors helmet dotenv` (takes 4-10 seconds)
- Install dev dependencies: `npm install --save-dev nodemon jest supertest eslint`
- Create basic structure: `mkdir -p src routes controllers models`
- Create server file: `touch server.js` or `touch src/app.js`
- Run development server: `npm run dev` or `node server.js`
- Run tests: `npm test` (requires test script in package.json)

#### For Python/FastAPI:
- Create virtual environment: `python3 -m venv venv` (takes 1-3 seconds)
- Activate virtual environment: `source venv/bin/activate`
- Create requirements.txt: `echo "fastapi\nuvicorn[standard]" > requirements.txt`
- Install dependencies: `pip install -r requirements.txt` (takes 3-15 seconds)
- Run development server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- Run tests: `pytest` (requires pytest installation)

#### For Python/Flask:
- Create virtual environment: `python3 -m venv venv`  
- Activate virtual environment: `source venv/bin/activate`
- Install Flask: `pip install flask flask-cors python-dotenv`
- Run development server: `flask run` or `python app.py`

## Validation

### Current State Validation
- ALWAYS run `ls -la` to confirm repository contents
- ALWAYS run `git status` to check working directory state
- Repository should contain only: LICENSE, README.md, .git/, and .github/ directories

### Manual Validation Scenarios (When Implemented)
After developing the API, ALWAYS validate these complete workflows:

#### Basic API Functionality Test
1. Start the API server (FastAPI: `uvicorn main:app --reload`, Express: `npm start` or `node server.js`)
2. Test root endpoint: `curl http://localhost:8000/` (FastAPI) or `curl http://localhost:3000/` (Express)
3. Test health check: `curl http://localhost:8000/health` 
4. Test quotes endpoint: `curl http://localhost:8000/api/quotes`
5. Test random quote: `curl http://localhost:8000/api/quotes/random`
6. Test specific quote: `curl http://localhost:8000/api/quotes/1`
7. Test error handling: `curl http://localhost:8000/api/quotes/999`
8. Verify all endpoints return expected JSON responses
9. Stop the server (Ctrl+C)

#### End-to-End Development Test
1. Initialize project with appropriate commands (npm init or create requirements.txt)
2. Install dependencies (npm install or pip install)
3. Create basic server with sample endpoints
4. Start server and verify it responds to requests
5. Test at least 3 different endpoints including error cases
6. Run linting if configured
7. Run tests if configured

## Build and Test Expectations

### Current State
- No build process exists - builds will fail
- No tests exist - test commands will fail
- No linting configuration exists - lint commands will fail

### Expected Future Timeouts (when implemented)
- **NEVER CANCEL**: npm install typically takes 4-10 seconds for basic packages, up to 60 seconds for complex projects. Set timeout to 5+ minutes.
- **NEVER CANCEL**: pip install for API frameworks typically takes 3-15 seconds. Set timeout to 2+ minutes.
- **NEVER CANCEL**: Python virtual environment creation takes 1-3 seconds. Set timeout to 30+ seconds.
- **NEVER CANCEL**: Initial build may take 30 seconds to 5 minutes depending on project size. Set timeout to 10+ minutes.
- **NEVER CANCEL**: Test suite may take 5 seconds to 2 minutes. Set timeout to 5+ minutes.
- **NEVER CANCEL**: Linting typically takes 1-10 seconds. Set timeout to 2+ minutes.
- **NEVER CANCEL**: Server startup takes 1-5 seconds. Set timeout to 30+ seconds.

## Common API Development Patterns

### RESTful Quote API Endpoints (Future Implementation)
Typical endpoints for a quote engine API:
- `GET /api/quotes` - Get all quotes (with pagination)
- `GET /api/quotes/random` - Get random quote
- `GET /api/quotes/:id` - Get specific quote
- `POST /api/quotes` - Create new quote (requires authentication)
- `PUT /api/quotes/:id` - Update quote (requires authentication)
- `DELETE /api/quotes/:id` - Delete quote (requires authentication)
- `GET /api/quotes/category/:category` - Get quotes by category
- `GET /api/quotes/search?q=term` - Search quotes

### Testing Scenarios (When Implemented)
- Test GET /api/quotes returns array of quotes
- Test GET /api/quotes/random returns single random quote
- Test pagination works correctly
- Test search functionality
- Test error handling for invalid quote IDs
- Test rate limiting if implemented
- Test CORS headers if needed for web applications

## Environment Setup

### Available Tools
- Node.js v20.19.4: `/usr/local/bin/node`
- npm v10.8.2: Available for JavaScript/TypeScript projects
- Python 3.12.3: `/usr/bin/python3`
- pip: Available for Python projects
- git: Available for version control

### Recommended First Steps for Development
1. Decide on technology stack (Node.js/Express, Python/FastAPI, etc.)
2. Initialize project configuration (`npm init` or create requirements.txt)
3. Set up basic project structure
4. Implement basic health check endpoint
5. Add environment configuration (.env file)
6. Set up testing framework
7. Configure linting and formatting tools
8. Create GitHub workflows for CI/CD

## CRITICAL REMINDERS
- **REPOSITORY IS MINIMAL**: Contains no application code yet
- **NO BUILD SYSTEM**: Standard build/test commands will fail
- **VALIDATION REQUIRED**: Always check current state with `ls -la` and `git status`
- **FUTURE-READY**: Instructions prepared for common API development patterns
- Always validate any new setup commands before documenting them as working
- Always test complete user scenarios when application code exists

## Common Tasks Reference

### Current Repository Contents
```bash
ls -la
total 52
drwxr-xr-x 3 runner docker  4096 Aug 27 17:29 .
drwxr-xr-x 3 runner docker  4096 Aug 27 17:28 ..
drwxr-xr-x 7 runner docker  4096 Aug 27 17:31 .git
drwxr-xr-x 2 runner docker  4096 Aug 27 17:32 .github
-rw-r--r-- 1 runner docker 35149 Aug 27 17:29 LICENSE
-rw-r--r-- 1 runner docker    24 Aug 27 17:29 README.md
```

### README.md Contents
```bash
cat README.md
# viral-quote-engine-api
```

### Git Status (Clean State)
```bash
git status
On branch copilot/fix-26
Your branch is up to date with 'origin/copilot/fix-26'.

nothing to commit, working tree clean
```