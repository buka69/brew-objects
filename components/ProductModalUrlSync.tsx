'use client';

import {useEffect} from 'react';

export default function ProductModalUrlSync(){
 useEffect(()=>{
  let suppress=false;
  const closeModalFromHistory=()=>{const close=document.querySelector('.productPage .x') as HTMLButtonElement|null;if(close){suppress=true;close.click();queueMicrotask(()=>{suppress=false})}};
  const onClick=(event:MouseEvent)=>{
   const target=event.target as Element|null;if(!target)return;
   const productButton=target.closest<HTMLElement>('.productMain, .related button');
   if(productButton){if(suppress)return;const slug=productButton.dataset.productSlug;const id=productButton.dataset.productId;if(slug&&window.location.pathname!==`/products/${slug}`)window.history.pushState({brewProductModal:true,productId:id},'',`/products/${slug}`);return}
   const closeButton=target.closest('.productPage .x');const clickedProductOverlay=target.classList.contains('overlay')&&target.querySelector('.productPage');
   if((closeButton||clickedProductOverlay)&&!suppress){if(window.history.state?.brewProductModal)window.history.back();else if(window.location.pathname.startsWith('/products/'))window.history.replaceState({},'','/#shop')}
  };
  const onPopState=()=>{if(!window.location.pathname.startsWith('/products/'))closeModalFromHistory()};
  document.addEventListener('click',onClick);window.addEventListener('popstate',onPopState);
  return()=>{document.removeEventListener('click',onClick);window.removeEventListener('popstate',onPopState)};
 },[]);
 return null;
}
