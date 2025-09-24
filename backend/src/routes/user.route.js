import { Router } from "express";
import { getProfile, updateProfile} from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/auth.required.js";

const router = Router();

router.get('/me', authRequired, getProfile);
router.put('/me', authRequired, updateProfile);

export default router;