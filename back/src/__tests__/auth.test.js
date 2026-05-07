import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma.js';

// Mocking bcrypt and jwt
jest.mock('bcrypt', () => ({
  hash: jest.fn(async (password) => `hashed_${password}`),

  compare: jest.fn(async (password, hash) =>
    password === hash.replace('hashed_', '')
  ),
}));

jest.mock('../utils/jwt.js', () => ({
  signAccessToken: jest.fn(
    (payload) => `mock_access_token_for_${payload.id}`
  ),

  signRefreshToken: jest.fn(
    (payload) => `mock_refresh_token_for_${payload.id}`
  ),
}));

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    // ordem correta
    await prisma.auditLog.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.usuario.deleteMany({});

    await prisma.$disconnect();
  });

  // =========================
  // REGISTER TESTS
  // =========================

  describe('POST /api/usuario/register', () => {
    beforeEach(async () => {
      // ordem correta
      await prisma.auditLog.deleteMany({});
      await prisma.booking.deleteMany({});
      await prisma.usuario.deleteMany({});
    });

    it('should register a new user successfully', async () => {
      const newUser = {
        nome: 'Test User',
        email: 'testuser@example.com',
        senha: 'password123',
        tipoUsuario: 'USER',
      };

      const response = await request(app)
        .post('/api/usuario/register')
        .send(newUser);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Test User');
      expect(response.body.email).toBe('testuser@example.com');
      expect(response.body.tipoUsuario).toBe('USER');

      expect(response.body).not.toHaveProperty('senha');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUser = {
        nome: 'Test User',
        senha: 'password123',
      };

      const response = await request(app)
        .post('/api/usuario/register')
        .send(incompleteUser);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty(
        'message',
        'Nome, email e senha são obrigatórios'
      );
    });

    it('should return 400 for an invalid email format', async () => {
      const invalidEmailUser = {
        nome: 'Test User',
        email: 'invalid-email',
        senha: 'password123',
        tipoUsuario: 'USER',
      };

      const response = await request(app)
        .post('/api/usuario/register')
        .send(invalidEmailUser);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty(
        'message',
        'Email inválido'
      );
    });

    it('should return 400 for a password less than 6 characters', async () => {
      const shortPasswordUser = {
        nome: 'Test User',
        email: 'testuser@example.com',
        senha: 'pass',
        tipoUsuario: 'USER',
      };

      const response = await request(app)
        .post('/api/usuario/register')
        .send(shortPasswordUser);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty(
        'message',
        'A senha deve ter pelo menos 6 caracteres'
      );
    });

    it('should return 400 if email is already registered', async () => {
      const existingUser = {
        nome: 'Existing User',
        email: 'existing@example.com',
        senha: 'password123',
        tipoUsuario: 'USER',
      };

      await request(app)
        .post('/api/usuario/register')
        .send(existingUser);

      const duplicateUser = {
        nome: 'Another User',
        email: 'existing@example.com',
        senha: 'anotherpassword',
        tipoUsuario: 'USER',
      };

      const response = await request(app)
        .post('/api/usuario/register')
        .send(duplicateUser);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty(
        'message',
        'Email já cadastrado'
      );
    });
  });

  // =========================
  // LOGIN TESTS
  // =========================

  describe('POST /api/usuario/login', () => {
    const loginCredentials = {
      email: 'loginuser@example.com',
      senha: 'securepassword',
    };

    beforeEach(async () => {
      // ordem correta
      await prisma.auditLog.deleteMany({});
      await prisma.booking.deleteMany({});
      await prisma.usuario.deleteMany({});

      await request(app)
        .post('/api/usuario/register')
        .send({
          nome: 'Login User',
          email: loginCredentials.email,
          senha: loginCredentials.senha,
          tipoUsuario: 'ADMIN',
        });
    });

    it('should login a user successfully', async () => {
      const response = await request(app)
        .post('/api/usuario/login')
        .send(loginCredentials);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('usuario');

      expect(response.body.usuario.email)
        .toBe(loginCredentials.email);

      expect(response.body.usuario.tipoUsuario)
        .toBe('ADMIN');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/usuario/login')
        .send({
          email: 'wrong@example.com',
          senha: loginCredentials.senha,
        });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty(
        'message',
        'Email ou senha inválidos'
      );
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/usuario/login')
        .send({
          email: loginCredentials.email,
          senha: 'wrongpassword',
        });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty(
        'message',
        'Email ou senha inválidos'
      );
    });

    it('should return 401 if email is missing', async () => {
      const response = await request(app)
        .post('/api/usuario/login')
        .send({
          senha: loginCredentials.senha,
        });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty(
        'message',
        'Email ou senha inválidos'
      );
    });

    it('should return 401 if password is missing', async () => {
      const response = await request(app)
        .post('/api/usuario/login')
        .send({
          email: loginCredentials.email,
        });

      expect(response.status).toBe(401);

      expect(response.body).toHaveProperty(
        'message',
        'Email ou senha inválidos'
      );
    });
  });
});