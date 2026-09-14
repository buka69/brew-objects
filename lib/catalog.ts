export type ProductImage={id:string;url:string;alt:string;position:number};

export type CatalogProduct={
 id:string;slug:string;name:string;category:string;categorySlug:string;brand:string;brandSlug:string;
 price:number;compareAtPrice?:number;currency:string;source:string;description:string;rating:string;reviews:number;
 badge?:string;details:string[];images:ProductImage[];status:'draft'|'active'|'archived';stock:number;b2b:boolean;
 featured:boolean;sortOrder:number;updatedAt:string;
};
