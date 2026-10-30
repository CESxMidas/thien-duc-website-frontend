/* eslint-disable @typescript-eslint/no-require-imports -- Script kiểm tra giao diện cục bộ. */
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const esbuild = require('../../thien-duc-website-admin/node_modules/esbuild');
const { chromium } = require('../../thien-duc-website-admin/node_modules/@playwright/test');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');

async function main() {
  const root = process.cwd();
  const bundle = path.join(root, 'artifacts/projects-background-preview.cjs');
  await esbuild.build({
    stdin: { contents: `import React from 'react';import{renderToStaticMarkup}from'react-dom/server';import Page from './src/app/[locale]/du-an/page';export async function render(locale){return renderToStaticMarkup(await Page({params:Promise.resolve({locale}),searchParams:Promise.resolve({})}));}`, resolveDir: root, loader: 'tsx' },
    bundle: true, platform: 'node', format: 'cjs', outfile: bundle, jsx: 'automatic', packages: 'external',
    plugins: [{ name: 'preview-adapters', setup(build) {
      build.onResolve({ filter: /^(next\/(link|navigation)|@\/components\/layout\/site-shell|@\/lib\/api\/projects)$/ }, args => ({ path: args.path, namespace: 'preview' }));
      build.onLoad({ filter: /.*/, namespace: 'preview' }, args => ({
        contents: args.path === 'next/link' ? `import React from'react';export default function Link({scroll,...props}){return <a {...props}/>}`
          : args.path === 'next/navigation' ? `export function notFound(){throw Error('404')}export function permanentRedirect(){throw Error('redirect')}export function useRouter(){return {push(){}}}`
          : args.path.includes('site-shell') ? `import React from'react';export function SiteShell({children}){return <main>{children}</main>}`
          : `export async function getProjects(){return []}`,
        loader: 'tsx', resolveDir: root,
      }));
    }}],
  });
  const css = await postcss([tailwind({ base: root })]).process(await fs.readFile('src/app/globals.css', 'utf8'), { from: path.join(root, 'src/app/globals.css') });
  const preview = require(bundle);
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === '/images/backgrounds/projects-architecture.webp') {
        res.setHeader('Content-Type', 'image/webp');
        res.end(await fs.readFile(path.join(root, 'public', req.url)));
        return;
      }
      const url = new URL(req.url, 'http://localhost');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css.css}body{background:var(--color-ivory)}.projects-motion{animation:none}.reveal-from-left{opacity:1;transform:none}</style></head><body>${await preview.render(url.searchParams.get('locale') || 'vi')}</body></html>`);
    } catch (error) { res.statusCode = 500; res.end(error.message); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [375, 768, 1024, 1440, 1920]) for (const locale of ['vi', 'en']) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`http://127.0.0.1:${server.address().port}/?locale=${locale}`);
      await page.evaluate(async () => { const img = new Image(); img.src = '/images/backgrounds/projects-architecture.webp'; await img.decode(); });
      const metrics = await page.locator('.projects-page-intro').evaluate(intro => {
        const css = getComputedStyle(intro, '::before');
        return { overflow: document.documentElement.scrollWidth > innerWidth, height: intro.getBoundingClientRect().height, pointer: css.pointerEvents, background: css.backgroundImage, opacity: css.opacity, bottomPadding: getComputedStyle(intro.querySelector('.page-heading')).paddingBottom };
      });
      assert(!metrics.overflow);
      assert.equal(metrics.pointer, 'none');
      assert(metrics.background.includes('projects-architecture.webp'));
      assert.equal(metrics.bottomPadding, width < 768 ? '24px' : '32px');
      assert.equal(await page.locator('.projects-page-intro h1').count(), 1);
      assert.equal(await page.locator('.projects-page-intro a').count(), 4);
      if (locale === 'vi' && [375, 1440, 1920].includes(width)) await page.locator('.projects-page-intro').screenshot({ path: `artifacts/projects-background-${width}.png` });
      console.log('PASS', locale, width, JSON.stringify(metrics));
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
    await fs.unlink(bundle);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
