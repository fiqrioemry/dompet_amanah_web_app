# 💸 Dompet Amanah – Donation Management App

Dompet Amanah is a fullstack donation management platform that empowers transparency, accountability, and collaboration between donors, admins, and reviewers in charitable programs. This application simplifies the process of managing donation campaigns, verifying program activities, and tracking donation progress — all in one centralized system.

Designed to foster trust and streamline the donation lifecycle, Dompet Amanah provides role-based dashboards, secure OTP login, structured donation receipts, audit verification, and real-time insights into ongoing charity efforts.

---

## 1. Project Overview

Dompet Amanah was built to address a common pain in community-based donation efforts: a lack of transparency, real-time monitoring, and clear accountability. Many donation platforms fail to provide end-to-end traceability, from fundraising to impact delivery. Dompet Amanah solves this by giving donors real-time updates and enabling reviewers to verify program activities through logs, audits, and image-based evidence.

---

## 2. Tech Stack

### Backend

- **Node.js (Express 5)** – API server framework
- **Sequelize ORM** – PostgreSQL database integration
- **PostgreSQL** – Primary database
- **Redis + rate-limit-redis** – OTP/session storage & rate limiter
- **JWT + OTP (Nodemailer)** – Auth system
- **Multer + Cloudinary** – File uploads and image hosting
- **Midtrans Client** – Payment gateway integration
- **Joi** – Schema validation
- **Docker + Docker Compose** – Containerization

### Deployment & Infra

- **VPS (Ubuntu)** with **Docker**, **Nginx**, **Certbot** for SSL
- **API Key Middleware** for internal protection
- **Express Async Handler** for clean error handling

---

## 3. Key Features

- ✅ **OTP-based Authentication** via Email
- ✅ **Google-Ready OAuth Extension (Planned)**
- ✅ **Role-based Access Control** (Admin, Donor, Reviewer)
- ✅ **Donation Lifecycle Tracking** (create, view, verify)
- ✅ **Campaign Program Management**
- ✅ **Audit Log & Image Upload** by reviewer
- ✅ **Program Activity Logs**
- ✅ **Donation Receipt Generator**
- ✅ **Dashboard with summary & statistics**
- ✅ **Secure Media Upload (via Cloudinary)**
- ✅ **Rate Limiting + Redis OTP Tracking**

---

## 4. API Endpoints

### 4.1 Authentication

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| POST   | /api/v1/auth/verify-otp      | Verify OTP login         |
| POST   | /api/v1/auth/send-otp        | Send OTP to email        |
| POST   | /api/v1/auth/register        | Register new user        |
| POST   | /api/v1/auth/login           | Login with credentials   |
| POST   | /api/v1/auth/logout          | Logout user session      |
| POST   | /api/v1/auth/refresh         | Refresh access token     |
| POST   | /api/v1/auth/reset-password  | Reset forgotten password |
| POST   | /api/v1/auth/change-password | Change user password     |

### 4.2 Users

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | /api/v1/users/me        | Get logged-in user info |
| PUT    | /api/v1/users/me        | Update profile + avatar |
| GET    | /api/v1/users           | Admin: get all users    |
| GET    | /api/v1/users/\:id      | Admin: get user by ID   |
| PUT    | /api/v1/users/\:id/role | Admin: update user role |
| DELETE | /api/v1/users/\:id      | Admin: delete user      |

### 4.3 Programs

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | /api/v1/programs               | Admin: create new program |
| PUT    | /api/v1/programs/\:id          | Admin: update program     |
| DELETE | /api/v1/programs/\:id          | Admin: delete program     |
| GET    | /api/v1/programs               | Get all programs          |
| GET    | /api/v1/programs/\:id          | Get program detail        |
| PATCH  | /api/v1/programs/\:id/activate | Admin: activate program   |
| PATCH  | /api/v1/programs/\:id/complete | Admin: complete program   |
| PATCH  | /api/v1/programs/\:id/cancel   | Admin: cancel program     |

### 4.4 Donations

