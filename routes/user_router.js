import database from "../controllers/user_controller.js";
import express from "express";
const router = express.Router();

router.post("/", database.createUser);
router.post("/sign", database.Signin);
router.post("/resend", database.resendOTP);

export default router;
