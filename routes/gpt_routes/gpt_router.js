
import { askGPTController } from "../../controllers/gpt_controller/chatgpt_controller.js";
import express from "express"
const router = express.Router();

router.post('/', askGPTController);
export default router;