import openai from '../controllers/chatgpt_controller.js'
import express from "express"
const router = express.Router();

router.post('/', openai.askSomething);
export default router;