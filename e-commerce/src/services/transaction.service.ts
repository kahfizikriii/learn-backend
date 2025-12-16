// src/services/transaction.service.ts (dengan crypto native)
import type { Prisma, PrismaClient } from '@prisma/client/extension';
import { getPrisma } from '../prisma';
import crypto from 'crypto';
 
const prisma: PrismaClient = getPrisma();

export interface TransactionItemInput {
  productId: number;
  quantity: number;
}

export interface CreateTransactionInput {
  userId: number;
  items: TransactionItemInput[];
}

export interface TransactionResponse {
  id: number;
  transactionCode: string;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

class TransactionService {
  private generateTransactionCode(): string {
    // Generate random string untuk transaction code
    const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `TRX-${timestamp}-${randomString}`;
  }

  async createTransaction(data: CreateTransactionInput): Promise<TransactionResponse> {
    // Validasi input
    if (!data.items || data.items.length === 0) {
      throw new Error('Transaction must have at least one item');
    }

    // Gunakan transaction dari prisma langsung
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const productIds = data.items.map(item => item.productId);
      
      // Ambil semua produk yang dibeli
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds }
        }
      });

      // Validasi stok dan hitung total
      let totalAmount = 0;
      const itemsWithDetails = [];

      for (const item of data.items) {
        const product = products.find((p: { id: number; }) => p.id === item.productId);
        
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        itemsWithDetails.push({
          product,
          quantity: item.quantity,
          price: product.price,
          subtotal
        });
      }

      // Generate unique transaction code menggunakan crypto
      const transactionCode = this.generateTransactionCode();

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          transactionCode,
          userId: data.userId,
          totalAmount,
          status: 'PENDING'
        }
      });

      // Create transaction items dan update stok
      const transactionItems = [];

      for (const item of itemsWithDetails) {
        // Create transaction item
        const transactionItem = await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          },
          include: {
            product: true
          }
        });

        // Update product stock menggunakan decrement
        await tx.product.update({
          where: { id: item.product.id },
          data: { 
            stock: {
              decrement: item.quantity
            }
          }
        });

        transactionItems.push(transactionItem);
      }

      // Update transaction status to COMPLETED
      const updatedTransaction = await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED' },
        include: {
          transactionItems: {
            include: {
              product: true
            }
          }
        }
      });

      return this.formatTransactionResponse(updatedTransaction);
    });
  }

  async getTransactionById(id: number): Promise<TransactionResponse | null> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          transactionItems: {
            include: {
              product: true
            }
          }
        }
      });

      if (!transaction) {
        return null;
      }

      return this.formatTransactionResponse(transaction);
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }

  async getTransactionsByUser(userId: number): Promise<TransactionResponse[]> {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        include: {
          transactionItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return transactions.map((transaction: any) => this.formatTransactionResponse(transaction));
    } catch (error) {
      console.error('Get user transactions error:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<TransactionResponse[]> {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          transactionItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return transactions.map((transaction: any) => this.formatTransactionResponse(transaction));
    } catch (error) {
      console.error('Get all transactions error:', error);
      throw error;
    }
  }

  private formatTransactionResponse(transaction: any): TransactionResponse {
    return {
      id: transaction.id,
      transactionCode: transaction.transactionCode,
      userId: transaction.userId,
      totalAmount: transaction.totalAmount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      items: transaction.transactionItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }))
    };
  }
}

export default new TransactionService();