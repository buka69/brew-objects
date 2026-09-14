import type {MetadataRoute} from 'next';
import {getCatalog} from '../lib/catalog-repository';
import {SITE_URL} from '../lib/seo';

export const dynamic='force-dynamic';

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const catalog=await getCatalog();const now=new Date();const categories=[...new Set(catalog.map(p=>p.categorySlug))];const brands=[...new Set(catalog.map(p=>p.brandSlug))];
 return [{url:SITE_URL,lastModified:now,changeFrequency:'daily',priority:1},...categories.map(slug=>({url:`${SITE_URL}/categories/${slug}`,lastModified:now,changeFrequency:'weekly' as const,priority:.85})),...brands.map(slug=>({url:`${SITE_URL}/brands/${slug}`,lastModified:now,changeFrequency:'weekly' as const,priority:.75})),...catalog.map(p=>({url:`${SITE_URL}/products/${p.slug}`,lastModified:new Date(p.updatedAt),changeFrequency:'weekly' as const,priority:.9}))];
}
