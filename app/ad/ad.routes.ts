import express from "express";
import { authenticateUser, authorizeRole } from "../common/middleware/role-auth.middleware";
import { createAd, fetchAdById, getAds, getAdsByUserController } from "./ad.controller";
import { rateLimiter } from "../common/middleware/rate-limitter.middleware";

const router = express.Router();

// Create a new ad (admin-only)
router.post(
  "/", rateLimiter,
  authenticateUser, // Ensure the user is authenticated
  authorizeRole(["ADMIN"]), // Ensure the user is an admin
  createAd // Handle ad creation
);
router.get('/all-ads',rateLimiter, authenticateUser, getAdsByUserController);
router.get("/", rateLimiter,getAds);
router.get("/:id", rateLimiter, fetchAdById);
export default router;