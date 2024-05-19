import request from 'supertest';
import app from '@/.';

describe('GET /api/products', () => {
  it('Should return all products', async () => {
    const res = await request(app).get('/api/products');
    return expect(res.statusCode).toBe(200);
  });
});
