import type {ProductGallery} from './gallery40';

export const galleryFixes:Record<string,ProductGallery>={
 'motta-yellow':[
  'https://www.complementosdelcafe.com/4850-medium_default/motta-jarra-de-leche-tulip-500ml-amarillo.jpg',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-2.jpg?v=1779068408&width=1946',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-3.jpg?v=1779068400&width=1946',
  'https://coffeestuff.co.nz/cdn/shop/files/motta-tulip-milk-frothing-jug-500ml-yellow-4.jpg?v=1779068425&width=1946'
 ]
};

export function galleryFixFor(id:string):ProductGallery|undefined{return galleryFixes[id]}
