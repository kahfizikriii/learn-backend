import { Router } from "express";
import { 
create, 
deleteById, 
getAll, 
getById, 
search, 
update 
} from "../controllers/product.controller";
import { productCreateValidation, productIdValidation, } from "../middlewares/product.validation";
import { validate } from "../utils/validator";

const router = Router();

router.get("/", getAll );

// GET BY ID + VALIDASI
router.get("/:id", validate(productIdValidation),getById );

// GET BY SEARCH
router.get("/search", search);

// CREATE PRODUK + VALIDASI
router.post("/", validate(productCreateValidation),create );

// UPDATE PRODUK
router.put("/:id", validate(productIdValidation),update);

// DELETE PRODUK
router.delete("/:id", validate(productIdValidation),deleteById );

export default router;