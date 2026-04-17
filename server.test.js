const request = require('supertest');
const { app } = require('./server');

describe('Chat App - Auth Routes', () => {
  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          email: 'newuser@test.com',
          password: 'senha123',
          name: 'New User'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'newuser@test.com');
      expect(res.body.user).toHaveProperty('name', 'New User');
    });

    it('should not register user without email', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          password: 'senha123',
          name: 'No Email'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not register user without password', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          email: 'test@test.com',
          name: 'No Pass'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not register duplicate user', async () => {
      // Primeiro registro
      await request(app)
        .post('/api/register')
        .send({
          email: 'duplicate@test.com',
          password: 'senha123',
          name: 'First User'
        });

      // Tentativa de duplicar
      const res = await request(app)
        .post('/api/register')
        .send({
          email: 'duplicate@test.com',
          password: 'senha456',
          name: 'Second User'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toContain('already exists');
    });
  });

  describe('POST /api/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/register')
        .send({
          email: 'login@test.com',
          password: 'senha123',
          name: 'Login Test'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'login@test.com',
          password: 'senha123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'login@test.com');
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'senha123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('Invalid credentials');
    });

    it('should not login without email', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          password: 'senha123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not login without password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'login@test.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});

describe('Chat App - Channels', () => {
  describe('GET /api/channels', () => {
    it('should return list of channels', async () => {
      const res = await request(app)
        .get('/api/channels');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should include default channels', async () => {
      const res = await request(app)
        .get('/api/channels');

      const channelNames = res.body.map(ch => ch.name);
      expect(channelNames).toContain('geral');
      expect(channelNames).toContain('fiscal');
      expect(channelNames).toContain('contabil');
      expect(channelNames).toContain('rh');
    });
  });
});

describe('Chat App - Messages', () => {
  describe('GET /api/messages/:channel', () => {
    it('should return messages for a channel', async () => {
      const res = await request(app)
        .get('/api/messages/geral');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return empty array for empty channel', async () => {
      const res = await request(app)
        .get('/api/messages/vazio');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});

describe('Chat App - Static Files', () => {
  describe('GET /', () => {
    it('should serve index.html', async () => {
      const res = await request(app)
        .get('/');

      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('<!DOCTYPE html>');
    });
  });
});

// Testes de integração (opcional, mas útil)
describe('Chat App - Test Users', () => {
  it('should login with test user leoncio', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'leoncio@contabil.com',
        password: 'senha123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Leoncio');
    expect(res.body.user.role).toBe('admin');
  });

  it('should login with test user contador', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'contador@contabil.com',
        password: 'senha123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Contador');
    expect(res.body.user.role).toBe('user');
  });

  it('should login with test user fiscal', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'fiscal@contabil.com',
        password: 'senha123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Fiscal');
    expect(res.body.user.role).toBe('user');
  });
});
