import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const registry=JSON.parse(await readFile('registry.json','utf8'));
for (const entry of registry.items) test(`${entry.name}: published payload has complete local imports and matches source`,async()=>{
 const item=JSON.parse(await readFile(`public/r/${entry.name}.json`,'utf8'));
 const targets=new Set(item.files.map(file=>path.basename(file.target)));
 for(const file of item.files){
  assert.equal(file.content,await readFile(file.path,'utf8'));
  for(const match of file.content.matchAll(/(?:from\s*|import\s*)["']\.\/([^"']+)["']/g)){
   const target=match[1];assert.ok(targets.has(target)||targets.has(target+'.ts')||targets.has(target+'.tsx'),`Missing dependency: ${target}`);
  }
 }
});
