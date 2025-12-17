import { Router } from "express";
import * as profile from '../controllers/profile.controller';
import { validate } from "../utils/validator";
import { authenticate } from "../middlewares/auth.middleware"; 
import { upload } from "../middlewares/upload.middleware";
import { createProfileValidation, updateProfileValidation } from "../validation/profile.validation";


const router = Router()

router.get('/:id', profile.getById)

router.post('/',authenticate, upload.single('profile_picture_url'), validate(createProfileValidation), profile.create)

router.put('/:id',validate(updateProfileValidation), profile.update)

router.delete('/:id', profile.remove)

export default router;