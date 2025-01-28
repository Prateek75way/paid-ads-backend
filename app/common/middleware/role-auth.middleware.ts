import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../../user/user.schema";
import { IUser } from "../../user/user.dto";

/**
 * Extends the Express Request object to include a user property.
 * This is used for attaching the authenticated user after verification.
 * 
 * @interface AuthenticatedRequest
 * @extends {Request}
 */
export interface AuthenticatedRequest extends Request {
    user?: Omit<IUser, "password">; // Exclude the password field from the user object
}

/**
 * Middleware to authenticate the user using a JWT stored in cookies.
 *
 * This middleware retrieves the JWT from the `Authorization` header, verifies it,
 * and attaches the user object (excluding the password) to the request if successful.
 *
 * @param {AuthenticatedRequest} req - The incoming request object, extended to include user details after authentication.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 * @throws {Error} - If the token is missing, invalid, or expired.
 */
export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Retrieve the JWT from the Authorization header
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Authorization token is required" });
            return; // Exit after sending the response
        }

        // Verify the JWT using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
            id: string;
            role: string;
        };

        // Look for the user associated with the decoded token's ID in the database
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; // Exit after sending the response
        }

        // Attach user details to the request object, excluding the password field
        req.user = {
          _id: user._id.toString(),
          role: user.role,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          walletBalance: user.walletBalance,
          ipAddress: user.ipAddress,
          active: user.active,
          refreshToken: user.refreshToken,
          updatedAt: user.updatedAt
      };

        // Proceed to the next middleware or route handler
        next();
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
        } else {
            res.status(500).json({ message: error.message || "Failed to authenticate user" });
        }
    }
};

/**
 * Middleware to enforce role-based access control.
 *
 * This middleware ensures that only users with specific roles can access certain routes.
 * If the user's role is not included in the allowed roles, a `403 Forbidden` response is sent.
 *
 * @param {string[]} allowedRoles - Array of roles allowed to access the route.
 * @returns {Function} - Middleware function to check user roles.
 * @throws {Error} - If the user is not authenticated or if their role is not allowed.
 */
export const authorizeRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Check if the user is authenticated
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized: User not authenticated" });
            return;
        }

        // Check if the user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
            return;
        }

        // Proceed to the next middleware or route handler
        next();
    };
};
