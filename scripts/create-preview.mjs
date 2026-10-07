import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';

const root = resolve('dist');
const mime = {
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
async function dataUrl(file) {
  const bytes = await readFile(file);
  return `data:${mime[extname(file)] || 'application/octet-stream'};base64,${bytes.toString('base64')}`;
}
let html = await readFile(resolve(root, 'index.html'), 'utf8');
for (const match of [...html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/g)]) {
  const file = resolve(root, match[1]);
  if (match[0].includes('rel="stylesheet"')) {
    let css = await readFile(file, 'utf8');
    for (const asset of [...css.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)]) {
      if (!asset[1].startsWith('data:'))
        css = css.replace(asset[0], `url("${await dataUrl(resolve(dirname(file), asset[1]))}")`);
    }
    html = html.replace(match[0], `<style>${css}</style>`);
  } else if (match[0].includes('rel="icon"')) {
    html = html.replace(match[1], await dataUrl(file));
  } else if (match[0].includes('rel="modulepreload"')) {
    html = html.replace(match[0], '');
  }
}
for (const match of [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)]) {
  let js = await readFile(resolve(root, match[1]), 'utf8');
  for (const asset of new Set(
    [...js.matchAll(/\.\/images\/[a-zA-Z0-9_./-]+\.(?:jpg|png|webp)/g)].map((value) => value[0]),
  )) {
    js = js.replaceAll(asset, await dataUrl(resolve(root, asset)));
  }
  html = html.replace(
    match[0],
    `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`,
  );
}
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/LydsEvents-preview.html', html);
console.log(
  'Created artifacts/LydsEvents-preview.html — open directly in a browser; no server needed.',
);
