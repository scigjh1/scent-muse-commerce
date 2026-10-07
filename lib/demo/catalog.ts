import { cookies } from 'next/headers';
import type { Product, Cart, Collection, Menu, Page } from '../shopify/types';
const date = '2026-10-07T00:00:00Z';
const image = (photo: string) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1400&q=85`;
const samples = [
  ['rose-atelier','玫瑰序曲 · Rose Atelier','680','floral','photo-1541643600914-78b084683601','玫瑰 / 黑醋栗 / 白麝香','柔和花香，适合约会与日常。先试香，再选择属于自己的气味。'],
  ['citrus-letter','柑橘来信 · Citrus Letter','420','fresh','photo-1594035910387-fea47794261f','佛手柑 / 橙花 / 雪松','像一封来自地中海的明亮来信，清新轻盈。'],
  ['midnight-wood','午夜森林 · Midnight Wood','880','woody','photo-1615634260167-c8cdede054de','檀香 / 鸢尾 / 琥珀','安静的木质调，适合晚宴与秋冬。'],
  ['soft-musk','肌肤记忆 · Soft Musk','560','floral','photo-1592945403244-b3fbafd7f539','白麝香 / 铃兰 / 香草','贴近肌肤的轻柔气味，适合办公室。'],
  ['sunday-bloom','周日花园 · Sunday Bloom','390','floral','photo-1587017539504-67cfbddac569','牡丹 / 绿叶 / 梨','清新花果香，留住松弛而明亮的周末。'],
  ['amber-note','琥珀手记 · Amber Note','720','woody','photo-1615634260167-c8cdede054de','琥珀 / 雪松 / 豆蔻','温暖而克制的辛香木质调。'],
  ['sea-mist','海岸薄雾 · Sea Mist','480','fresh','photo-1594035910387-fea47794261f','海盐 / 鼠尾草 / 柚子','干净清爽的海盐调，适合出游。'],
  ['discovery-set','气味探索 · Discovery Set','168','discovery','photo-1541643600914-78b084683601','花香 / 木质 / 清新','三支 2ml 概念试香装，低成本发现自己的香气偏好。']
];
export const products: Product[] = samples.map(([handle,title,amount,tag,photo,notes,description],index) => {
  const picture = {url:image(photo!),altText:title!,width:1400,height:1400};
  return {id:`sample-${index}`,handle:handle!,title:title!,description:`${description} 香调：${notes}。本商品为概念展示样例，价格为模拟定价。`,descriptionHtml:`<p>${description}</p><p><strong>香调</strong> ${notes}</p><p>概念展示样例 · 模拟定价 · 不提供真实支付</p>`,availableForSale:true,options:[{id:`option-${index}`,name:'容量',values:['试香 2ml','香水 30ml']}],priceRange:{minVariantPrice:{amount:'29',currencyCode:'CNY'},maxVariantPrice:{amount:amount!,currencyCode:'CNY'}},variants:[{id:`sample-${index}-2`,title:'试香 2ml',availableForSale:true,selectedOptions:[{name:'容量',value:'试香 2ml'}],price:{amount:'29',currencyCode:'CNY'}},{id:`sample-${index}-30`,title:'香水 30ml',availableForSale:true,selectedOptions:[{name:'容量',value:'香水 30ml'}],price:{amount:amount!,currencyCode:'CNY'}}],featuredImage:picture,images:[picture],seo:{title:title!,description:description!},tags:[tag!,notes!],updatedAt:date};
});
export const collections: Collection[] = [['','全部香氛'],['floral','柔和花香'],['woody','温暖木质'],['fresh','清新柑橘'],['discovery','试香礼盒']].map(([handle,title])=>({handle:handle!,title:title!,description:title!,seo:{title:title!,description:title!},updatedAt:date,path:handle?`/search/${handle}`:'/search'}));
export async function getCollections() { return collections; }
export async function getCollection(handle: string) { return collections.find(c=>c.handle===handle); }
export async function getProduct(handle: string) { return products.find(p=>p.handle===handle); }
export async function getProducts({query,reverse,sortKey}: {query?:string;reverse?:boolean;sortKey?:string}={}) {
  let list = [...products].filter(p=>!query||`${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sortKey==='PRICE') list.sort((a,b)=>Number(a.priceRange.maxVariantPrice.amount)-Number(b.priceRange.maxVariantPrice.amount));
  if (sortKey==='TITLE') list.sort((a,b)=>a.title.localeCompare(b.title,'zh'));
  return reverse?list.reverse():list;
}
export async function getCollectionProducts({collection,reverse,sortKey}: {collection:string;reverse?:boolean;sortKey?:string}) { const list = await getProducts({reverse,sortKey}); return collection.startsWith('hidden-')?list:list.filter(p=>p.tags.includes(collection)); }
export async function getProductRecommendations(id: string) { const item=products.find(p=>p.id===id); return products.filter(p=>p.id!==id&&(!item||p.tags[0]===item.tags[0])).slice(0,4); }
export async function getMenu(handle:string): Promise<Menu[]> { return handle.includes('footer')?[{title:'关于试香',path:'/about'},{title:'开源项目',path:'https://github.com/scigjh1/scent-muse-commerce'}]:[{title:'探索香氛',path:'/search'},{title:'风格测评',path:'/quiz'},{title:'试香礼盒',path:'/search/discovery'}]; }
export async function getPage(handle:string): Promise<Page> { return {id:handle,handle,title:'关于 ScentMuse',body:'<p>ScentMuse 是基于 Vercel Commerce 定制的个人美妆与香氛产品 Demo。商品、价格和意向单均为演示内容，不产生真实交易。</p>',bodySummary:'香氛探索与试香',createdAt:date,updatedAt:date}; }
export async function getPages() { return [await getPage('about')]; }
type SavedLine={merchandiseId:string;quantity:number};
function cartFrom(saved:SavedLine[]):Cart {
  const lines=saved.flatMap((line,index)=>{const p=products.find(p=>p.variants.some(v=>v.id===line.merchandiseId));const v=p?.variants.find(v=>v.id===line.merchandiseId);return p&&v?[{id:`line-${line.merchandiseId}`,quantity:line.quantity,cost:{totalAmount:{amount:String(Number(v.price.amount)*line.quantity),currencyCode:'CNY'}},merchandise:{id:v.id,title:v.title,selectedOptions:v.selectedOptions,product:{id:p.id,handle:p.handle,title:p.title,featuredImage:p.featuredImage}}}]:[];});
  const amount=String(lines.reduce((sum,line)=>sum+Number(line.cost.totalAmount.amount),0));
  return {id:'demo-cart',checkoutUrl:'/checkout',lines,totalQuantity:lines.reduce((sum,line)=>sum+line.quantity,0),cost:{subtotalAmount:{amount,currencyCode:'CNY'},totalAmount:{amount,currencyCode:'CNY'},totalTaxAmount:{amount:'0',currencyCode:'CNY'}}};
}
async function read():Promise<SavedLine[]> {try{return JSON.parse((await cookies()).get('scent-cart')?.value||'[]');}catch{return [];}}
async function save(lines:SavedLine[]) { (await cookies()).set('scent-cart',JSON.stringify(lines),{httpOnly:true,sameSite:'lax',path:'/',maxAge:604800});return cartFrom(lines); }
function validate(id:string,q:number) {if(!products.some(p=>p.variants.some(v=>v.id===id))||!Number.isInteger(q)||q<1||q>99)throw new Error('Invalid sample product or quantity');}
export async function createCart() { return save([]); }
export async function getCart() { const jar=await cookies(); return jar.has('scent-cart')?cartFrom(await read()):undefined; }
export async function addToCart(newLines:SavedLine[]) {const lines=await read();for(const line of newLines){validate(line.merchandiseId,line.quantity);const current=lines.find(l=>l.merchandiseId===line.merchandiseId);if(current){validate(line.merchandiseId,current.quantity+line.quantity);current.quantity+=line.quantity;}else{lines.push({...line});}}return save(lines);}
export async function removeFromCart(ids:string[]) {return save((await read()).filter(l=>!ids.includes(`line-${l.merchandiseId}`)));}
export async function updateCart(changes:{id:string;merchandiseId:string;quantity:number}[]) {let lines=await read();for(const change of changes){if(change.quantity===0){lines=lines.filter(l=>`line-${l.merchandiseId}`!==change.id);continue;}validate(change.merchandiseId,change.quantity);const line=lines.find(l=>`line-${l.merchandiseId}`===change.id);if(line)line.quantity=change.quantity;}return save(lines);}
