
# Reward View Project

This is the backend for the Reward View project. The application allows users to earn rewards by interacting with ads (view or click). Users can register, log in, and track their wallet balances, while admins can manage users and ads.

## Features

- **Unique IP Address**: Each user is unique , with there own IP Address
- **User Authentication**: Register, log in, and manage user sessions with JWT-based authentication.
- **User Role Management**: Roles for users and admins, allowing different permissions for each.
- **Ad Interaction**: Users can interact with ads (view or click), earning rewards based on their actions.
- **Admin Control**: Admins can create, view, and manage ads. Admins can also view all users and manage their actions.
- **Rate Limiting**: Limits the number of requests to prevent abuse.
- **Wallet Balance**: Track and manage wallet balances for users.
- **Error Handling**: Handles errors gracefully across the app.

## Technology Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building RESTful APIs.
- **Mongoose**: MongoDB ODM for interacting with the database.
- **TypeScript**: Typed JavaScript for improved developer experience.
- **JWT (JSON Web Tokens)**: For user authentication.
- **Bcrypt**: For hashing passwords securely.
- **Swagger UI**: For API documentation.
- **Husky & Lint-Staged**: For pre-commit hooks and code quality tools (ESLint, Prettier).

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB database instance
- NPM or Yarn for package management

### Step-by-Step Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/reward-view-backend.git
    cd reward-view-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**: Create a `.env` file in the root of the project and add the following configuration:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/rewardview
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the server**:
    ```bash
    npm run start
    ```

Your backend should now be running on `http://localhost:5000`.

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user.
- **POST** `/api/auth/login` - Login and get a JWT token.
- **POST** `/api/auth/refresh` - Refresh the JWT token.
- **POST** `/api/auth/logout` - Log the user out and invalidate the token.

### Users

- **GET** `/api/users` - Get all users (Admin only).
- **GET** `/api/users/wallet-balance` - Get the wallet balance of the authenticated user.
- **GET** `/api/users/{id}` - Get a specific user (Admin only).
- **DELETE** `/api/users/{id}` - Delete a specific user (Admin only).

### Ads

- **POST** `/api/ads` - Create a new ad (Admin only).
- **GET** `/api/ads` - Get all ads (Authenticated users).
- **GET** `/api/ads/{id}` - Get a specific ad.
- **GET** `/api/ads/all-ads` - Get all ads created by the authenticated user.
- **POST** `/api/ads/interact` - Track an ad interaction (view or click).

### Ad Interactions

- **POST** `/api/ads/interact` - Track ad interaction (view or click) for the authenticated user.

## Middleware

- **Authentication**: Ensures the user is logged in and their token is valid.
- **Authorization**: Ensures the user has the correct role (e.g., Admin) to access certain routes.
- **Rate Limiting**: Limits the number of requests to prevent abuse.
- **Error Handling**: Global error handling to ensure graceful failure.

## Development Setup

### Running the Development Server

You can run the development server with live reloading using `nodemon`:

```bash
npm run dev
```

### Running the Project in Production

To run the project in production mode:

```bash
npm run prod
```

### Linting and Formatting

To ensure code quality and consistency, the project uses **ESLint** and **Prettier**:

- To lint your code:
    ```bash
    npm run lint
    ```

- To fix linting issues:
    ```bash
    npm run lint:fix
    ```

- To format your code:
    ```bash
    npm run format
    ```

### Pre-Commit Hooks

The project uses **Husky** to enforce pre-commit hooks. Before each commit, code is automatically linted and formatted.

## Testing

For unit testing and integration testing, the project uses **Jest** or other testing tools. (You can add testing commands as needed.)

Run tests using the following command:

```bash
npm test
```


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new pull request.


### Key Sections:
1. **Features**: Outlines the core features of the project.
2. **Technology Stack**: Lists technologies and tools used in the project.
3. **Installation**: Guides on setting up the project locally.
4. **API Endpoints**: Describes the available routes and HTTP methods.
5. **Middleware**: Explains the middleware in use for authentication, authorization, rate limiting, and error handling.
6. **Development Setup**: Instructions for setting up and running the development server, as well as running in production mode.
7. **Linting and Formatting**: Instructions on ensuring consistent code formatting.
8. **Testing**: Placeholder for unit testing and integration testing.
9. **Deployment**: How to deploy to Heroku.
10. **Contributing**: Guidelines for contributing to the project.
11. **License**: Licensing information.

