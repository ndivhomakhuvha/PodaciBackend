import database from '../controllers/server_controller.js'
import express from "express"
const router = express.Router();

router.post('/', database.createServer);
router.get('/:id', database.viewServersById);
router.get('/', database.getAllServers);
router.put('/update/:id', database.updateServer)
router.delete('/:id', database.DeleteOne);

export default router;