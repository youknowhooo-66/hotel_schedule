import prisma from '../config/prisma.js';

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { bookings: true },
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoom = async (req, res) => {
  const { number, category, basePrice, status } = req.body;
  try {
    const newRoom = await prisma.room.create({
      data: { 
        number, 
        category, 
        basePrice: parseFloat(basePrice), 
        status: status || 'AVAILABLE' 
      },
    });
    
    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_ROOM',
        entity: 'Room',
        entityId: newRoom.id,
        userId: req.user.id,
        details: JSON.stringify(newRoom)
      }
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_ROOM',
        entity: 'Room',
        entityId: updatedRoom.id,
        userId: req.user.id,
        details: JSON.stringify(updatedRoom)
      }
    });

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
