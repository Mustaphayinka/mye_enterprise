# Mye Enterprise

Online store for Mye Enterprise: kitchen, home and personal-care essentials. Customers browse,
add to cart and send their order on WhatsApp. The owner manages everything from `/admin`.

Built with React, TypeScript, Tailwind CSS v4 and Vite. Supabase provides the database,
the owner login and photo storage. Hosted on Netlify.

## What's in it

**Store (customers)**
- Home page: headline, categories, featured and newest products, WhatsApp call-to-action
- Shop: search, category filter, sorting, "in stock only"
- Product pages with a photo gallery, quantity, "Add to cart" and "Order on WhatsApp"
- Cart drawer and checkout. The order (items, total, name, phone, address) opens in WhatsApp,
  addressed to the store's number. A copy is saved for the owner.
- About and Contact pages, all driven by the store settings
- Works well on phones; photos are compressed on upload

**Admin (owner), at `/admin`**
- Products: add, edit, delete, upload/reorder up to 8 photos, set the price and an optional
  "was" price (shows "Sale"), and one-tap "In stock / Sold out" and "Featured" switches
- Orders: every order sent from the site, with a status (new, confirmed, delivered, cancelled)
  and buttons to WhatsApp or call the customer
- Categories: add, rename, reorder, delete
- Store settings: name, WhatsApp number, phone, email, address, hours, home page text,
  announcement bar, social links

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Without Supabase keys the site runs in **demo mode**, using the 41 products from the old site,
with changes saved only in your browser. Admin login in demo mode: any email, password `demo1234`.

## Go live (one-time setup, about 15 minutes)

1. **Supabase** (free): create a project at https://supabase.com.
2. In Supabase, open **SQL Editor**, paste `supabase/schema.sql` and press **Run**. Then do the
   same with `supabase/seed.sql` to load the 41 starter products.
3. **Turn off public sign-ups**: Authentication → Sign In / Providers → turn off "Allow new users to sign up".
4. **Create the owner's login**: Authentication → Users → Add user (email and a strong password).
   Then in SQL Editor run:
   ```sql
   insert into admins (user_id) select id from auth.users where email = 'OWNER@EMAIL.COM';
   ```
5. **Keys**: Project Settings → API. Copy the Project URL and the `anon` public key.
   - Locally: copy `.env.example` to `.env` and paste them in.
   - On Netlify: Site configuration → Environment variables → add `VITE_SUPABASE_URL` and
     `VITE_SUPABASE_ANON_KEY`, then redeploy.
6. **Netlify** builds automatically from GitHub using `netlify.toml` (`npm run build`, output folder `dist`).

The `anon` key is safe to be public. The database security rules in `schema.sql` allow anyone to
read products and place an order, and allow **only** users in the `admins` table to change
anything or see orders.

## Old product photos

The old site's `images/` folder was never committed to GitHub. If you have it (for example in an
old Netlify deploy or on the computer that made the site), copy it to `public/images/` and the
starter products will show their photos. Otherwise the owner can upload new photos from the admin
page. Products without a photo show a neat coloured placeholder.

The old static site is kept in `legacy/` for reference. It isn't part of the build and can be deleted.

## Project layout

```
src/
  lib/        api.ts (Supabase + demo backends), types, formatting, image compression, seed data
  context/    store data, cart, owner login
  components/ layout (header, footer), product cards, cart drawer, icons
  pages/      Home, Shop, ProductPage, Cart (checkout), About/Contact, NotFound
  admin/      Login, Products, ProductForm, Orders, Categories, SettingsPage
supabase/     schema.sql (tables + security rules), seed.sql (starter products)
```
