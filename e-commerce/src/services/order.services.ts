import type { Order } from "../generated/client";
import { getPrisma } from "../prisma"

const prisma = getPrisma()

export const getAllOrders = async (): Promise<{ orders: Order[], total: number }> => {
    const orders = await prisma.order.findMany({
        where: { deletedAt: null },  
    })
    const total = orders.length;

    return { orders, total };

}


export const getByIdOrders = async (id: string) => {
    return await prisma.order.findUnique({
        where: { id: parseInt(id), deletedAt: null },
    })
}

export const createOrders = async (userId: number, total: number) => {
    return await prisma.order.create({
        data: {
            userId,
            total
        }
    })
}

export const updateOrders = async (id: string, data: Partial<Order>) => {
    const numId = parseInt(id);
    return await prisma.order.update({
        where: { id: numId, deletedAt: null },
        data
    })
}

export const deleteByIdOrders = async (id: string) => {
    const numId = parseInt(id);
    return await prisma.order.update({
        where: { id: numId, deletedAt: null },
        data: { deletedAt: new Date() }
    })

}

// DAy 13 


export interface CreateOrder {
    orderItems: OrderItems[]
}

export interface OrderItems {
    productId: number
    quantity: number
}

export const checkoutOrder = async (data: CreateOrder,userId: number) => {
    return await prisma.$transaction(async (tx) => {
        let total = 0
        const orderItemsData = []

        // 1. Loop orderItems → ambil product asli
        for (const item of data.orderItems) {
            const product = await tx.product.findUnique({
                where: { id: item.productId }
            })

            if (!product) {
                throw new Error(`Product ID ${item.productId} not found`)
            }

            // 2. Validasi stok
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`)
            }

            // 3. Hitung total dari harga DB
            const price = Number(product.price)
            total += price * item.quantity

            // 4. Siapkan data orderItems
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
            })

            // 5. Update stok
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }
        
        // saran dari chat gpt
        const user = await tx.user.findUnique({
             where: { id: userId }
            })

            if (!user) {
             throw new Error("User tidak ditemukan")
        }


        // 6. Create order + orderItems (nested write)
        const newOrder = await tx.order.create({
            data: {
                userId: userId,
                total,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return newOrder
    })
}