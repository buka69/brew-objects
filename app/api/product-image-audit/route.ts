import {NextRequest,NextResponse} from 'next/server';
import sharp from 'sharp';
import {catalog40} from '../../../lib/catalog40';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const allowed=[
 'www.complementosdelcafe.com','complementosdelcafe.com','b2c.complementosdelcafe.com',
 'www.hario-europe.com','hario-europe.com','fellowproducts.com','www.fellowproducts.com',
 'comandantegrinder.com','www.comandantegrinder.com','eu.acaia.co'
];

const decodeHtml=(s:string)=>s.replace(/&amp;/g,'&').replace(/&#x2F;/g,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\u002F/g,'/');
function imageKey(url:string){try{const u=new URL(url);return `${u.host}${u.pathname.replace(/-(?:small|medium|large|home|cart)_default(?=\.)/i,'')}`.toLowerCase()}catch{return url.split('?')[0].toLowerCase()}}
function collectImages(html:string,base:URL){
 const out:string[]=[];const seen=new Set<string>();
 const add=(raw:string)=>{if(!raw)return;try{const url=new URL(decodeHtml(raw),base).toString();if(!/^https?:/i.test(url))return;const key=imageKey(url);if(seen.has(key))return;seen.add(key);out.push(url)}catch{}};
 for(const m of html.matchAll(/https?:\/\/[^"'\\s>]+-large_default\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\\s>]*)?/gi))add(m[0]);
 for(const m of html.matchAll(/https?:\/\/[^"'\\s>]+\/cdn\/shop\/(?:products|files)\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\\s>]*)?/gi))add(m[0]);
 for(const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi))add(m[1]);
 for(const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["']/gi))add(m[1]);
 for(const block of html.matchAll(/"image"\s*:\s*\[([^\]]+)\]/gi))for(const m of block[1].matchAll(/"([^"]+)"/g))add(m[1]);
 for(const m of html.matchAll(/"image"\s*:\s*"([^"]+)"/gi))add(m[1]);
 for(const tag of html.matchAll(/<a\b[^>]*>/gi))for(const m of tag[0].matchAll(/(?:href|data-image|data-zoom-image)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi))add(m[1]);
 for(const tag of html.matchAll(/<img\b[^>]*>/gi)){
  const t=tag[0];
  for(const m of t.matchAll(/(?:data-zoom-image|data-image-large-src|data-src|src)=["']([^"']+)["']/gi))add(m[1]);
  for(const m of t.matchAll(/srcset=["']([^"']+)["']/gi))for(const part of m[1].split(','))add(part.trim().split(/\s+/)[0]);
 }
 return out;
}
async function getCandidates(u:URL){
 let candidates:string[]=[];
 const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8','accept-language':'en-US,en;q=0.9'},redirect:'follow',cache:'no-store'});
 if(r.ok){const ct=(r.headers.get('content-type')||'').toLowerCase();if(!ct.startsWith('image/'))candidates=collectImages(await r.text(),u)}
 const rr=await fetch(`https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`,{headers:{'user-agent':'BREWOBJECTS/1.0'},redirect:'follow',cache:'no-store'});
 if(rr.ok){const md=await rr.text();const seen=new Set(candidates.map(imageKey));for(const m of md.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)){const url=m[1],key=imageKey(url);if(!seen.has(key)){seen.add(key);candidates.push(url)}}}
 return candidates;
}
function toHex(bits:number[]){let s='';for(let i=0;i<bits.length;i+=4)s+=parseInt(bits.slice(i,i+4).join('').padEnd(4,'0'),2).toString(16);return s}
async function inspect(url:string,referer:string){
 try{
  const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0','referer':referer,'accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},redirect:'follow',cache:'no-store'});if(!r.ok)throw new Error(String(r.status));
  const b=Buffer.from(await r.arrayBuffer());const meta=await sharp(b).metadata();const {data}=await sharp(b).resize(16,16,{fit:'fill'}).grayscale().raw().toBuffer({resolveWithObject:true});let sum=0;for(const v of data)sum+=v;const avg=sum/data.length;const bits=[...data].map(v=>v>=avg?1:0);return {url,width:meta.width||0,height:meta.height||0,bytes:b.length,ahash:toHex(bits)};
 }catch(e){return {url,error:e instanceof Error?e.message:String(e)}}
}
const pop=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];
function hamming(a:string,b:string){let n=0;const len=Math.min(a.length,b.length);for(let i=0;i<len;i++)n+=pop[parseInt(a[i],16)^parseInt(b[i],16)];return n+Math.abs(a.length-b.length)*4}
async function audit(id:string,raw:string){
 let u:URL;try{u=new URL(raw)}catch{return {id,source:raw,error:'bad url'}}
 if(!allowed.includes(u.hostname))return {id,source:raw,error:'host not allowed'};
 const candidates=(await getCandidates(u)).slice(0,24);
 const inspected=await Promise.all(candidates.map(x=>inspect(x,u.origin+'/')));
 const good=inspected.filter((x):x is {url:string;width:number;height:number;bytes:number;ahash:string}=>'ahash' in x);
 const selected:typeof good=[];
 for(const x of good){if(x.width<250||x.height<250)continue;if(selected.every(y=>hamming(x.ahash,y.ahash)>=18))selected.push(x);if(selected.length===4)break}
 return {id,source:raw,count:candidates.length,selected,all:inspected};
}
export async function GET(req:NextRequest){
 const ids=(req.nextUrl.searchParams.get('ids')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,4);
 if(ids.length){
  const products=ids.map(id=>catalog40.find(p=>p.id===id)).filter(Boolean) as typeof catalog40;
  const results=await Promise.all(products.map(p=>audit(p.id,p.source)));
  return NextResponse.json({results});
 }
 const id=req.nextUrl.searchParams.get('id')||'';
 const raw=req.nextUrl.searchParams.get('url')||catalog40.find(p=>p.id===id)?.source;
 if(!raw)return NextResponse.json({error:'missing product id/url'},{status:400});
 return NextResponse.json(await audit(id,raw));
}
