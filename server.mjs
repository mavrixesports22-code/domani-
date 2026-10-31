import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname);
const port=Number(process.env.PORT||4187);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(filename!==root&&!filename.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    let stat=await fs.stat(filename);
    if(stat.isDirectory()){filename=path.join(filename,'index.html');stat=await fs.stat(filename);}
    const bytes=await fs.readFile(filename);
    const headers={'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]);const end=Math.min(range[2]?Number(range[2]):stat.size-1,stat.size-1);if(start>end){res.writeHead(416);res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});res.end(bytes.subarray(start,end+1));return;}
    res.writeHead(200,{...headers,'Content-Length':stat.size});res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
