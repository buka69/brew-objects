'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';

type CartItem={qty?:number};
const CART_KEY='brew-objects-cart-v3';

export default function SeoSiteHeader(){
 const[count,setCount]=useState(0);
 useEffect(()=>{
  const read=()=>{
   try{
    const raw=localStorage.getItem(CART_KEY);
    const items:CartItem[]=raw?JSON.parse(raw):[];
    setCount(Array.isArray(items)?items.reduce((sum,item)=>sum+(Number(item.qty)||0),0):0);
   }catch{setCount(0)}
  };
  read();
  window.addEventListener('storage',read);
  window.addEventListener('focus',read);
  return()=>{window.removeEventListener('storage',read);window.removeEventListener('focus',read)};
 },[]);
 return <>
  <div className="seoTopbar"><span>◎ Ship to: Europe⌄</span><span>Pre-launch: special prices for early supporters</span><Link href="/#wholesale">B2B / Wholesale</Link></div>
  <header className="seoSiteHeader">
   <Link className="seoBrand" href="/">BREW / OBJECTS<small>Specialty coffee tools</small></Link>
   <nav className="seoMainnav" aria-label="Store navigation">
    <Link href="/categories/brewing">Brewing</Link>
    <Link href="/categories/espresso">Espresso</Link>
    <Link href="/categories/latte-art">Latte Art</Link>
    <Link href="/categories/drinkware">Drinkware</Link>
    <Link href="/categories/cleaning">Cleaning</Link>
   </nav>
   <div className="seoHeaderTools">
    <Link className="seoShopLink" href="/#shop">Shop</Link>
    <Link className="seoCartLink" href="/#cart">Cart <b>{count}</b></Link>
   </div>
  </header>
 </>;
}
