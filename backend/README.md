# LAPTOPIA Backend

This folder contains the backend API for the LAPTOPIA storefront and admin console. It powers product listing, authentication, orders, customer data, and admin-only business tools.

## Overview

The backend is built with:

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- role-based authorization (`customer` and `admin`)

## Core responsibilities

- user registration and login
- product catalog APIs
- category and brand management
- order creation and status updates
- customer account data and admin metrics
- storefront configuration
- admin account bootstrap from environment variables

## Environment setup

Create a `backend/.env` file using the template in `.env.example`.

Required variables include:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/laptopia
JWT_SECRET=replace_with_a_secure_random_value
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=LAPTOPIA Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_private_password
```

Notes:
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` configure the initial admin account used for protected admin access.
- `ADMIN_PASSWORD` should be at least 12 characters in the project configuration.
- These values are used to bootstrap the initial admin user when the database connects.

## Admin access model

Admin access is controlled by the `role` field on the user document.

- public registration always creates a customer account
- only the trusted server-side bootstrap can create an admin account
- frontend routes check `user.role === 'admin'` before allowing access to `/admin`
- backend routes also enforce admin authorization through middleware

## Quick start

```bash
cd backend
npm install
npm run dev
```

If the database is empty and the admin credentials are configured, the app will create the admin user during startup.

## Database bootstrapping

The project initializes default categories, brand records, store settings, and the admin user automatically when the app connects to MongoDB.

## API summary

### Auth
- `POST /api/auth/register` — customer signup
- `POST /api/auth/login` — login with email/password
- `GET /api/auth/me` — fetch current user from JWT

### Products
- `GET /api/products` — public catalog listing with filters
- `GET /api/products/:id` — product detail view
- `POST /api/products/images` — admin-only upload of up to five product images
- `POST /api/products` — admin-only create
- `PUT /api/products/:id` — admin-only update
- `DELETE /api/products/:id` — admin-only delete

### Categories and brands
- `GET /api/categories` — public category listing
- `POST /api/categories/images` — admin-only upload of one category image (multipart field: `image`, max 5 MB)
- `POST /api/categories` — admin-only create category
- `PUT /api/categories/:id` — admin-only update category
- `DELETE /api/categories/:id` — admin-only delete category
- Category images are optional; no default/demo image is applied when a category has no saved image URL.
- `GET /api/categories/brands` — public and admin brand data
- `POST /api/categories/brands` — admin-only create brand
- `PUT /api/categories/brands/:id` — admin-only update brand
- `DELETE /api/categories/brands/:id` — admin-only delete brand

### Orders and customers
- `GET /api/orders` — admin-only order list
- `GET /api/orders/:id` — admin-only order detail
- `PATCH /api/orders/:id/status` — admin-only status updates
- `GET /api/customers` — admin-only customer overview
- `GET /api/customers/:id` — admin-only customer detail

### Store settings
- `GET /api/settings` — public storefront settings
- `PUT /api/settings` — admin-only settings update

## Seeding catalog data

The project includes a seed script for demo data:

```bash
npm run seed:catalog
```

This script creates default categories, subcategories, and sample products useful for portfolio and demo presentation.

## Notes for demo usage

This project is intended as a realistic e-commerce demo. The store uses sample data and a demo admin account, which is ideal for assessing business logic and UI flows in interviews or portfolio reviews.

## Security note

For real deployments, use:
- strong JWT secret
- secure MongoDB credentials
- production-grade secrets management
- proper deployment environment policies

Never expose live admin credentials in a public repository.
