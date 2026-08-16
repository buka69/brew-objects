import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';
export const revalidate=86400;

const allowed=[
 'www.complementosdelcafe.com','complementosdelcafe.com','b2c.complementosdelcafe.com',
 'www.hario-europe.com','hario-europe.com','fellowproducts.com','www.fellowproducts.com',
 'comandantegrinder.com','www.comandantegrinder.com','eu.acaia.co'
];

function decodeHtml(s:string){return s.replace(/&amp;/g,'&').replace(/&#x2F;/g,'/').replace(/&quot;/g,'"').replace(/&#39;/g,"'")}

export async function GET(req:NextRequest){
 const raw=req.nextUrl.searchParams.get('url');
 if(!raw)return new NextResponse('missing url',{status:400});
 let u:URL;
 try{u=new URL(raw)}catch{return new NextResponse('bad url',{status:400})}
 if(!['http:','https:'].includes(u.protocol)||!allowed.includes(u.hostname))return new NextResponse('host not allowed',{status:403});
 try{
  const r=await fetch(u.toString(),{headers:{'user-agent':'Mozilla/5.0 (compatible; BREWOBJECTS/1.0)','accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'},redirect:'follow',next:{revalidate:86400}});
  if(!r.ok)throw new Error('source '+r.status);
  const ct=(r.headers.get('content-type')||'').toLowerCase();
  if(ct.startsWith('image/'))return new NextResponse(await r.arrayBuffer(),{headers:{'content-type':ct,'cache-control':'public, max-age=86400, s-maxage=604800'}});
  const html=await r.text();
  const patterns=[
   /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
   /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
   /https?:\/\/[^"'\\s>]+-large_default\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)/i,
   /https?:\/\/[^"'\\s>]+\/cdn\/shop\/(?:products|files)\/[^"'\\s>]+\.(?:jpg|jpeg|png|webp)[^"'\\s>]*/i
  ];
  let image='';
  for(const p of patterns){const m=html.match(p);if(m){image=decodeHtml(m[1]||m[0]);break}}
  if(!image)throw new Error('image not found');
  const iu=new URL(image,u);
  const ir=await fetch(iu.toString(),{headers:{'user-agent':'Mozilla/5.0','referer':u.origin+'/'},redirect:'follow',next:{revalidate:86400}});
  if(!ir.ok)throw new Error('image '+ir.status);
  const ict=ir.headers.get('content-type')||'image/jpeg';
  return new NextResponse(await ir.arrayBuffer(),{headers:{'content-type':ict,'cache-control':'public, max-age=86400, s-maxage=604800'}});
 }catch{
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#f1ede5"/><text x="50%" y="49%" text-anchor="middle" font-family="Arial" font-size="30" fill="#777">Photo loading</text><text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="18" fill="#999">BREW / OBJECTS</text></svg>';
  return new NextResponse(svg,{status:200,headers:{'content-type':'image/svg+xml','cache-control':'no-store'}});
 }
}
