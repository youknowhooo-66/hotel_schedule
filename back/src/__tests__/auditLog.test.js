import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma.js';

describe('Audit Log Endpoints', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.usuario.upsert({
      where: { id: 1 },
      update: { nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
      create: { id: 1, nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
    });
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
  });

  it('GET /api/audit-log should return logs', async () => {
    // create an audit log directly
    await prisma.auditLog.create({
      data: {
        action: 'TEST_ACTION',
        entity: 'Test',
        entityId: 999,
        userId: 1,
        details: JSON.stringify({ foo: 'bar' })
      }
    });

    const res = await request(app).get('/api/audit-log');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0]).toHaveProperty('action');
  });
});