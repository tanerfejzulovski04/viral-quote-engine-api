const request = require('supertest');
const app = require('../src/app');

describe('API Response Envelopes', () => {
  let authToken;

  // Get authentication token before running tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    
    authToken = response.body.data.token;
  });

  describe('Success Response Envelopes', () => {
    test('Health endpoint returns standard success envelope', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty('error');
      expect(response.body.data).toHaveProperty('status', 'ok');
    });

    test('API info endpoint returns success envelope with data', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty('error');
      expect(response.body.data).toHaveProperty('name', 'Viral Quote Engine API');
    });

    test('Get quotes returns success envelope with data and meta', async () => {
      const response = await request(app)
        .get('/api/quotes')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body).not.toHaveProperty('error');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('limit');
      expect(response.body.meta).toHaveProperty('offset');
      expect(response.body.meta).toHaveProperty('hasMore');
    });

    test('Get random quote returns success envelope', async () => {
      const response = await request(app)
        .get('/api/quotes/random')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty('error');
      expect(response.body.data).toHaveProperty('text');
      expect(response.body.data).toHaveProperty('author');
    });

    test('Login returns success envelope with token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty('error');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    test('Create quote returns success envelope with 201 status', async () => {
      const response = await request(app)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          text: 'This is a test quote for our standardized envelope system.',
          author: 'Test Author',
          category: 'general'
        })
        .expect(201);

      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty('error');
      expect(response.body.data).toHaveProperty('text');
      expect(response.body.data).toHaveProperty('author');
      expect(response.body.data).toHaveProperty('id');
    });
  });

  describe('Error Response Envelopes', () => {
    test('404 error returns standard error envelope', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('message');
    });

    test('Validation error returns standard error envelope with details', async () => {
      const response = await request(app)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          text: 'Short', // Too short (min 10 chars)
          author: 'A' // Too short (min 2 chars)
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('details');
      expect(Array.isArray(response.body.error.details)).toBe(true);
    });

    test('Authentication error returns standard error envelope', async () => {
      const response = await request(app)
        .post('/api/quotes')
        .send({
          text: 'This should fail due to missing auth token.',
          author: 'Test Author'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'AUTH_REQUIRED');
      expect(response.body.error).toHaveProperty('message');
    });

    test('Invalid JWT token returns standard error envelope', async () => {
      const response = await request(app)
        .post('/api/quotes')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          text: 'This should fail due to invalid token.',
          author: 'Test Author'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'AUTH_ERROR');
      expect(response.body.error).toHaveProperty('message');
    });

    test('Quote not found returns standard error envelope', async () => {
      const response = await request(app)
        .get('/api/quotes/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'QUOTE_NOT_FOUND');
      expect(response.body.error).toHaveProperty('message');
    });

    test('Invalid login credentials return standard error envelope', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body).not.toHaveProperty('data');
      expect(response.body.error).toHaveProperty('code', 'INVALID_CREDENTIALS');
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('Response Envelope Consistency', () => {
    test('All success responses have data property', async () => {
      const endpoints = [
        { method: 'get', path: '/health' },
        { method: 'get', path: '/api' },
        { method: 'get', path: '/api/quotes' },
        { method: 'get', path: '/api/quotes/random' },
        { method: 'get', path: '/api/quotes/categories' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        expect(response.body).toHaveProperty('data');
        expect(response.body).not.toHaveProperty('error');
      }
    });

    test('All error responses have error property with required fields', async () => {
      const endpoints = [
        { method: 'get', path: '/nonexistent', expectedCode: 'NOT_FOUND' },
        { method: 'get', path: '/api/quotes/invalid-id', expectedCode: 'QUOTE_NOT_FOUND' },
        { method: 'post', path: '/api/quotes', expectedCode: 'AUTH_REQUIRED' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        expect(response.body).toHaveProperty('error');
        expect(response.body).not.toHaveProperty('data');
        expect(response.body.error).toHaveProperty('code', endpoint.expectedCode);
        expect(response.body.error).toHaveProperty('message');
        expect(typeof response.body.error.message).toBe('string');
      }
    });
  });
});