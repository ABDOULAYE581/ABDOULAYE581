const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const base = process.env.TEST_URL || 'http://127.0.0.1:8000';
(async () => {
 const options = { headless: true };
 if (process.env.CHROMIUM_PATH) { options.executablePath = process.env.CHROMIUM_PATH; options.args = ['--no-sandbox', '--disable-dev-shm-usage']; }
 const browser = await chromium.launch(options);
 fs.mkdirSync('test-results', {recursive:true});
 const page = await browser.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`)});
 for(const width of [360,390,600,768,1024,1440]) {
  await page.setViewportSize({width,height:900}); await page.goto(base);
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20))}window.scrollTo(0,0)});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow) throw Error('Horizontal overflow '+width);
  const clippedName = await page.locator('h1').evaluate(el => { const range = document.createRange(); range.selectNodeContents(el); return [...range.getClientRects()].some(r => r.right > innerWidth - 8); });
  if (clippedName) throw Error('Nom coupé '+width);
  console.log('Layout OK',width);
 }
 await page.setViewportSize({width:390,height:844}); await page.goto(base);
 await page.locator('.menu-toggle').click(); await page.locator('#navigation a[href="#projets"]').click();
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false') throw Error('menu close');
 await page.locator('[data-filter="bureautique"]').click();
 if(await page.locator('.project-card:visible').count()!==1) throw Error('filter');
 await page.locator('[data-project="excel"]').click();
 await page.locator('dialog').waitFor({state:'visible'}); await page.keyboard.press('Escape');
 await page.locator('[data-info="cv"]').click(); await page.locator('dialog').waitFor({state:'visible'}); await page.locator('.dialog-done').click();
 await page.locator('.form-submit').click();
 if(await page.locator('[aria-invalid="true"]').count()!==4) throw Error('validation');
 await page.locator('#name').fill('Visiteur test'); await page.locator('#email').fill('test@example.com'); await page.locator('#subject').selectOption({index:1}); await page.locator('#message').fill('Bonjour, je souhaite échanger au sujet de votre parcours.'); await page.locator('.form-submit').click();
 const dl=page.waitForEvent('download');await page.locator('#form-status button').click(); await dl;
 console.log('Menu, filtres, modales, validation et téléchargement OK');
 await page.setViewportSize({width:1440,height:1000});await page.goto(base);await page.waitForTimeout(1000);await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view')));await page.waitForTimeout(700);await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.waitForTimeout(1000);await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view')));await page.waitForTimeout(700);await page.screenshot({path:'test-results/mobile.png',fullPage:true});
 if(errors.length) throw Error(errors.join('\n')); console.log('Aucune erreur JS ou ressource HTTP');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
