import express from "express";
import { authenticateUser, authorizeRole } from "../common/middleware/role-auth.middleware";
import { createAd, fetchAdById, getAds, getAdsByUserController } from "./ad.controller";

const router = express.Router();

// Create a new ad (admin-only)
router.post(
  "/",
  authenticateUser, // Ensure the user is authenticated
  authorizeRole(["ADMIN"]), // Ensure the user is an admin
  createAd // Handle ad creation
);
router.get('/all-ads', authenticateUser, getAdsByUserController);
router.get("/", authenticateUser, getAds);
router.get("/:id", fetchAdById);
export default router;