import database from '../controllers/server_controller.js'
import express from "express"
const router = express.Router();

router.post('/', database.createServer);
router.get('/:id', database.viewServersById);
export default router;