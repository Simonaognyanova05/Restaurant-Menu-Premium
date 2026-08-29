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

## Представяне пред бизнеса

Публичното меню е на `http://localhost:3000`, а админ студиото е на `http://localhost:3000/#admin`.

### Production конфигурация

В production средата задайте environment variables през hosting платформата, а не в Git:

**Backend**

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://menu.example.com
MONGODB_URI=<production-mongodb-uri>
ADMIN_EMAIL=<business-admin-email>
ADMIN_PASSWORD=<strong-admin-password>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1d
```

**Frontend**

```env
REACT_APP_API_URL=https://api.example.com/api
```

Build команда:

```bash
cd frontend
npm ci
npm run build
```

Deploy-нете съдържанието на `frontend/build` като статичен сайт и стартирайте backend-а с `npm ci && npm start` от `backend`.

### Преди реален launch

- Сменете MongoDB паролата и admin паролата, ако са били използвани за development.
- Добавете production домейна във `CLIENT_URL`; при няколко домейна ги разделете със запетая.
- Проверете `GET /api/health` и login-а в `/#admin`.
- Добавете менюто през админ студиото и проверете mobile изгледа на QR линка.
- Не commit-вайте `.env` файлове или credentials.

### Demo меню

За да добавите примерни данни в MongoDB, уверете се, че `backend/.env` съдържа валиден `MONGODB_URI`, след което изпълнете:

```bash
cd backend
npm run seed
```

Скриптът добавя четири категории с общо девет ястия. Той е идемпотентен: при повторно изпълнение обновява същите категории и ястия, вместо да създава дубликати.
