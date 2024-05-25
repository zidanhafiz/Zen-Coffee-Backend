import app from '@/.';
import request from 'supertest';

const bankData = {
  name: 'testing lasttest',
  bank: 'Mandiri',
  account: '1208432812304812',
  userId: 'abc123def456',
};

const userData = {
  id: 'abc123def456',
  username: 'testing123',
  firstName: 'testing',
  lastName: 'lasttest',
  email: 'testemail123@test.com',
};

const getBankIdTest = async () => {
  const res = await request(app).get('/api/banks');
  return res.body.data[0].id;
};

beforeAll(async () => {
  await request(app).post('/api/users').send(userData);
});

describe('POST /api/banks', () => {
  it('Should get validation error', async () => {
    const res = await request(app).post(`/api/banks`).send({
      bank: 'Mandiri',
    });
    expect(res.statusCode).toBe(400);
  });
  it('Should create a new bank account', async () => {
    const res = await request(app).post(`/api/banks`).send(bankData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('Success');
  });
});
describe('GET /api/banks', () => {
  it('Should get all banks data', async () => {
    const res = await request(app).get(`/api/banks`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toContain('Success');
  });
});

describe('GET /api/banks/:id', () => {
  it('Should get error 404', async () => {
    const res = await request(app).get(`/api/banks/123`);
    expect(res.statusCode).toBe(404);
  });
  it('Should get bank data', async () => {
    const id = await getBankIdTest();
    const res = await request(app).get(`/api/banks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toContain('Success');
    expect(res.body.data.name).toBe(bankData.name);
  });
});

describe('PATCH /api/banks/:id', () => {
  it('Should get error 404', async () => {
    const res = await request(app).delete(`/api/banks/123`);
    expect(res.statusCode).toBe(404);
  });
  it('Should delete bank data', async () => {
    const id = await getBankIdTest();
    const res = await request(app).delete(`/api/banks/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
  });
});

afterAll(async () => {
  await request(app).delete(`/api/users/${userData.id}`);
});
