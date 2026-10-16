# LAPTOPIA Frontend

This folder contains the React frontend for the LAPTOPIA storefront and admin console. It provides the public shopping experience and the protected admin dashboard in a single app.

## Project purpose

The frontend demonstrates a realistic ecommerce workflow with:

- homepage and storefront layout
- category and product browsing
- search, filters, and product detail pages
- cart and checkout flow
- customer login and registration
- profile management
- admin panel with operational business controls

## Main user flows

### Customer
- browse catalog
- add products to cart
- proceed to checkout
- create an account or login
- view profile information

### Admin
- login with an admin account
- access the admin dashboard via `/admin`
- manage products, categories, orders, customers, and settings

## Route structure

- `/` — storefront homepage
- `/catalog` — product catalog
- `/products/:id` — product detail
- `/cart` — cart view
- `/checkout` — order checkout
- `/support` — support page
- `/about` — company/about page
- `/login` — user login
- `/register` — account registration
- `/profile` — authenticated customer profile
- `/admin` — protected admin dashboard

## Admin access rules

The admin panel is protected by a route guard.

- if no user is logged in, the app redirects to `/login`
- if the user exists but `role !== 'admin'`, the app redirects away from `/admin`
- only admin-role users can access product, order, customer, category, and settings management pages

This is the recommended pattern for a portfolio project because it proves proper authorization logic rather than fake UI-only restrictions.

## Demo admin credentials

The project expects an admin account to exist in the backend database. The default credentials are configured in `backend/.env`.

Example:

```text
Email: syedali@gmail.com
Password: Hax_codE-03@
```

For production use, replace them with secure values and keep them out of version control.

## Run locally

From this folder:

```bash
npm install
npm run dev
```

The browser will show the Vite local URL, typically:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## What the admin dashboard includes

- Overview
- Products management
- Orders management
- Customers management
- Categories and brands management
- Store settings management

This admin layer is one of the strongest parts of the project and is best suited for demonstrating real business capability during interviews.

## Tech notes

The frontend uses React Router for route management, context providers for auth, cart, and settings, and a protected-route structure that mirrors real-world authorization patterns.

## Suggested portfolio narrative

> This project is a full-stack e-commerce demo with a role-based admin dashboard. It shows product catalog management, order handling, customer visibility, and storefront configuration in a realistic business context.

That makes it easier to explain to recruiters and hiring managers how much of the application logic is operational and not just cosmetic.
