import Store40 from '../components/Store40';
import EscapeClose from '../components/EscapeClose';
import SeoHomeContent from '../components/SeoHomeContent';
import SeoFooterLinks from '../components/SeoFooterLinks';
import ProductModalUrlSync from '../components/ProductModalUrlSync';
import FilterClearFix from '../components/FilterClearFix';
import CategoryCircleNavigation from '../components/CategoryCircleNavigation';
import HomeHashActions from '../components/HomeHashActions';
import {getCatalog} from '../lib/catalog-repository';

export const dynamic='force-dynamic';

export default async function Page(){const products=await getCatalog();return <><EscapeClose/><ProductModalUrlSync/><FilterClearFix/><CategoryCircleNavigation/><HomeHashActions/><Store40 products={products}/><SeoHomeContent/><SeoFooterLinks products={products}/></>}
