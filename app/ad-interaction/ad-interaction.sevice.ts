import { Ad } from "../ad/ad.schema";
import { AdInteraction } from "./ad-interaction.schema";
import User from "../user/user.schema";

/**
 * Track ad interaction (view or click) and reward the user.
 * 
 * This function tracks a user's interaction with a specific ad (either a view or click),
 * verifies if the user has already interacted with the ad, determines the reward amount based on the interaction type, 
 * and updates the user's wallet balance accordingly. It also records the interaction.
 * 
 * @param {string} userId - The ID of the user interacting with the ad.
 * @param {string} adId - The ID of the ad being interacted with.
 * @param {"view" | "click"} interactionType - The type of interaction: either "view" or "click".
 * @param {string} ipAddress - The IP address of the user making the interaction.
 * 
 * @returns {Promise<void>} - A promise that resolves when the interaction is tracked and the reward is applied.
 * 
 * @throws {Error} - Throws an error if the user has already interacted with the ad (both "view" and "click"), 
 *                   if the ad is not found, or if the user is not found.
 */
export const trackAdInteraction = async (
    userId: string,
    adId: string,
    interactionType: "view" | "click",
    ipAddress: string
): Promise<void> => {
    // Find all interactions for the given user, ad, and IP address
    const existingInteractions = await AdInteraction.find({ userId, adId, ipAddress });
    
    // Check if the user has both "view" and "click" interactions already
    const hasViewed = existingInteractions.some(interaction => interaction.interactionType === "view");
    const hasClicked = existingInteractions.some(interaction => interaction.interactionType === "click");
    
    // If both "view" and "click" interactions exist, throw an error
    if (hasViewed && hasClicked) {
      throw new Error("You have already interacted with this ad.");
    }
  
    // If the interaction is a "view" and the user has already clicked, or vice versa, allow the current interaction
    if ((interactionType === "view" && hasClicked) || (interactionType === "click" && hasViewed)) {
      // Allow user to interact again if it's either "view" or "click" without both
    }
  
    // Find the ad to get the reward amount
    const ad = await Ad.findById(adId);
    if (!ad) {
      throw new Error("Ad not found");
    }
  
    // Determine the reward amount based on the interaction type
    const rewardAmount = interactionType === "view" ? ad.pricePerView : ad.pricePerClick;
  
    // Update the user's wallet balance
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.walletBalance += rewardAmount;
    await user.save();
  
    // Record the interaction
    await AdInteraction.create({ userId, adId, interactionType, ipAddress });
};
