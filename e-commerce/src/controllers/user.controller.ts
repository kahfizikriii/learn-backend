import type { Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, searchUser, updateUser } from "../services/user.service";
import { successResponse } from "../utils/respons";


export const getAll= async (_req: Request, res: Response) => {
    const { users, total } = await getAllUsers()
    successResponse(res, "Berhasil mengambil data", {jumlah: total, data: users, })

}

export const getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new Error("id tidak ditemukan")
    }
    const user = await getUserById(req.params.id)
    successResponse(res, "Berhasil mengambil data", user)
}

export const create = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const data = {
        name: String(name),
        email: String(email),
        password: String(password),
    }
    const user = await createUser(data)
    successResponse(res, "Berhasil menambahkan data", user);

}

export const update = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const user = await updateUser(req.params.id, req.body)
    successResponse(res, "Berhasil mengupdate data", user);

}

export const deleteById = async (req: Request, res: Response) => {
    if (!req.params.id) throw new Error("id tidak ditemukan");
    const user = await deleteUser(req.params.id)
    successResponse(res, "Berhasil menghapus data", user);

}

export const search = async (req: Request, res: Response) => {
    const { name, email, password } = req.query;
    const user = await searchUser(name?.toString(), email?.toString(), password?.toString())
    successResponse(res, "Berhasil mengambil data", user);

}