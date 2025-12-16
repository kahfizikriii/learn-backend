// src/routes/index.ts
import express from 'express';
import transactionRoutes from './transaction.routes';

const router = express.Router();

router.use('/transactions', transactionRoutes);

// Tambahkan routes lain di sini
// router.use('/products', productRoutes);
// router.use('/users', userRoutes);

export default router;