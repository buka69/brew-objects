import {NextRequest,NextResponse} from 'next/server';
import {getProductById} from '../../../lib/catalog-repository';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(req:NextRequest){
 const id=req.nextUrl.searchParams.get('id')||'';
 if(!id)return NextResponse.json({error:'missing id'},{status:400});
 const product=await getProductById(id);
 if(!product)return NextResponse.json({error:'not found'},{status:404});
 return NextResponse.json({id,count:product.images.length},{headers:{'cache-control':'public, max-age=60, s-maxage=60'}});
}
