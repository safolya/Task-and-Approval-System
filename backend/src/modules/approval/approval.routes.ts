import { authMiddle } from "../../middlewares/authMiddleware";
import { managerMiddle } from "../../middlewares/managerMiddleware";
import { Router } from "express";
import { approveTask } from "./approval.controller";
const router = Router();

router.post("/team/:taskId",authMiddle,managerMiddle,approveTask);
router.post("/team/:taskId/reject",authMiddle,managerMiddle,approveTask);

export default router;