# capstone

A full-stack blogging platform with role-based access for users, authors, and admins. The project includes:

- **Backend**: Node.js, Express, MongoDB, JWT authentication, file upload support, Cloudinary image handling, and role-based API routing.
- **Frontend**: React, Vite, Tailwind CSS, React Router, Zustand, Axios, and protected route support.

## Key Features

- User registration and login
- Role-based access for `USER`, `AUTHOR`, and `ADMIN`
- Author dashboard for creating, editing, and viewing articles
- Admin dashboard for managing users and authors
- Public article browsing and author listing
- API error handling and invalid route fallback

## Project Structure

- `backend/`: Express server, API routes, middleware, models, and configuration
- `frontend/`: React application, routing, pages, components, and styles

### Backend structure

- `backend/server.js` - main server entry point
- `backend/APIs/` - route modules for user, author, admin, and common public operations
- `backend/models/` - Mongoose schemas for users and articles
- `backend/middlewares/` - authentication and token verification middleware
- `backend/config/` - Cloudinary, Multer, and upload configuration

### Frontend structure

- `frontend/src/App.jsx` - route definitions and app bootstrap
- `frontend/src/components/` - page and UI components
- `frontend/src/store/authStore.js` - client authentication state
- `frontend/src/styles/common.js` - shared styling tokens

## Setup

### 1. Backend

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file with the following environment variables:

```env
PORT=5000
DB_URL=<your-mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

4. Start the backend server:

```bash
npm start
```

The backend listens on the port defined in `PORT` and exposes these main route prefixes:

- `/user-api`
- `/author-api`
- `/admin-api`
- `/common-api`

### 2. Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

> Note: `frontend/src/App.jsx` currently sets `axios.defaults.baseURL` to `https://capstone-lq6s.onrender.com`.
> If you run the backend locally, update this to your local backend URL or add environment-based configuration.

## Running Locally

- Start backend first with `npm start` in `backend/`
- Start frontend with `npm run dev` in `frontend/`
- Access the app in your browser at the Vite server URL

## Authentication and Authorization

The platform supports:

- `USER` role: access to user profile pages
- `AUTHOR` role: author dashboard, write and edit articles
- `ADMIN` role: admin dashboard, manage users and authors

Protected routes are implemented in the frontend via `ProtectedRoute.jsx`.

## Deployment Notes

- The frontend is configured for Vite and can be built with `npm run build`
- The backend is ready for deployment as a Node.js app using `npm start`
- Ensure MongoDB and Cloudinary credentials are available in production environment variables

## Useful Commands

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Additional Notes

- The backend includes centralized error handling and invalid route support
- The frontend includes route-based page components and an admin/author/user navigation flow
- Use the existing HTTP request files in `backend/` for manual API testing if needed

---

Built for a capstone project showcasing a modern blog platform with role-based access control.
