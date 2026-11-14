const request = require('supertest');
const app = require('../../src/app');
const { pool, migrate } = require('../../src/db');

beforeAll(async () => {
  await migrate();
});

beforeEach(async () => {
  await pool.query('TRUNCATE tasks RESTART IDENTITY');
});

afterAll(async () => {
  await pool.end();
});

describe('API /tasks (com PostgreSQL real)', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('POST cria e GET lista', async () => {
    const created = await request(app)
      .post('/tasks')
      .send({ title: 'Tarefa 1' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      id: 1,
      title: 'Tarefa 1',
      done: false,
    });

    const list = await request(app).get('/tasks');
    expect(list.body).toHaveLength(1);
  });

  test('POST com título inválido retorna 400', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });
    expect(res.status).toBe(400);
  });

  test('PUT atualiza e DELETE remove', async () => {
    await request(app).post('/tasks').send({ title: 'A' });
    const upd = await request(app)
      .put('/tasks/1')
      .send({ title: 'B', done: true });
    expect(upd.status).toBe(200);
    expect(upd.body).toMatchObject({ title: 'B', done: true });

    expect((await request(app).delete('/tasks/1')).status).toBe(204);
    expect((await request(app).get('/tasks/1')).status).toBe(404);
  });

  test('id inválido retorna 400', async () => {
    expect((await request(app).get('/tasks/abc')).status).toBe(400);
  });

  test('resiste a SQL injection no título', async () => {
    const evil = "x'); DROP TABLE tasks;--";
    const res = await request(app).post('/tasks').send({ title: evil });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(evil);
    expect((await request(app).get('/tasks')).status).toBe(200);
  });
});
