import Link from 'next/link';
import type {CatalogProduct} from '../lib/catalog';

export default function SeoFooterLinks({products}:{products:CatalogProduct[]}){
 const categories=[...new Map(products.map(p=>[p.categorySlug,p.category])).entries()];
 const brands=[...new Map(products.map(p=>[p.brandSlug,p.brand])).entries()];
 return <footer className="seoFooter" aria-label="Browse categories and brands">
  <div className="seoFooterGrid">
   <section><h2>Shop by category</h2><div className="seoFooterLinks">{categories.map(([slug,name])=><Link key={slug} href={`/categories/${slug}`}>{name}</Link>)}</div></section>
   <section><h2>Popular brands</h2><div className="seoFooterLinks">{brands.map(([slug,name])=><Link key={slug} href={`/brands/${slug}`}>{name}</Link>)}</div></section>
  </div>
 </footer>;
}
