import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';
export const revalidate=86400;

const allowed=[
 'www.complementosdelcafe.com','complementosdelcafe.com','b2c.complementosdelcafe.com',
 'www.hario-europe.com','hario-europe.com','fellowproducts.com','www.fellowproducts.com',
 'comandantegrinder.com','www.comandantegrinder.com','eu.acaia.co'
];

const overrides:[RegExp,string][]=[
 [/moccamaster-kbg-select-copper/i,'https://nano-kaffee.de/cdn/shop/files/KBGSelectCopper.jpg?v=1732010415'],
 [/cafetto-gc2/i,'https://ineffablecoffee.com/cdn/shop/files/cafetto-gc2-450g.webp?crop=center&height=900&v=1750680228&width=900'],
 [/fellow-carter-bundle-move-3-in-1/i,'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4a714bc1-c4bb-47df-87a5-6ddaec80b13e.jpg'],
 [/varia-smart-kettle-black/i,'https://www.variabrewing.com/cdn/shop/files/AURA0.8LBLK.jpg?v=1716393149'],
 [/epic-cups-coffee-mug-355ml-negro/i,'https://beanbros.co/cdn/shop/files/epic-mug-355ml-694888.jpg?v=1723743542']
];

const decodeHtml=(s:string)=>s.replace(/&amp;/g,'&').replace(/&#x2F;/g,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\u002F/g,'/');

function imageKey(url:string){
 try{
  const u=new URL(url);
  const parts=u.pathname.split('/');
  const file=(parts.pop()||'')
   .replace(/-(?:small|medium|large|home|cart)_default(?=\.)/i,'')
   .replace(/(?:_|-)(?:\d{2,4}x\d{0,4}|\d{2,4}x)(?=\.)/i,'')
   .replace(/@\d+x(?=\.)/i,'')
   .toLowerCase();
  return file||u.pathname.toLowerCase();
 }catch{return url.split('?')[0].toLowerCase()}
}

function collectImages(html:string,base:URL){
 const out:string[]=[];
 const seen=new Set<string>();
 const add=(raw:string)=>{
  if(!raw)return;
  try{
   const url=new URL(decodeHtml(raw),base).toString();
   if(!/^https?:/i.test(url))return;
   const key=imageKey(url);
   if(seen.has(key))return;
   seen.add(key);out.push(url);
  }catch{}
 };

 // Product-gallery images first (common on PrestaShop / Shopify product pages).
 for(const m of html.matchAll(/https?:\/\/[^"'\\s>]+-large_default\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\\s>]*)?/gi))add(m[0]);
 for(const m of html.matchAll(/https?:\/\/[^"'\\s>]+\/cdn\/shop\/(?:products|files)\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\\s>]*)?/gi))add(m[0]);

 // Structured product imagery.
 for(const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi))add(m[1]);
 for(const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["']/gi))add(m[1]);
 for(const block of html.matchAll(/"image"\s*:\s*\[([^\]]+)\]/gi))for(const m of block[1].matchAll(/"([^"]+)"/g))add(m[1]);
 for(const m of html.matchAll(/"image"\s*:\s*"([^"]+)"/gi))add(m[1]);

 // Gallery links often point to the full-size image while the nested img is only a thumb.
 for(const tag of html.matchAll(/<a\b[^>]*>/gi)){
  const t=tag[0];
  for(const m of t.matchAll(/(?:href|data-image|data-zoom-image)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi))add(m[1]);
 }

 // Gallery/thumb image tags. srcset can expose alternate gallery files even when src repeats.
 for(const tag of html.matchAll(/<img\b[^>]*>/gi)){
  const t=tag[0];
  for(const m of t.matchAll(/(?:data-zoom-image|data-image-large-src|data-src|src)=["']([^"']+)["']/gi))add(m[1]);
  for(const m of t.matchAll(/srcset=["']([^"']+)["']/gi)){
   for(const part of m[1].split(','))add(part.trim().split(/\s+/)[0]);
  }
 }
 return out;
}

async function fetchImage(url:string,referer:string){
 const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','referer':referer,'accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},redirect:'follow',next:{revalidate:86400}});
 if(!r.ok)throw new Error('image '+r.status);
 const ct=(r.headers.get('content-type')||'image/jpeg').toLowerCase();
 if(!ct.startsWith('image/'))throw new Error('not image');
 return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=86400, s-maxage=604800'}});
}

export async function GET(req:NextRequest){
 const raw=req.nextUrl.searchParams.get('url');
 const variant=Math.max(0,Math.min(7,Number(req.nextUrl.searchParams.get('variant')||0)||0));
 if(!raw)return new NextResponse('missing url',{status:400});
 let u:URL;
 try{u=new URL(raw)}catch{return new NextResponse('bad url',{status:400})}
 if(!['http:','https:'].includes(u.protocol)||!allowed.includes(u.hostname))return new NextResponse('host not allowed',{status:403});
 try{
  const fixed=overrides.find(([pattern])=>pattern.test(u.pathname));
  if(fixed&&variant===0)return await fetchImage(fixed[1],new URL(fixed[1]).origin+'/');

  let candidates:string[]=[];
  const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8','accept-language':'en-US,en;q=0.9'},redirect:'follow',next:{revalidate:86400}});
  if(r.ok){
   const ct=(r.headers.get('content-type')||'').toLowerCase();
   if(ct.startsWith('image/')){
    if(variant>0)return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}});
    return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=86400, s-maxage=604800'}});
   }
   candidates=collectImages(await r.text(),u);
  }

  const reader=`https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`;
  const rr=await fetch(reader,{headers:{'user-agent':'BREWOBJECTS/1.0'},redirect:'follow',next:{revalidate:86400}});
  if(rr.ok){
   const md=await rr.text();
   const seen=new Set(candidates.map(imageKey));
   for(const m of md.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)){
    const url=m[1],key=imageKey(url);
    if(!seen.has(key)){seen.add(key);candidates.push(url)}
   }
  }

  if(fixed&&!candidates.some(x=>imageKey(x)===imageKey(fixed[1])))candidates.unshift(fixed[1]);
  const chosen=candidates[variant];
  if(chosen)return await fetchImage(chosen,u.origin+'/');
  if(variant>0)return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}});
  throw new Error('image not found');
 }catch{
  if(variant>0)return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}});
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f1ede5"/><text x="50%" y="49%" text-anchor="middle" font-family="Arial" font-size="30" fill="#777">Photo unavailable</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">BREW / OBJECTS</text></svg>';
  return new NextResponse(svg,{status:200,headers:{'content-type':'image/svg+xml','cache-control':'no-store'}});
 }
}
