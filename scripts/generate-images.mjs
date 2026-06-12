/**
 * Generates public/og-image.png, public/logo.png, and src/app/icon.png
 * using only Node.js built-ins (zlib + Buffer).
 * Run with: node scripts/generate-images.mjs
 */

import { createWriteStream, mkdirSync } from "fs";
import { deflateSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ─── PNG encoder ───────────────────────────────────────────────────────────
function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let j = 0; j < 8; j++)
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function makePng(width, height, rgbaRows) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Build raw scanlines (filter byte 0 + RGB data)
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 3)] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 3;
      const dst = y * (1 + width * 3) + 1 + x * 3;
      raw[dst]     = rgbaRows[src];
      raw[dst + 1] = rgbaRows[src + 1];
      raw[dst + 2] = rgbaRows[src + 2];
    }
  }

  const compressed = deflateSync(raw, { level: 6 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─── Color helpers ──────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function fillRect(pixels, w, x0, y0, rw, rh, r, g, b) {
  for (let y = y0; y < y0 + rh; y++)
    for (let x = x0; x < x0 + rw; x++) {
      const i = (y * w + x) * 3;
      pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b;
    }
}

function fillCircle(pixels, W, cx, cy, radius, r, g, b) {
  for (let y = Math.max(0, cy - radius); y < Math.min(W, cy + radius); y++)
    for (let x = Math.max(0, cx - radius); x < Math.min(W, cx + radius); x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) {
        const i = (y * W + x) * 3;
        pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b;
      }
}

function writePng(filePath, buf) {
  const ws = createWriteStream(filePath);
  ws.write(buf);
  ws.end();
  console.log("✓ Created", filePath);
}

// ─── OG Image (1200 × 630) ──────────────────────────────────────────────────
function makeOgImage() {
  const W = 1200, H = 630;
  const pixels = Buffer.alloc(W * H * 3);
  const [br, bg, bb] = hexToRgb("#f0fdf4"); // light green bg
  pixels.fill(0);
  for (let i = 0; i < W * H * 3; i += 3) {
    pixels[i] = br; pixels[i+1] = bg; pixels[i+2] = bb;
  }

  // Dark green banner at top
  const [hr, hg, hb] = hexToRgb("#16a34a");
  fillRect(pixels, W, 0, 0, W, 80, hr, hg, hb);

  // Darker green footer band
  fillRect(pixels, W, 0, H - 80, W, 80, hr, hg, hb);

  // Central circle (logo area)
  const [cr, cg, cb] = hexToRgb("#16a34a");
  fillCircle(pixels, W, W / 2, H / 2, 120, cr, cg, cb);

  // Inner white circle
  fillCircle(pixels, W, W / 2, H / 2, 95, 255, 255, 255);

  // Small green dot (leaf hint)
  fillCircle(pixels, W, W / 2, H / 2, 55, cr, cg, cb);

  return makePng(W, H, pixels);
}

// ─── Logo (400 × 120) ───────────────────────────────────────────────────────
function makeLogo() {
  const W = 400, H = 120;
  const pixels = Buffer.alloc(W * H * 3, 255); // white bg

  const [gr, gg, gb] = hexToRgb("#16a34a");

  // Green square icon on the left
  fillRect(pixels, W, 10, 10, 100, 100, gr, gg, gb);
  // White inner circle
  fillCircle(pixels, W, 60, 60, 35, 255, 255, 255);
  // Green dot
  fillCircle(pixels, W, 60, 60, 18, gr, gg, gb);

  return makePng(W, H, pixels);
}

// ─── Favicon (64 × 64) ──────────────────────────────────────────────────────
function makeFavicon() {
  const W = 64;
  const pixels = Buffer.alloc(W * W * 3);
  const [gr, gg, gb] = hexToRgb("#16a34a");
  // Fill white
  pixels.fill(255);
  // Green circle
  fillCircle(pixels, W, 32, 32, 30, gr, gg, gb);
  // White inner
  fillCircle(pixels, W, 32, 32, 20, 255, 255, 255);
  // Green dot
  fillCircle(pixels, W, 32, 32, 10, gr, gg, gb);
  return makePng(W, W, pixels);
}

// ─── Write files ────────────────────────────────────────────────────────────
mkdirSync(join(root, "public"), { recursive: true });
mkdirSync(join(root, "src", "app"), { recursive: true });

writePng(join(root, "public", "og-image.png"), makeOgImage());
writePng(join(root, "public", "logo.png"), makeLogo());
writePng(join(root, "src", "app", "icon.png"), makeFavicon());

console.log("\nAll images generated successfully.");
