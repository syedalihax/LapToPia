# Laptopia backend

## Seed the product catalog

1. Configure the existing MongoDB connection and server settings in `backend/.env` (see `.env.example`).
2. From the `backend` directory, run `npm run seed:catalog`.
3. The seed upserts the 10 marked main categories, their 30 slugged subcategories, managed brands, and 30 example products. It can be run again safely; seeded rows are matched by stable slugs. It does not delete users, orders, customers, or other catalog records.
4. The script verifies the category, subcategory, product, and product-to-subcategory counts and exits with an error if they do not meet the expected minimums.

Seeded product descriptions identify the displayed PKR prices as demo samples, not verified market quotes, and advise confirming the exact regional configuration. Catalog photos use the project's existing public Unsplash image source URLs as generic illustrative imagery, not as claims that a photo depicts the exact retail SKU.

## Catalog API

- `GET /api/categories` — category records and subcategory names/slugs; seeded main categories have `catalogMain: true`.
- `GET /api/categories/brands` — managed brands plus legacy product brand names.
- `GET /api/products` — filters: `category` (category name, value, or slug), `subcategory` (subcategory slug), `brand`, `minPrice`, `maxPrice`, `inStock=true`, `status`, and `search`.
- `GET /api/products/:id` — product details.
- Admin-only product writes remain at `POST /api/products`, `PUT /api/products/:id`, and `DELETE /api/products/:id`.
- Admin-only category and brand writes remain under `/api/categories` and `/api/categories/brands`.

Product category and brand values intentionally remain strings to match the existing application schema and admin flows; category and brand administration is reused rather than duplicated.

## Store settings, customers, and fulfillment

- `GET /api/settings` — public storefront settings. `PUT /api/settings` — admin-only updates, including separate `supportPhone` and `whatsappPhone`; those values feed the Navbar, Support, Cart, Checkout, Footer, and invoice contact links.
- `GET /api/customers` — admin-only customer directory with order counts and revenue metrics derived from actual orders.
- `GET /api/customers/:id` — admin-only customer profile, order history/status counts, last order date, delivered (collected) revenue, all-status total order value, and non-cancelled/non-returned booked order value.
- `PATCH /api/orders/:id/status` — admin-only safe fulfillment status updates. Orders can move pending → shipping/delivered/cancelled, shipping → delivered/cancelled, and delivered → returned. Cancellation/return restores reserved inventory once; terminal cancelled/returned orders cannot be reopened through this endpoint.

Customer collected revenue counts delivered orders only. Booked value excludes cancelled and returned orders. This is order revenue, not net profit; cost of goods, shipping, and operating costs are not represented in the existing database.
