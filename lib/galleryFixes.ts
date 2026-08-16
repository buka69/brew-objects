import type {ProductGallery} from './gallery40';

export const galleryFixes:Record<string,ProductGallery>={
 'motta-yellow':[
  'https://www.complementosdelcafe.com/4850-medium_default/motta-jarra-de-leche-tulip-500ml-amarillo.jpg',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-2.jpg?v=1779068408&width=1946',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-3.jpg?v=1779068400&width=1946',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-4.jpg?v=1779068425&width=1946'
 ],
 'cafelat-cloths':[
  'https://www.complementosdelcafe.com/4813-medium_default/cafelat-pack-4-panos-microfibra.jpg',
  'https://area51coffeeroasters.com/wp-content/uploads/Gear-CafelatMicrofiberCloths_4pack-P01-1080w.png',
  'https://area51coffeeroasters.com/wp-content/uploads/Gear-CafelatMicrofiberCloths_4pack-SL01-1080w.png',
  'https://area51coffeeroasters.com/wp-content/uploads/Gear-CafelatMicrofiberCloths_4pack-SL02-1080w.png'
 ],
 'cafetto-gc2':[
  'https://ineffablecoffee.com/cdn/shop/files/cafetto-gc2-450g.webp?crop=center&height=900&v=1750680228&width=900',
  'https://kaffemester-i03.mycdn.no/mysimgprod/kaffemester_mystore_no/images/wJx1U_Cafetto_Cafetto_GC2_Grinder_Clean_1.webp/w800h800.webp',
  'https://cdn.cafetto.com/general-images/grinder-clean.jpg',
  'https://www.jhornig.com/cdn/shop/articles/jhornig-muehlenreinigung-blogbeitrag-1_1200x800.jpg?v=1741614769'
 ]
};

export function galleryFixFor(id:string):ProductGallery|undefined{return galleryFixes[id]}
