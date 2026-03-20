/**
 * Normaliza capturas em prints/ para a Chrome Web Store:
 * 1280 x 800, PNG RGB (sem alfa; fundo branco se havia transparência).
 * Máximo 5 ficheiros (ordenados por nome).
 * Uso: node scripts/normalize-print-screenshots.mjs
 */
import { mkdir, readdir, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PRINTS = join(__dirname, '..', 'prints');

const W = 1280;
const H = 800;
const MAX_FILES = 5;

async function main() {
  await mkdir(PRINTS, { recursive: true });
  const all = (await readdir(PRINTS)).filter((f) => /\.(png|jpe?g)$/i.test(f) && !f.startsWith('.'));
  const sorted = [...all].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const files = sorted.slice(0, MAX_FILES);

  if (files.length === 0) {
    console.error('Nenhuma imagem .png/.jpg em prints/');
    process.exit(1);
  }
  if (all.length > MAX_FILES) {
    console.warn(`Aviso: ${all.length} imagens encontradas; apenas as primeiras ${MAX_FILES} (por nome) foram processadas.`);
  }

  for (const name of files) {
    const input = join(PRINTS, name);
    const safeBase = name.replace(/\s+/g, '-').replace(/\.[^.]+$/i, '');
    const finalName = `${safeBase}.png`;
    const finalPath = join(PRINTS, finalName);
    const tmpPath = join(PRINTS, `.tmp-normalize-${safeBase}-${process.pid}.png`);

    await sharp(input)
      .rotate()
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize(W, H, {
        fit: 'contain',
        position: 'center',
        background: { r: 255, g: 255, b: 255 },
      })
      .png({
        compressionLevel: 9,
        palette: false,
        effort: 7,
      })
      .toFile(tmpPath);

    if (finalPath !== input) {
      try {
        await unlink(input);
      } catch {
        /* original já era outro nome */
      }
    } else {
      await unlink(input);
    }

    await rename(tmpPath, finalPath);
    console.log('OK', finalName, W, 'x', H, 'PNG RGB');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
