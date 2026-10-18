// Extracted from Syuze; MIT Copyright (c) 2026 Songhai. See SOURCE-LICENSE.txt.
// Dense shelves fan upward from the folder; cards keep their actual dimensions.
export function folderFanLayout(folder,items){
 const layout=new Map(),gap=20,rows=[];
 const remaining=items.map((item,index)=>({item,index})).sort((a,b)=>b.item.width*b.item.height-a.item.width*a.item.height||a.index-b.index).map(v=>v.item);
 const columns=items.length<=5?items.length:Math.ceil(Math.sqrt(items.length*1.6));
 const baseWidth=remaining.slice(0,columns).reduce((sum,i)=>sum+i.width,0)+Math.max(0,columns-1)*gap;
 while(remaining.length){
  const budget=baseWidth*Math.pow(.82,rows.length),row=[];let width=0;
  while(remaining.length){const item=remaining[0],next=width+(row.length?gap:0)+item.width;if(row.length&&next>budget)break;row.push(remaining.shift());width=next;}
  rows.push({items:row,width,height:Math.max(...row.map(i=>i.height))});
 }
 let bottom=folder.y-24;
 for(const row of rows){
  const center=folder.x+folder.width/2,radius=(row.width-(row.items[0].width+row.items.at(-1).width)/2)/2,rise=row.items.length>1?Math.min(12,row.width*.012):0;
  let x=center-row.width/2;
  for(const item of row.items){const t=radius?Math.max(-1,Math.min(1,(x+item.width/2-center)/radius)):0,lift=rise*(1-t*t);layout.set(item.id,{x,y:bottom-item.height-lift,width:item.width,height:item.height,rotation:0});x+=item.width+gap;}
  bottom-=row.height+24+rise;
 }
 return layout;
}
