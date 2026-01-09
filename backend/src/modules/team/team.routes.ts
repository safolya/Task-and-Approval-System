import { authMiddle } from "../../middlewares/authMiddleware";
import { roleMiddle } from "../../middlewares/roleMiddleware";
import { Router } from "express";
import { createTeam,invite,resInvite } from "./team.controller";
const router = Router();

router.post("/create",authMiddle,roleMiddle,createTeam)
router.post("/invite/:teamId",authMiddle,roleMiddle,invite)
router.post("/invite/team/:token",authMiddle,resInvite)

export default router;

