import Link from 'next/link';
import {catalog40} from '../lib/catalog40';
import {brandFor,brandSlug,categorySlug} from '../lib/seo';

export default function SeoFooterLinks(){
 const categories=[...new Set(catalog40.map(p=>p.category))];
 const brands=[...new Set(catalog40.map(brandFor))];
 return <footer className="seoFooter" aria-label="Browse categories and brands">
  <div className="seoFooterGrid">
   <section><h2>Shop by category</h2><div className="seoFooterLinks">{categories.map(c=><Link key={c} href={`/categories/${categorySlug(c)}`}>{c}</Link>)}</div></section>
   <section><h2>Popular brands</h2><div className="seoFooterLinks">{brands.map(b=><Link key={b} href={`/brands/${brandSlug(b)}`}>{b}</Link>)}</div></section>
  </div>
 </footer>;
}
