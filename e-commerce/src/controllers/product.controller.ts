import type { Request, Response } from "express";
import { createProduct, deleteProduct, getAllProduct, getByIdProduct, searchProduct, updateProduct, } from "../services/product.service";
import { successResponse } from "../utils/respons";

export const getAll = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const sortBy = req.query.sortBy as string
  const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc'

  const search: any = {
    name: req.query.name as string,
    min_price: req.query.min_price
      ? Number(req.query.min_price)
      : undefined,
    max_price: req.query.max_price
      ? Number(req.query.max_price)
      : undefined,
  }

  const result = await getAllProduct({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  })

  const pagination = {
    page: result.currentPage,
    limit,
    total: result.total,
    totalpages: result.totalPages,
  }

  successResponse(
    res,
    "Berhasil mengambil data",
    result.products,
    pagination
  )
}

export const getById = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const product = await getByIdProduct(req.params.id);
    successResponse(res, "Berhasil mengambil data", product);
}

// export const search = async (req: Request, res: Response) => {
//   const { name, max_price, min_price } = req.query;
//   const result = await searchProduct(name?.toString(), Number(max_price), Number(min_price))
//   res.json({
//     success: true,
//     filtered_result: result
//   });
// }

export const create = async (req: Request, res: Response) => {
  const file = req.file 
  if (!file) throw new Error("file tidak ditemukan");
  const { name, description, price, stock, categoryId } = req.body;
  const imageUrl = `public/uploads/${file.filename}`
  const data = {
    name: String(name),
    description: String(description),
    price: Number(price),
    stock: Number(stock),
    categoryId: Number(categoryId),
    ...(description && { description: description }),
    image : imageUrl
  }
  const products =await createProduct(data)
  successResponse(res, "Berhasil menambahkan data", products);
}

export const update = async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id!, req.body)
  successResponse(res, "Berhasil mengupdate data", product);
}

export const deleteById = async(req: Request, res: Response) => {
  const deleted = deleteProduct(req.params.id!);
  successResponse(res, "Berhasil menghapus data", deleted);
}