import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const failures=[];
const files=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){if(['.captures','.git','dist','node_modules','tools'].includes(entry.name)||entry.name.includes('$'))continue;const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else files.push(file);}}
await walk(root);
const htmls=files.filter(file=>file.endsWith('.html'));
for(const file of htmls){
  const html=await fs.readFile(file,'utf8');
  if(!html.includes('/local-runtime.js'))failures.push(`${path.relative(root,file)}: missing static compatibility`);
  for(const match of html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g)){
    const value=match[1].replaceAll('&amp;','&');
    if(!value.startsWith('/')||value.startsWith('//')||value.startsWith('/_vercel/'))continue;
    const filename=path.join(root,decodeURIComponent(value.split(/[?#]/)[0]));
    try{const stat=await fs.stat(filename);if(stat.isDirectory())await fs.access(path.join(filename,'index.html'));}catch{failures.push(`${path.relative(root,file)}: missing ${value}`);}
  }
}
for(const file of files.filter(f=>f.endsWith('.js')&&f.includes('_next'))){
  const source=await fs.readFile(file,'utf8');
  for(const match of source.matchAll(/["'](\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|svg|mp4|woff2))["']/g))try{await fs.access(path.join(root,match[1]));}catch{failures.push(`${path.basename(file)}: missing ${match[1]}`);}
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log(`Verified ${htmls.length} pages and literal runtime asset references.`);
