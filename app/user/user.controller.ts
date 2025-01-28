import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';

/**
 * Controller to create a new user.
 * 
 * @param {Request} req - The incoming request object containing user data.
 * @param {Response} res - The response object used to send back the status and response.
 * @returns {void}
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    res.status(201).send(createResponse(result, "User created successfully"));
});

/**
 * Controller to fetch all users.
 * 
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The response object used to send back the users list or an error.
 * @returns {void}
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            error: error.message,
        });
    }
};

/**
 * Controller to login a user.
 * 
 * @param {Request} req - The incoming request object containing the user's login credentials (email and password).
 * @param {Response} res - The response object used to send back the login result and set the access token as a cookie.
 * @returns {void}
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await userService.loginUser(email, password);

    // Set the access token as an HTTP-only cookie
    res.cookie("AccessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only for HTTPS in production
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).send(createResponse(result, "Login successful"));
});

/**
 * Controller to refresh the user's access token and refresh token.
 * 
 * @param {Request} req - The incoming request object containing the refresh token.
 * @param {Response} res - The response object used to send back the refreshed tokens and user data.
 * @returns {void}
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
        const { accessToken, refreshToken: newRefreshToken, user } = await userService.refreshTokens(refreshToken);

        // Set the new access token as an HTTP-only cookie
        res.cookie("AccessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).send(
            createResponse(
                { accessToken, refreshToken: newRefreshToken, user }, // Include user data
                "Tokens refreshed successfully"
            )
        );
    } catch (error: any) {
        throw new Error(error.message);
    }
});

/**
 * Controller to log out the user by clearing the access token cookie.
 * 
 * @param {Request} req - The incoming request object containing the user's details (through authentication middleware).
 * @param {Response} res - The response object used to send back the logout status.
 * @returns {void}
 */
export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;  // Assuming user is attached to the request after authentication

    if (!userId) {
        throw new Error("User not authenticated");
    }

    try {
        // Clear the accessToken cookie
        res.clearCookie("AccessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure for production environments
            sameSite: "strict",
        });

        // Call service to update the refresh token in the database
        await userService.clearRefreshToken(userId);

        // Send a success response
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Controller to get the user's wallet balance.
 * 
 * @param {Request} req - The incoming request object containing the user's ID (from authentication middleware).
 * @param {Response} res - The response object used to send back the user's wallet balance or an error.
 * @returns {void}
 */
export const getWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) { throw new Error("User not authenticated"); }
        
        const userBalance = await userService.getWalletBalanceByUserId(userId);

        if (!userBalance) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json(userBalance);
        }
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
