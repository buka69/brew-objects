'use client';
import {useEffect} from 'react';

export default function HomeHashActions(){
 useEffect(()=>{
  const run=()=>{
   if(window.location.hash==='#cart'){
    window.setTimeout(()=>document.querySelector<HTMLButtonElement>('header .cart')?.click(),0);
   }else if(window.location.hash==='#wholesale'){
    window.setTimeout(()=>document.querySelector<HTMLButtonElement>('.topbar button')?.click(),0);
   }
  };
  run();
  window.addEventListener('hashchange',run);
  return()=>window.removeEventListener('hashchange',run);
 },[]);
 return null;
}
