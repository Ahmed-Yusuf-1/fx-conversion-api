import request from 'supertest';
import { app } from '../src/app';

// These tests send real HTTP requests to the app, so they check the whole path:
// JSON in, validation, conversion, status code and JSON out.
describe('POST /convert', () => {
  test('converts CAD to USD (the example from the assignment)', async () => {
    const response = await request(app)
      .post('/convert')
      .send({ from: 'CAD', to: 'USD', amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      from: 'CAD',
      to: 'USD',
      originalAmount: 100,
      convertedAmount: 72,
      exchangeRate: 0.72,
    });
  });

  test('accepts lowercase codes and answers in capitals', async () => {
    const response = await request(app)
      .post('/convert')
      .send({ from: 'usd', to: 'jpy', amount: 1 });

    expect(response.status).toBe(200);
    expect(response.body.from).toBe('USD');
    expect(response.body.to).toBe('JPY');
    expect(response.body.convertedAmount).toBe(152);
  });

  test('answers 400 with the problem when the request is invalid', async () => {
    const response = await request(app)
      .post('/convert')
      .send({ from: 'CAD', to: 'USD', amount: -5 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ['amount must be greater than 0'] });
  });

  test('answers 400 with every problem at once', async () => {
    const response = await request(app)
      .post('/convert')
      .send({ to: 'ABC', amount: '100' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });

  test('answers 400 when the body is not valid JSON', async () => {
    const response = await request(app)
      .post('/convert')
      .set('Content-Type', 'application/json')
      .send('{ "from": "CAD", ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: ['Request body is not valid JSON'] });
  });

  test('answers 413, not 500, when the body is too large', async () => {
    const response = await request(app)
      .post('/convert')
      .send({ from: 'CAD', to: 'USD', amount: 100, padding: 'x'.repeat(200000) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ errors: ['request entity too large'] });
  });

  test('answers 400 when there is no body', async () => {
    const response = await request(app).post('/convert');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errors: ['Request body must be a JSON object with from, to and amount'],
    });
  });
});

describe('anything else', () => {
  test('answers 404 for the wrong method', async () => {
    const response = await request(app).get('/convert');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errors: ['Cannot GET /convert. Use POST /convert'] });
  });

  test('answers 404 for an unknown address', async () => {
    const response = await request(app).post('/rates');

    expect(response.status).toBe(404);
  });
});
