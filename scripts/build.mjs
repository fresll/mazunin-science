import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteFiles } from './release-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
for (const file of siteFiles) {
  await mkdir(dirname(resolve(output,file)), { recursive: true });
  await cp(resolve(root,file), resolve(output,file));
}
await writeFile(resolve(output,'.nojekyll'), '');
await writeFile(resolve(output,'CNAME'), 'mazunin.science\n');
console.log('Built dist/: approved homepage, two resource links, static assets. Nothing uploaded.');
