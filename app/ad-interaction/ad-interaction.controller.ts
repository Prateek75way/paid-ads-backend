import { Request, Response } from "express";
import { trackAdInteraction } from "./ad-interaction.sevice";

/**
 * Controller to track ad interaction (view or click) and reward the user.
 * 
 * This function logs the ad interaction (such as a view or click) by a user,
 * associates the interaction with the user and their IP address, and then 
 * calls a service to record the interaction and apply any rewards.
 * 
 * @param {Request} req - The request object that contains the user's interaction data (adId, interactionType).
 * @param {Response} res - The response object to send the status back to the client.
 * 
 * @returns {Promise<void>} - The result of tracking the interaction, including any errors.
 * 
 * @throws {Error} - Throws an error if the adId, interactionType, userId, or ipAddress are missing.
 */
export const interactWithAd = async (req: Request, res: Response): Promise<void> => {
    try {
      // Log the entire request body to see what data is coming in
      console.log("Request Body:", req.body);
  
      const { adId, interactionType } = req.body;
      
      // Log individual fields to confirm they are being extracted correctly
      console.log("Ad ID:", adId);
      console.log("Interaction Type:", interactionType);
  
      const userId = req.user?._id; // User ID from the authenticated request
      const ipAddress = req.ip; // User's IP address from the request
  
      // Log the userId and ipAddress to ensure they are extracted
      console.log("User ID:", userId);
      console.log("IP Address:", ipAddress);
  
      if (!adId || !interactionType) {
        console.error("Missing adId or interactionType");
        res.status(400).json({ message: "Ad ID and interaction type are required" });
        return;
      }
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      if (!ipAddress) {
        throw new Error("IP address not found");
      }
  
      // Proceed with tracking the ad interaction
      await trackAdInteraction(userId, adId, interactionType, ipAddress);
  
      res.status(200).json({ message: "Ad interaction recorded successfully" });
    } catch (error: any) {
      // Log any errors for debugging
      console.error("Error:", error.message);
      res.status(400).json({ message: error.message || "Failed to record ad interaction" });
    }
};
