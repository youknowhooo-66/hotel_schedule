import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import { usuarioRouter } from './routes/userRouter.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'], // Permite instâncias do Vite
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/booking', bookingRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/usuario', usuarioRouter);

export default app;
