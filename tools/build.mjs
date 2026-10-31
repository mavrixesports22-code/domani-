import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
await fs.mkdir(dist,{recursive:true});
const entries=await fs.readdir(root,{withFileTypes:true});
const assetDirectories=new Set(['_next','favicon','gallery','logos','models','shots','team','domani']);
for(const entry of entries){
  if(entry.isFile()&&/\.(webp|png|jpe?g|svg|mp4|ico|webmanifest|css|js|json)$/.test(entry.name)&&!['package.json','vercel.json','clone-ui.js','clone-ui.css','manifest.json'].includes(entry.name)) await fs.copyFile(path.join(root,entry.name),path.join(dist,entry.name));
  if(entry.isDirectory()&&assetDirectories.has(entry.name)) await fs.cp(path.join(root,entry.name),path.join(dist,entry.name),{recursive:true});
}
const routes=['','features','team','faq','book','imprint','dataprivacy','blog'];
const blogs=await fs.readdir(path.join(root,'blog'),{withFileTypes:true});
routes.push(...blogs.filter(x=>x.isDirectory()&&!x.name.includes('$')).map(x=>'blog/'+x.name));
for(const route of routes){await fs.mkdir(path.join(dist,route),{recursive:true});await fs.copyFile(path.join(root,route,'index.html'),path.join(dist,route,'index.html'));}
await fs.mkdir(path.join(dist,'_vercel/insights'),{recursive:true});
await fs.writeFile(path.join(dist,'_vercel/insights/script.js'),'/* Reference analytics disabled in this recreation. */');
console.log(`Built ${routes.length} pages into dist.`);
