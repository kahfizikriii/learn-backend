import { Router } from "express";
import { 
create, 
deleteById, 
getAll, 
getById,  
update 
} from "../controllers/product.controller";
import { productCreateValidation, productIdValidation, } from "../validation/product.validation";
import { validate } from "../utils/validator";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getAll );

// GET BY ID + VALIDASI
router.get("/:id", validate(productIdValidation),getById );

// // GET BY SEARCH
// router.get("/search", search);

// CREATE PRODUK + VALIDASI
router.post("/", authenticate, upload.single("image"), validate(productCreateValidation),create );

// UPDATE PRODUK
router.put("/:id", validate(productIdValidation),update);

// DELETE PRODUK
router.delete("/:id", validate(productIdValidation),deleteById );

export default router;