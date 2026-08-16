import {NextRequest,NextResponse} from 'next/server';
import sharp from 'sharp';
import {gallery40} from '../../../lib/gallery40';
import {galleryFixFor} from '../../../lib/galleryFixes';
import {catalog40} from '../../../lib/catalog40';

export const runtime='nodejs';
export const dynamic='force-dynamic';

function toHex(bits:number[]){let s='';for(let i=0;i<bits.length;i+=4)s+=parseInt(bits.slice(i,i+4).join('').padEnd(4,'0'),2).toString(16);return s}
const pop=[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4];
function hamming(a:string,b:string){let n=0;const len=Math.min(a.length,b.length);for(let i=0;i<len;i++)n+=pop[parseInt(a[i],16)^parseInt(b[i],16)];return n+Math.abs(a.length-b.length)*4}
async function inspect(url:string){
 try{
  const origin=new URL(url).origin+'/';
  const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0','referer':origin,'accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},redirect:'follow',cache:'no-store'});
  if(!r.ok)throw new Error(String(r.status));
  const ct=(r.headers.get('content-type')||'').toLowerCase();if(!ct.startsWith('image/'))throw new Error('not image');
  const b=Buffer.from(await r.arrayBuffer());
  const meta=await sharp(b).metadata();
  const {data}=await sharp(b).resize(16,16,{fit:'fill'}).grayscale().raw().toBuffer({resolveWithObject:true});
  let sum=0;for(const v of data)sum+=v;const avg=sum/data.length;const bits=[...data].map(v=>v>=avg?1:0);
  return {url,width:meta.width||0,height:meta.height||0,bytes:b.length,ahash:toHex(bits)};
 }catch(e){return {url,error:e instanceof Error?e.message:String(e)}}
}
async function audit(id:string){
 const gallery=galleryFixFor(id)||gallery40[id];
 if(!gallery)return {id,ok:false,error:'no pinned gallery'};
 const images=await Promise.all(gallery.map(inspect));
 const good=images.filter((x):x is {url:string;width:number;height:number;bytes:number;ahash:string}=>'ahash' in x);
 const pairs:{a:number;b:number;distance:number}[]=[];
 for(let a=0;a<good.length;a++)for(let b=a+1;b<good.length;b++)pairs.push({a,b,distance:hamming(good[a].ahash,good[b].ahash)});
 const minDistance=pairs.length?Math.min(...pairs.map(x=>x.distance)):0;
 const uniqueUrls=new Set(gallery.map(x=>x.split('?')[0].toLowerCase())).size===4;
 const ok=good.length===4&&uniqueUrls&&minDistance>=10;
 return {id,name:catalog40.find(p=>p.id===id)?.name,ok,minDistance,images,pairs};
}
export async function GET(req:NextRequest){
 const ids=(req.nextUrl.searchParams.get('ids')||req.nextUrl.searchParams.get('id')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,4);
 if(!ids.length)return NextResponse.json({error:'missing id/ids'},{status:400});
 return NextResponse.json({results:await Promise.all(ids.map(audit))});
}
