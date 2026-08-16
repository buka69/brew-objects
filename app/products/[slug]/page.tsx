import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {catalog40} from '../../../lib/catalog40';
import {SITE_URL,brandFor,brandSlug,categorySlug,productKeywords,productMetaDescription,productSlug} from '../../../lib/seo';

type Props={params:Promise<{slug:string}>};
const findProduct=(slug:string)=>catalog40.find(p=>productSlug(p)===slug);

export function generateStaticParams(){return catalog40.map(p=>({slug:productSlug(p)}))}

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const p=findProduct(slug);if(!p)return {};
 const url=`/products/${slug}`;const image=`/api/product-image?id=${encodeURIComponent(p.id)}&variant=0&v=seo2`;
 const description=productMetaDescription(p);
 return {
  title:`${p.name} — Buy in Europe`,description,keywords:productKeywords(p),alternates:{canonical:url},
  openGraph:{type:'website',url,title:`${p.name} — Buy in Europe`,description,images:[{url:image,width:1200,height:1200,alt:`${p.name} product photo`}]},
  twitter:{card:'summary_large_image',title:`${p.name} — Buy in Europe`,description,images:[image]},
  robots:{index:true,follow:true}
 };
}

export default async function ProductPage({params}:Props){
 const {slug}=await params;const p=findProduct(slug);if(!p)notFound();
 const brand=brandFor(p);const productUrl=`${SITE_URL}/products/${slug}`;
 const imageUrl=`${SITE_URL}/api/product-image?id=${encodeURIComponent(p.id)}&variant=0&v=seo2`;
 const productSchema={
  '@context':'https://schema.org','@type':'Product',name:p.name,description:productMetaDescription(p),image:[0,1,2,3].map(i=>`${SITE_URL}/api/product-image?id=${encodeURIComponent(p.id)}&variant=${i}&v=seo2`),
  brand:{'@type':'Brand',name:brand},sku:p.id,url:productUrl,
  offers:{'@type':'Offer',url:productUrl,priceCurrency:'EUR',price:p.price.toFixed(2),availability:'https://schema.org/PreOrder',itemCondition:'https://schema.org/NewCondition',seller:{'@type':'Organization',name:'BREW / OBJECTS'}}
 };
 const breadcrumbSchema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
  {'@type':'ListItem',position:1,name:'Home',item:SITE_URL},
  {'@type':'ListItem',position:2,name:p.category,item:`${SITE_URL}/categories/${categorySlug(p.category)}`},
  {'@type':'ListItem',position:3,name:p.name,item:productUrl}
 ]};
 const related=catalog40.filter(x=>x.id!==p.id&&(x.category===p.category||brandFor(x)===brand)).slice(0,4);
 return <main className="seoPage">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(productSchema)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema)}}/>
  <nav className="seoBreadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href={`/categories/${categorySlug(p.category)}`}>{p.category}</Link><span>›</span><span>{p.name}</span></nav>
  <div className="seoProduct">
   <div><img className="seoHeroImage" src={`/api/product-image?id=${encodeURIComponent(p.id)}&variant=0&v=seo2`} width="900" height="900" alt={`${p.name} — ${p.description}`}/><div className="seoThumbs">{[0,1,2,3].map(i=><img key={i} src={`/api/product-image?id=${encodeURIComponent(p.id)}&variant=${i}&v=seo2`} width="260" height="260" loading="lazy" alt={`${p.name} product view ${i+1}`}/>)}</div></div>
   <section><div className="seoMeta"><Link href={`/brands/${brandSlug(brand)}`}>{brand}</Link> · <Link href={`/categories/${categorySlug(p.category)}`}>{p.category}</Link></div><h1>{p.name}</h1><p>{p.description}</p><div className="seoPrice">€{p.price.toFixed(2)}</div><p className="seoMeta">Pre-launch reference price · European storefront</p><div className="seoProductActions"><Link className="seoButton" href="/">Shop BREW / OBJECTS</Link><a className="seoButton seoSecondary" href={p.source} rel="nofollow noreferrer">Manufacturer / reference</a></div><h2>Product details</h2><ul className="seoSpecs">{p.details.map(d=><li key={d}>{d}</li>)}</ul><p>Looking to buy {p.name} in Europe? BREW / OBJECTS curates specialty coffee equipment for home brewers, baristas and cafés, with European-focused product discovery and pricing validation.</p></section>
  </div>
  <section className="seoSection"><h2>Related specialty coffee equipment</h2><div className="seoGrid">{related.map(r=><Link className="seoCard" key={r.id} href={`/products/${productSlug(r)}`}><img src={`/api/product-image?id=${encodeURIComponent(r.id)}&variant=0&v=seo2`} width="320" height="320" loading="lazy" alt={`${r.name} specialty coffee equipment`}/><div className="seoCardText"><strong>{r.name}</strong><small>€{r.price.toFixed(2)} · {r.category}</small></div></Link>)}</div></section>
 </main>
}
