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
  return `<g transform="translate(${x} ${y}) scale(1.03)" color="${color}">${art}</g>`;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#ffffff"/>
<text x="50" y="207" fill="#16212e" font-family="Arial, sans-serif" font-size="45" letter-spacing="-1.8">MAZUNIN <tspan fill="#b94738">/</tspan></text>
<text x="46" y="286" fill="#16212e" font-family="Arial, sans-serif" font-size="78" font-weight="700" letter-spacing="-4.6">SCIENCE</text>
<text x="50" y="369" fill="#16212e" font-family="Arial, sans-serif" font-size="38">Наука, образование</text>
<text x="50" y="417" fill="#16212e" font-family="Arial, sans-serif" font-size="38">и технологии</text>
<circle cx="546" cy="315" r="104" fill="#f1dfe1"/>
<circle cx="790" cy="315" r="104" fill="#dce8f3"/>
<circle cx="1034" cy="315" r="104" fill="#e9ebd9"/>
${drawing(0, 'amphitheatre', 381, 191, '#79535d')}
${drawing(1, 'observatory', 625, 191, '#355d7d')}
${drawing(2, 'workshop', 869, 191, '#596139')}
</svg>`;
const svgPath = resolve(root, 'assets/og/mazunin-science-preview.svg');
writeFileSync(svgPath, svg);
const render = spawnSync('python3', [resolve(root, 'scripts/render-og.py'), svgPath, resolve(root, 'assets/og/mazunin-science-preview.png')], { stdio: 'inherit' });
if (render.status !== 0) process.exit(render.status || 1);
