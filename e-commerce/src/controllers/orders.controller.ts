import { createOrders, deleteByIdOrders, getAllOrders, getByIdOrders ,updateOrders } from "../services/order.services"
import { successResponse } from "../utils/respons"
import type { Request, Response } from "express"
import { checkoutOrder } from "../services/order.services"


export const getAll = async (_req: Request, res: Response) => {
    const { orders, total } = await getAllOrders()
    successResponse(res, "Berhasil mengambil data", {jumlah: total, data: orders, })
}

export const getById = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const order = await getByIdOrders(req.params.id);
    successResponse(res, "Berhasil mengambil data", order);
}

export const create = async (req: Request, res: Response) => {
    const { userId, total } = req.body;
    const order = await createOrders(userId, total)
    successResponse(res, "Berhasil menambahkan data", order);
}

export const update = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const order = await updateOrders(req.params.id, req.body);
    successResponse(res, "Berhasil mengupdate data", order);

}

export const deleteById = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const order = await deleteByIdOrders(req.params.id)
    successResponse(res, "Berhasil menghapus data", order);

}

//  Day 13

export interface OrderRequest extends Request {
    userId: number
    total: number
    orderItems: OrderItems[]
}

export interface OrderItems {
    productId: number
    quantity: number
}


export const checkout = async (req: Request, res: Response) => {
    const result = await checkoutOrder(req.body, req.user!.id)

    successResponse(
        res,
        "Berhasil melakukan checkout",
        result,
        null,
        201
    )
}