import {NextRequest,NextResponse} from 'next/server';

const KEYS=new Set(['espresso','studio','timemore','toddy']);

export async function GET(req:NextRequest){
 const key=req.nextUrl.searchParams.get('key')||'';
 if(!KEYS.has(key))return new NextResponse('Unknown banner',{status:404});
 return NextResponse.redirect(new URL(`/banners/${key}.webp`,req.url),307);
}
