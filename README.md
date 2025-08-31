# Movie Review App

## Overview
The Movie Review App is a full-stack web application that allows users to explore movies, manage their watchlist, and leave reviews. It also includes an admin panel for managing movie data. The app is built using modern web technologies, including React, Node.js, Express.js, and MongoDB.

## Features
### User Frontend
- **Home Page**: Displays a list of movies with details like title, genre, release year, director, and rating.
- **Login/Register**: Combined login and registration functionality for user authentication.
- **Watchlist**: Allows users to add and remove movies from their watchlist.
- **Navbar**: Provides navigation to Home, Movies, Watchlist, and Profile pages.

### Admin Frontend
- **Login**: Admin authentication using email and password.
- **Navbar**: Navigation options for viewing all movies and adding new movies.
- **Add Movie**: Form to add new movies to the database, including fields for title, genre, release year, director, cast, synopsis, and poster URL.
- **Home Page**: Displays all movies with pagination and filtering options.

### Backend
- **Authentication**: JWT-based authentication for users and admins.
- **Movie Management**: APIs for adding, retrieving, and managing movies.
- **Watchlist Management**: APIs for adding and removing movies from the user's watchlist.

## Technologies Used
- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Setup Instructions
### Prerequisites
- Node.js and npm installed
- MongoDB database

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-review-app
   ```
3. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
4. Install dependencies for the user frontend:
   ```bash
   cd ../user-frontend
   npm install
   ```
5. Install dependencies for the admin frontend:
   ```bash
   cd ../admin-frontend
   npm install
   ```

### Environment Variables
Create `.env` files in the `server`, `user-frontend`, and `admin-frontend` directories with the following variables:
- **Server**:
  ```env
  ADMIN_EMAIL=admin@movie-review.com
  ADMIN_PASSWORD=qwerty123
  JWT_SECRET=<jwt-secret>
  MONGO_URI=<mongo-uri>
  ```
- **User Frontend** and **Admin Frontend**:
  ```env
  REACT_APP_BACKEND_URL=http://localhost:4000
  ```

### Running the Application
1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
2. Start the user frontend:
   ```bash
   cd ../user-frontend
   npm run dev
   ```
3. Start the admin frontend:
   ```bash
   cd ../admin-frontend
   npm run dev
   ```

### Access the Application
- **User Frontend**: `http://localhost:5173`
- **Admin Frontend**: `http://localhost:5174`

## License
This project is licensed under the MIT License.
