import archiver from 'archiver';
import { createWriteStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distPath = join(root, 'dist');

if (!existsSync(distPath)) {
  console.error('Erro: pasta dist/ não existe. Execute antes: npm run build');
  process.exit(1);
}

const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const version = pkg.version ?? '0.0.0';
const zipName = `fake-data-easy-chrome-${version}.zip`;
const outPath = join(root, zipName);

const output = createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') console.warn(err);
});

try {
  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(distPath, false);
    archive.finalize();
  });
  const bytes = archive.pointer();
  console.log(`ZIP criado: ${zipName}`);
  console.log(`Caminho: ${outPath}`);
  console.log(`Tamanho: ${bytes} bytes`);
} catch (e) {
  console.error(e);
  process.exit(1);
}
