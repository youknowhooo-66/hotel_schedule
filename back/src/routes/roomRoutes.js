import express from 'express';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
