import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';
export const dynamic='force-dynamic';

const KEYS:Record<string,string[]>={
 espresso:['ESPRESSO-SERIES-1-B2C-Banners-DESKTOP','ESPRESSO-SERIES-1'],
 studio:['SB-COFFEE-CORNER-B2C-Banners-DESKTOP','SB-COFFEE-CORNER'],
 timemore:['TIMEMORE-ICICLE-B2C-Banners-DESKTOP','TIMEMORE-ICICLE'],
 toddy:['TODDY-DOMESTICO-B2C-Banners-DESKTOP','TODDY-DOMESTICO']
};

const abs=(u:string,base:string)=>{try{return new URL(u,base).toString()}catch{return ''}};

export async function GET(req:NextRequest){
 const key=req.nextUrl.searchParams.get('key')||'';
 const needles=KEYS[key];
 if(!needles)return new NextResponse('Unknown banner',{status:404});
 try{
  const home='https://www.complementosdelcafe.com/es/';
  const r=await fetch(home,{headers:{'user-agent':'Mozilla/5.0 (compatible; BREW-OBJECTS/1.0)','accept':'text/html,application/xhtml+xml'},cache:'no-store'});
  const html=await r.text();
  const decoded=html.replace(/&amp;/g,'&').replace(/\\u002F/g,'/').replace(/\\\//g,'/');
  const candidates=[...decoded.matchAll(/(?:src|href|data-src|data-lazy|data-bg|background-image)\s*=\s*["']?([^"'<>\s)]+)|url\(["']?([^"')]+)|https?:[^"'<>\s)]+/gi)]
   .map(m=>(m[1]||m[2]||m[0]||'').replace(/^https?:/i,x=>x))
   .filter(Boolean);
  let found='';
  for(const c of candidates){
   const d=decodeURIComponent(c);
   if(needles.some(n=>d.toUpperCase().includes(n.toUpperCase()))){found=abs(c,home);break}
  }
  if(!found){
   const all=[...decoded.matchAll(/["'(=](https?:\/\/[^"')\s]+\.webp[^"')\s]*|\/[^"')\s]+\.webp[^"')\s]*)/gi)].map(m=>m[1]);
   const hit=all.find(c=>needles.some(n=>decodeURIComponent(c).toUpperCase().includes(n.toUpperCase())));
   if(hit)found=abs(hit,home);
  }
  if(!found)return new NextResponse('Banner asset not found',{status:404});
  const img=await fetch(found,{headers:{'user-agent':'Mozilla/5.0','referer':home},cache:'no-store'});
  if(!img.ok)return new NextResponse('Upstream banner failed',{status:502});
  const type=img.headers.get('content-type')||'image/webp';
  const body=await img.arrayBuffer();
  return new NextResponse(body,{status:200,headers:{'content-type':type,'cache-control':'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'}});
 }catch(e){return new NextResponse('Banner proxy error',{status:500})}
}
