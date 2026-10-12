// Export one illustrative photo as the responsive WebP set the Photo component expects.
//   node scripts/prepare-photo.mjs <source.png> <name> [widths=640,1024,1600]
//   → public/img/photos/<name>-<w>.webp, and prints the CMS photo fields (src, width, height, widths).
//
// Optional bottle placement (official front cutout only; the bottle is never generated):
//   BOTTLE="x,y,h" node scripts/prepare-photo.mjs ...
//   x, y = bottom-centre of the bottle in source pixels (where it touches the surface), h = bottle height in px.
//   BOTTLE_TONE="brightness,saturation" optionally matches the cutout to the scene light (defaults 1,1).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [src, name, widthsArg = '640,1024,1600'] = process.argv.slice(2);
if (!src || !name) {
  console.error('usage: node scripts/prepare-photo.mjs <source.png> <name> [widths]');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = process.env.OUT_DIR ?? path.join(root, 'public/img/photos');
fs.mkdirSync(outDir, { recursive: true });

let base = sharp(src).removeAlpha();
const meta = await base.metadata();

if (process.env.BOTTLE) {
  const [x, y, h] = process.env.BOTTLE.split(',').map(Number);
  const [bri, sat] = (process.env.BOTTLE_TONE ?? '1,1').split(',').map(Number);
  const cutout = path.join(root, 'brief/assets/official/memowell-bottle-front.png');
  const bottle = await sharp(cutout).trim().resize({ height: Math.round(h) }).modulate({ brightness: bri, saturation: sat }).png().toBuffer();
  const bm = await sharp(bottle).metadata();
  const left = Math.round(x - bm.width / 2);
  const top = Math.round(y - bm.height);
  // Soft contact shadow + a wider ambient shadow so the bottle sits on the surface.
  const sw = Math.round(bm.width * 1.5), sh = Math.round(bm.width * 0.34);
  const shadow = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}">
      <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.max(2, bm.width * 0.06)}"/></filter></defs>
      <ellipse cx="${sw / 2}" cy="${sh / 2}" rx="${bm.width * 0.62}" ry="${sh * 0.26}" fill="rgba(10,14,40,0.38)" filter="url(#b)"/>
      <ellipse cx="${sw / 2}" cy="${sh / 2}" rx="${bm.width * 0.44}" ry="${sh * 0.12}" fill="rgba(10,14,40,0.55)" filter="url(#b)"/>
    </svg>`,
  );
  const flat = await base.png().toBuffer();
  base = sharp(
    await sharp(flat)
      .composite([
        { input: shadow, left: Math.round(x - sw / 2), top: Math.round(y - sh / 2) },
        { input: bottle, left, top },
      ])
      .png()
      .toBuffer(),
  );
  console.log(`bottle: ${bm.width}x${bm.height}px at ${left},${top} (${((bm.height / meta.height) * 100).toFixed(1)}% of frame height)`);
}

const flat = await base.png().toBuffer();
const widths = widthsArg.split(',').map(Number).filter((w) => w <= meta.width);
for (const w of widths) {
  const file = path.join(outDir, `${name}-${w}.webp`);
  await sharp(flat).resize({ width: w }).webp({ quality: 80, effort: 6 }).toFile(file);
  console.log(`${path.relative(root, file)} ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
const maxW = widths[widths.length - 1];
const maxH = Math.round((meta.height / meta.width) * maxW);
console.log(`\nCMS photo fields:\n  src: "/img/photos/${name}"\n  width: ${maxW}\n  height: ${maxH}\n  widths: [${widths.join(', ')}]`);
