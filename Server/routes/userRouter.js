import exp from "express";
import { loginUser, registerUser } from "../controller/userController.js";
const router = exp.Router();
router.post("/login" , loginUser);
router.post('/register',registerUser);

export default router;