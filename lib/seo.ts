import type {CatalogProduct} from './catalog40';

export const SITE_URL='https://brew-objects.vercel.app';

export const siteKeywords=[
 'specialty coffee equipment Europe','coffee brewing equipment Europe','barista tools Europe','coffee equipment online Europe',
 'coffee gear Europe','café equipment accessories','pour over coffee equipment','manual coffee grinders','gooseneck coffee kettles',
 'latte art tools','coffee scales','coffee brewing accessories','professional barista tools','home coffee brewing gear'
];

export const slugify=(value:string)=>value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const productSlug=(p:CatalogProduct)=>slugify(p.name);
export const categorySlug=(category:string)=>slugify(category);

const brandRules:[RegExp,string][]=[
 [/^Ceramic Pour Over Dripper/i,'Hario'],[/^Hario/i,'Hario'],[/^Fellow/i,'Fellow'],[/^Comandante/i,'Comandante'],[/^Acaia/i,'Acaia'],
 [/^Rhinowares/i,'Rhinowares'],[/^Moccamaster/i,'Moccamaster'],[/^Pezzetti/i,'Pezzetti'],[/^Kinto/i,'Kinto'],[/^Bialetti/i,'Bialetti'],
 [/^AeroPress/i,'AeroPress'],[/^Origami/i,'Origami'],[/^Epic/i,'Epic'],[/^Studio Barista/i,'Studio Barista'],[/^Motta/i,'Motta'],
 [/^Cafelat/i,'Cafelat'],[/^Cafetto/i,'Cafetto'],[/^MHW3Bomber/i,'MHW3Bomber'],[/^Varia/i,'Varia'],[/^Brewista/i,'Brewista'],[/^Eureka/i,'Eureka']
];
export function brandFor(p:CatalogProduct){return brandRules.find(([re])=>re.test(p.name))?.[1]||p.name.split(' ')[0]}
export const brandSlug=(brand:string)=>slugify(brand);

export const categoryCopy:Record<string,{title:string;description:string;intro:string;keywords:string[]}>= {
 Brewing:{title:'Coffee Brewing Equipment & Pour Over Gear Europe',description:'Shop coffee brewing equipment in Europe: pour over drippers, moka pots, coffee servers, cold brew makers and manual brewers for home and café use.',intro:'Explore specialty coffee brewing equipment selected for consistent extraction at home or behind the bar. Compare pour over drippers, coffee servers, moka pots, cold brew makers and manual brewing accessories available for European coffee enthusiasts and professionals.',keywords:['coffee brewing equipment Europe','pour over coffee gear Europe','buy coffee dripper Europe','manual coffee brewers Europe','specialty coffee brewing tools']},
 Espresso:{title:'Espresso Accessories & Barista Tools Europe',description:'Shop espresso accessories and professional barista tools in Europe, including dosing cups, knock boxes and workflow accessories for cafés and home espresso.',intro:'Build a cleaner, faster espresso workflow with specialist accessories for dosing, puck preparation and bar cleanup. Our espresso tool selection is aimed at both home baristas and professional coffee shops across Europe.',keywords:['espresso accessories Europe','barista tools Europe','coffee dosing cup Europe','espresso workflow tools','cafe barista equipment']},
 Grinders:{title:'Specialty Coffee Grinders Europe',description:'Shop specialty coffee grinders in Europe, including precision manual grinders for espresso, filter and pour over coffee.',intro:'A consistent grind is one of the biggest drivers of better coffee. Discover precision coffee grinders for espresso and filter brewing, selected for repeatable adjustment, burr quality and everyday usability.',keywords:['coffee grinders Europe','manual coffee grinder Europe','specialty coffee grinder','buy coffee grinder Europe','espresso grinder accessories']},
 Kettles:{title:'Gooseneck Coffee Kettles Europe',description:'Shop precision gooseneck coffee kettles in Europe with temperature control for pour over, filter coffee and professional brewing.',intro:'Control flow rate and brewing temperature with precision coffee kettles made for pour over and filter coffee. Compare variable-temperature and gooseneck kettles for home brewers and coffee professionals.',keywords:['gooseneck kettle Europe','coffee kettle temperature control','pour over kettle Europe','buy coffee kettle Europe','specialty coffee kettle']},
 Scales:{title:'Coffee Scales & Brewing Scales Europe',description:'Shop precision coffee scales in Europe for espresso and pour over brewing, with accurate weight and timing for repeatable coffee recipes.',intro:'Precision coffee scales help make espresso and filter recipes repeatable. Shop brewing scales designed for fast response, accurate dosing and practical use on espresso machines and brew bars.',keywords:['coffee scales Europe','espresso scale Europe','pour over scale','precision coffee scale','barista scale Europe']},
 'Latte Art':{title:'Latte Art Pitchers & Milk Jugs Europe',description:'Shop latte art milk pitchers and barista milk jugs in Europe for precise pouring, steaming and professional café service.',intro:'Choose milk pitchers designed for controlled steaming and precise latte art pours. Compare sizes, spout shapes and finishes for café service or home espresso setups.',keywords:['latte art pitcher Europe','milk pitcher Europe','barista milk jug','latte art tools Europe','coffee milk jug']},
 Drinkware:{title:'Specialty Coffee Cups, Mugs & Drinkware Europe',description:'Shop specialty coffee cups, cappuccino cups, latte cups, mugs and travel drinkware in Europe for home brewers and cafés.',intro:'Serve specialty coffee in drinkware made for espresso, cappuccino, latte and takeaway use. Browse cups, saucers, mugs and insulated travel drinkware for home and professional service.',keywords:['coffee cups Europe','cappuccino cups Europe','latte cups Europe','specialty coffee mugs','barista drinkware']},
 Cleaning:{title:'Coffee Machine & Grinder Cleaning Products Europe',description:'Shop coffee grinder cleaners, microfiber cloths and barista cleaning accessories in Europe for daily café and home coffee equipment care.',intro:'Keep grinders, espresso stations and brewing equipment clean with purpose-built coffee cleaning products and barista cloths for daily maintenance.',keywords:['coffee grinder cleaner Europe','barista cleaning products','coffee machine cleaning accessories','cafe cleaning tools','grinder cleaner']},
 Lab:{title:'Coffee Cupping & Sensory Tools Europe',description:'Shop coffee cupping bowls and sensory evaluation tools in Europe for roasters, cafés, coffee labs and home cupping.',intro:'Evaluate coffee consistently with cupping and sensory tools used for quality control, coffee education and comparative tasting.',keywords:['coffee cupping tools Europe','cupping bowls Europe','coffee sensory tools','coffee lab equipment','coffee tasting equipment']}
};

export function productKeywords(p:CatalogProduct){
 const brand=brandFor(p);return [
  `buy ${p.name} Europe`,`${p.name} Europe`,`${p.name} online`,`${brand} coffee equipment Europe`,
  `${p.category.toLowerCase()} equipment Europe`,'specialty coffee equipment Europe','barista tools Europe'
 ]
}

export function productMetaDescription(p:CatalogProduct){
 const brand=brandFor(p);return `Buy ${p.name} in Europe. ${p.description}. ${brand} specialty coffee equipment for home brewers and cafés from BREW / OBJECTS.`
}

export function brandDescription(brand:string){return `Shop ${brand} specialty coffee equipment and barista tools in Europe. Compare selected ${brand} brewing gear, accessories and café equipment at BREW / OBJECTS.`}
