import {NextRequest,NextResponse} from 'next/server';
import {getProductById} from '../../../lib/catalog-repository';

export const runtime='nodejs';
export const revalidate=21600;

async function fetchImage(url:string){
 const origin=new URL(url).origin+'/';
 const response=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36','referer':origin,'accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'},redirect:'follow',next:{revalidate:21600}});
 if(!response.ok)throw new Error(`image ${response.status}`);
 const contentType=(response.headers.get('content-type')||'').toLowerCase();
 if(!contentType.startsWith('image/'))throw new Error('not image');
 return new NextResponse(await response.arrayBuffer(),{headers:{'content-type':contentType,'cache-control':'public, max-age=21600, s-maxage=21600'}});
}

export async function GET(req:NextRequest){
 const id=req.nextUrl.searchParams.get('id')||'';const variant=Math.max(0,Math.min(30,Number(req.nextUrl.searchParams.get('variant')||0)||0));
 if(!id)return new NextResponse('missing id',{status:400});
 const product=await getProductById(id);const chosen=product?.images[variant]?.url;
 if(!chosen)return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}});
 try{return await fetchImage(chosen)}catch{return new NextResponse(null,{status:404,headers:{'cache-control':'no-store'}})}
}