| Method | Endpoint                        | Description                   |
| ------ | ------------------------------- | ----------------------------- |
| POST   | /api/v1/donations               | Donor: make a donation        |
| GET    | /api/v1/donations/\:id          | Get donation detail           |
| GET    | /api/v1/donations/my-donations  | Donor: view donation history  |
| GET    | /api/v1/donations/programs/\:id | Admin: view program donations |
| PATCH  | /api/v1/donations/\:id/status   | Admin: update donation status |

### 4.5 Receipts

| Method | Endpoint                      | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| POST   | /api/v1/receipts              | Admin: generate donation receipt |
| GET    | /api/v1/receipts/\:donationId | Get receipt by donation ID       |

### 4.6 Program Logs

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| POST   | /api/v1/program-logs/\:id/logs | Admin/Reviewer: add log with image |
| GET    | /api/v1/program-logs/\:id/logs | Get logs for a program             |

### 4.7 Program Audits

| Method | Endpoint                           | Description                       |
| ------ | ---------------------------------- | --------------------------------- |
| POST   | /api/v1/program-audits/\:id/audits | Reviewer: submit audit with image |
| GET    | /api/v1/program-audits/\:id/audits | View audits for a program         |
| PATCH  | /api/v1/program-audits/\:id/verify | Admin: verify submitted audit     |

### 4.8 Dashboard

| Method | Endpoint                              | Description                       |
| ------ | ------------------------------------- | --------------------------------- |
| GET    | /api/v1/dashboard/overview            | Admin: dashboard overview         |
| GET    | /api/v1/dashboard/statistics          | Admin: statistics of all programs |
| GET    | /api/v1/dashboard/my-donation-summary | Donor: view personal summary      |

---

## 5. Environment Configuration

```env
# App
PORT=5000
API_KEY=your-api-key
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Redis
REDIS_ADDR=redis:6379
REDIS_PASSWORD=

# PostgreSQL
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_NAME=dompet_amanah
DB_PASSWORD=your-password

# Nodemailer
USER_EMAIL=example@mail.com
USER_PASSWORD=your-email-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
CLOUDINARY_FOLDER_NAME=program_audits

# Midtrans
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_SERVER_KEY=your-server-key
```

---

## 6. Deployment Guide

### 6.1 VPS Setup

- Docker & Docker Compose
- Reverse Proxy with Nginx + SSL (Certbot)
- Env secrets securely mounted
- `docker-compose up -d --build`

### 6.2 Folder Structure (Backend)

```
/src/
├── app.js                        # Inisialisasi express, middleware, routes
├── server.js                     # Entry point server

├── config/                       # global configuration for dependencies
│   ├── config.js
│
├── models/                       # Sequelize models
│   ├── index.js
│   └── user.js
│
├── controllers/                 # Handler request (per modul)
│   └── auth.controller.js
│
├── routes/                      # Express routers per modul
│   └── auth.routes.js
│
├── middlewares/                 # Custom middleware
│   ├── auth.middleware.js
│   ├── cors.middleware.js
│   ├── limiter.middleware.js
│   ├── api.middleware.js
│   └── errorHandler.js

├── errors/                      # Custom error class dan kode
│   └── ApiError.js

├── validations/                 # Validasi request body (Joi/Zod)
│   └── auth.validation.js

├── utils/                       # Helper function reusable
│   ├── jwt.js
│   ├── hash.js
│   ├── mailer.js
│   └── uploader.js
│
├── migrations/                  # File migrasi Sequelize CLI
├── seeders/

├── docs/                        # API documentation (Swagger YAML / JSON)
│   └── swagger.yaml
│
├── tests/                       # Unit & integration tests
│   ├── auth.test.js
│   └── helpers/
│       └── mockUser.j
.env
.env.example
.gitignore
Dockerfile
docker-compose.yml
package.json
README.md
.sequelizerc
```

---

## 7. About Me

- 👤 name : Ahmad Fiqri Oemmry
- 📁 email : [fiqrioemry@gmail.com](mailto:fiqrioemry@gmail.com)
- 🌐 LinkedIn : [https://www.linkedin.com/in/ahmadfiqrioemry](https://www.linkedin.com/in/ahmadfiqrioemry)
- 📦 Project URL: _coming soon_

## 🖼️ Preview (Optional)

> Add image previews of the dashboard, donation history, program audit pages here if available.

---

## 📄 License

This project is licensed under the MIT License.
