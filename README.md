# Enterprise Task Management Platform

## Overview
The Enterprise Task Management Platform is a full-stack application built using the MERN stack (MongoDB, Express, React, Node.js). This platform is designed to help teams manage their tasks, projects, and workflows efficiently.

## Project Structure
The project is organized into two main directories: `client` and `server`.

### Client
The client-side of the application is built with React and is responsible for the user interface.

- **public/index.html**: The main HTML file for the React application.
- **src/components**: Contains reusable React components such as buttons, forms, and modals.
- **src/pages**: Contains the main pages of the application, including the dashboard and task management pages.
- **src/App.js**: The main component that sets up application routes.
- **src/index.js**: The entry point for the React application.
- **package.json**: Configuration file for the client-side application.

### Server
The server-side of the application is built with Node.js and Express, handling the backend logic and database interactions.

- **src/controllers**: Contains controller files for user, project, and task management.
- **src/models**: Contains Mongoose models defining schemas for users, projects, tasks, and roles.
- **src/routes**: Contains route files defining API endpoints.
- **src/app.js**: The entry point for the backend application.
- **src/config/db.js**: Database configuration and connection logic for MongoDB.
- **package.json**: Configuration file for the server-side application.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

3. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

The application should now be running on `http://localhost:3000` for the client and `http://localhost:5000` for the server.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.