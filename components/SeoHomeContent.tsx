import Link from 'next/link';
import {catalog40} from '../lib/catalog40';
import {brandFor,brandSlug,categorySlug} from '../lib/seo';

export default function SeoHomeContent(){
 const categories=[...new Set(catalog40.map(p=>p.category))];
 const brands=[...new Set(catalog40.map(brandFor))];
 return <section className="seoHome" aria-labelledby="seo-home-title">
  <h1 id="seo-home-title">Specialty Coffee Equipment & Barista Tools in Europe</h1>
  <p>BREW / OBJECTS is a curated European store for specialty coffee equipment, brewing tools and café accessories. Discover pour over brewers, coffee grinders, precision kettles, scales, latte art pitchers, espresso accessories, drinkware and cleaning tools for home brewers and coffee professionals.</p>
  <div className="seoSection"><h2>Shop coffee equipment by category</h2><div className="seoLinks">{categories.map(c=><Link key={c} href={`/categories/${categorySlug(c)}`}>{c}</Link>)}</div></div>
  <div className="seoSection"><h2>Popular coffee equipment brands</h2><div className="seoLinks">{brands.map(b=><Link key={b} href={`/brands/${brandSlug(b)}`}>{b}</Link>)}</div></div>
 </section>
}
