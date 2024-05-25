import app from '@/.';
import request from 'supertest';

const userData = {
  id: 'abc123def456',
  username: 'testing123',
  firstName: 'testing',
  lastName: 'lasttest',
  email: 'testemail123@test.com',
};

describe('POST /api/users', () => {
  it('Should get error validation', async () => {
    const res = await request(app).post('/api/users').send({
      id: 'abc123def456',
      username: 'testing123',
      firstName: 'testing',
      email: 'testemail123@test.com',
    });

    expect(res.statusCode).toBe(400);
  });
  it('Should success create new user', async () => {
    const res = await request(app).post('/api/users').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain('Success create new user');
  });
  it('Should failed create user if username or email is already taken', async () => {
    const res = await request(app).post('/api/users').send(userData);
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/users', () => {
  it('Should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

describe('GET /api/users/:id', () => {
  it('Should return 404 if user is not exist', async () => {
    const res = await request(app).get(`/api/users/123`);
    expect(res.statusCode).toBe(404);
  });
  it('Should return user', async () => {
    const res = await request(app).get(`/api/users/${userData.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.id).toBe(userData.id);
    expect(res.body.data.username).toBe(userData.username);
  });
});

describe('PATCH /api/users/:id', () => {
  it(`Should get error validation`, async () => {
    const res = await request(app).patch(`/api/users/${userData.id}`).send({
      firstName: 'firsttest',
    });
    expect(res.statusCode).toBe(400);
  });
  it(`Should get error 404 if user is not exist`, async () => {
    const res = await request(app).patch(`/api/users/123`).send({
      firstName: 'firsttest',
      lastName: 'lasttesting',
    });

    expect(res.statusCode).toBe(404);
  });
  it(`Should update user's full name`, async () => {
    const res = await request(app).patch(`/api/users/${userData.id}`).send({
      firstName: 'firsttest',
      lastName: 'lasttesting',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success updated user');
  });
});

describe('PATCH /api/users/:id/email', () => {
  it(`Should get error validation`, async () => {
    const res = await request(app)
      .patch(`/api/users/${userData.id}/email`)
      .send({ email: '123' });
    expect(res.statusCode).toBe(400);
  });
  it(`Should get error 404 if user is not exist`, async () => {
    const res = await request(app).patch(`/api/users/123/email`).send({
      email: 'testing12345@test.com',
    });

    expect(res.statusCode).toBe(404);
  });
  it(`Should update user's email`, async () => {
    const res = await request(app).patch(`/api/users/${userData.id}/email`).send({
      email: 'testing12345@test.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain(`Success updated user's email`);
  });
});

describe('DELETE /api/users/:id', () => {
  it(`Should get error 404 if user is not exist`, async () => {
    const res = await request(app).delete(`/api/users/123`);
    expect(res.statusCode).toBe(404);
  });
  it(`Should delete user`, async () => {
    const res = await request(app).delete(`/api/users/${userData.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain(`Success deleted user`);
  });
});
