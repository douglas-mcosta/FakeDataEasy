/**
 * Gera PNGs de ícone a partir de public/assets/logo-icon.svg (Chrome + loja).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public/assets/logo-icon.svg');
const outDir = join(root, 'public/assets');

const sizes = [16, 32, 48, 128];

async function main() {
  const svg = readFileSync(svgPath);
  for (const size of sizes) {
    const out = join(outDir, `FakeDataEasy-${size}.png`);
    await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
    console.log('written', out);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
