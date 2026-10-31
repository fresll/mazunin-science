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
  return `<g transform="translate(${x} ${y}) scale(1.35)" color="${color}">${art}</g>`;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#ffffff"/>
<text x="275" y="119" fill="#16212e" font-family="Arial, sans-serif" font-size="68" letter-spacing="-2.8">MAZUNIN</text>
<text x="580" y="119" fill="#16212e" font-family="Arial, sans-serif" font-size="68">/</text>
<text x="630" y="119" fill="#16212e" font-family="Arial, sans-serif" font-size="68" font-weight="700" letter-spacing="-2.8">SCIENCE</text>
<circle cx="250" cy="322" r="132" fill="#f1dfe1"/>
<circle cx="600" cy="322" r="132" fill="#dce8f3"/>
<circle cx="950" cy="322" r="132" fill="#e9ebd9"/>
${drawing(0, 'amphitheatre', 34, 160, '#79535d')}
${drawing(1, 'observatory', 384, 160, '#355d7d')}
${drawing(2, 'workshop', 734, 160, '#596139')}
<g text-anchor="middle" fill="#16212e" font-family="Arial, sans-serif" font-size="43">
<text x="250" y="551">Образование</text>
<text x="600" y="551">Наука</text>
<text x="950" y="551">Технологии</text>
</g>
</svg>`;
const svgPath = resolve(root, 'assets/og/mazunin-science-preview.svg');
writeFileSync(svgPath, svg);
const render = spawnSync('python3', [resolve(root, 'scripts/render-og.py'), svgPath, resolve(root, 'assets/og/mazunin-science-preview-v2.png')], { stdio: 'inherit' });
if (render.status !== 0) process.exit(render.status || 1);
