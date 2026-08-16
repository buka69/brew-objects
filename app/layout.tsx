import './globals.css';
import './controls.css';
import './seo.css';
import './cursors.css';
import type {Metadata} from 'next';
import Script from 'next/script';
import {SITE_URL,siteKeywords} from '../lib/seo';

export const metadata:Metadata={
 metadataBase:new URL(SITE_URL),
 title:{default:'BREW / OBJECTS — Specialty Coffee Equipment Europe',template:'%s | BREW / OBJECTS'},
 description:'Shop specialty coffee equipment, brewing tools, grinders, kettles, barista accessories and café gear in Europe. Curated tools for home brewers and coffee professionals.',
 keywords:siteKeywords,
 alternates:{canonical:'/'},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 openGraph:{type:'website',url:SITE_URL,siteName:'BREW / OBJECTS',title:'BREW / OBJECTS — Specialty Coffee Equipment Europe',description:'Specialty coffee equipment, barista tools and brewing gear for home brewers and cafés across Europe.',images:[{url:'/api/product-image?id=v60&variant=0&v=seo',width:1200,height:1200,alt:'Specialty coffee brewing equipment from BREW / OBJECTS'}]},
 twitter:{card:'summary_large_image',title:'BREW / OBJECTS — Specialty Coffee Equipment Europe',description:'Specialty coffee equipment, barista tools and brewing gear in Europe.',images:['/api/product-image?id=v60&variant=0&v=seo']},
 verification:process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:undefined,
 category:'shopping'
};

const orgSchema={'@context':'https://schema.org','@type':'Organization',name:'BREW / OBJECTS',url:SITE_URL,description:'European specialty coffee equipment and barista tools store.',logo:`${SITE_URL}/api/product-image?id=v60&variant=0&v=seo`};
const websiteSchema={'@context':'https://schema.org','@type':'WebSite',name:'BREW / OBJECTS',url:SITE_URL,description:'Specialty coffee equipment, barista tools and brewing gear in Europe.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 const ga=process.env.NEXT_PUBLIC_GA4_ID;const pixel=process.env.NEXT_PUBLIC_META_PIXEL_ID;
 return <html lang="en"><body>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(orgSchema)}}/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema)}}/>
  {children}
  {ga&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script></>}
  {pixel&&<Script id="meta" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}</Script>}
 </body></html>
}
