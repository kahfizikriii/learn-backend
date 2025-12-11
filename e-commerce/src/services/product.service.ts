import type { Product } from "../generated/client";
import { getPrisma } from "../prisma";

const prisma = getPrisma()

export const getAllProduct = async (): Promise<{ products: Product[], total: number }> => {
    const products = await prisma.product.findMany({include: { category: true } })
    const total = products.length

    return {  products, total}
}

export const getByIdProduct = async (id: string) => {
  const numId = parseInt(id);
  const product = await prisma.product.findUnique({
    where: { id:numId },
    include: { category: true },
  });

  if (!product) {
    throw new Error("Produk dengan ID tersebut tidak ditemukan");
  }
  return product;
}

export const searchProduct = async (name?: string, min_price?: number, max_price?: number): Promise<Product[]> => {
    return await prisma.product.findMany({
        where: {
            ...(name && {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            }),
            price: {
                ...(min_price && { gte: min_price }),
                ...(max_price && { lte: max_price }),
            }
        },
        include: { category: true }
    })
}

export const createProduct = async(data: {name: string, description?: string, price: number, stock: number, 
  categoryId?: number}): Promise<Product> => {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId ?? null,
      }
    })
}

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
    await getByIdProduct(id)

    const numId = parseInt(id);

    return await prisma.product.update({
      where: {  id: numId},
      data
    })
}

export const deleteProduct = async (id: string): Promise<Product> => {
     const numId = parseInt(id);

     return await prisma.product.delete({
      where: { id: numId }
     })
}