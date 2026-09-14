create table if not exists public.categories (
 slug text primary key,name text not null unique,sort_order integer not null default 0,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.brands (
 slug text primary key,name text not null unique,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.products (
 id text primary key,slug text not null unique,name text not null,
 category_slug text not null references public.categories(slug),brand_slug text references public.brands(slug),
 description text not null default '',details jsonb not null default '[]'::jsonb,
 price numeric(12,2) not null check(price>=0),compare_at_price numeric(12,2) check(compare_at_price is null or compare_at_price>=price),
 currency char(3) not null default 'EUR',source_url text,rating numeric(2,1) not null default 0 check(rating between 0 and 5),
 review_count integer not null default 0 check(review_count>=0),badge text,
 status text not null default 'draft' check(status in ('draft','active','archived')),
 stock_quantity integer not null default 0 check(stock_quantity>=0),is_b2b boolean not null default false,
 is_featured boolean not null default false,sort_order integer not null default 0,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.product_images (
 id bigint generated always as identity primary key,product_id text not null references public.products(id) on delete cascade,
 url text not null,alt_text text,position integer not null default 0 check(position>=0),created_at timestamptz not null default now(),
 unique(product_id,position)
);
create index if not exists products_status_sort_idx on public.products(status,sort_order);
create index if not exists products_category_idx on public.products(category_slug);
create index if not exists products_brand_idx on public.products(brand_slug);
create index if not exists product_images_product_idx on public.product_images(product_id,position);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now();return new;end; $$;
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at before update on public.brands for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select using(true);
drop policy if exists "Public can read brands" on public.brands;
create policy "Public can read brands" on public.brands for select using(true);
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using(status='active');
drop policy if exists "Public can read active product images" on public.product_images;
create policy "Public can read active product images" on public.product_images for select using(exists(select 1 from public.products where products.id=product_images.product_id and products.status='active'));
