import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../services/category.sevice";
import { successResponse } from "../utils/respons";
export const getAll = async (_req, res) => {
    const category = await getAllCategories();
    successResponse(res, "kategori berhasil diambil", category, null, 200);
};
export const getById = async (req, res) => {
    if (!req.params.id)
        throw new Error("id tidak ditemukan");
    const category = await getCategoryById(req.params.id);
    successResponse(res, "kategori berhasil diambil", category);
};
export const create = async (req, res) => {
    const category = await createCategory(req.body.name);
    successResponse(res, "kategori berhasil ditambahkan", category, null, 201);
};
export const update = async (req, res) => {
    if (!req.params.id)
        throw new Error('id tidak ditemukan');
    const category = await updateCategory(req.params.id, req.body);
    successResponse(res, "kategori berhasil di update", category);
};
export const deleteById = async (req, res) => {
    if (!req.params.id)
        throw new Error("id kategori tidak ditemukan");
    const category = await deleteCategory(req.params.id);
    successResponse(res, "kategori berhasil di hapus", category);
};
//# sourceMappingURL=category.controller.js.map