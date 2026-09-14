import {cache} from 'react';
import type {CatalogProduct} from './catalog';
import {catalog40} from './catalog40';
import {gallery40} from './gallery40';
import {galleryFixes} from './galleryFixes';
import {brandFor,brandSlug,categorySlug,productSlug} from './seo';

type ProductRow={
 id:string;slug:string;name:string;price:number|string;compare_at_price:number|string|null;currency:string;
 source_url:string|null;description:string;rating:number|string;review_count:number;badge:string|null;
 details:string[]|null;status:'draft'|'active'|'archived';stock_quantity:number;is_b2b:boolean;
 is_featured:boolean;sort_order:number;updated_at:string;
 category:{name:string;slug:string}|{name:string;slug:string}[];
 brand:{name:string;slug:string}|{name:string;slug:string}[]|null;
 images:{id:string|number;url:string;alt_text:string|null;position:number}[]|null;
};

const one=<T,>(value:T|T[]|null)=>Array.isArray(value)?value[0]??null:value;

function normalize(row:ProductRow):CatalogProduct{
 const category=one(row.category);const brand=one(row.brand);
 if(!category)throw new Error(`Product ${row.id} has no category`);
 return {id:row.id,slug:row.slug,name:row.name,category:category.name,categorySlug:category.slug,brand:brand?.name||'BREW / OBJECTS',brandSlug:brand?.slug||'brew-objects',price:Number(row.price),compareAtPrice:row.compare_at_price==null?undefined:Number(row.compare_at_price),currency:row.currency,source:row.source_url||'',description:row.description,rating:Number(row.rating).toFixed(1),reviews:row.review_count,badge:row.badge||undefined,details:row.details||[],status:row.status,stock:row.stock_quantity,b2b:row.is_b2b,featured:row.is_featured,sortOrder:row.sort_order,updatedAt:row.updated_at,images:(row.images||[]).sort((a,b)=>a.position-b.position).map(image=>({id:String(image.id),url:image.url,alt:image.alt_text||row.name,position:image.position}))};
}

function legacyCatalog():CatalogProduct[]{
 return catalog40.map((p,index)=>{const brand=brandFor(p as never);const images=galleryFixes[p.id]||gallery40[p.id]||[];
  return {id:p.id,slug:productSlug(p as never),name:p.name,category:p.category,categorySlug:categorySlug(p.category),brand,brandSlug:brandSlug(brand),price:p.price,currency:'EUR',source:p.source,description:p.description,rating:p.rating,reviews:p.reviews,badge:p.badge,details:p.details,images:images.map((url,position)=>({id:`${p.id}-${position}`,url,alt:`${p.name} — view ${position+1}`,position})),status:'active',stock:0,b2b:false,featured:Boolean(p.badge),sortOrder:index,updatedAt:new Date(0).toISOString()};
 });
}

export const getCatalog=cache(async():Promise<CatalogProduct[]>=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return legacyCatalog();
 const query='select=id,slug,name,price,compare_at_price,currency,source_url,description,rating,review_count,badge,details,status,stock_quantity,is_b2b,is_featured,sort_order,updated_at,category:categories(name,slug),brand:brands(name,slug),images:product_images(id,url,alt_text,position)&status=eq.active&order=sort_order.asc';
 const response=await fetch(`${url}/rest/v1/products?${query}`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});
 if(!response.ok)throw new Error(`Unable to load catalog: ${response.status} ${await response.text()}`);
 return ((await response.json()) as ProductRow[]).map(normalize);
});

export const getProductBySlug=cache(async(slug:string)=>(await getCatalog()).find(product=>product.slug===slug));
export const getProductById=cache(async(id:string)=>(await getCatalog()).find(product=>product.id===id));
