import prisma from '../config/prisma.js';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true, createdBy: true },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { guestName, guestEmail, checkIn, checkOut, roomId } = req.body;
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // 1. Check availability
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: parseInt(roomId),
        status: { not: 'CANCELLED' },
        OR: [
          { checkIn: { lt: end }, checkOut: { gt: start } }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Quarto não disponível nestas datas.' });
    }

    // 2. Calculate dynamic price
    const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
    if (!room) return res.status(404).json({ error: 'Quarto não encontrado' });

    let finalPrice = room.basePrice;
    
    // Find active pricing rules
    const rules = await prisma.pricingRule.findMany({
      where: {
        OR: [
          { category: room.category },
          { category: null }
        ],
        startDate: { lte: start },
        endDate: { gte: start }
      }
    });

    if (rules.length > 0) {
      // Apply the rule that gives the highest price (maximizing revenue)
      const bestRule = rules.reduce((prev, current) => {
        const prevPrice = prev.fixedPrice || (room.basePrice * prev.priceMultiplier);
        const currPrice = current.fixedPrice || (room.basePrice * current.priceMultiplier);
        return prevPrice > currPrice ? prev : current;
      });

      finalPrice = bestRule.fixedPrice || (room.basePrice * bestRule.priceMultiplier);
    }

    // 3. Create Booking
    // Busca um usuário válido caso req.user.id falhe, para evitar erro de Foreign Key
    let validUserId = req.user?.id;
    if (!validUserId) {
      const firstUser = await prisma.usuario.findFirst();
      validUserId = firstUser?.id;
    }

    const newBooking = await prisma.booking.create({
      data: {
        guestName: guestName || "Hóspede",
        guestEmail: guestEmail || "",
        checkIn: start,
        checkOut: end,
        totalPrice: Number(finalPrice) || Number(room.basePrice) || 0,
        roomId: parseInt(roomId),
        createdById: validUserId
      },
    });

    // 4. Availability Alerts (ALGORITMO DE GERENCIAMENTO DE DISPONILIDADE)
    const totalRoomsInCategory = await prisma.room.count({ where: { category: room.category } });
    const occupiedRoomsInCategory = await prisma.booking.count({
      where: {
        room: { category: room.category },
        status: { not: 'CANCELLED' },
        OR: [
          { checkIn: { lt: end }, checkOut: { gt: start } }
        ]
      }
    });

    let alert = null;
    const availabilityPercentage = ((totalRoomsInCategory - occupiedRoomsInCategory) / totalRoomsInCategory) * 100;

    if (availabilityPercentage <= 10) {
      alert = 'ALERTA: Disponibilidade de quartos atingiu o limite mínimo (10% ou menos).';
    } else if (occupiedRoomsInCategory >= totalRoomsInCategory) {
       alert = 'ALERTA: Risco eminente de OVERBOOKING para esta categoria.';
    }

    // 5. Audit Log (Isolado)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'CREATE_BOOKING',
          entity: 'Booking',
          entityId: newBooking.id,
          userId: req.user.id,
          details: JSON.stringify({ ...newBooking, alert })
        }
      });
    } catch (auditError) {
      console.error("⚠️ Erro ao criar log de auditoria (Booking):", auditError);
    }

    return res.status(201).json({ booking: newBooking, alert });
  } catch (error) {
    console.error("❌ Erro ao criar agendamento:", error);
    return res.status(500).json({ error: 'Erro interno ao processar agendamento.' });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { guestName, guestEmail, checkIn, checkOut, roomId } = req.body;
  try {
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ error: 'Reserva não encontrada' });

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Check room exists
    const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
    if (!room) return res.status(404).json({ error: 'Quarto não encontrado' });

    // Check availability excluding current booking
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: parseInt(roomId),
        status: { not: 'CANCELLED' },
        NOT: { id: parseInt(id) },
        OR: [
          { checkIn: { lt: end }, checkOut: { gt: start } }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Quarto não disponível nestas datas.' });
    }

    // Recalculate price similarly to creation
    let finalPrice = room.basePrice;
    const rules = await prisma.pricingRule.findMany({
      where: {
        OR: [
          { category: room.category },
          { category: null }
        ],
        startDate: { lte: start },
        endDate: { gte: start }
      }
    });

    if (rules.length > 0) {
      const bestRule = rules.reduce((prev, current) => {
        const prevPrice = prev.fixedPrice || (room.basePrice * prev.priceMultiplier);
        const currPrice = current.fixedPrice || (room.basePrice * current.priceMultiplier);
        return prevPrice > currPrice ? prev : current;
      });
      finalPrice = bestRule.fixedPrice || (room.basePrice * bestRule.priceMultiplier);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        guestName,
        guestEmail,
        checkIn: start,
        checkOut: end,
        totalPrice: finalPrice,
        roomId: parseInt(roomId)
      }
    });

    // Audit Log (Isolado)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE_BOOKING',
          entity: 'Booking',
          entityId: updatedBooking.id,
          userId: req.user.id,
          details: JSON.stringify({ before: booking, after: updatedBooking })
        }
      });
    } catch (auditError) {
      console.error("⚠️ Erro ao criar log de auditoria no update (Booking):", auditError);
    }

    return res.json(updatedBooking);
  } catch (error) {
    console.error("❌ Erro ao atualizar agendamento:", error);
    return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // Audit Log (Isolado)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE_BOOKING_STATUS',
          entity: 'Booking',
          entityId: updatedBooking.id,
          userId: req.user.id,
          details: JSON.stringify({ status })
        }
      });
    } catch (auditError) {
       console.error("⚠️ Erro ao criar log de auditoria no status (Booking):", auditError);
    }

    return res.json(updatedBooking);
  } catch (error) {
    console.error("❌ Erro ao atualizar status do agendamento:", error);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    // Audit Log (Isolado)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'DELETE_BOOKING',
          entity: 'Booking',
          entityId: parseInt(id),
          userId: req.user.id,
          details: JSON.stringify(booking)
        }
      });
    } catch (auditError) {
      console.error("⚠️ Erro ao criar log de auditoria no delete (Booking):", auditError);
    }

    return res.status(204).send();
  } catch (error) {
    console.error("❌ Erro ao deletar agendamento:", error);
    return res.status(500).json({ error: 'Erro ao deletar agendamento.' });
  }
};
