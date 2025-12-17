import { body } from "express-validator";

export const categoryValidation = [
  body("name")
    .notEmpty().withMessage("Nama wajib diisi")
    .isString().withMessage("Nama harus berupa teks")
    .trim()
    .isLength({ min: 3 }).withMessage("Nama minimal 3 karakter")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Nama hanya boleh berisi huruf, angka, dan spasi"),
];