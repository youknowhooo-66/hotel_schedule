import prisma from '../config/prisma.js';

export const getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
