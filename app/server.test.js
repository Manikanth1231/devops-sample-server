const request = require('supertest');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.json({ message: 'DevOps Sample Server', status: 'running' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));

test('GET / returns server info', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('running');
});

test('GET /health returns healthy', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('healthy');
});
