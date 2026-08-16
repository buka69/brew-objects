'use client';
import {useEffect} from 'react';

export default function SeoHomeContent(){
 useEffect(()=>{
  const hero=document.querySelector<HTMLElement>('.seoHome');
  const header=document.querySelector<HTMLElement>('header');
  if(hero&&header&&hero.previousElementSibling!==header) header.insertAdjacentElement('afterend',hero);
 },[]);
 return <section className="seoHome" aria-labelledby="seo-home-title">
  <div className="seoHomeIntro">
   <h1 id="seo-home-title">Specialty Coffee Equipment & Barista Tools in Europe</h1>
   <p>BREW / OBJECTS is a curated European store for specialty coffee equipment, brewing tools and café accessories. Discover pour over brewers, coffee grinders, precision kettles, scales, latte art pitchers, espresso accessories, drinkware and cleaning tools for home brewers and coffee professionals.</p>
  </div>
 </section>;
}
