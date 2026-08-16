import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';
export const revalidate=86400;

const allowed=[
 'www.complementosdelcafe.com','complementosdelcafe.com','b2c.complementosdelcafe.com',
 'www.hario-europe.com','hario-europe.com','fellowproducts.com','www.fellowproducts.com',
 'comandantegrinder.com','www.comandantegrinder.com','eu.acaia.co'
];

const overrides:[RegExp,string][]=[
 [/moccamaster-kbg-select-copper/i,'https://www.moccamaster.es/pub/media/catalog/category/slider/KBG_Select/moccamaster-kbg-select-slider-1.1.jpg'],
 [/cafetto-gc2/i,'https://ineffablecoffee.com/cdn/shop/files/cafetto-gc2-450g.webp?crop=center&height=900&v=1750680228&width=900'],
 [/fellow-carter-bundle-move-3-in-1/i,'https://fellowproducts.com/cdn/shop/files/Web_PDP_CarterMoveMug-12oz_CoralCrush_1.png?v=1776292476&width=1200'],
 [/varia-smart-kettle-black/i,'https://www.variabrewing.com/cdn/shop/files/AURA0.8LBLK.jpg?v=1716393149'],
 [/epic-cups-coffee-mug-355ml-negro/i,'https://kinto-europe.com/cdn/shop/products/20757.jpg?v=1561465499&width=1024']
];

const decodeHtml=(s:string)=>s.replace(/&amp;/g,'&').replace(/&#x2F;/g,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\u002F/g,'/');

function pickImage(html:string,base:URL){
 const patterns=[
  /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
  /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  /"image"\s*:\s*"([^"]+)"/i,
  /"image"\s*:\s*\[\s*"([^"]+)"/i,
  /<img[^>]+(?:data-src|src)=["']([^"']+)["'][^>]*(?:product|main|featured)/i,
  /<img[^>]+(?:data-src|src)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/i,
  /https?:\/\/[^"'\\s>]+-large_default\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)/i,
  /https?:\/\/[^"'\\s>]+\/cdn\/shop\/(?:products|files)\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)[^"'\\s>]*/i
 ];
 for(const p of patterns){const m=html.match(p);if(m){try{return new URL(decodeHtml(m[1]||m[0]),base).toString()}catch{}}}
 return '';
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
 if(!raw)return new NextResponse('missing url',{status:400});
 let u:URL;
 try{u=new URL(raw)}catch{return new NextResponse('bad url',{status:400})}
 if(!['http:','https:'].includes(u.protocol)||!allowed.includes(u.hostname))return new NextResponse('host not allowed',{status:403});
 try{
  const fixed=overrides.find(([pattern])=>pattern.test(u.pathname));
  if(fixed)return await fetchImage(fixed[1],new URL(fixed[1]).origin+'/');
  const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8','accept-language':'en-US,en;q=0.9'},redirect:'follow',next:{revalidate:86400}});
  if(r.ok){
   const ct=(r.headers.get('content-type')||'').toLowerCase();
   if(ct.startsWith('image/'))return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=86400, s-maxage=604800'}});
   const html=await r.text();
   const found=pickImage(html,u);
   if(found)return await fetchImage(found,u.origin+'/');
  }
  const reader=`https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`;
  const rr=await fetch(reader,{headers:{'user-agent':'BREWOBJECTS/1.0'},redirect:'follow',next:{revalidate:86400}});
  if(rr.ok){
   const md=await rr.text();
   const candidates=[...md.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)].map(m=>m[1]);
   const preferred=candidates.find(x=>/product|cdn|media|image|shop|uploads/i.test(x))||candidates[0];
   if(preferred)return await fetchImage(preferred,u.origin+'/');
  }
  throw new Error('image not found');
 }catch{
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f1ede5"/><text x="50%" y="49%" text-anchor="middle" font-family="Arial" font-size="30" fill="#777">Photo unavailable</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">BREW / OBJECTS</text></svg>';
  return new NextResponse(svg,{status:200,headers:{'content-type':'image/svg+xml','cache-control':'no-store'}});
 }
}
