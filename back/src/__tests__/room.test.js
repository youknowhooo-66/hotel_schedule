import { jest } from '@jest/globals';
import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
  await prisma.usuario.upsert({
    where: { id: 1 },
    update: { nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
    create: { id: 1, nome: 'Test Admin', email: 'admin@test.local', senha: 'hashed', tipoUsuario: 'ADMIN' },
  });
});

const adminUser = {
  id: 1,
  tipoUsuario: "ADMIN",
};

beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/room", () => {
  it("should return all rooms", async () => {
    await prisma.room.create({
      data: {
        number: "101",
        category: "SIMPLES",
        basePrice: 100,
        status: "AVAILABLE",
      },
    });

    const response = await request(app).get("/api/room");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("POST /api/room", () => {
  it("should create a room", async () => {
    const response = await request(app)
      .post("/api/room")
      .send({
        number: "102",
        category: "DUPLO",
        basePrice: 200,
      })
      .set("user", JSON.stringify(adminUser));

    expect(response.status).toBe(201);

    expect(response.body.number).toBe("102");
    expect(response.body.category).toBe("DUPLO");
  });
});

describe("PUT /api/room/:id", () => {
  it("should update a room", async () => {
    const room = await prisma.room.create({
      data: {
        number: "103",
        category: "SIMPLES",
        basePrice: 100,
        status: "AVAILABLE",
      },
    });

    const response = await request(app)
      .put(`/api/room/${room.id}`)
      .send({
        number: "103A",
        category: "SUITE",
        basePrice: 300,
      })
      .set("user", JSON.stringify(adminUser));

    expect(response.status).toBe(200);

    expect(response.body.number).toBe("103A");
    expect(response.body.category).toBe("SUITE");
  });
});

describe("DELETE /api/room/:id", () => {
  it("should delete a room", async () => {
    const room = await prisma.room.create({
      data: {
        number: "104",
        category: "SIMPLES",
        basePrice: 120,
        status: "AVAILABLE",
      },
    });

    const response = await request(app)
      .delete(`/api/room/${room.id}`);

    expect(response.status).toBe(204);
  });
});