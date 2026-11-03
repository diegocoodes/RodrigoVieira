import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'out');
const destination = resolve(root, 'dist/hostinger');
const entries = [];

async function collect(directory) {
  for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const path = resolve(directory, item.name);
    if (item.isDirectory()) await collect(path);
    else if (item.isFile()) entries.push({ path, name: relative(output, path).split(sep).join('/') });
    else throw new Error(`Tipo de arquivo não suportado: ${item.name}`);
  }
}

// A fresh build is explicit: packaging never silently ships a different build.
try {
  await readFile(resolve(output, 'index.html'));
  await readFile(resolve(output, '404.html'));
} catch {
  throw new Error('Execute npm run build antes de empacotar, ou use npm run build:hostinger.');
}
await collect(output);
entries.push({ path: resolve(root, 'deploy/hostinger/.htaccess'), name: '.htaccess' });
if (entries.length >= 65535) throw new Error('O pacote excede o limite de entradas ZIP32.');

// Portable ZIP writer using Node.js only, including hidden files and UTF-8 names.
const files = [];
const centralDirectory = [];
let offset = 0;
for (const entry of entries) {
  const data = await readFile(entry.path);
  const compressed = deflateRawSync(data, { level: 6 });
  const payload = compressed.length < data.length ? compressed : data;
  const method = payload === data ? 0 : 8;
  const name = Buffer.from(entry.name, 'utf8');
  const checksum = crc32(data);
  const date = (await stat(entry.path)).mtime;
  const dosTime = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | (date.getUTCSeconds() >> 1);
  const dosDate = ((Math.max(1980, date.getUTCFullYear()) - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6);
  header.writeUInt16LE(method, 8);
  header.writeUInt16LE(dosTime, 10);
  header.writeUInt16LE(dosDate, 12);
  header.writeUInt32LE(checksum, 14);
  header.writeUInt32LE(payload.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(name.length, 26);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(dosTime, 12);
  central.writeUInt16LE(dosDate, 14);
  central.writeUInt32LE(checksum, 16);
  central.writeUInt32LE(payload.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt32LE(offset, 42);
  files.push(header, name, payload);
  centralDirectory.push(central, name);
  offset += header.length + name.length + payload.length;
}
const directory = Buffer.concat(centralDirectory);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(directory.length, 12);
end.writeUInt32LE(offset, 16);
await mkdir(destination, { recursive: true });
const archive = resolve(destination, 'rodrigo-vieira-hostinger.zip');
await writeFile(archive, Buffer.concat([...files, directory, end]));
console.log(`Hostinger: ${archive}`);
console.log(`${entries.length} arquivos. Extraia o conteúdo diretamente em public_html.`);
