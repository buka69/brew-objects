'use client';

import {useEffect} from 'react';
import {catalog40} from '../lib/catalog40';
import {productSlug} from '../lib/seo';

const byName=new Map(catalog40.map(p=>[p.name,p]));

export default function ProductModalUrlSync(){
 useEffect(()=>{
  let suppress=false;

  const productFromButton=(button:Element|null)=>{
   if(!button)return null;
   const name=(button.querySelector('h3')?.textContent||button.querySelector('b')?.textContent||'').trim();
   return byName.get(name)||null;
  };

  const closeModalFromHistory=()=>{
   const close=document.querySelector('.productPage .x') as HTMLButtonElement|null;
   if(close){suppress=true;close.click();queueMicrotask(()=>{suppress=false})}
  };

  const onClick=(event:MouseEvent)=>{
   const target=event.target as Element|null;
   if(!target)return;

   const productButton=target.closest('.productMain, .related button');
   if(productButton){
    if(suppress)return;
    const product=productFromButton(productButton);
    if(product){
     const url=`/products/${productSlug(product)}`;
     if(window.location.pathname!==url){
      window.history.pushState({brewProductModal:true,productId:product.id},'',url);
     }
    }
    return;
   }

   const closeButton=target.closest('.productPage .x');
   const clickedProductOverlay=target.classList.contains('overlay')&&target.querySelector('.productPage');
   if((closeButton||clickedProductOverlay)&&!suppress){
    if(window.history.state?.brewProductModal){window.history.back()}
    else if(window.location.pathname.startsWith('/products/')){window.history.replaceState({},'','/#shop')}
   }
  };

  const onPopState=()=>{
   if(!window.location.pathname.startsWith('/products/')){
    closeModalFromHistory();
   }
  };

  document.addEventListener('click',onClick);
  window.addEventListener('popstate',onPopState);
  return()=>{document.removeEventListener('click',onClick);window.removeEventListener('popstate',onPopState)};
 },[]);
 return null;
}
