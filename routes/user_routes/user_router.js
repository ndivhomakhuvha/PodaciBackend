import {
  createUserController,
  signInUserController,
  signInAsGuestController,
  resendOtpController,
  updateUserController,
  verifyOTPController
} from "../../controllers/user_controller/user_controller.js";
import express from "express";
const router = express.Router();

router.post("/", createUserController);
router.post("/sign", signInUserController);
router.post("/resend", resendOtpController);
router.put("/update/:id", updateUserController);
router.post("/guest_sign", signInAsGuestController);
router.post("/otp/:id", verifyOTPController);

export default router;
