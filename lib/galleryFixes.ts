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
  'https://lazenskakava.s24.cdn-upgates.com/_cache/b/a/bace8a235df2ac2bef92996270c5b2b0-cafetto-grinder-clean-450g-cistic-mlynku.jpg',
  'https://lazenskakava.s24.cdn-upgates.com/_cache/d/0/d080b2f9fc53423b684c4724dd467f38-cafetto-grinder-clean-450g-cistic-mlynku.webp',
  'https://lazenskakava.s24.cdn-upgates.com/_cache/e/e/ee05b3626f3d92251b0f9cf916211771-cafetto-grinder-clean-450g-cistic-mlynku.webp'
 ]
};

export function galleryFixFor(id:string):ProductGallery|undefined{return galleryFixes[id]}
