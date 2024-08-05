import request from 'supertest';
import app from '../app'; // Adjust this import based on your app's entry point

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });

  it('GET / - should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
