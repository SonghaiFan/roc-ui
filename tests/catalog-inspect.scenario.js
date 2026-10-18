async page=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4190/');const view=await(await page.locator('iframe').elementHandle()).contentFrame();await view.locator('#typography').waitFor();await page.waitForTimeout(600);
 await page.screenshot({path:'output/playwright/catalog-overview.png'});
 const overflow=await view.evaluate(()=>[...document.querySelectorAll('.component-preview')].map(e=>({id:e.dataset.component,width:e.clientWidth,scroll:e.scrollWidth,height:e.clientHeight})).filter(e=>e.scroll>e.width+2));
 await view.getByRole('button',{name:'Focus Calendar preview',exact:true}).click();await page.getByRole('heading',{name:'Calendar',exact:true}).waitFor();await page.screenshot({path:'output/playwright/catalog-calendar.png'});
 return {errors,overflow,count:await view.locator('.component-card').count()};
}
