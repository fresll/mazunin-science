import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';
import { siteFiles } from './release-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root,'dist');
const walk = folder => readdirSync(folder,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(resolve(folder,x.name)):[resolve(folder,x.name)]);
const files = walk(output);
const actual = files.map(x=>relative(output,x).replaceAll('\\','/')).sort();
assert.deepEqual(actual,[...siteFiles,'.nojekyll','CNAME'].sort(),'Unexpected or missing publication files');
for (const file of files.filter(x=>x.endsWith('.html'))) {
  const html=readFileSync(file,'utf8');
  for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(url)) continue;
    const pathname=url.split(/[?#]/)[0];
    const target=pathname==='/'?'index.html':pathname;
    assert.ok(existsSync(resolve(dirname(file),target)),`Broken local URL: ${url}`);
  }
}
const entry=readFileSync(resolve(output,'index.html'),'utf8');
assert.match(entry,/data-site="public"/);
assert.match(entry,/rel="canonical" href="https:\/\/mazunin\.science\/"/);
assert.ok(!entry.includes('noindex'),'Public homepage must be indexable');
assert.ok(!entry.includes('../assets/'),'Homepage assets must resolve at the domain root');
assert.equal(readFileSync(resolve(output,'CNAME'),'utf8').trim(),'mazunin.science');
const sandbox={window:{}};
runInNewContext(readFileSync(resolve(output,'assets/release-content.js'),'utf8'),sandbox);
assert.equal(sandbox.window.MS_RELEASE.links.molbio,'https://fresll.github.io/molbio/');
assert.equal(sandbox.window.MS_RELEASE.links.atlas.ru,'https://atlas.mazunin.science/ru/');
assert.equal(sandbox.window.MS_RELEASE.links.atlas.en,'https://atlas.mazunin.science/en/');

// Execute the shipped scripts with a minimal document and inspect what the app
// inserts into #app. This checks generated markup, not merely its source code.
function renderPublic(search) {
  const app = { innerHTML: '' };
  const element = {
    addEventListener() {}, querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return 'false'; }
  };
  const document = {
    body: { dataset: { variant:'c', site:'public' }, style: { setProperty() {} } },
    documentElement: {},
    getElementById(id) { return id === 'app' ? app : null; },
    querySelector(selector) { return selector === '.project-dialog' ? null : element; },
    querySelectorAll() { return []; }, addEventListener() {}
  };
  const context = { window: {}, document, location: { search, hash:'' }, URLSearchParams };
  for (const name of ['content.js','graphics.js','folio-art.js','release-content.js','app.js']) {
    runInNewContext(readFileSync(resolve(output,'assets',name),'utf8'),context,{filename:name});
  }
  return app.innerHTML;
}
const publicMarkup = renderPublic('');
assert.equal(renderPublic('?utm_source=chatgpt.com'),publicMarkup,'Tracking parameters must not alter the public page');
assert.doesNotMatch(publicMarkup,/\b(?:content-flow|content-section|site-footer)\b/,'Public DOM must not contain legacy sections or footer');
assert.doesNotMatch(publicMarkup,/\bid="(?:education|research|technology|updates|about)"/,'Public DOM must not contain duplicate content sections');
assert.equal((publicMarkup.match(/<article class="folio-sheet\b/g)||[]).length,3,'Public DOM must contain exactly three sheets');
for (let i=0; i<3; i++) {
  assert.match(publicMarkup,new RegExp(`href="#sheet-${i}" data-sheet-nav="${i}"`));
  assert.match(publicMarkup,new RegExp(`id="sheet-${i}"`));
}
assert.ok(publicMarkup.includes(sandbox.window.MS_RELEASE.links.molbio));
for (const [search, lang] of [['', 'ru'], ['?lang=en', 'en']]) {
  const markup = renderPublic(search);
  const url = sandbox.window.MS_RELEASE.links.atlas[lang];
  const atlasName = lang === 'ru' ? 'Атлас ПГТ-мт' : 'PGT-mt Atlas';
  assert.ok(markup.includes(`>${atlasName} <span aria-hidden="true">↗</span></a>`), `${lang}: Atlas name must match the language`);
  assert.equal((markup.match(new RegExp(`href="${url}"`, 'g')) || []).length, 2, `${lang}: Atlas sheet and expanded action must use the correct URL`);
  assert.ok(markup.includes(`<small>${url.replace('https://','')}</small>`), `${lang}: visible Atlas address must match the link`);
  assert.ok(markup.includes(sandbox.window.MS_RELEASE.links.molbio), `${lang}: Molbio URL must remain unchanged`);
  assert.ok(!markup.includes('fresll.github.io/pgt-mt-atlas/'), `${lang}: old Atlas URL remains`);
}
for (const file of files.filter(x=>/\.(?:html|js|css|xml|txt)$/.test(x))) {
  assert.ok(!readFileSync(file,'utf8').includes('fresll.github.io/pgt-mt-atlas/'), `Old Atlas URL in ${file}`);
}
assert.ok(publicMarkup.includes('Modicum') && publicMarkup.includes('В разработке'));
assert.doesNotMatch(publicMarkup,/href="#(?:education|research|technology|updates|about)"/);
for (const file of files.filter(x=>x.endsWith('.js'))) {
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
}
console.log(`OK — ${actual.length} publication files; generated public markup, UTM, resource URLs, root paths, canonical, domain and JS checked. Draft pages excluded.`);
