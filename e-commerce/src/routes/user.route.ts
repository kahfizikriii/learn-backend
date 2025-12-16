import { Router } from "express";
import { create, deleteById, getAll, getById, search, update } from "../controllers/user.controller";

const router = Router()
router.get('/',getAll)
router.get('/search',search)
router.get('/:id',getById)
router.post('/',create)
router.put('/:id',update)
router.delete('/:id',deleteById)

export default router;