import express from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllBookings);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.patch('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
