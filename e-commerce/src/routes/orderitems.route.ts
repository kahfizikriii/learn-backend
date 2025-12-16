import { Router } from "express";
import * as orderItemController from "../controllers/orderitems.controller";

const router = Router();

router.get("/", orderItemController.getAll);
router.get("/:id", orderItemController.getById);
router.post("/", orderItemController.create);
router.put("/:id", orderItemController.update);
router.delete("/:id", orderItemController.deleteById);

export default router;