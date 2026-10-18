import { build } from 'esbuild';
import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
const names = ['expandable-card','folder-fan','source-stack','focus-lanes','continuous-tabs','image-viewport','voice-player','selection-toolbar','page-book','source-tray'];
const root = { $schema:'https://ui.shadcn.com/schema/registry.json', name:'roc', homepage:'https://github.com/SonghaiFan/roc-ui', items:[] };
await mkdir('public/r',{recursive:true});
await mkdir('public/source',{recursive:true});
for (const name of names) {
  const files = [], seen = new Set();
  async function collect(file) {
    if(seen.has(file)) return; seen.add(file); files.push(file);
    const content=await readFile(`registry/roc/${file}`,'utf8');
    if(file.endsWith('.js')) { try { await readFile(`registry/roc/${file.replace(/\.js$/,'.d.ts')}`); await collect(file.replace(/\.js$/,'.d.ts')); } catch {} }
    for(const match of content.matchAll(/(?:from\s*|import\s*)["']\.\/([^"']+)["']/g)) {
      let target=match[1];
      if(!/\.(?:css|js|ts|tsx)$/.test(target)) { for(const ext of ['.ts','.tsx','.js']) { try { await readFile(`registry/roc/${target+ext}`); target+=ext; break; } catch {} } }
      await collect(target);
    }
  }
  await collect(`${name}.tsx`);
  await collect('SOURCE-LICENSE.txt');
  const item = { $schema:'https://ui.shadcn.com/schema/registry-item.json', name, type:'registry:component', title:name.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '), description:'ROC: retained identity and coherent layout changes.', dependencies:['react'], files:[] };
  for (const file of files) {
    const path=`registry/roc/${file}`;
    const content=await readFile(path,'utf8');
    item.files.push({path,type:'registry:file',target:`~/components/roc/${file}`,content});
    await writeFile(`public/source/${file}`,content);
  }
  await writeFile(`public/r/${name}.json`,JSON.stringify(item,null,2)+'\n');
  root.items.push({...item,files:item.files.map(({content,...file})=>file)});
}
await writeFile('registry.json',JSON.stringify(root,null,2)+'\n');
await rm('dist',{recursive:true,force:true}); await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,format:'esm',outdir:'dist/assets',target:'es2022',define:{'process.env.NODE_ENV':'"production"'}});
await writeFile('dist/index.html',`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="ROC — a design space for reusable interfaces that preserve object identity. Interactive React components, source code, and continuity contracts."><meta name="theme-color" content="#fafbf8"><title>ROC — Objects, in continuity</title><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./assets/main.css"></head><body><div id="root"></div><script type="module" src="./assets/main.js"></script></body></html>`);
console.log(`Built gallery + ${names.length} registry items.`);

await rm('docs',{recursive:true,force:true}); await cp('dist','docs',{recursive:true}); await writeFile('docs/.nojekyll','');
