import express from "express";
import userRoutes from "./user/user.route";
import adRoutes from "./ad/ad.routes";
import interactWithAd from "./ad-interaction/ad-interaction.route";
// routes
const router = express.Router();

router.use("/users", userRoutes);
router.use("/ads", adRoutes)
router.use("/interact", interactWithAd)

export default router; 