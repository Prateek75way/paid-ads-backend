import express from "express";
import { authenticateUser } from "../common/middleware/role-auth.middleware";
import { interactWithAd } from "../ad-interaction/ad-interaction.controller";

const router = express.Router();



// Track ad interaction (view or click)
router.post("/", authenticateUser,interactWithAd);

export default router;