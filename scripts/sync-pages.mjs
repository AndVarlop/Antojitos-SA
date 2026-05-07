import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
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
    await writeFile(path.join(docsDir, '.nojekyll'), '', 'utf8');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});