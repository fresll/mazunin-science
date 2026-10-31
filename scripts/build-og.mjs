// Rebuild the social image from the site's approved vector illustrations.
// Requires Python 3, CairoSVG, Pillow, Cairo and the Arial fonts.
// Run: node scripts/build-og.mjs
// If Cairo is installed by Homebrew on macOS, run:
// DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib node scripts/build-og.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'assets/folio-art.js'), 'utf8'), context);
const drawing = (group, id, x, y, color) => {
  const art = context.window.MS_FOLIO.drawing(group, id).replace(/<svg[^>]*>/, '').replace('</svg>', '');
  return `<g transform="translate(${x} ${y}) scale(1.5)" color="${color}">${art}</g>`;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#ffffff"/>
<circle cx="250" cy="280" r="155" fill="#f1dfe1"/>
<circle cx="600" cy="280" r="155" fill="#dce8f3"/>
<circle cx="950" cy="280" r="155" fill="#e9ebd9"/>
${drawing(0, 'amphitheatre', 10, 100, '#79535d')}
${drawing(1, 'observatory', 360, 100, '#355d7d')}
${drawing(2, 'workshop', 710, 100, '#596139')}
<g text-anchor="middle" fill="#16212e" font-family="Arial, sans-serif" font-size="46">
<text x="250" y="535">Образование</text>
<text x="600" y="535">Наука</text>
<text x="950" y="535">Технологии</text>
</g>
</svg>`;
const svgPath = resolve(root, 'assets/og/mazunin-science-preview-v3.svg');
writeFileSync(svgPath, svg);
const render = spawnSync('python3', [resolve(root, 'scripts/render-og.py'), svgPath, resolve(root, 'assets/og/mazunin-science-preview-v3.png')], { stdio: 'inherit' });
if (render.status !== 0) process.exit(render.status || 1);
