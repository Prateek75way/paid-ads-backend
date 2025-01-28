import { type IUser } from "./user.dto";
import userSchema from "./user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Creates a new user and saves them to the database.
 * 
 * @param {IUser} data - The user data to be saved.
 * @returns {Promise<IUser>} - The created user object.
 */
export const createUser = async (data: IUser) => {
    const result = await userSchema.create({...data, active: true});
    return result;
};

/**
 * Fetches all users from the database.
 * 
 * @returns {Promise<{ success: boolean, message?: string, data?: IUser[] }>} - Returns a success flag with user data or an error message.
 */
export const getAllUsers = async () => {
    try {
        const users = await userSchema.find();
        if (users.length === 0) {
            return { success: false, message: "No users found" };
        }
        return { success: true, data: users };
    } catch (error: any) {
        throw new Error("Failed to retrieve users: " + error.message);
    }
};

/**
 * Logs in a user by verifying their email and password and generates authentication tokens.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ accessToken: string, refreshToken: string, user: IUser }>} - The access token, refresh token, and user object.
 * @throws {Error} If email or password is incorrect or missing.
 */
export const loginUser = async (email: string, password: string) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    user.refreshToken = refreshToken;
    user.active = true;
    await user.save();

    return { accessToken, refreshToken, user };
};

/**
 * Generates an access token for a user with their ID and role.
 * 
 * @param {string} id - The ID of the user.
 * @param {string} role - The role of the user.
 * @returns {string} - The generated access token.
 */
export const generateAccessToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "15m" });
}

/**
 * Generates a refresh token for a user with their ID and role.
 * 
 * @param {string} id - The ID of the user.
 * @param {string} role - The role of the user.
 * @returns {string} - The generated refresh token.
 */
export const generateRefreshToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });
};

/**
 * Refreshes the access and refresh tokens using the provided refresh token.
 * 
 * @param {string} refreshToken - The refresh token to use for generating new tokens.
 * @returns {Promise<{ accessToken: string, refreshToken: string, user: IUser }>} - The new access token, refresh token, and user object.
 * @throws {Error} If the refresh token is invalid or expired.
 */
export const refreshTokens = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };

        const user = await userSchema.findOne({ _id: decoded.id, refreshToken });
        if (!user) {
            throw new Error("Invalid or expired refresh token");
        }

        const newAccessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id, user.role);

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
    } catch (error: any) {
        console.error("Error refreshing tokens:", error);
        throw new Error("Invalid or expired refresh token");
    }
};

/**
 * Clears the refresh token for a user by setting it to an empty string in the database.
 * 
 * @param {string} userId - The ID of the user whose refresh token needs to be cleared.
 * @returns {Promise<void>} - A promise that resolves when the refresh token has been cleared.
 * @throws {Error} If the user cannot be found or there is an error updating the refresh token.
 */
export const clearRefreshToken = async (userId: string) => {
    try {
        const user = await userSchema.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.refreshToken = "";
        await user.save();
    } catch (error: any) {
        throw new Error(`Error clearing refresh token: ${error.message}`);
    }
};

/**
 * Retrieves the wallet balance for a user by their user ID.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{ walletBalance: number, name: string } | null>} - The wallet balance and user's name, or null if no user is found.
 */
export const getWalletBalanceByUserId = async (userId: string) => {
    const user = await userSchema.findById(userId).select("walletBalance name");
    return user ? { walletBalance: user.walletBalance, name: user.name } : null;
};
