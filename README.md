# mindVault Backend

This is the backend server for a personal note-taking application built using Node.js, Express, TypeScript, and PostgreSQL.  
It includes RESTful API endpoints for user registration and login, creating and managing notes, organizing notes with tags, and searching and filtering notes.

# Getting Started

To get started, make sure you have
- Node.js
- A PostgreSQL database

## Installation

Clone the repository
```
git clone https://github.com/vanssssssss/mindVault
```

Install dependencies
```
npm install
```

Create a `.env` file in the root of your directory and add variables
```
DATABASE_URL=<your PostgreSQL connection string>
JWT_SECRET_KEY=<your jwt secret>
PORT=<port number>
```

Run the server
```
npm start
```

The backend will run on: http://localhost:3000 (or as set in environment variable)

# API Endpoints

- POST `/api/v1/auth/register` — Register a new user.

- POST `/api/v1/auth/login` — Login and receive a JWT token.

- POST `/api/v1/notes` — Create a new note with optional tags.

- GET `/api/v1/notes` — Fetch all notes for the logged-in user (supports search, tag filter, and pagination).

- GET `/api/v1/notes/:id` — Fetch a specific note by its ID.

- PATCH `/api/v1/notes/:id` — Update a note's title, content, or tags.

- DELETE `/api/v1/notes/:id` — Delete a note by its ID.

- GET `/api/v1/tags` — Fetch all tags for the logged-in user.

- DELETE `/api/v1/tags/:id` — Delete a tag by its ID.

# Features Implemented

- User Registration & Login using JWT (JSON Web Token)
- Secure Password Hashing with bcrypt
- Protected Routes for all note and tag operations
- Create notes with a title, content, and multiple tags
- Tags are auto-created if they don't already exist
- Full-text search across note titles and content
- Filter notes by tag name
- Pagination support on note listings
- Update notes including full tag replacement
- Transactional writes for data integrity on note and tag operations
- Centralized database indexing for performant queries
- Proper HTTP Status Codes (200, 201, 204, 400, 401, 404, 409, 500)
