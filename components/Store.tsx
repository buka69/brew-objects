'use client';
import Image from 'next/image';
import {useEffect,useMemo,useState} from 'react';
import {categories,products,Product} from '../lib/products';
import {track} from '../lib/analytics';

type CartItem=Product&{qty:number};
const KEY='brew-objects-cart-v1';
const money=(n:number)=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);
const img=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=88`;
const IMG={
 dripper:img('photo-1741908494446-23d1550a1bca'),
 grinder:img('photo-1758979645721-ad65bacd6708'),
 tamper:img('photo-1758887255513-9752751dfd4c'),
 scale:img('photo-1734750420991-5094aded6921'),
 espresso:img('photo-1716623135997-690d6712b9a3'),
 brew:img('photo-1715583620588-3edc22b3f406'),
 carafe:img('photo-1568317163583-f82a43b649fc'),
 pitcher:img('photo-1604946326876-e8cdb157ec59'),
 travel:img('photo-1769796330939-bdb06aacb524'),
 storage:img('photo-1564507122562-2bc9a88267f6'),
 lifestyle:img('photo-1495474472287-4d71bcdd2085'),
 cafe:img('photo-1445116572660-236099ec97a0')
};
const photoFor=(p:Product)=>{
 if(p.id.includes('dripper')||p.id.includes('filter'))return IMG.dripper;
 if(p.id.includes('server')||p.id.includes('immersion')||p.id.includes('cold-brew'))return IMG.carafe;
 if(p.id.includes('gooseneck'))return IMG.brew;
 if(p.id.includes('tamper'))return IMG.tamper;
 if(p.id.includes('wdt')||p.id.includes('dosing')||p.id.includes('puck')||p.id.includes('knock')||p.id.includes('mat'))return IMG.espresso;
 if(p.id.includes('pitcher'))return IMG.pitcher;
 if(p.id.includes('travel'))return IMG.travel;
 if(p.id.includes('canister')||p.id.includes('dose-tubes'))return IMG.storage;
 if(p.category==='Drinkware')return IMG.lifestyle;
 if(p.category==='Storage & Care')return IMG.cafe;
 return IMG.brew;
};
const detailFor=(p:Product)=>{
 const common={rating:'4.8',reviews:64};
 if(p.category==='Brewing')return {...common,subtitle:'Designed for precise, repeatable manual brewing.',specs:['Food-contact materials','Easy-clean construction','Home & café use','Supplier-validated dimensions'],copy:'Built around control and consistency. The final production version will be selected for stable flow, easy cleaning and dependable daily use in both home and light café environments.'};
 if(p.category==='Espresso Tools')return {...common,subtitle:'A practical tool for cleaner, more consistent espresso prep.',specs:['58 mm ecosystem where applicable','Durable metal construction','Easy-clean surfaces','Supplier-validated tolerances'],copy:'A focused espresso accessory intended to make puck preparation cleaner and more repeatable. Final dimensions, fit and materials will be verified against the selected production sample.'};
 if(p.category==='Latte Art')return {...common,subtitle:'Balanced for controlled steaming and pouring.',specs:['Stainless-steel construction','Defined volume','Comfortable handle balance','Café workflow ready'],copy:'Designed for everyday milk work with comfortable balance and a practical spout profile. The final supplier sample will be checked for wall thickness, handle comfort and pouring control.'};
 if(p.category==='Drinkware')return {...common,subtitle:'Specialty-café proportions for everyday service.',specs:['Food-contact compliant glaze','Dishwasher durability target','Café serving size','B2B case-pack potential'],copy:'A café-style drinking format selected around specialty coffee serving sizes. Final glaze, wall thickness and dishwasher durability will be validated before production.'};
 return {...common,subtitle:'A durable accessory for coffee storage and care.',specs:['Reusable daily-use design','Easy-clean materials','Home & café workflow','Supplier-validated materials'],copy:'A practical accessory intended to simplify coffee storage, organisation or cleaning. Final materials and care instructions will be confirmed after supplier testing.'};
};
const cats=[['Pour Over',IMG.dripper],['Espresso',IMG.espresso],['Grinders',IMG.grinder],['Kettles',IMG.brew],['Scales',IMG.scale],['Latte Art',IMG.pitcher],['Drinkware',IMG.lifestyle],['Storage',IMG.storage]];

export default function Store(){
 const[category,setCategory]=useState('All');const[cart,setCart]=useState<CartItem[]>([]);const[ready,setReady]=useState(false);const[cartOpen,setCartOpen]=useState(false);const[checkout,setCheckout]=useState(false);const[wholesale,setWholesale]=useState(false);const[selected,setSelected]=useState<Product|null>(null);const[query,setQuery]=useState('');
 const filtered=useMemo(()=>products.filter(p=>(category==='All'||p.category===category)&&p.name.toLowerCase().includes(query.toLowerCase())),[category,query]);
 const count=cart.reduce((s,x)=>s+x.qty,0);const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
 useEffect(()=>{try{const x=localStorage.getItem(KEY);if(x)setCart(JSON.parse(x))}catch{}setReady(true)},[]);useEffect(()=>{if(ready)localStorage.setItem(KEY,JSON.stringify(cart))},[cart,ready]);
 const add=(p:Product)=>{setCart(c=>{const x=c.find(i=>i.id===p.id);return x?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]});track('add_to_cart',{product_id:p.id,price:p.price,currency:'EUR'});setCartOpen(true)};
 const qty=(id:string,d:number)=>setCart(c=>c.flatMap(i=>i.id!==id?[i]:i.qty+d<=0?[]:[{...i,qty:i.qty+d}]));
 return <>
  <div className="topbar"><span>◎ Ship to: Europe</span><span>Pre-launch · special prices for early supporters</span><button onClick={()=>setWholesale(true)}>B2B / Wholesale</button></div>
  <header><a className="brand" href="#">BREW / OBJECTS<small>Specialty coffee tools</small></a><nav className="mainnav"><a href="#shop">Brewing</a><a href="#shop">Espresso</a><a href="#shop">Latte Art</a><a href="#shop">Drinkware</a><a href="#shop">Storage</a></nav><div className="headtools"><label className="search"><input placeholder="Search tools..." value={query} onChange={e=>setQuery(e.target.value)}/><span>⌕</span></label><button className="iconbtn">♡</button><button className="cart" onClick={()=>setCartOpen(true)}>Cart <b>{count}</b></button></div></header>
  <main>
   <section className="hero"><div className="heroCopy"><p className="eyebrow">SPECIALTY GEAR · EUROPE · B2C + B2B</p><h1>Objects for<br/>better coffee.</h1><p className="lead">Carefully selected specialty coffee tools for home brewers and cafés across Europe.</p><div className="actions"><a className="primary" href="#shop">Shop all products</a><button className="secondary" onClick={()=>setWholesale(true)}>B2B / Wholesale</button></div></div><div className="heroVisual"><Image src={IMG.brew} alt="Specialty coffee equipment" fill priority/><div className="heroBenefits"><span>🚚 <b>Fast shipping across Europe</b><small>Free shipping over €60</small></span><span>✦ <b>Premium quality</b><small>Selected by coffee professionals</small></span><span>□ <b>Home & professional use</b><small>Tools that make a difference</small></span></div></div></section>
   <section className="categories"><div className="sectionTitle"><h3>Top Categories</h3><a href="#shop">View all categories →</a></div><div className="catrow">{cats.map(([n,u])=><button key={n} onClick={()=>setQuery('')}><span className="catimg"><Image src={u} alt={n} fill/></span><small>{n}</small></button>)}</div></section>
   <section id="shop" className="shop"><aside className="filters"><div className="filterHead"><b>Filter</b><button onClick={()=>{setCategory('All');setQuery('')}}>Clear all</button></div><div className="filterBlock"><b>Category</b>{categories.filter(c=>c!=='All').map(c=><label key={c}><input type="checkbox" checked={category===c} onChange={()=>setCategory(category===c?'All':c)}/>{c}</label>)}</div><div className="filterBlock"><b>Price</b><div className="rangeLine"/><small>€0 <span>€350+</span></small></div><div className="filterBlock"><b>Use</b><label><input type="checkbox"/>Home</label><label><input type="checkbox"/>Café / B2B</label></div></aside>
    <div className="catalog"><div className="catalogHead"><div><p className="eyebrow">THE COLLECTION</p><h2>{filtered.length} products</h2></div><select><option>Sort by: Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></div><div className="chips">{categories.map(c=><button key={c} className={c===category?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="grid">{filtered.map((p,i)=><article key={p.id}><button className="productMain" onClick={()=>{setSelected(p);track('view_item',{product_id:p.id})}}><div className="pic"><Image src={photoFor(p)} alt={p.name} fill/>{p.badge&&<span className="badge">{p.badge}</span>}<span className="heart">♡</span></div><div className="meta"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="rating"><span>★★★★★</span><small>({32+i*3})</small></div></div></button><div className="buy"><strong>{money(p.price)}</strong><button className="plus" onClick={()=>add(p)}>+</button></div></article>)}</div></div>
   </section>
   <section className="serviceStrip"><span>◇ <b>Pre-launch prices</b><small>Special prices for early supporters</small></span><span>♢ <b>14-day returns</b><small>Easy returns and exchanges</small></span><span>▣ <b>Secure checkout</b><small>Safe and encrypted payments</small></span><span>◉ <b>Need help?</b><small>hello@brewobjects.com</small></span></section>
  </main>
  {selected&&(()=>{const d=detailFor(selected);const related=products.filter(x=>x.category===selected.category&&x.id!==selected.id).slice(0,4);return <div className="overlay" onMouseDown={()=>setSelected(null)}><div className="productPage" onMouseDown={e=>e.stopPropagation()}><button className="x" onClick={()=>setSelected(null)}>×</button><div className="thumbs">{[photoFor(selected),IMG.espresso,IMG.carafe,IMG.brew].map((u,i)=><div key={i}><Image src={u} alt="" fill/></div>)}</div><div className="gallery"><Image src={photoFor(selected)} alt={selected.name} fill/></div><div className="info"><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><div className="rating"><span>★★★★★</span><small>{d.rating} · {d.reviews} reviews</small></div><strong className="price">{money(selected.price)}</strong><p className="tax">Tax included. Shipping calculated at checkout.</p><p className="productLead">{d.subtitle}</p><div className="featureIcons"><span>✓ Easy clean</span><span>◌ Daily use</span><span>◇ Selected materials</span></div><div className="purchase"><label>QUANTITY <span><button>−</button>1<button>+</button></span></label><button className="primary wide" onClick={()=>add(selected)}>Add to cart · {money(selected.price)}</button><button className="secondary wide" onClick={()=>setCheckout(true)}>Buy now</button></div>{selected.b2b&&<div className="wholesaleBox"><b>For cafés & professionals</b><small>Wholesale prices, custom offers and fast delivery.</small><button onClick={()=>setWholesale(true)}>Request wholesale pricing</button></div>}<div className="detailsTabs"><b>Details</b><span>Specifications</span><span>Shipping & Returns</span></div><p className="productCopy">{d.copy}</p><ul className="specs">{d.specs.map(s=><li key={s}>{s}</li>)}</ul><div className="related"><h3>You may also like</h3><div>{related.map(r=><button key={r.id} onClick={()=>setSelected(r)}><span><Image src={photoFor(r)} alt={r.name} fill/></span><b>{r.name}</b><small>{money(r.price)}</small></button>)}</div></div></div></div></div>})()}
  {cartOpen&&<div className="overlay" onMouseDown={()=>setCartOpen(false)}><aside className="cartDrawer" onMouseDown={e=>e.stopPropagation()}><div className="drawerhead"><h2>Your cart</h2><button onClick={()=>setCartOpen(false)}>×</button></div>{!cart.length?<p>Your cart is empty.</p>:<>{cart.map(i=><div className="cartitem" key={i.id}><Image src={photoFor(i)} alt="" width={72} height={72}/><div><strong>{i.name}</strong><small>{money(i.price)}</small><div className="qty"><button onClick={()=>qty(i.id,-1)}>−</button><span>{i.qty}</span><button onClick={()=>qty(i.id,1)}>+</button></div></div></div>)}<div className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><button className="primary wide" onClick={()=>{setCheckout(true);setCartOpen(false);track('begin_checkout',{value:subtotal})}}>Continue to checkout</button></>}</aside></div>}
  {checkout&&<div className="overlay"><div className="modal"><button className="x" onClick={()=>setCheckout(false)}>×</button><p className="eyebrow">CHECKOUT INTENT</p><h2>Where should we launch first?</h2><p>No payment is collected in this validation prototype.</p><form onSubmit={e=>{e.preventDefault();track('checkout_contact_submit',{value:subtotal});alert('Thanks — interest recorded.');setCheckout(false)}}><input type="email" placeholder="Email" required/><input placeholder="Shipping country" required/><button className="primary wide">Continue</button></form></div></div>}
  {wholesale&&<div className="overlay"><div className="modal"><button className="x" onClick={()=>setWholesale(false)}>×</button><p className="eyebrow">WHOLESALE</p><h2>Equip your café.</h2><form onSubmit={e=>{e.preventDefault();track('wholesale_lead');alert('Wholesale interest recorded.');setWholesale(false)}}><input placeholder="Name" required/><input placeholder="Café / Company" required/><input type="email" placeholder="Email" required/><input placeholder="Country" required/><textarea placeholder="Products and approximate quantities" required/><button className="primary wide">Request pricing</button></form></div></div>}
 </>;
}
