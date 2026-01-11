import { authMiddle } from "../../middlewares/authMiddleware";
import { roleMiddle } from "../../middlewares/roleMiddleware";
import { Router } from "express";
import { createTeam,invite,resInvite,roleChange,remove,getTeam } from "./team.controller";
const router = Router();

router.get("/all",authMiddle,getTeam);
router.post("/create",authMiddle,roleMiddle,createTeam)
router.post("/invite/:teamId",authMiddle,roleMiddle,invite)
router.post("/invite/team/:token",authMiddle,resInvite)
router.post("/:teamId/members/:userId/role",authMiddle,roleMiddle,roleChange)
router.post("/:teamId/remove/:userId",authMiddle,roleMiddle,remove)

export default router;

