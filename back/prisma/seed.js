// prisma/seed.js

import prisma from '../src/config/prisma.js'
import {
  TipoUsuario,
  RoomCategory,
  RoomStatus,
  BookingStatus,
} from '@prisma/client'

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpar dados existentes (Opcional, mas recomendado para evitar erros de duplicidade)
  console.log('🧹 Limpando dados antigos...')
  await prisma.auditLog.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.pricingRule.deleteMany()
  await prisma.room.deleteMany()
  await prisma.usuario.deleteMany()

  // =========================
  // USUÁRIOS
  // =========================
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@hotel.com',
      senha: '123456',
      tipoUsuario: TipoUsuario.ADMIN,
    },
  })

  const user = await prisma.usuario.create({
    data: {
      nome: 'Usuário Teste',
      email: 'user@hotel.com',
      senha: '123456',
      tipoUsuario: TipoUsuario.USER,
    },
  })

  console.log('✅ Usuários criados')

  // =========================
  // QUARTOS
  // =========================
  const room1 = await prisma.room.create({
    data: {
      number: '101',
      category: RoomCategory.SIMPLES,
      basePrice: 150,
      status: RoomStatus.AVAILABLE,
    },
  })

  const room2 = await prisma.room.create({
    data: {
      number: '102',
      category: RoomCategory.DUPLO,
      basePrice: 250,
      status: RoomStatus.OCCUPIED,
    },
  })

  const room3 = await prisma.room.create({
    data: {
      number: '201',
      category: RoomCategory.SUITE,
      basePrice: 500,
      status: RoomStatus.MAINTENANCE,
    },
  })

  console.log('✅ Quartos criados')

  // =========================
  // RESERVAS
  // =========================
  await prisma.booking.create({
    data: {
      guestName: 'Carlos Silva',
      guestEmail: 'carlos@gmail.com',

      checkIn: new Date('2026-05-10'),
      checkOut: new Date('2026-05-15'),

      status: BookingStatus.CONFIRMED,
      totalPrice: 750,

      roomId: room1.id,
      createdById: admin.id,
    },
  })

  await prisma.booking.create({
    data: {
      guestName: 'Maria Souza',
      guestEmail: 'maria@gmail.com',

      checkIn: new Date('2026-06-01'),
      checkOut: new Date('2026-06-05'),

      status: BookingStatus.PENDING,
      totalPrice: 1000,

      roomId: room2.id,
      createdById: user.id,
    },
  })

  console.log('✅ Reservas criadas')

  // =========================
  // REGRAS DE PREÇO
  // =========================
  await prisma.pricingRule.create({
    data: {
      description: 'Alta temporada',

      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-31'),

      priceMultiplier: 1.5,

      category: RoomCategory.SUITE,
    },
  })

  await prisma.pricingRule.create({
    data: {
      description: 'Promoção quartos simples',

      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-31'),

      fixedPrice: 120,

      category: RoomCategory.SIMPLES,
    },
  })

  console.log('✅ Pricing rules criadas')

  // =========================
  // AUDIT LOGS
  // =========================
  await prisma.auditLog.create({
    data: {
      action: 'CREATE_BOOKING',
      entity: 'Booking',
      entityId: 1,
      details: 'Reserva criada pelo administrador',

      userId: admin.id,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE_ROOM',
      entity: 'Room',
      entityId: room3.id,
      details: 'Quarto colocado em manutenção',

      userId: admin.id,
    },
  })

  console.log('✅ Audit logs criados')

  console.log('🎉 Seed finalizada!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })