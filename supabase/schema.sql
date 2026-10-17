-- Mye Stores database. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Security model: anyone can READ products, categories and settings, and can PLACE an order.
-- Only users listed in `admins` can change anything or read orders.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text not null default '' check (char_length(description) <= 4000),
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  category_id uuid references categories(id) on delete set null,
  images text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on products(category_id);

create table if not exists settings (
  id int primary key default 1 check (id = 1),   -- exactly one row
  store_name text not null default 'Mye Stores',
  tagline text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  announcement text not null default '',
  whatsapp text not null default '',             -- digits only, e.g. 2348170084726
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  hours text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  tiktok text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  phone text not null check (char_length(phone) between 5 and 30),
  address text not null default '' check (char_length(address) <= 500),
  note text not null default '' check (char_length(note) <= 1000),
  items jsonb not null,
  total numeric(12,2) not null check (total >= 0),
  status text not null default 'new' check (status in ('new', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- keep updated_at fresh
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_touch on products;
create trigger products_touch before update on products for each row execute function touch_updated_at();
drop trigger if exists settings_touch on settings;
create trigger settings_touch before update on settings for each row execute function touch_updated_at();

-- ---------- who is an admin ----------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------- row level security ----------
alter table categories enable row level security;
alter table products   enable row level security;
alter table settings   enable row level security;
alter table orders     enable row level security;
alter table admins     enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "public read products" on products;
create policy "public read products" on products for select using (true);
drop policy if exists "admin write products" on products;
create policy "admin write products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select using (true);
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for all using (is_admin()) with check (is_admin());

drop policy if exists "anyone can place an order" on orders;
create policy "anyone can place an order" on orders for insert with check (status = 'new');
drop policy if exists "admin manage orders" on orders;
create policy "admin manage orders" on orders for all using (is_admin()) with check (is_admin());

drop policy if exists "admins see themselves" on admins;
create policy "admins see themselves" on admins for select using (user_id = auth.uid());

-- ---------- product photos ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());
drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());
drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());

-- ---------- default settings row ----------
insert into settings (id, store_name, tagline, hero_title, hero_subtitle, whatsapp, phone, address, hours)
values (1, 'Mye Stores',
  'Everyday essentials for your kitchen, home and room',
  'Quality home & kitchen essentials, at student-friendly prices',
  'Browse the store, add what you like to your cart, and send your order straight to us on WhatsApp.',
  '2348170084726', '+234 817 008 4726', 'Al-Hikmah University, Nigeria', '08:00 - 16:00')
on conflict (id) do nothing;

-- ---------- make the owner an admin ----------
-- 1. Supabase -> Authentication -> Users -> Add user (owner's email + a strong password).
-- 2. Then run this, with their email:
--    insert into admins (user_id) select id from auth.users where email = 'OWNER@EMAIL.COM';
