import {
  createServerController,
  viewServerByUserIdController,
  getAllServersController,
  updateServerController,
  deleteAparticularServerByIdController,
  createServerWithHttpsController,
} from "../../controllers/server_controller/server_controller.js";
import express from "express";
const router = express.Router();

router.post("/", createServerController);
router.get("/:id", viewServerByUserIdController);
router.get("/", getAllServersController);
router.put("/update/:id", updateServerController);
router.delete("/:id", deleteAparticularServerByIdController);
router.post("/with-https", createServerWithHttpsController);

export default router;
