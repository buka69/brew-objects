import {NextRequest,NextResponse} from 'next/server';
import {sourceGallery} from '../../../lib/sourceGallery';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(req:NextRequest){
 const id=req.nextUrl.searchParams.get('id')||'';
 if(!id)return NextResponse.json({error:'missing id'},{status:400});
 const images=await sourceGallery(id);
 return NextResponse.json({id,count:images.length},{headers:{'cache-control':'public, max-age=300, s-maxage=21600'}});
}
