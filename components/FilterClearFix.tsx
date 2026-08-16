'use client';
import {useEffect} from 'react';

export default function FilterClearFix(){
 useEffect(()=>{
  const handler=(event:Event)=>{
   const target=event.target as HTMLElement|null;
   const button=target?.closest('.filterHead button');
   if(!button)return;
   event.preventDefault();
   event.stopPropagation();

   const allChip=Array.from(document.querySelectorAll<HTMLButtonElement>('.chips button')).find(b=>b.textContent?.trim().startsWith('All'));
   allChip?.click();

   const search=document.querySelector<HTMLInputElement>('.search input');
   if(search){
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
    setter?.call(search,'');
    search.dispatchEvent(new Event('input',{bubbles:true}));
    search.dispatchEvent(new Event('change',{bubbles:true}));
   }

   const range=document.querySelector<HTMLInputElement>('.priceRange');
   if(range){
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
    setter?.call(range,range.max);
    range.dispatchEvent(new Event('input',{bubbles:true}));
    range.dispatchEvent(new Event('change',{bubbles:true}));
   }

   const sort=document.querySelector<HTMLSelectElement>('.sortWrap select');
   if(sort){
    const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;
    setter?.call(sort,'featured');
    sort.dispatchEvent(new Event('change',{bubbles:true}));
   }

   const wishlist=document.querySelector<HTMLInputElement>('.wishlistCheck input');
   if(wishlist?.checked)wishlist.click();
  };
  document.addEventListener('click',handler,true);
  return()=>document.removeEventListener('click',handler,true);
 },[]);
 return null;
}
