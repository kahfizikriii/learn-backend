// src/routes/transaction.routes.ts
import express from 'express';
import transactionController from '../controllers/transaction.controller';

const router = express.Router();

// POST /api/transactions - Checkout
router.post('/', transactionController.checkout);

// GET /api/transactions/:id - Detail Transaksi
router.get('/:id', transactionController.getTransactionDetail);

// GET /api/transactions/user/:userId - Get user transactions
router.get('/user/:userId', transactionController.getUserTransactions);

// GET /api/transactions - Get all transactions (for admin)
router.get('/', transactionController.getAllTransactions);

export default router;