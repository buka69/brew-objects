# BREW / OBJECTS

Next.js storefront for validating demand for specialty coffee equipment across Europe (B2C + B2B).

## Product catalog

The live catalog is designed to use Supabase as its source of truth:

- `categories`
- `brands`
- `products`
- `product_images`

Apply `supabase/migrations/202609140001_catalog.sql`, then `supabase/seed.sql` in the Supabase SQL editor. The seed imports the current 40 products and 160 product images.

Set these variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Once both are present, storefront, filters, product/category/brand pages, image galleries, metadata, and sitemap read current records directly from Supabase without requiring a deploy for catalog edits.

Until Supabase is connected, the app intentionally falls back to the existing catalog snapshot so production remains available during migration.

## Local

`npm install`

`npm run dev`

Optional analytics variables:

- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`
