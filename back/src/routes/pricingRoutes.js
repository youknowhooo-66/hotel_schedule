import express from 'express';
import {
  getAllPricingRules,
  createPricingRule,
  deletePricingRule,
} from '../controllers/pricingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllPricingRules);
router.post('/', createPricingRule);
router.delete('/:id', deletePricingRule);

export default router;
