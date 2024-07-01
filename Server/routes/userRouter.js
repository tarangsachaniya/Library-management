import exp from "express";
import { currentUser, loginUser, registerUser } from "../controller/userController.js";
import { authmiddleware } from "../helper/auth.js";
const router = exp.Router();
router.post("/login", loginUser);
router.post('/register', registerUser);
router.get('/me', authmiddleware, currentUser);

export default router;