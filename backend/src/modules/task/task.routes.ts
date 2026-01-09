import { authMiddle } from "../../middlewares/authMiddleware";
import { managerMiddle } from "../../middlewares/managerMiddleware";
import { roleMiddle } from "../../middlewares/roleMiddleware";
import { Router } from "express";
import { createTask } from "./task.controller";
const router = Router();

router.post("/create/task/:teamId",authMiddle,managerMiddle,createTask)