# Restaurant Menu Premium

Full-stack digital menu for a luxury restaurant.

## Stack

- Frontend: React created with Create React App
- Backend: Node.js, Express and Mongoose
- Database: MongoDB Atlas

## Structure

```text
frontend/  React application
backend/   Express API with model/service/controller architecture
```

## Run locally

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `MONGODB_URI`, `ADMIN_PASSWORD` and `JWT_SECRET` in `backend/.env` before starting the server. The configured admin email is `simonaognanova05@gmail.com`. The health endpoint is available at `http://localhost:5000/api/health`.

The public menu is available at `GET /api/menu`. Category and dish create, update and delete endpoints require a Bearer token returned by `POST /api/auth/login`.

### Frontend

```bash
cd frontend
npm start
```

The React app runs at `http://localhost:3000`.
