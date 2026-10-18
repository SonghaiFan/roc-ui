import './build.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist'), port=Number(process.env.PORT||4186);
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.tsx':'text/plain','.ts':'text/plain','.svg':'image/svg+xml','.wav':'audio/wav'};
createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost'),file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  const data=await readFile(file),headers={'Content-Type':mime[extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*','Accept-Ranges':'bytes'};
  if(req.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   let start=match?.[1]?Number(match[1]):Math.max(0,data.length-Number(match?.[2])),end=match?.[1]&&match[2]?Math.min(Number(match[2]),data.length-1):data.length-1;
   if(!match||!Number.isFinite(start)||start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();return;}
   const chunk=data.subarray(start,end+1);res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':chunk.length});res.end(req.method==='HEAD'?undefined:chunk);return;
  }
  res.writeHead(200,{...headers,'Content-Length':data.length}).end(req.method==='HEAD'?undefined:data);
 } catch {res.writeHead(404).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`ROC gallery: http://127.0.0.1:${port}`));
