import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";

import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// Load the environment configuration
loadConfig();

//swagger files config
const swaggerJson = fs.readFileSync(path.join(process.cwd(), 'swagger', 'options.json'), 'utf-8');
const swaggerSpec = JSON.parse(swaggerJson); 
 
// Extend Express to include a user interface without password field 
declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}

// Port number (defaults to 8000 if not specified)
const port = Number(process.env.PORT) ?? 8000;

// Create Express app instance
const app: Express = express(); 

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
   origin: "*",  // Allows all origins
   credentials: true // Allows credentials (cookies, authorization headers, etc.)
}));

/**
 * Initializes and starts the application.
 * 
 * @returns {Promise<void>} - A promise that resolves once the app has been initialized and started.
 */
const initApp = async (): Promise<void> => {
  // Initialize MongoDB connection
  await initDB();

  // Initialize Passport for JWT authentication
  // initPassport();


  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Pass swaggerSpec instead of null
  
  
  // Static file serving for the JSON file
  app.use('/swagger', express.static(path.join(process.cwd(), 'swagger')));
  const swaggerJsonPath = path.join(process.cwd(), 'swagger', 'options.json');

  // Set up API routes with the base path /api
  app.use("/api", routes);

  // Health check endpoint
  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // Error handling middleware
  app.use(errorHandler);

  // Start HTTP server on the specified port
  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};

// Initialize the app
void initApp();
