import { Ad } from "./ad.schema";
import { IAd } from "./ad.dto";
import User from "../user/user.schema";

/**
 * Create a new ad. This function is only available for admin users.
 * 
 * @param {IAd} adData - The data for the new ad to be created.
 * @param {string} userId - The ID of the user attempting to create the ad.
 * 
 * @returns {Promise<IAd>} - The newly created ad.
 * 
 * @throws {Error} - Throws an error if the user is not an admin or if an error occurs during creation.
 */
export const createAdService = async (adData: IAd, userId: string): Promise<IAd> => {
    // Check if the user is an admin
    const adminUser = await User.findById(userId);
    if (!adminUser || adminUser.role !== "ADMIN") {
        throw new Error("Only admins can create ads");
    }

    // Create the ad
    const newAd: IAd = await Ad.create({
        ...adData,
        createdBy: adminUser._id, // Associate the ad with the admin who created it
    });

    return newAd;
};

/**
 * Get all ads created by a specific user.
 * 
 * @param {string} userId - The ID of the user whose ads are to be fetched.
 * 
 * @returns {Promise<IAd[]>} - An array of ads created by the user.
 * 
 * @throws {Error} - Throws an error if an issue occurs during fetching the ads.
 */
export const getAdsByUser = async (userId: string): Promise<IAd[]> => {
    try {
        const ads = await Ad.find({ createdBy: userId }).populate('createdBy', 'name email role');
        return ads;  // Return the found ads
    } catch (error: any) {
        throw new Error('Error fetching ads: ' + error.message);
    }
};

/**
 * Fetch all ads available for the user.
 * 
 * @returns {Promise<any[]>} - An array of all ads available.
 * 
 * @throws {Error} - Throws an error if an issue occurs while fetching the ads.
 */
export const fetchAdsForUser = async (): Promise<any[]> => {
    return await Ad.find().select("-__v"); // Fetch all ads (excluding the __v field)
};

/**
 * Get a specific ad by its ID.
 * 
 * @param {string} adId - The ID of the ad to be fetched.
 * 
 * @returns {Promise<IAd>} - The ad with the specified ID.
 * 
 * @throws {Error} - Throws an error if the ad is not found or if an issue occurs while fetching it.
 */
export const getAdById = async (adId: string): Promise<IAd> => {
    try {
      const ad = await Ad.findById(adId).populate("createdBy", "name email");
      if (!ad) {
        throw new Error("Ad not found");
      }
      return ad;
    } catch (error: any) {
      throw new Error(error.message || "Error fetching the ad");
    }
};
