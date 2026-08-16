import type {MetadataRoute} from 'next';
import {catalog40} from '../lib/catalog40';
import {SITE_URL,brandFor,brandSlug,categorySlug,productSlug} from '../lib/seo';

export default function sitemap():MetadataRoute.Sitemap{
 const now=new Date();
 const categories=[...new Set(catalog40.map(p=>p.category))];
 const brands=[...new Set(catalog40.map(brandFor))];
 return [
  {url:SITE_URL,lastModified:now,changeFrequency:'daily',priority:1},
  ...categories.map(c=>({url:`${SITE_URL}/categories/${categorySlug(c)}`,lastModified:now,changeFrequency:'weekly' as const,priority:.85})),
  ...brands.map(b=>({url:`${SITE_URL}/brands/${brandSlug(b)}`,lastModified:now,changeFrequency:'weekly' as const,priority:.75})),
  ...catalog40.map(p=>({url:`${SITE_URL}/products/${productSlug(p)}`,lastModified:now,changeFrequency:'weekly' as const,priority:.9}))
 ];
}
