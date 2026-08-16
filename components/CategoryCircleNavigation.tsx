'use client';
import {useEffect} from 'react';

const routes:Record<string,string>={
 'Pour Over':'/categories/brewing',
 'Espresso':'/categories/espresso',
 'Grinders':'/categories/grinders',
 'Kettles':'/categories/kettles',
 'Scales':'/categories/scales',
 'Latte Art':'/categories/latte-art',
 'Drinkware':'/categories/drinkware',
 'Cleaning':'/categories/cleaning',
 'Lab':'/categories/lab'
};

export default function CategoryCircleNavigation(){
 useEffect(()=>{
  const onClick=(event:MouseEvent)=>{
   const target=event.target as HTMLElement|null;
   const button=target?.closest('.catrow.ten button') as HTMLButtonElement|null;
   if(!button)return;
   const label=button.querySelector('small')?.textContent?.trim()||'';
   const route=routes[label];
   if(!route)return;
   event.preventDefault();
   event.stopImmediatePropagation();
   window.location.assign(route);
  };
  document.addEventListener('click',onClick,true);
  return()=>document.removeEventListener('click',onClick,true);
 },[]);
 return null;
}
