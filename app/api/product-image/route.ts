import {NextRequest,NextResponse} from 'next/server';
import {catalog40} from '../../../lib/catalog40';
import {sourceGallery} from '../../../lib/sourceGallery';

export const runtime='nodejs';
export const revalidate=21600;

const allowed=[
 'www.complementosdelcafe.com','complementosdelcafe.com','b2c.complementosdelcafe.com',
 'www.hario-europe.com','hario-europe.com','fellowproducts.com','www.fellowproducts.com',
 'comandantegrinder.com','www.comandantegrinder.com','eu.acaia.co'
];

async function fetchImage(url:string){
 const origin=new URL(url).origin+'/';
 const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','referer':origin,'accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},redirect:'follow',next:{revalidate:21600}});
 if(!r.ok)throw new Error(`image ${r.status}`);
 const ct=(r.headers.get('content-type')||'').toLowerCase();
 if(!ct.startsWith('image/'))throw new Error('not image');
 return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=21600, s-maxage=21600'}});
}

const decodeHtml=(s:string)=>s.replace(/&amp;/g,'&').replace(/&#x2F;/g,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\u002F/g,'/');
function pickImage(html:string,base:URL){
 const patterns=[
  /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
  /"image"\s*:\s*"([^"]+)"/i,
  /"image"\s*:\s*\[\s*"([^"]+)"/i
 ];
 for(const p of patterns){const m=html.match(p);if(m){try{return new URL(decodeHtml(m[1]),base).toString()}catch{}}}
 return '';
}

export async function GET(req:NextRequest){
 const explicitId=req.nextUrl.searchParams.get('id')||'';
 const raw=req.nextUrl.searchParams.get('url')||'';
 const mappedId=explicitId||catalog40.find(p=>p.source===raw)?.id||'';
 const variant=Math.max(0,Math.min(30,Number(req.nextUrl.searchParams.get('variant')||0)||0));

 if(mappedId){
  const gallery=await sourceGallery(mappedId);
  const chosen=gallery[variant];
  if(chosen){
   try{return await fetchImage(chosen)}catch{return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}})}
  }
  return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}});
 }

 if(!raw)return new NextResponse('missing id/url',{status:400});
 let u:URL;try{u=new URL(raw)}catch{return new NextResponse('bad url',{status:400})}
 if(!['http:','https:'].includes(u.protocol)||!allowed.includes(u.hostname))return new NextResponse('host not allowed',{status:403});
 try{
  const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0','accept':'text/html,application/xhtml+xml,image/avif,image/webp,*/*;q=0.8'},redirect:'follow',next:{revalidate:21600}});
  if(!r.ok)throw new Error(String(r.status));
  const ct=(r.headers.get('content-type')||'').toLowerCase();
  if(ct.startsWith('image/'))return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=21600'}});
  const found=pickImage(await r.text(),u);if(found)return await fetchImage(found);
  throw new Error('image not found');
 }catch{
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f1ede5"/><text x="50%" y="49%" text-anchor="middle" font-family="Arial" font-size="30" fill="#777">Photo unavailable</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">BREW / OBJECTS</text></svg>';
  return new NextResponse(svg,{status:200,headers:{'content-type':'image/svg+xml','cache-control':'no-store'}});
 }
}
