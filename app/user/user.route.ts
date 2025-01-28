
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";

import { authenticateUser, authorizeRole } from "../common/middleware/role-auth.middleware";
import { rateLimiter } from "../common/middleware/rate-limitter.middleware";



const router = Router();

router
        .post("/", userController.createUser)   
        .get("/",authenticateUser, // Authenticate the user
                authorizeRole(["ADMIN"]), userController.getAllUsers)
        .post("/login",rateLimiter, catchError, userController.loginUser)  
        .post("/refresh", rateLimiter,  catchError, userController.refresh) 
      
        .post("/logout", rateLimiter, authenticateUser, userController.logoutController) 
        router.get("/wallet-balance", authenticateUser,userController.getWalletBalance);
       
      
        // .get("/", userController.getAllUser)    
        // .get("/:id", userController.getUserById)   
        // .delete("/:id", userController.deleteUser)
        // .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
        // .patch("/:id", userValidator.editUser, catchError, userController.editUser)

export default router;  

 