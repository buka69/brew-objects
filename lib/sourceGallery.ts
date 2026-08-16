import {galleryFor} from './gallery40';
import {galleryFixFor} from './galleryFixes';
import {catalog40} from './catalog40';

const isComplementos=(host:string)=>host==='www.complementosdelcafe.com'||host==='complementosdelcafe.com'||host==='b2c.complementosdelcafe.com';
const decode=(s:string)=>s.replace(/&amp;/g,'&').replace(/\\u002F/g,'/').replace(/\\u0026/g,'&');

function complementosGallery(html:string,page:URL){
 const slug=page.pathname.split('/').filter(Boolean).pop()||'';
 const escaped=slug.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const re=new RegExp(`((?:https?:)?//(?:www\\.)?complementosdelcafe\\.com/(\\d+)-(large|home|medium)_default/${escaped}\\.(?:jpg|jpeg|png|webp)(?:\\?[^\\s\"'<>]*)?)`,'gi');
 const byId=new Map<string,{url:string;rank:number}>();
 const rank:Record<string,number>={large:3,home:2,medium:1};
 for(const m of html.matchAll(re)){
  const id=m[2],size=(m[3]||'medium').toLowerCase();
  const url=m[1].startsWith('//')?`https:${m[1]}`:m[1];
  const next={url,rank:rank[size]||0};
  const prev=byId.get(id);
  if(!prev||next.rank>prev.rank)byId.set(id,next);
 }
 return [...byId.values()].map(x=>x.url);
}

export async function sourceGallery(id:string){
 const p=catalog40.find(x=>x.id===id);
 if(!p)return [];

 // The old Hario Europe hero URL now resolves to a generic lifestyle image.
 // Keep the same verified product gallery but start with a clean product shot.
 if(id==='server'){
  const g=galleryFixFor(id)||galleryFor(id)||[];
  return g.length>=4?[g[1],g[2],g[3],g[0]]:[...g];
 }

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
