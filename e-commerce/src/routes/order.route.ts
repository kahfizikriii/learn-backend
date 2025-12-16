import { Router } from "express";
import { create, deleteById, getAll, getById, update } from "../controllers/orders.controller";
import { checkout } from "../controllers/orders.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router()

router.post('/checkout',checkout,authenticate)
router.get('/',getAll)
router.get('/:id',getById)
router.post('/',create)
router.put('/:id',update)
router.delete('/:id',deleteById)

export default router;