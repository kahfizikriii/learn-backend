import { Router } from "express";
import * as category from "../controllers/category.controller"
import { validate } from "../utils/validator";
import { categoryValidation } from "../validation/category.validation";

const router = Router()

router.get('/', category.getAll )

router.get('/:id', category.getById)

router.post('/', validate(categoryValidation), category.create )

router.patch("/:id",  validate(categoryValidation), category.update)

router.delete('/:id', category.deleteById)

export default router;