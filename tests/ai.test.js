const request = require('supertest');
const app = require('../src/server');

describe('AI Rewrite API', () => {
  describe('POST /api/ai/rewrite', () => {
    it('should accept valid text and return variants', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: 'This is a great quote!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('variants');
      expect(Array.isArray(response.body.variants)).toBe(true);
      expect(response.body.variants.length).toBeGreaterThanOrEqual(3);
      response.body.variants.forEach(variant => {
        expect(typeof variant).toBe('string');
        expect(variant.length).toBeGreaterThan(0);
      });
    });

    it('should accept text with style parameter', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: 'This is a great quote!',
          style: 'casual'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('variants');
      expect(Array.isArray(response.body.variants)).toBe(true);
      expect(response.body.variants.length).toBeGreaterThanOrEqual(3);
    });

    it('should reject empty text with 422', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: ''
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'text',
        message: 'Text cannot be empty'
      });
    });

    it('should reject whitespace-only text with 422', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: '   \n\t  '
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'text',
        message: 'Text cannot be empty'
      });
    });

    it('should reject missing text with 422', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'text',
        message: 'Text is required'
      });
    });

    it('should reject text longer than 200 characters with 422', async () => {
      const longText = 'A'.repeat(201);
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: longText
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'text',
        message: 'Text cannot exceed 200 characters'
      });
    });

    it('should accept text exactly 200 characters long', async () => {
      const text200 = 'A'.repeat(200);
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: text200
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('variants');
      expect(response.body.variants.length).toBeGreaterThanOrEqual(3);
    });

    it('should reject non-string text with 422', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: 123
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'text',
        message: 'Text must be a string'
      });
    });

    it('should reject non-string style with 422', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: 'Valid text',
          style: 123
        });

      expect(response.status).toBe(422);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual({
        field: 'style',
        message: 'Style must be a string'
      });
    });

    it('should handle null style gracefully', async () => {
      const response = await request(app)
        .post('/api/ai/rewrite')
        .send({
          text: 'Valid text',
          style: null
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('variants');
    });
  });

  describe('Health check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('hasOpenAIKey');
      expect(typeof response.body.hasOpenAIKey).toBe('boolean');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Not found');
    });
  });
});