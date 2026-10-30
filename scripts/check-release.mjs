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
assert.equal(sandbox.window.MS_RELEASE.links.atlas,'https://fresll.github.io/pgt-mt-atlas/ru/');
for (const file of files.filter(x=>x.endsWith('.js'))) {
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
}
console.log(`OK — ${actual.length} publication files; resource URLs, root paths, canonical, domain and JS checked. Draft pages excluded.`);
