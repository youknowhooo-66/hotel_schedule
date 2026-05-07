import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import prisma from '../config/prisma.js';

describe('Booking Endpoints', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.usuario.upsert({
      where: { id: 1 },
      update: { nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
      create: { id: 1, nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.room.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.room.deleteMany();
  });

  it('POST /api/booking should create a booking', async () => {
    const roomRes = await request(app).post('/api/room').send({ number: '201', category: 'SIMPLES', basePrice: 100 });
    expect(roomRes.status).toBe(201);
    const roomId = roomRes.body.id;

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 2);

    const res = await request(app).post('/api/booking').send({
      guestName: 'Guest',
      guestEmail: 'guest@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('booking');
    expect(res.body.booking.totalPrice).toBe(100);
  });

  it('POST /api/booking should prevent overlapping bookings', async () => {
    const roomRes = await request(app).post('/api/room').send({ number: '202', category: 'SIMPLES', basePrice: 120 });
    const roomId = roomRes.body.id;

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 3);

    // first booking
    const first = await request(app).post('/api/booking').send({
      guestName: 'First',
      guestEmail: 'first@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });
    expect(first.status).toBe(201);

    // overlapping booking
    const overlap = await request(app).post('/api/booking').send({
      guestName: 'Second',
      guestEmail: 'second@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });

    expect(overlap.status).toBe(400);
  });

  it('PUT /api/booking/:id should update a booking', async () => {
    const roomRes = await request(app).post('/api/room').send({ number: '203', category: 'SIMPLES', basePrice: 110 });
    const roomId = roomRes.body.id;

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 2);
    end.setDate(end.getDate() + 4);

    const create = await request(app).post('/api/booking').send({
      guestName: 'Update',
      guestEmail: 'update@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });

    const id = create.body.booking.id;

    const newStart = new Date();
    const newEnd = new Date();
    newStart.setDate(newStart.getDate() + 3);
    newEnd.setDate(newEnd.getDate() + 5);

    const res = await request(app).put(`/api/booking/${id}`).send({
      guestName: 'Updated Name',
      guestEmail: 'updated@example.com',
      checkIn: newStart.toISOString(),
      checkOut: newEnd.toISOString(),
      roomId,
    });

    expect(res.status).toBe(200);
    expect(res.body.guestName).toBe('Updated Name');
  });

  it('PATCH /api/booking/:id/status should update status', async () => {
    const roomRes = await request(app).post('/api/room').send({ number: '204', category: 'SIMPLES', basePrice: 90 });
    const roomId = roomRes.body.id;

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 2);

    const create = await request(app).post('/api/booking').send({
      guestName: 'Status',
      guestEmail: 'status@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });

    const id = create.body.booking.id;

    const res = await request(app).patch(`/api/booking/${id}/status`).send({ status: 'CONFIRMED' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CONFIRMED');
  });

  it('DELETE /api/booking/:id should delete booking', async () => {
    const roomRes = await request(app).post('/api/room').send({ number: '205', category: 'SIMPLES', basePrice: 95 });
    const roomId = roomRes.body.id;

    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 2);

    const create = await request(app).post('/api/booking').send({
      guestName: 'Delete',
      guestEmail: 'delete@example.com',
      checkIn: start.toISOString(),
      checkOut: end.toISOString(),
      roomId,
    });

    const id = create.body.booking.id;

    const del = await request(app).delete(`/api/booking/${id}`);
    expect(del.status).toBe(204);
  });
});