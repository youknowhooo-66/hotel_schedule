import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma.js';

describe('Pricing Endpoints', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.usuario.upsert({
      where: { id: 1 },
      update: { nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
      create: { id: 1, nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
    });
  });

  afterAll(async () => {
    await prisma.pricingRule.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.pricingRule.deleteMany();
  });

  it('GET /api/pricing should return array', async () => {
    const res = await request(app).get('/api/pricing');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/pricing should create a pricing rule', async () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 10);

    const res = await request(app).post('/api/pricing').send({
      description: 'Test rule',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      priceMultiplier: 1.5,
      fixedPrice: null,
      category: null,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe('Test rule');
  });

  it('DELETE /api/pricing/:id should delete a rule', async () => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 10);

    const create = await request(app).post('/api/pricing').send({
      description: 'To delete',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      priceMultiplier: 2.0,
      fixedPrice: null,
      category: null,
    });

    const id = create.body.id;
    const del = await request(app).delete(`/api/pricing/${id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get('/api/pricing');
    expect(list.body.find(r => r.id === id)).toBeUndefined();
  });
});