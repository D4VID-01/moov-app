import { Router } from "express";
import {register, login, logout} from "../controllers/auth.controller.js";
import { registerValidtor, loginValidator } from "../validators/auth.validator.js";

const router = Router();

router.post('/register', registerValidtor, register);
router.post('/login', loginValidator, login);
router.post('/logout', logout);

export default router;