import request from 'supertest';
import app from '@/.';
import prisma from '@/db';

describe('GET /api/products', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });
  afterEach(async () => {
    await prisma.$disconnect();
  });
  it('Should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
    expect(res.body).toHaveProperty('data');
  });
  it('Should return products by name', async () => {
    const res = await request(app).get('/api/products?name=gayo');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  it('Should return products by category', async () => {
    const res = await request(app).get('/api/products?category=kopi');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  it('Should return products order by name sorting ascendant', async () => {
    const res = await request(app).get('/api/products?orderBy=name&sort=asc');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
    expect(res.body.data[0].name).toContain('a');
  });

  it('Should return 0 products by name if product doesnt exist', async () => {
    const res = await request(app).get('/api/products?name=xyz');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success');
    expect(res.body.data.length).toEqual(0);
  });
});

describe('GET /api/products/:id', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });
  afterEach(async () => {
    await prisma.$disconnect();
  });
  const id = '52a6dff9-35fb-4e19-9933-02b9875d78ac';
  it('Should return product by id', async () => {
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });
  it('Should return 404 not found product', async () => {
    const res = await request(app).get(`/api/products/asdf`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/products', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });
  afterEach(async () => {
    await prisma.$disconnect();
  });
  it('Should return error if images are empty', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('name', 'single')
      .field('description', 'kopi baru')
      .field('price', 150000)
      .field('stock', 100)
      .field('category', 'kopi')
      .field('variants', ['biji kopi', 'giling halus']);
    expect(res.statusCode).toBe(400);
  });
  it('Should return error if variants are empty', async () => {
    const res = await request(app)
      .post('/api/products')
      .attach('images', `C:Users/nadiz/Downloads/hutao23.png`)
      .field('name', 'single')
      .field('description', 'kopi baru')
      .field('price', 150000)
      .field('stock', 100)
      .field('category', 'kopi');
    expect(res.statusCode).toBe(400);
  });
  it('Should insert new product into DB', async () => {
    const res = await request(app)
      .post('/api/products')
      .attach('images', `C:Users/nadiz/Downloads/hutao23.png`)
      .field('name', 'single')
      .field('description', 'kopi baru')
      .field('price', 150000)
      .field('stock', 100)
      .field('category', 'kopi')
      .field('variants', ['biji kopi', 'giling halus']);
    expect(res.statusCode).toBe(201);
  });
});

describe('PATCH /api/products:id', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });
  afterEach(async () => {
    await prisma.$disconnect();
  });
  const productId = request(app)
    .get('/api/products?name=single')
    .then((res) => res.body.data[0].id);
  it('Should return error if required fields are missing', async () => {
    const id = await productId;
    const res = await request(app)
      .patch(`/api/products/${id}`)
      .field('name', 'single')
      .field('description', 'kopi single updated');
    expect(res.statusCode).toBe(400);
  });
  it('Should return 404 if product not exist on DB', async () => {
    const res = await request(app)
      .patch(`/api/products/asdf`)
      .attach('images', `C:Users/nadiz/Downloads/hutao23.png`)
      .field('name', 'single')
      .field('description', 'kopi baru updated')
      .field('price', 99000)
      .field('stock', 100)
      .field('category', 'kopi')
      .field('variants', ['biji kopi', 'giling halus', 'giling kasar']);
    expect(res.statusCode).toBe(404);
  });
  it('Should update product', async () => {
    const id = await productId;
    const res = await request(app)
      .patch(`/api/products/${id}`)
      .attach('images', `C:Users/nadiz/Downloads/hutao23.png`)
      .field('name', 'single')
      .field('description', 'kopi baru updated')
      .field('price', 99000)
      .field('stock', 100)
      .field('category', 'kopi')
      .field('variants', ['biji kopi', 'giling halus', 'giling kasar']);
    const updatedRes = await request(app).get(`/api/products/${id}`);
    const data = updatedRes.body.data;
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Success updated product');
    expect(data.description).toContain('kopi baru updated');
  }, 10000);
});

describe('DELETE /api/products/:id', () => {
  beforeEach(async () => {
    await prisma.$connect();
  });
  afterEach(async () => {
    await prisma.$disconnect();
  });
  const product = request(app)
    .get('/api/products?name=single')
    .then((res) => res.body.data[0]);
  it('Should return 404 if product is not exist in DB', async () => {
    const res = await request(app).delete(`/api/products/asdf`);
    expect(res.statusCode).toBe(404);
  });
  it('Should delete product', async () => {
    const data = await product;
    const res = await request(app).delete(`/api/products/${data.id}`);
    expect(res.statusCode).toBe(200);
  });
});
