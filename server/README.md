# Enterprise Task Management Platform

## Overview
The Enterprise Task Management Platform is a full-stack application built using the MERN (MongoDB, Express, React, Node.js) stack. This platform is designed to help organizations manage tasks, projects, and teams efficiently.

## Project Structure
The project is divided into two main parts: the client and the server.

### Client
The client-side is built with React and is responsible for the user interface. It includes:
- **public/index.html**: The main HTML file for the React application.
- **src/components**: Reusable React components such as buttons, forms, and modals.
- **src/pages**: Main pages of the application, including the dashboard and task management views.
- **src/App.js**: The main component that sets up application routes.
- **src/index.js**: The entry point for the React application.
- **package.json**: Configuration file for the client-side application.

### Server
The server-side is built with Node.js and Express, handling the backend logic and database interactions. It includes:
- **src/controllers**: Business logic for user, project, and task management.
- **src/models**: Mongoose models defining schemas for users, projects, tasks, and roles.
- **src/routes**: API endpoints for user, project, and task management.
- **src/app.js**: Entry point for the backend application, setting up the server and routes.
- **src/config/db.js**: Database configuration and connection logic for MongoDB.
- **package.json**: Configuration file for the server-side application.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running, or access to a MongoDB cloud service.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd enterprise-task-management-platform
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
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
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.