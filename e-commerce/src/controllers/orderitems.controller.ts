import type { Request, Response } from "express";
import * as orderItemService from "../services/orderitems.services";
import { successResponse } from "../utils/respons";


export const getAll = async (_req: Request, res: Response) => {
  const { orderItems, total } = await orderItemService.getAll();

  return successResponse(res, "Berhasil mengambil data", {
    jumlah: total,
    data: orderItems,
  });
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id tidak ditemukan",
    });
  }

  const orderItem = await orderItemService.getById(id);

  if (!orderItem) {
    return res.status(404).json({
      success: false,
      message: "Order item tidak ditemukan",
    });
  }

  return successResponse(res, "Berhasil mengambil data", orderItem);
};


export const create = async (req: Request, res: Response) => {
  const { orderId, productId, quantity } = req.body;

  if (!orderId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: "orderId, productId, dan quantity wajib diisi",
    });
  }

  const orderItem = await orderItemService.create(
    Number(orderId),
    Number(productId),
    Number(quantity)
  );

  return successResponse(res, "Berhasil menambahkan data", orderItem);
};


export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id tidak ditemukan",
    });
  }

  const result = await orderItemService.update(id, req.body);

  if ("count" in result && result.count === 0) {
    return res.status(404).json({
      success: false,
      message: "Order item tidak ditemukan atau sudah dihapus",
    });
  }

  return successResponse(res, "Berhasil mengupdate data", result);
};


export const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "id tidak ditemukan",
    });
  }

  const result = await orderItemService.deleteById(id);

  if ("count" in result && result.count === 0) {
    return res.status(404).json({
      success: false,
      message: "Order item tidak ditemukan atau sudah dihapus",
    });
  }

  return successResponse(res, "Berhasil menghapus data", null);
};