import './build.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist'), port=Number(process.env.PORT||4186);
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.tsx':'text/plain','.ts':'text/plain'};
createServer(async(req,res)=>{
 try { const url=new URL(req.url,'http://localhost'); const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname)); if(!file.startsWith(root+sep)){res.writeHead(403).end();return;} const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*'}).end(data); }
 catch {res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`ROC gallery: http://127.0.0.1:${port}`));
