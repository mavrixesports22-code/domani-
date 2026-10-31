import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import svgpath from 'svgpath';
const root=path.resolve(import.meta.dirname,'..');
const baseline='57c403e3f27cc2c8e8e3900c5a07eae4a57f95b5';
const original=file=>execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,maxBuffer:12e6}).toString();
const home=original('index.html');
const catalog=JSON.parse(await fs.readFile(path.join(root,'domani/catalog.json'),'utf8'));
const source=JSON.parse(await fs.readFile(path.join(root,'.captures/domani-research.json'),'utf8'));
const articles=JSON.parse(await fs.readFile(path.join(root,'tools/domani-articles.json'),'utf8'));
const copy=Object.assign({},...await Promise.all(['home','features','secondary','legal'].map(async part=>JSON.parse(await fs.readFile(path.join(root,`tools/domani-copy-${part}.json`),'utf8')))));
Object.assign(copy,{
 'Product':'Collection','Blog':'Journal','Team':'Our story','Book a demo':'Explore DOMANI','Book a Demo':'Explore DOMANI',
 'a product by':'tomorrow, worn today','aiworx':'DOMANI','grace ai':'DOMANI','grace. editorial':'DOMANI','grace. ai studio':'DOMANI parfum house',
 'a product by ':'by ',
 'EU':'you',
 ', Officer Onlineshop & Operations, Carl Gross & Club of Gents, Création Gross GmbH & Co. KG':', ALBORI, Really nice for evenings',
 ' Maximilian Glas':' Five signature parfums',' Regensburg':' 25% perfume oil',
 'AI fashion photography guides and comparisons | grace ai':'Fragrance notes & stories | DOMANI',
 'Exploring the intersection of artificial intelligence and fashion, from creative direction to production at scale.':'Explore the notes, rituals and stories behind the five DOMANI signature parfums.',
 'Book a demo and see what grace. can do for your brand.':'Discover ALBORI, AZZURO, INIZIO, OBSIDIAN and VELORA. Tomorrow remembers you.',
 'Book a demo of the AI fashion studio | grace ai':'Explore DOMANI | Panther Collection',
 'Shopify':'ALBORI','Shopware':'AZZURO','Magento':'INIZIO','Akeneo':'VELORA','Cloudinary':'OBSIDIAN','Bynder':'PANTHER',
 'All':'All','Industry':'Collection','Technology':'Parfum','Creative':'Ritual','Insights':'Guide','Tips':'House Notes','Comparisons':'Orders',
 'Read article':'Read story','Back to Blog':'Back to Journal','Latest insights':'Fragrance notes',
 'Max Glas':'DOMANI','30 minutes on Google Meet. Bring a product shot and watch it go through the studio on the call.':'Five unisex parfums. Discover your signature with the Panther Discovery Set.',
 '30 min · Google Meet':'5 × 2 ml · Parfum',
 'No cameras were involved. We hope that’s enough for ':'Five unisex parfums. A signature for ',
 'What we write about':'Notes from the house',
 'grace ai fashion studio':'DOMANI parfum house','grace fashion':'DOMANI parfums',
 'https://aiworx.ai':'https://www.domani.in/',
 'https://www.instagram.com/graceaifashionstudio/':'https://www.instagram.com/domani.perfume/'
});
const productImages=['ALBORIBOTTLE.jpg','AZZUROBOTTLE.jpg','INIZIOBOTTLE.jpg','OBSIDIANBOTTLE.jpg','VELORABOTTLE.jpg'];
productImages[0]='ALBORI_BOTTLE.jpg';
const A=name=>'/domani/assets/'+name;
const red='DOMANI_ColourRoom_Obsidian_Desktop_2560x1440_ce77968f-f690-4095-83f6-d14808026352.jpg';
const redMobile='DOMANI_ColourRoom_Obsidian_Mobile_1440x1800_e1c32f01-17f6-485c-9ae3-f7b6b969823a.jpg';
const tomorrow='DOMANI_Tomorrow_Desktop_2560x1440_7892f6ed-1beb-498b-a3e4-df4bd5a61b87.jpg';
const albori='Creative02_Albori.jpg',azzuro='DOMANI_Azzuro_Botanical_Square_2048.jpg',obsidian='DOMANI_Obsidian_Leather_Square_1024.jpg';
const assets={
 '/ai-fashion-editorial-metallic-jacket.webp':A('obsidian-cinematic-hero.png'),'/video.mp4':'/domani/motion/hero.mp4',
 '/women-senseful.webp':A(tomorrow),'/women-senseful-hd.webp':A(tomorrow),'/footer.webp':A(red),'/og-image.jpg':A(red),
 '/stunning-campaigns.webp':A(albori),'/lookbooks.webp':A(azzuro),'/product-shots.webp':A(obsidian),
 '/garment-details.jpg':A('OBSIDIANBOTTLE.jpg'),'/garment-silk.jpg':A('DOMANI_Obsidian_Wood_Shopify.jpg'),
 '/product1.png':A('ALBORI_BOTTLE.jpg'),'/product2.png':A('OBSIDIANBOTTLE.jpg'),'/product3.png':A('VELORABOTTLE.jpg'),
 '/product-to-model.webp':A('ALBORIBOXANDBOTTLE.jpg'),'/mannequin-to-model-3.webp':A('OBSIDIANBOXANDBOTTLE.jpg'),
 '/edit-image-1.webp':A('VELORABOTTLE.jpg'),'/edit-image-2.webp':A(tomorrow),
 '/ai-fashion-on-model-denim-mirror-room.webp':A('OBSIDIANBOXANDBOTTLE.jpg'),
 '/gallery/studio-jacket.jpg':A(albori),'/gallery/flatlay-outfit.jpg':A(azzuro),
 '/sealed-figure.jpg':A('DOMANI_Obsidian_Wood_Shopify.jpg'),'/sealed-lock.webp':A('OBSIDIANBOX.jpg'),
 '/billboard.png':A(red),'/g-mark.png':'/domani/marks/monogram.svg','/logo.svg':'/domani/assets/wordmark.svg',
 '/team/max.jpg':'/domani/marks/monogram.svg',
 '/shots/stage-blue-suit-85mm.jpg':A('obsidian-cinematic-hero.png'),'/shots/stage-blue-suit-85mm-phone.jpg':A(redMobile),
 '/shots/stage-blue-suit-crouching.jpg':A(red),'/shots/stage-blue-suit-crouching-phone.jpg':A(redMobile),
 '/shots/stage-blue-suit-leaning.jpg':A('DOMANI_Obsidian_Wood_Shopify.jpg'),'/shots/stage-blue-suit-leaning-phone.jpg':A('OBSIDIANBOXANDBOTTLE.jpg'),
 '/shots/blue-suit-packshot.jpg':A('OBSIDIANBOTTLE.jpg'),'/shots/model-avatar-blue-suit.jpg':A('OBSIDIANBOX.jpg'),
 '/shots/blue-suit-motion.mp4':'/domani/motion/obsidian.mp4','/shots/blue-suit-motion-poster.jpg':A(redMobile),
 '/shots/fisheye-motion.mp4':'/domani/motion/discovery.mp4','/shots/fisheye-motion-poster.jpg':A('DOMANI_Discovery_Set_Square_2048.jpg'),
 '/shots/elevator-garden-motion.mp4':'/domani/motion/tomorrow.mp4','/shots/elevator-motion-poster.jpg':A(tomorrow),
 '/shots/on-model-blue-suit.webp':A('ALBORIBOXANDBOTTLE.jpg'),'/shots/detail-blue-suit-lapel.webp':A('AZZUROBOXANDBOTTLE.jpg'),
 '/shots/flatlay-blue-suit-chair.webp':A('INIZIOBOXANDBOTTLE.jpg'),'/shots/phantom-blue-suit.webp':A('VELORABOXANDBOTTLE.jpg'),
 '/shots/trench-walk.jpg':A(albori),'/shots/trench-scene.jpg':A('Creative_Shopify_1c5dbb5d-f96b-4c2a-852b-d153518ca8a8.jpg'),
 '/shots/trench-crouch.jpg':A(tomorrow),'/shots/trench-front.jpg':A(azzuro),'/shots/trench-back.jpg':A(obsidian),
 '/shots/trench-bag.jpg':A('DOMANI_Discovery_Set_Square_2048.jpg'),'/shots/trench-packshot.jpg':A('OBSIDIANBOTTLE.jpg'),
 '/shots/shot-2.jpg':A('INIZIOBOXANDBOTTLE.jpg'),'/shots/shot-3.jpg':A('VELORABOXANDBOTTLE.jpg')
};
const modelOrder={'amira':'ALBORI_BOTTLE.jpg','jonathan':'AZZUROBOTTLE.jpg','susanne':'INIZIOBOTTLE.jpg','timmi':'OBSIDIANBOTTLE.jpg','suna':'VELORABOTTLE.jpg','gundel':'ALBORI_BOTTLE.jpg','steve':'AZZUROBOTTLE.jpg','kai':'INIZIOBOTTLE.jpg','rafaela':'OBSIDIANBOTTLE.jpg','timmothy':'VELORABOTTLE.jpg','nathalie':'ALBORI_BOTTLE.jpg','chung':'AZZUROBOTTLE.jpg','harry':'INIZIOBOTTLE.jpg','lisa':'VELORABOTTLE.jpg'};
const tracked=execFileSync('git',['ls-tree','-r','--name-only',baseline],{cwd:root}).toString().trim().split('\n');
for(const file of tracked.filter(f=>f.startsWith('models/'))){const name=path.basename(file).split(/[.-]/)[0];assets['/'+file]=A(modelOrder[name]||'OBSIDIANBOTTLE.jpg');}
await fs.mkdir(path.join(root,'domani/marks'),{recursive:true});
for(const name of ['ALBORI','AZZURO','INIZIO','OBSIDIAN','VELORA','PANTHER'])await fs.writeFile(path.join(root,'domani/marks',name.toLowerCase()+'.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80"><text x="130" y="53" text-anchor="middle" font-family="Georgia,serif" font-size="30" letter-spacing="4" fill="currentColor">${name}</text></svg>`);
let logoIndex=0;
for(const file of tracked.filter(f=>f.startsWith('logos/')&&/\.(png|svg)$/.test(f)))assets['/'+file]='/domani/marks/'+['albori','azzuro','inizio','obsidian','velora','panther'][logoIndex++%6]+'.svg';
Object.assign(assets,{'/logos/carl-gross.svg':'/domani/marks/albori.svg','/logos/club-of-gents.svg':'/domani/marks/obsidian.svg','/logos/mustang.svg':'/domani/marks/inizio.svg','/logos/nova-studios.svg':'/domani/marks/velora.svg','/logos/marc-aurel.svg':'/domani/marks/azzuro.svg','/logos/falke.svg':'/domani/marks/panther.svg'});
for(const icon of ['favicon.ico','favicon-32x32.png','favicon-16x16.png','apple-touch-icon.png'])assets['/favicon/'+icon]='/domani/marks/monogram.svg';
const brandSVG=home.match(/<svg\b[^>]*viewBox="0 0 1160 320"[^>]*>[\s\S]*?<\/svg>/)[0];
const oldPaths=[...brandSVG.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map(m=>m[1]);
const official=await fs.readFile(path.join(root,'domani/assets/wordmark.svg'),'utf8');
const newPath=svgpath([...official.matchAll(/\bd="([^"]+)"/g)].map(m=>m[1]).join(' ')).matrix([0.9666667,0,0,0.9666667,-386.6667,-806.6667]).round(4).toString();
const logoMatrix='matrix(0.9666667 0 0 0.9666667 -386.6667 -806.6667)';
const monogram=await fs.readFile(path.join(root,'domani/assets/Copy_of_Domani_Black4.svg'),'utf8');
await fs.writeFile(path.join(root,'domani/marks/monogram.svg'),monogram.replace('viewBox="0 0 2000 2000"','viewBox="740 780 520 440"'));
const oldDoor=home.match(/<svg\b[^>]*viewBox="0 0 364 232"[^>]*>[\s\S]*?<\/svg>/)?.[0];
const doorPath=oldDoor?.match(/\bd="([^"]+)"/)?.[1];
const monoPath=svgpath(monogram.match(/\bd="([^"]+)"/)[1]).matrix([0.48,0,0,0.48,-298,-364]).round(4).toString();
const doorMatrix='matrix(0.48 0 0 0.48 -298 -364)';
const pathData=new Map(oldPaths.map((p,i)=>[p,i?'':newPath]));
if(doorPath)pathData.set(doorPath,'M-8 -1600H372V1832H-8Z '+monoPath+'  ');
const assetEntries=Object.entries(assets).sort((a,b)=>b[0].length-a[0].length);
const htmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function text(value){
 if(copy[value]!==undefined)return copy[value];
 if(assets[value])return assets[value];
 if(pathData.has(value))return pathData.get(value);
 for(const [old,replacement] of assetEntries)if(value.startsWith(old+'?')||value.startsWith('https://gracefashion.ai'+old))return value.replace(old,replacement).replace('https://gracefashion.ai','');
 for(const [old,replacement]of assetEntries)if(value.includes(old))value=value.replaceAll(old,replacement);
 for(const [old,replacement]of Object.entries(copy))if(old.length>20&&value.includes(old))value=value.replaceAll(old,replacement);
 if(value.includes('https://gracefashion.ai'))value=value.replaceAll('https://gracefashion.ai','https://www.domani.in');
 if(value.includes('grace ai'))value=value.replaceAll('grace ai','DOMANI');
 return value;
}
function object(value,articleBody){
 if(typeof value==='string')return text(value);
 if(Array.isArray(value))return value.map(v=>object(v,articleBody));
 if(value&&typeof value==='object'){
   const out={};
   for(const [key,v]of Object.entries(value))out[key]=key==='__html'?embedded(v,articleBody):object(v,articleBody);
   const article=typeof value.slug==='string'?articleList.find(a=>a.slug===value.slug):null;
   if(article){if('image'in out)out.image=article.image;if('excerpt'in out)out.excerpt=article.description;if('category'in out)out.category=article.category;}
   return out;
 }
 return value;
}
function embedded(value,articleBody){
 if(value.trim().startsWith('{'))try{return JSON.stringify(object(JSON.parse(value),articleBody));}catch{}
 return value.startsWith('<')?markup(value,articleBody):text(value);
}
function js(source){
 let result=source.replace(/"(?:\\.|[^"\\])*"/g,token=>{try{return JSON.stringify(text(JSON.parse(token)));}catch{return token;}})
 ;
 // All three old glyph parts share this module. Replace the complete mark asset,
 // keeping its clip-path, animated imagery and zoom timeline intact.
 const module=result.indexOf('19184,64718,e=>{');
 if(module>=0){const start=result.indexOf('let o=',module),end=result.indexOf(',u=()=>',start);if(start>=0&&end>start)result=result.slice(0,start)+'let o='+JSON.stringify(monoPath)+',c="",d=""'+result.slice(end);}
 result=result.replaceAll('{name:"Dark in a good way",src:"/domani/marks/panther.svg"','{name:"PANTHER DISCOVERY SET",src:"/domani/marks/panther.svg"');
 return result;
}
function markup(html,articleBody){
 if(articleBody&&html.startsWith('<p>')&&html.length>300)return articleBody;
 let result=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[^]*?-->|<[^>]+>|[^<]+/g,token=>{
   if(token.startsWith('<script')){
     if(token.includes('application/ld+json'))return token.replace(/(>)([\s\S]*)(<\/script>)/,(_,a,b,c)=>a+embedded(b,articleBody)+c);
     return token;
   }
   if(token.startsWith('<style')||token.startsWith('<!--'))return token;
   if(token.startsWith('<'))return token.replace(/\b(src|srcSet|href|poster|alt|title|content|aria-label|d|style)="([^"]*)"/g,(all,attr,value)=>{
     const decoded=value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
     let next=text(decoded);
     if(attr==='srcSet')for(const [a,b]of assetEntries)next=next.replaceAll(a,b);
     let tail='';
     return attr+'="'+htmlEscape(next)+'"'+tail;
   });
   const decoded=token.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'");
   return htmlEscape(text(decoded));
 });
 // Rebuild only the two text lines split into animated word spans.
 for(const [oldPhrase,newPhrase]of [['You decide what the world','Tomorrow remembers you.'],['should see & wear.','Wear it your way.']]){
   result=result.replace(/<span class="block">((?:<span class="inline-block"[^>]*>[^<]*<\/span>\s*)+)<\/span>/g,(all,inside)=>{
     const plain=inside.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').trim();if(plain!==oldPhrase)return all;
     const template=inside.match(/<span class="inline-block"[^>]*>/)[0];return '<span class="block">'+newPhrase.split(' ').map(w=>template+htmlEscape(w)+'</span>').join(' ')+(inside.endsWith(' ')?' ':'')+'</span>';
   });
 }
 result=result.replace(/(<p class="headline-large text-black text-center min-h-\[2\.6em\] md:min-h-\[1\.3em\]">)([\s\S]*?)(<\/p>)/g,(_,open,inside,close)=>{
   const label=inside.match(/<span class="sr-only">([^<]+)<\/span>/)?.[1];
   const caret=inside.match(/<span class="roster-caret[^>]*><\/span>/)?.[0]||'';
   if(!label)return open+inside+close;
   return open+'<span class="sr-only">'+label+'</span>'+[...label].map((char,index)=>'<span aria-hidden="true" class="relative invisible">'+char+(index===0?caret:'')+'</span>').join('')+close;
 });
 return result;
}
function flight(stream,articleBody){
 const buf=Buffer.from(stream);let pos=0,result='';
 while(pos<buf.length){
   const colon=buf.indexOf(58,pos);if(colon<0){result+=buf.subarray(pos).toString();break;}
   const prefix=buf.subarray(pos,colon+1).toString();pos=colon+1;
   if(buf[pos]===84){
     const comma=buf.indexOf(44,pos),hex=buf.subarray(pos+1,comma).toString();
     if(/^[\da-f]+$/.test(hex)){
       const end=comma+1+parseInt(hex,16);const old=buf.subarray(comma+1,end).toString();
       const next=embedded(old,articleBody);result+=prefix+'T'+Buffer.byteLength(next).toString(16)+','+next;pos=end;
       if(buf[pos]===10){result+='\n';pos++;}continue;
     }
   }
   let end=buf.indexOf(10,pos);if(end<0)end=buf.length;
   const payload=buf.subarray(pos,end).toString();let next=payload;
   try{next=JSON.stringify(object(JSON.parse(payload),articleBody));}catch{if(payload.startsWith('I'))try{next='I'+JSON.stringify(object(JSON.parse(payload.slice(1)),articleBody));}catch{}else if(payload.startsWith('HL'))try{next='HL'+JSON.stringify(object(JSON.parse(payload.slice(2)),articleBody));}catch{}}
   result+=prefix+next+(end<buf.length?'\n':'');pos=end+1;
 }
 return result;
}
const articleList=Array.isArray(articles)?articles:Object.entries(articles).map(([slug,value])=>({slug,...value}));
for(const article of articleList){
 if(article.oldTitle)copy[article.oldTitle]=article.title;
 if(article.oldDescription)copy[article.oldDescription]=article.description;
 const oldTitle=original(`blog/${article.slug}/index.html`).match(/<title>([\s\S]*?)<\/title>/)?.[1];
 if(oldTitle)copy[oldTitle.replaceAll('&amp;','&')]=article.title+' | DOMANI';
}
const htmlFiles=tracked.filter(f=>f.endsWith('.html')&&!f.includes('${'));
for(const file of htmlFiles){
 let html=original(file);
 const spec=articleList.find(a=>file===`blog/${a.slug}/index.html`);
 const chunks=[];
 html=html.replace(/<script>self\.__next_f\.push\((\[.*?\])\)<\/script>/gs,(all,json)=>{try{const item=JSON.parse(json);if(item[0]===1){chunks.push(item[1]);return '';}}catch{}return all;});
 html=markup(html);
 // Original statistic text nodes only; animation percentages are untouched.
 if(file==='index.html')html=html.replace(/(>)(80%|100%|3 min)(<\/p>)/g,(_,a,v,c)=>a+({'80%':'25%','100%':'8–10h','3 min':'50 ml'}[v])+c);
 if(spec){
   html=html.replace(/(<div class="blog-content"[^>]*>)[\s\S]*?(<\/div>)/,(_,open,close)=>open+spec.bodyHtml+close);
 }
 for(const a of articleList)html=html.replace(/<img\b[^>]*>/g,tag=>tag.includes('alt="'+htmlEscape(a.title)+'"')?tag.replace(/src="[^"]*"/,'src="'+a.image+'"'):tag);
 html=html.replace(/(<img[^>]*src="\/domani\/marks\/panther\.svg"[^>]*alt=")[^"]*"/g,'$1PANTHER DISCOVERY SET"');
 if(chunks.length){let stream=flight(chunks.join(''),spec?.bodyHtml);html=html.replace('</body>','<script>self.__next_f.push('+JSON.stringify([1,stream]).replaceAll('<','\\u003c')+')</script></body>');}
 await fs.writeFile(path.join(root,file),html);
}
const jsFiles=tracked.filter(f=>f.startsWith('_next/')&&f.endsWith('.js'));
for(const file of jsFiles){
 let body=original(file);
 if(!/0k46l0|3lw43|2ejcwl|turbopack|0c0hxo|3douyl/.test(file))body=js(body);
 body=body.replaceAll('{value:"80%",label:"perfume oil"},{value:"100%",label:"wear varies by skin"},{value:"3 min",label:"full-size parfum"}','{value:"25%",label:"perfume oil"},{value:"8–10h",label:"wear varies by skin"},{value:"50 ml",label:"full-size parfum"}');
 await fs.writeFile(path.join(root,file),body);
}
await fs.writeFile(path.join(root,'domani/content-map.json'),JSON.stringify({source:'https://www.domani.in/',baseline,copy,assets,generatedAssets:[{path:A('obsidian-cinematic-hero.png'),purpose:'Missing cinematic hero composition; bottle identity referenced from official Obsidian photo.',tool:'built-in image_gen'}]},null,2));
console.log(`Applied DOMANI content to ${htmlFiles.length} pages. Retained original layout, styles and interaction code.`);
