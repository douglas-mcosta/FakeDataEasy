import archiver from 'archiver';
import { createWriteStream, existsSync } from 'node:fs';
import { readFile, rename, unlink } from 'node:fs/promises';
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
/** Nome opcional: `node scripts/zip-dist.mjs meu_pacote_v2.0` → meu_pacote_v2.0.zip */
const arg = process.argv[2];
const zipName = arg
  ? /\.zip$/i.test(arg)
    ? arg
    : `${arg}.zip`
  : `fake-data-easy-chrome-${version}.zip`;

/** ZIP fica em dist/; ficheiro temporário na raiz do projecto evita incluir o .zip dentro de si mesmo. */
const outPath = join(distPath, zipName);
const tmpPath = join(root, `.tmp-zip-${zipName}`);

const output = createWriteStream(tmpPath);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') console.warn(err);
});

try {
  await new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.glob('**/*', {
      cwd: distPath,
      nodir: true,
      dot: true,
      ignore: ['**/*.zip'],
    });
    archive.finalize();
  });
  const bytes = archive.pointer();
  try {
    await unlink(outPath);
  } catch {
    /* não existia */
  }
  await rename(tmpPath, outPath);
  console.log(`ZIP criado: ${zipName}`);
  console.log(`Caminho: ${outPath}`);
  console.log(`Tamanho: ${bytes} bytes`);
} catch (e) {
  try {
    await unlink(tmpPath);
  } catch {
    /* ok */
  }
  console.error(e);
  process.exit(1);
}
