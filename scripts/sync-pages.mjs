import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const docsDir = path.resolve('docs');
const browserDir = path.join(docsDir, 'browser');

async function copyDirectoryContents(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await copyDirectoryContents(sourcePath, targetPath);
      continue;
    }
    await cp(sourcePath, targetPath, { force: true });
  }
}

async function main() {
  await copyDirectoryContents(browserDir, docsDir);

  // GitHub Pages: sirve 404.html cuando no encuentra la ruta.
  // Al ser igual a index.html, Angular toma el control y maneja el routing.
  const indexHtml = await readFile(path.join(docsDir, 'index.html'), 'utf8');
  await writeFile(path.join(docsDir, '404.html'), indexHtml, 'utf8');

  // Evitar que GitHub Pages procese con Jekyll
  await writeFile(path.join(docsDir, '.nojekyll'), '', 'utf8');

  // CNAME para dominio personalizado
  await writeFile(path.join(docsDir, 'CNAME'), 'antojitos-sa.devandvar.com', 'utf8');

  console.log('✅ docs/ listo para GitHub Pages');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
