# BREW / OBJECTS

Next.js storefront for specialty coffee equipment.

## Supabase catalogue

1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL editor.
3. Run `supabase/seed.sql` to import all current products and galleries.
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel and redeploy.

Products, brands, categories and images can then be edited in Supabase. Published changes appear within about 60 seconds. Until Supabase is configured, the storefront safely uses its bundled catalogue.
