import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import SeoSiteHeader from '../../../components/SeoSiteHeader';
import {getCatalog} from '../../../lib/catalog-repository';
import {SITE_URL,categoryCopy} from '../../../lib/seo';

type Props={params:Promise<{slug:string}>};
export const dynamic='force-dynamic';

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const catalog=await getCatalog();const match=catalog.find(p=>p.categorySlug===slug);if(!match)return {};
 const c=match.category;const seo=categoryCopy[c];const description=seo?.description||`Shop ${c.toLowerCase()} specialty coffee equipment in Europe.`;
 return {title:seo?.title||`${c} Coffee Equipment Europe`,description,keywords:seo?.keywords,alternates:{canonical:`/categories/${slug}`},openGraph:{type:'website',url:`/categories/${slug}`,title:seo?.title||`${c} Coffee Equipment Europe`,description},twitter:{card:'summary',title:seo?.title||`${c} Coffee Equipment Europe`,description}};
}

export default async function CategoryPage({params}:Props){
 const {slug}=await params;const catalog=await getCatalog();const match=catalog.find(p=>p.categorySlug===slug);if(!match)notFound();
 const c=match.category;const products=catalog.filter(p=>p.categorySlug===slug);const categories=[...new Map(catalog.map(p=>[p.categorySlug,p.category])).entries()];const seo=categoryCopy[c];const url=`${SITE_URL}/categories/${slug}`;
 const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:SITE_URL},{'@type':'ListItem',position:2,name:c,item:url}]};
 const list={'@context':'https://schema.org','@type':'ItemList',name:seo?.title||c,itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,url:`${SITE_URL}/products/${p.slug}`,name:p.name}))};
 return <><SeoSiteHeader/><main className="seoPage seoCategoryPage"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(list)}}/><nav className="seoBreadcrumb"><Link href="/">Home</Link><span>›</span><span>{c}</span></nav><h1>{seo?.title||`${c} Coffee Equipment Europe`}</h1><p>{seo?.intro||seo?.description}</p><div className="seoGrid seoCategoryGrid">{products.map(p=><Link className="seoCard" key={p.id} href={`/products/${p.slug}`}><img src={`/api/product-image?id=${encodeURIComponent(p.id)}&variant=0`} width="320" height="320" loading="lazy" alt={`${p.name} — ${c.toLowerCase()} coffee equipment`}/><div className="seoCardText"><strong>{p.name}</strong><small>€{p.price.toFixed(2)} · {p.description}</small></div></Link>)}</div><section className="seoSection"><h2>Shop specialty coffee equipment in Europe</h2><p>BREW / OBJECTS brings together specialist coffee gear for European home brewers, baristas and cafés. Compare products by brewing method, workflow and use case, then explore individual product pages for specifications and reference pricing.</p><div className="seoLinks"><Link href="/">All coffee equipment</Link>{categories.filter(([s])=>s!==slug).map(([s,name])=><Link key={s} href={`/categories/${s}`}>{name}</Link>)}</div></section></main></>;
}
