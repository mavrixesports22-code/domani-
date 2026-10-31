import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://gracefashion.ai';
const capture = path.join(root, '.captures');
await fs.mkdir(path.join(capture, 'previous'), {recursive:true});
const routes = ['','features','team','faq','book','imprint','dataprivacy','blog',...(await fs.readdir(path.join(root,'blog'),{withFileTypes:true})).filter(x=>x.isDirectory()&&!x.name.includes('$')).map(x=>'blog/'+x.name)];
const queue = new Set(['/video.mp4']);
const done = new Set();
const failures = [];
const inventory = [];
function discover(text, base='/') {
  for (const match of text.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g)) {
    const value = match[1].replaceAll('&amp;','&');
    if (!/\.(js|css|woff2?|webp|png|jpe?g|svg|mp4|ico)(?:\?|$)/i.test(value)) continue;
    const url = new URL(value, origin+base);
    if(url.origin===origin) queue.add(url.pathname);
  }
  for(const match of text.matchAll(/(?:\/?_next\/)?static\/(?:immutable\/)?(?:chunks|media)\/[a-zA-Z0-9_./-]+\.(?:js|css|woff2?)/g)) {
    let value = match[0];
    if(!value.startsWith('/_next/')) value='/_next/'+value.replace(/^\/?_next\//,'');
    queue.add(value);
  }
  for(const match of text.matchAll(/["'](\/(?:shots|models|logos|favicon|gallery)\/[^"'\s<>]+\.(?:webp|png|jpe?g|svg|mp4|ico))["']/g)) queue.add(match[1]);
  for(const match of text.matchAll(/["'](\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|svg|mp4|ico))["']/g)) queue.add(match[1]);
}
for(const route of routes) {
  const response=await fetch(origin+'/'+route);
  if(!response.ok) throw Error('Page '+route+' '+response.status);
  const html=await response.text();
  const dest=path.join(root,route,'index.html');
  await fs.mkdir(path.dirname(dest),{recursive:true});
  try {await fs.copyFile(dest,path.join(capture,'previous',(route||'home').replaceAll('/','--')+'.html'));}catch{}
  await fs.writeFile(dest,html);
  await fs.writeFile(path.join(capture,(route||'home').replaceAll('/','--')+'.source.html'),html);
  discover(html,'/'+route);
}
const extra=JSON.parse(await fs.readFile(path.join(capture,'network-assets.json'),'utf8').catch(()=>'[]'));
extra.forEach(url=>queue.add(new URL(url).pathname));
while([...queue].some(x=>!done.has(x))) {
  const batch=[...queue].filter(x=>!done.has(x)).slice(0,8);
  await Promise.all(batch.map(async resource=>{
    done.add(resource);
    try {
      const response=await fetch(origin+resource);
      if(!response.ok) {failures.push({resource,status:response.status});return;}
      const bytes=Buffer.from(await response.arrayBuffer());
      const dest=path.join(root,resource.replace(/^\//,''));
      if(!dest.startsWith(root+path.sep)) throw Error('Invalid resource');
      await fs.mkdir(path.dirname(dest),{recursive:true});
      await fs.writeFile(dest,bytes);
      inventory.push({resource,bytes:bytes.length});
      if(/\.(js|css)$/.test(resource)) discover(bytes.toString('utf8'),resource);
    }catch(error){failures.push({resource,error:error.message});}
  }));
}
await fs.writeFile(path.join(capture,'asset-inventory.json'),JSON.stringify({routes,inventory,failures},null,2));
console.log(JSON.stringify({pages:routes.length,assets:inventory.length,bytes:inventory.reduce((n,x)=>n+x.bytes,0),failures}));
