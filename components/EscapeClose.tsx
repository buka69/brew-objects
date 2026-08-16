'use client';
import {useEffect} from 'react';

export default function EscapeClose(){
 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{
   if(e.key!=='Escape')return;
   const close=document.querySelector<HTMLElement>('.overlay .x, .overlay .drawerhead button');
   close?.click();
  };
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[]);
 return null;
}
