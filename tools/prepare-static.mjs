import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(await fs.readFile(path.join(root,'.captures/asset-inventory.json'),'utf8'));
for(const route of manifest.routes) {
  const file=path.join(root,route,'index.html');
  let html=await fs.readFile(file,'utf8');
  if(!html.includes('local-runtime.js')) html=html.replace('<head>','<head><meta http-equiv="Content-Security-Policy" content="script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' blob:; object-src \'none\'"><link rel="stylesheet" href="/local-runtime.css"><script src="/local-runtime.js"></script>');
  // Keep the inline RSC and HTML copies consistent while disabling foreign analytics.
  html=html.replaceAll("'unsafe-eval' blob:","'unsafe-eval' blob: data:").replaceAll('https://www.googletagmanager.com/gtm.js','data:text/javascript,//disabled#').replaceAll('https://www.googletagmanager.com/ns.html','about:blank#');
  html=html.replace(/\/_next\/image\?url=([^&"\\\s<]+)(?:(?:&amp;|&)[^"\\\s<>]*)?/g,(_,src)=>decodeURIComponent(src));
  await fs.writeFile(file,html);
}
const booking=path.join(root,'_next/static/immutable/chunks/3feegrw23s8f2.js');
let js=await fs.readFile(booking,'utf8');
if(!js.includes('preview_only:')) js=js.replace('D={slot_taken:', 'D={preview_only:"This is a preview. No appointment was created. Use the live calendar link to book a demo.",slot_taken:');
await fs.writeFile(booking,js);
for(const name of await fs.readdir(path.join(root,'_next/static/immutable/chunks'))){
  if(!name.endsWith('.js'))continue;
  const file=path.join(root,'_next/static/immutable/chunks',name);
  const source=await fs.readFile(file,'utf8');
  const needle='return`${e.path}?url=${encodeURIComponent(t)}';
  if(source.includes(needle)&&!source.includes('return t;'+needle))await fs.writeFile(file,source.replaceAll(needle,'return t;'+needle));
}
console.log('Static navigation, local consent and booking preview prepared.');
