import { authMiddle } from "../../middlewares/authMiddleware";
import { managerMiddle } from "../../middlewares/managerMiddleware";
import { Router } from "express";
import { createTask,allTask } from "./task.controller";
const router = Router();

router.get("/all",authMiddle,allTask)
router.post("/create/:teamId",authMiddle,managerMiddle,createTask)

export default router;