import type { OrderItem } from "../generated/client";
import { getPrisma } from "../prisma";

const prisma = getPrisma()

export const getAll = async (): Promise<{
  orderItems: OrderItem[];
  total: number;
}> => {
  const orderItems = await prisma.orderItem.findMany({
    where: { deletedAt: null },
  });

  return {
    orderItems,
    total: orderItems.length,
  };
};


export const getById = async (id: string) => {
    return await prisma.orderItem.findUnique({
        where: { id: parseInt(id), deletedAt: null },
    })
}

export const create = async (orderId: number, productId: number, quantity: number) => {
    return await prisma.orderItem.create({
        data: {
            orderId,
            productId,
            quantity
        }
    })
}

export const update = async (id: string, data: Partial<OrderItem>) => {
    const numId = parseInt(id);
    return await prisma.orderItem.update({
        where: { id: numId, deletedAt: null },
        data
    })
}

export const deleteById = async (id: string) => {
    const numId = parseInt(id);
    return await prisma.orderItem.update({
        where: { id: numId, deletedAt: null },
        data: { deletedAt: new Date() }
    })
    
}