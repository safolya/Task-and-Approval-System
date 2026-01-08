import { authMiddle } from "../../middlewares/authMiddleware";
import { roleMiddle } from "../../middlewares/roleMiddleware";
import { Router } from "express";

const router = Router();

router.post("/createTeam",authMiddle,roleMiddle,)

