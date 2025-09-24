import { Router } from "express";
import {register, login, logout} from "../controllers/auth.controller.js";
import { registerValidtor, loginValidator } from "../validators/auth.validator.js";
import { handleValidation } from "../middlewares/handle.validation.js";

const router = Router();

router.post('/register', registerValidtor, handleValidation, register);
router.post('/login', loginValidator, handleValidation, login);
router.post('/logout', logout);

export default router;