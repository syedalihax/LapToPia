# LAPTOPIA Hardware Lab PK

LAPTOPIA is a full-stack electronics and hardware e-commerce demo project built for showcasing a modern storefront, cart and checkout flow, and a complete admin console. The project is designed to represent a realistic online hardware business where customers browse laptops, PCs, server equipment, and related accessories while administrators manage products, inventory, customers, orders, categories, and storefront settings.

## Project Overview

This repository contains three main parts:

- `backend/` — Express.js + MongoDB API with JWT authentication and admin-only protected routes
- `frontend/` — React + Vite storefront and admin dashboard
- root project — overall documentation, setup instructions, and deployment notes

## Why this project is valuable for portfolio use

The admin module is a major part of the project and represents a realistic operational layer for an e-commerce business. It includes:

- product management
- category and brand control
- order and fulfillment tracking
- customer visibility and revenue insights
- store settings management
- restricted admin access

This makes the project suitable for demonstrating practical business logic beyond a simple storefront.

## Core Features

### Customer experience
- responsive storefront homepage and catalog
- product filtering by category, subcategory, brand, price, and search
- product detail pages with stock status and pricing
- shopping cart and checkout experience
- support and contact pages
- user registration and login
- profile and order-related customer data

### Admin experience
- protected admin dashboard access
- product creation, editing, and deletion
- category and brand management
- order status updates
- customer directory and store analytics
- store configuration controls
- demo-only business system for managing a hardware catalog

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind-like utility styling approach with custom CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for image uploads
- bcryptjs for user password hashing

## Repository Structure

```text
LapToPia/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── validators/
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   └── index.html
├── README.md
└── .git/
```

## Admin Access and Login

Admin access is not open to everyone. The application uses a role-based authentication system.

- Only a user with `role: 'admin'` can access the admin panel
- The frontend checks `user.role !== 'admin'` and redirects non-admin users away from `/admin`
- The backend enforces admin-only routes using authentication + authorization middleware

### Demo admin login setup

The admin account is created from environment variables in `backend/.env`:

```env
ADMIN_NAME=LAPTOPIA Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_private_password
```

Important:
- the credentials are configured in `backend/.env`, not hardcoded in the UI
- the backend auto-creates the admin account if the environment values are valid
- for a real project, use strong and secure credentials and never expose production credentials in public repos

### Admin login details

Sign in with the email and password you configured privately in `backend/.env`.

This is a safe demo pattern for a portfolio project because it clearly demonstrates the admin access model without exposing an insecure hidden bypass.

## Local Setup

### 1. Clone the project

```bash
git clone <your-repository-url>
cd LapToPia
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Then edit `backend/.env` and set:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/laptopia
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=LAPTOPIA Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_private_password
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Open the frontend browser URL shown by Vite (usually `http://localhost:5173`).

## Default Backend Scripts

In `backend/package.json`:

```bash
npm run start
npm run dev
npm run seed:catalog
```

The catalog seed script populates base categories and sample products for demo use.

## Admin Console Highlights

The admin panel includes:

- Overview dashboard
- Products management
- Order management
- Customer management
- Category management
- Store settings editor

This is the strongest demonstration area of the project and reflects the part of the application typically valued in a business or technical interview.

## Notes for recruiters / employers

This project is built as a practical demo rather than a finished production SaaS. It is suitable for demonstrating:

- full-stack development workflow
- role-based authorization
- database seeding and schema work
- API design and integration
- front-end route protection
- admin panel and business feature modeling

## Recommended next improvements

- add email verification and password reset
- add inventory tracking with stock movement history
- add payment gateway integration
- add more robust analytics and reporting
- move admin credentials to a proper deployment secret manager
- add automated tests for backend and frontend

## Conclusion

This project demonstrates a realistic electronics store with a complete admin layer that covers the majority of operational business workflows. The admin area is intentionally documented and accessible through a controlled demo login so recruiters and reviewers can evaluate the project's depth and business realism.
