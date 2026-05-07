import prisma from '../config/prisma.js';

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { bookings: true },
    });
    return res.json(rooms);
  } catch (error) {
    console.error("❌ Erro ao buscar quartos:", error);
    return res.status(500).json({ error: 'Erro ao carregar lista de quartos.' });
  }
};

export const createRoom = async (req, res) => {
  const { number, category, basePrice, status } = req.body;

  if (!number || !category || !basePrice) {
    return res.status(400).json({ error: 'Número, categoria e preço base são obrigatórios.' });
  }

  try {
    const newRoom = await prisma.room.create({
      data: { 
        number, 
        category, 
        basePrice: parseFloat(basePrice), 
        status: status || 'AVAILABLE' 
      },
    });

    // Audit Log (Isolado para não quebrar a criação do quarto)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'CREATE_ROOM',
          entity: 'Room',
          entityId: newRoom.id,
          userId: req.user.id,
          details: JSON.stringify(newRoom)
        }
      });
    } catch (auditError) {
      console.error("⚠️ Erro ao criar log de auditoria:", auditError);
    }

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error("❌ Erro ao criar quarto:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Já existe um quarto com este número.' });
    }
    return res.status(500).json({ error: 'Erro interno no servidor ao criar quarto.' });
  }
};


export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { number, category, basePrice, status } = req.body;
  try {
    const updatedRoom = await prisma.room.update({
      where: { id: parseInt(id) },
      data: { 
        number, 
        category, 
        basePrice: basePrice ? parseFloat(basePrice) : undefined, 
        status 
      },
    });

    // Audit Log (Isolado)
    try {
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE_ROOM',
          entity: 'Room',
          entityId: updatedRoom.id,
          userId: req.user.id,
          details: JSON.stringify(updatedRoom)
        }
      });
    } catch (auditError) {
      console.error("⚠️ Erro ao criar log de auditoria no update:", auditError);
    }

    return res.json(updatedRoom);
  } catch (error) {
    console.error("❌ Erro ao atualizar quarto:", error);
    return res.status(500).json({ error: 'Erro ao atualizar quarto.' });
  }
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.room.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
