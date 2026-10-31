import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const map=JSON.parse(await fs.readFile('E:/ria/domani-asset-map.json','utf8'));
const response=await fetch('https://www.domani.in/products.json');
const catalog=await response.json();
await fs.mkdir(path.join(root,'domani/assets'),{recursive:true});
await fs.writeFile(path.join(root,'domani/catalog.json'),JSON.stringify(catalog,null,2));
const sources=new Set();
function collect(value){if(typeof value==='string'&&/^https?:.*\/cdn\/.*\.(jpg|jpeg|png|webp|svg|mp4)(\?|$)/i.test(value))sources.add(value.replace(/^http:/,'https:'));else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);}
collect(map);collect(catalog);
const live=await fs.readFile(path.join(root,'.captures/domani-live.html'),'utf8');
for(const m of live.matchAll(/(?:https:)?\/\/www\.domani\.in\/cdn\/shop\/(?:files|videos)\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp|svg|mp4)(?:\?[^"'<>\s]*)?/gi)){
  const u=new URL(m[0].startsWith('//')?'https:'+m[0]:m[0].replaceAll('&amp;','&'));
  for(const key of ['width','height','crop'])u.searchParams.delete(key);
  sources.add(u.href.replaceAll('&amp;','&'));
}
const inventory=[];
const failures=[];
const pending=[...sources];
for(let i=0;i<pending.length;i+=6)await Promise.all(pending.slice(i,i+6).map(async url=>{
  try{const response=await fetch(url);if(!response.ok)throw Error(String(response.status));const buffer=Buffer.from(await response.arrayBuffer());const filename=decodeURIComponent(new URL(url).pathname.split('/').at(-1));await fs.writeFile(path.join(root,'domani/assets',filename),buffer);inventory.push({url,path:'/domani/assets/'+filename,bytes:buffer.length});}catch(e){failures.push({url,error:e.message});}
}));
await fs.writeFile(path.join(root,'domani/asset-index.json'),JSON.stringify({inventory,failures},null,2));
console.log({products:catalog.products.length,assets:inventory.length,failures});
