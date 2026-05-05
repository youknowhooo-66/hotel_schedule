import express from 'express';
import {
  getAllAuditLogs
} from '../controllers/auditLogController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllAuditLogs);

export default router;
