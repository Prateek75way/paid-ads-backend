import { Request, Response } from "express";
import { createAdService, fetchAdsForUser, getAdById, getAdsByUser } from "./ad.service";
import { IAd } from "./ad.dto";

/**
 * Create a new ad (admin-only).
 * 
 * @param {Request} req - The request object that contains the data to create the ad.
 * @param {Response} res - The response object used to send the response to the client.
 * 
 * @returns {Promise<void>} - Sends a response with the status of the ad creation.
 */
export const createAd = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, imageUrl, pricePerView, pricePerClick, redirectUrl } = req.body;

        // Validate required fields
        if (!title || !description || !imageUrl || !pricePerView || !pricePerClick || !redirectUrl) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Prepare ad data
        const adData: IAd = {
            title,
            description,
            imageUrl,
            pricePerView,
            pricePerClick,
            redirectUrl
        };
        if(!req.user){
            throw new Error("User not authenticated");
        }
        // Call the service to create the ad
        const newAd = await createAdService(adData, req.user?._id);

        res.status(201).json({ message: "Ad created successfully", ad: newAd });
    } catch (error: any) {
        if (error.message === "Only admins can create ads") {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || "Failed to create ad" });
        }
    }
};

/**
 * Fetch all ads available for the user.
 * 
 * @param {Request} req - The request object that contains any necessary query parameters.
 * @param {Response} res - The response object used to send the response to the client.
 * 
 * @returns {Promise<void>} - Sends a response with the fetched ads.
 */
export const getAds = async (req: Request, res: Response): Promise<void> => {
    try {
      const ads = await fetchAdsForUser();
      res.status(200).json({ message: "Ads fetched successfully", ads });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch ads" });
    }
};

/**
 * Fetch all ads created by the authenticated user.
 * 
 * @param {Request} req - The request object that contains the authenticated user's data.
 * @param {Response} res - The response object used to send the response to the client.
 * 
 * @returns {Promise<void>} - Sends a response with the user's ads or an error message if no ads are found.
 */
export const getAdsByUserController = async (req: Request, res: Response) => {
    try {
        if(!req.user){ throw new Error("User not authenticated");}
        const userId = req.user._id;  // Assuming `req.user` contains the authenticated user data
        const ads = await getAdsByUser(userId);  // Call the service function to get ads
        if (ads.length === 0) {
            return res.status(404).json({ message: 'No ads found for this user.' });
        }
        return res.status(200).json({ ads });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching ads: ' + error.message });
    }
};

/**
 * Fetch an ad by its ID.
 * 
 * @param {Request} req - The request object that contains the ad ID in the URL parameters.
 * @param {Response} res - The response object used to send the response to the client.
 * 
 * @returns {Promise<void>} - Sends a response with the ad data if found or an error message.
 */
export const fetchAdById = async (req: Request, res: Response) => {
    const { id } = req.params; // Extract the ad ID from the URL params
    try {
      const ad = await getAdById(id); // Call the service function
      res.status(200).json({ success: true, ad }); // Send the ad as the response
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
};
