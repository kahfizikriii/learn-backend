import { body, param } from "express-validator";
export const productCreateValidation = [
    body("name")
        .notEmpty().withMessage("Nama wajib diisi").isLength({ min: 3 }).withMessage("Nama minimal 3 karakter"),
    body("description")
        .notEmpty().withMessage("Deskripsi wajib diisi"),
    body("price")
        .isNumeric().withMessage("Harga harus angka"),
    body('categoryId')
        .isNumeric().withMessage('ID kategori harus angka').toInt()
        .custom(value => value > 0).withMessage('ID kategori harus lebih dari satu')
];
export const productIdValidation = [
    param("id").isNumeric().withMessage("ID harus angka")
];
//# sourceMappingURL=product.validation.js.map