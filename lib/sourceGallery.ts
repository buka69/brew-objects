import {galleryFor} from './gallery40';
import {galleryFixFor} from './galleryFixes';
import {catalog40} from './catalog40';

const isComplementos=(host:string)=>host==='www.complementosdelcafe.com'||host==='complementosdelcafe.com'||host==='b2c.complementosdelcafe.com';
const decode=(s:string)=>s.replace(/&amp;/g,'&').replace(/\\u002F/g,'/').replace(/\\u0026/g,'&');

function complementosGallery(html:string,page:URL){
 const slug=page.pathname.split('/').filter(Boolean).pop()||'';
 const escaped=slug.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const re=new RegExp(`(?:https?:)?//(?:www\\.)?complementosdelcafe\\.com/(\\d+)-(?:large|home|medium)_default/${escaped}\\.(?:jpg|jpeg|png|webp)(?:\\?[^\\s\"'<>]*)?`,'gi');
 const ids:string[]=[];
 for(const m of html.matchAll(re)){if(!ids.includes(m[1]))ids.push(m[1])}
 return ids.map(id=>`https://www.complementosdelcafe.com/${id}-large_default/${slug}.jpg`);
}

export async function sourceGallery(id:string){
 const p=catalog40.find(x=>x.id===id);
 if(!p)return [];
 let u:URL;
 try{u=new URL(p.source)}catch{return [...(galleryFixFor(id)||galleryFor(id)||[])]}
 if(!isComplementos(u.hostname))return [...(galleryFixFor(id)||galleryFor(id)||[])];
 try{
  const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','accept':'text/html,application/xhtml+xml','accept-language':'es-ES,es;q=0.9,en;q=0.8'},redirect:'follow',next:{revalidate:21600}});
  if(!r.ok)throw new Error(String(r.status));
  const html=decode(await r.text());
  const exact=complementosGallery(html,u);
  if(exact.length)return exact;
 }catch{}
 return [...(galleryFixFor(id)||galleryFor(id)||[])];
}
