# AI-Assisted Job Application Tracker

This is a MERN stack job application tracker built for an internship assignment. The app lets users manage applications on a Kanban board, paste a job description for AI-based field extraction, and review role-specific resume bullet suggestions before saving the application.

## Tech Stack

- Frontend: React, JavaScript, Tailwind CSS, Vite, React Query
- Backend: Node.js, Express, JavaScript
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- AI: Gemini API with structured JSON output

## Project Structure

```text
.
|-- client
|   |-- src
|   |   |-- components
|   |   |-- context
|   |   |-- hooks
|   |   |-- lib
|   |   |-- pages
|   |   |-- services
|   |   `-- types
|-- server
|   |-- src
|   |   |-- config
|   |   |-- constants
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- schemas
|   |   |-- services
|   |   `-- utils
|-- .env.example
`-- package.json
```

## Features Implemented

- Register and login with JWT-based authentication
- Protected frontend and backend routes
- Persistent login after page refresh using local storage
- Kanban board with five required stages
- Drag and drop cards between stages
- Create, edit, view, and delete applications
- AI-powered job description parsing
- AI-generated resume bullet suggestions with copy buttons
- Loading, empty, and error states on the frontend
- Clean service-layer separation for AI logic on the backend

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

Required variables:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `CLIENT_URL`
- `VITE_API_URL`

`CLIENT_URL` can be a single frontend URL or multiple comma-separated URLs if you want to allow both local and deployed clients.

## How To Run

1. Install dependencies from the project root:

```bash
npm install
```

2. Create a `.env` file in the project root using the values from `.env.example`.

3. Start the backend in one terminal:

```bash
npm run dev:server
```

4. Start the frontend in another terminal:

```bash
npm run dev:client
```

5. Open `http://localhost:5173`

## Build Commands

Frontend:

```bash
npm run build --workspace client
```

Backend:

```bash
npm run build --workspace server
```

Full build:

```bash
npm run build
```

## Deployment

The simplest deployment setup for this project is:

- Frontend on Vercel
- Backend on Render
- MongoDB Atlas or another hosted MongoDB instance

### Backend on Render

Deploy the `server` folder as a Node web service.

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Set these environment variables in Render:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `CLIENT_URL`

For `CLIENT_URL`, use your deployed Vercel frontend URL.

### Frontend on Vercel

Deploy the `client` folder as a Vite app.

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

`client/vercel.json` is included so React Router routes like `/login` and `/register` continue to work after deployment.

Set this environment variable in Vercel:

- `VITE_API_URL`

For `VITE_API_URL`, use your deployed Render backend URL with `/api` at the end.

Example:

```text
https://your-backend-name.onrender.com/api
```

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Applications

- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `PATCH /api/applications/:id/status`
- `DELETE /api/applications/:id`
- `POST /api/applications/parse`

## Decisions Made

- I kept the project in a simple `client` and `server` structure so it is easy to explain and navigate.
- I placed the AI logic inside `server/src/services/aiService.js` so the route handlers stay small and focused.
- I used native drag and drop for the board because it was enough for the assignment and kept the frontend lighter.
- I used React Query to handle API data and refresh the board after create, update, delete, and status changes.
- I focused on the core assignment requirements and avoided adding stretch features before the basics were complete.

## Notes

- This project is focused on the exact core requirements from the assignment and does not include stretch goals like reminders, CSV export, dashboard analytics, or dark mode.
- The Gemini parser expects a reasonably detailed job description for better extraction quality.
