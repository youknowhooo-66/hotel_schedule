import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";

const adminUser = {
  id: 1,
  tipoUsuario: "ADMIN",
};
try{
beforeEach(async () => {
  await prisma.auditLog.deleteMany();
  await prisma.pricingRule.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /api/pricing", () => {
  it("should return all pricing rules", async () => {
    await prisma.pricingRule.create({
      data: {
        description: "High Season",
        startDate: new Date(),
        endDate: new Date(),
        priceMultiplier: 1.5,
        fixedPrice: null,
        category: "SIMPLES",
      },
    });

    const response = await request(app).get("/api/pricing");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("POST /api/pricing", () => {
  it("should create a pricing rule", async () => {
    const response = await request(app)
      .post("/api/pricing")
      .send({
        description: "Holiday",
        startDate: new Date(),
        endDate: new Date(),
        priceMultiplier: 2.0,
        category: "DUPLO",
      })
      .set("user", JSON.stringify(adminUser));

    expect(response.status).toBe(201);

    expect(response.body.description).toBe("Holiday");
  });
});

describe("DELETE /api/pricing/:id", () => {
  it("should delete a pricing rule", async () => {
    const rule = await prisma.pricingRule.create({
      data: {
        description: "Weekend",
        startDate: new Date(),
        endDate: new Date(),
        priceMultiplier: 1.3,
        category: "SUITE",
      },
    });

    const response = await request(app)
      .delete(`/api/pricing/${rule.id}`);

    expect(response.status).toBe(204);
  });
});
}catch (error) {
  console.error(error);

  return res.status(500).json({
    message: error.message,
  });
}