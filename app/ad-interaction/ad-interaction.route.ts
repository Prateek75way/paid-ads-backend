import express from "express";
import { authenticateUser } from "../common/middleware/role-auth.middleware";
import { interactWithAd } from "../ad-interaction/ad-interaction.controller";
import { rateLimiter } from "../common/middleware/rate-limitter.middleware";

const router = express.Router();



// Track ad interaction (view or click)
router.post("/", rateLimiter,authenticateUser,interactWithAd);

export default router;