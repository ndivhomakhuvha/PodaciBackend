import {
  createServerController,
  viewServerByUserIdController,
  getAllServersController,
  updateServerController,
  deleteAparticularServerByIdController,
  createServerWithHttpsController,
  pingAllServersController,
  pingAllServersControllerScheduled
} from "../../controllers/server_controller/server_controller.js";
import express from "express";
const router = express.Router();

router.post("/", createServerController);
router.get("/:id", viewServerByUserIdController);
router.get("/", getAllServersController);
router.put("/update/:id", updateServerController);
router.delete("/:id", deleteAparticularServerByIdController);
router.post("/with-https", createServerWithHttpsController);
router.put("/allservers/:id", pingAllServersController);
router.put("/allservers", pingAllServersControllerScheduled);
export default router;
