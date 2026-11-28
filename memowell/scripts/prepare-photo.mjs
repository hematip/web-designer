// Export one illustrative photo as the responsive WebP set the Photo component expects.
//   node scripts/prepare-photo.mjs <source.png> <name> [widths=640,1024,1600]
//   → public/img/photos/<name>-<w>.webp, and prints the CMS photo fields (src, width, height, widths).
//
// Optional bottle placement (official front cutout only; the bottle is never generated):
//   BOTTLE="x,y,h" node scripts/prepare-photo.mjs ...
//   x, y = bottom-centre of the bottle in source pixels (where it touches the surface), h = bottle height in px.
//   BOTTLE_TONE="brightness,saturation" optionally matches the cutout to the scene light (defaults 1,1).
//   BOTTLE_BLUR="sigma" softens the cutout to match a background that is out of focus (default 0 = sharp).
//
// Exact fit over a bottle that is already in the frame (packshots):
//   BOTTLE_BOX="x0,y0,x1,y1" node scripts/prepare-photo.mjs ...
//   The cutout's own alpha box is fitted to exactly that rectangle of the source, so the generated
//   bottle is covered completely and the official label is the only label in frame. The plate keeps
//   its own contact shadow, so no shadow is drawn (BOTTLE_SHADOW=1 adds the synthetic one anyway).
//   The script prints how far the rectangle departs from the cutout's true 0.5225 proportion.
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

// The official cutout's visible bottle, as an alpha bounding box (sharp's trim() keys on colour, not alpha).
async function officialCutout() {
  const file = path.join(root, 'brief/assets/official/memowell-bottle-front.png');
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { file, left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const tone = () => (process.env.BOTTLE_TONE ?? '1,1').split(',').map(Number);
const blurOf = () => Number(process.env.BOTTLE_BLUR ?? 0);

if (process.env.BOTTLE_BOX) {
  // Seat the official cutout exactly over a bottle the generator already put in the frame.
  const [bx0, by0, bx1, by1] = process.env.BOTTLE_BOX.split(',').map(Number);
  const boxW = bx1 - bx0 + 1, boxH = by1 - by0 + 1;
  const cut = await officialCutout();
  const [bri, sat] = tone();
  const blur = blurOf();
  let img = sharp(cut.file)
    .extract({ left: cut.left, top: cut.top, width: cut.width, height: cut.height })
    .resize({ width: boxW, height: boxH, fit: 'fill' })
    .modulate({ brightness: bri, saturation: sat });
  if (blur > 0) img = img.blur(blur);
  const bottle = await img.png().toBuffer();
  const trueRatio = cut.width / cut.height, boxRatio = boxW / boxH;
  const skew = ((boxRatio / trueRatio - 1) * 100).toFixed(1);
  const layers = [{ input: bottle, left: bx0, top: by0 }];
  if (process.env.BOTTLE_SHADOW === '1') {
    const sw = Math.round(boxW * 1.5), sh = Math.round(boxW * 0.34);
    layers.unshift({
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}">
          <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.max(2, boxW * 0.06)}"/></filter></defs>
          <ellipse cx="${sw / 2}" cy="${sh / 2}" rx="${boxW * 0.62}" ry="${sh * 0.26}" fill="rgba(10,14,40,0.38)" filter="url(#b)"/>
        </svg>`,
      ),
      left: Math.round(bx0 + boxW / 2 - sw / 2),
      top: Math.round(by1 - sh / 2),
    });
  }
  const plate = await base.png().toBuffer();
  base = sharp(await sharp(plate).composite(layers).png().toBuffer());
  console.log(`bottle: official cutout ${cut.width}x${cut.height} fitted to ${boxW}x${boxH} at ${bx0},${by0}`);
  console.log(`        ${((boxH / meta.height) * 100).toFixed(1)}% of frame height; width departs from the cutout's true proportion by ${skew}%`);
} else if (process.env.BOTTLE) {
  const [x, y, h] = process.env.BOTTLE.split(',').map(Number);
  const [bri, sat] = tone();
  const cutout = path.join(root, 'brief/assets/official/memowell-bottle-front.png');
  const blur = blurOf();
  let cut = sharp(cutout).trim().resize({ height: Math.round(h) }).modulate({ brightness: bri, saturation: sat });
  if (blur > 0) cut = cut.blur(blur);
  const bottle = await cut.png().toBuffer();
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
