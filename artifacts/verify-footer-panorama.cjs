/* eslint-disable @typescript-eslint/no-require-imports -- Script QA độc lập dùng CommonJS, không thuộc bundle website. */
const fs=require('node:fs/promises');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const esbuild=require('../../thien-duc-website-admin/node_modules/esbuild');
const {chromium}=require('../../thien-duc-website-admin/node_modules/@playwright/test');
const postcss=require('postcss');
const tailwind=require('@tailwindcss/postcss');

async function main(){
 const root=process.cwd(),bundle=path.join(root,'artifacts/footer-panorama-preview.cjs');
 await esbuild.build({stdin:{contents:`import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import{SiteFooter}from'./src/components/layout/site-footer';import{getDictionary}from'./src/lib/i18n/get-dictionary';import{companyContactFixture}from'./src/test-support/company-contact';export async function render(locale){return renderToStaticMarkup(<SiteFooter locale={locale} dictionary={await getDictionary(locale)} companyContact={companyContactFixture}/>);}`,resolveDir:root,loader:'tsx'},bundle:true,platform:'node',format:'cjs',outfile:bundle,jsx:'automatic',packages:'external',plugins:[{name:'next-adapter',setup(build){build.onResolve({filter:/^next\/(image|link)$/},args=>({path:args.path,namespace:'preview'}));build.onLoad({filter:/.*/,namespace:'preview'},args=>({contents:args.path==='next/image'?`import React from'react';export default function Image(props){return <img {...props}/>}`:`import React from'react';export default function Link(props){return <a {...props}/>}`,loader:'tsx',resolveDir:root}));}}]});
 const css=await postcss([tailwind({base:root})]).process(await fs.readFile('src/app/globals.css','utf8'),{from:path.join(root,'src/app/globals.css')});
 const preview=require(bundle);
 const server=http.createServer(async(req,res)=>{try{if(req.url.startsWith('/images/')){res.end(await fs.readFile(path.join(root,'public',decodeURI(req.url))));return;}const url=new URL(req.url,'http://localhost');res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css.css}</style></head><body>${await preview.render(url.searchParams.get('locale')||'vi')}</body></html>`);}catch(e){res.statusCode=500;res.end(e.message);}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  for(const width of [375,768,1024,1440,1920])for(const locale of ['vi','en']){
   await page.setViewportSize({width,height:1100});await page.goto(`http://127.0.0.1:${server.address().port}/?locale=${locale}`);await page.locator('footer img').waitFor();
   const metrics=await page.locator('footer').evaluate(footer=>{const inner=footer.firstElementChild;return{width:footer.getBoundingClientRect().width,height:footer.getBoundingClientRect().height,columns:getComputedStyle(inner).gridTemplateColumns.split(' ').map(parseFloat),overflow:document.documentElement.scrollWidth>innerWidth,background:getComputedStyle(footer,'::before').backgroundSize,pointer:getComputedStyle(footer,'::before').pointerEvents,layer:getComputedStyle(inner).zIndex};});
   assert(!metrics.overflow);assert.equal(metrics.pointer,'none');assert.equal(metrics.columns.length,width>=1024?4:width>=640?2:1);assert(Math.max(...metrics.columns)-Math.min(...metrics.columns)<1);
   if(locale==='vi'&&[375,1440,1920].includes(width))await page.locator('footer').screenshot({path:`artifacts/footer-panorama-${width}.png`});
   console.log('PASS',locale,width,JSON.stringify(metrics));
  }
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));await fs.unlink(bundle);}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
