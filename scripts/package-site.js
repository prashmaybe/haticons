#!/usr/bin/env node
/**
 * package-site.js
 * 100% Pure Node.js site packager with zero external dependencies.
 * Creates:
 *  1. code/download/haticons.zip (Offline font & vector assets pack for site visitors)
 *  2. site-deploy.zip (Ready-to-deploy archive for cPanel / Apache / shared hosting)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.resolve(__dirname, '..');
const CODE_DIR = path.join(ROOT_DIR, 'code');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DOWNLOAD_DIR = path.join(CODE_DIR, 'download');
const USER_ZIP_PATH = path.join(DOWNLOAD_DIR, 'haticons.zip');
const DEPLOY_ZIP_PATH = path.join(ROOT_DIR, 'site-deploy.zip');

/**
 * Pure Node.js ZIP archive generator using standard zlib and Buffer.
 * Supports standard PKZIP 2.0 with Deflate compression and UTF-8 filenames.
 *
 * @param {string} outputPath
 * @param {Array<{arcname: string, filePath?: string, data?: Buffer}>} entries
 */
function createZip(outputPath, entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  // Fixed DOS timestamp for deterministic builds (2026-10-29 12:00:00)
  const dosTime = (12 << 11) | (0 << 5) | 0;
  const dosDate = ((2026 - 1980) << 9) | (10 << 5) | 29;

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.arcname.replace(/\\/g, '/'), 'utf8');
    const uncompressed = entry.data || fs.readFileSync(entry.filePath);
    const crc = zlib.crc32(uncompressed);
    const compressed = uncompressed.length > 0 ? zlib.deflateRawSync(uncompressed) : Buffer.alloc(0);
    const method = uncompressed.length > 0 ? 8 : 0; // 8 = deflate, 0 = store

    // Local file header (30 bytes + filename)
    const lh = Buffer.alloc(30 + filenameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // signature
    lh.writeUInt16LE(20, 4);         // version needed (2.0)
    lh.writeUInt16LE(0x0800, 6);      // UTF-8 filename flag
    lh.writeUInt16LE(method, 8);      // compression method
    lh.writeUInt16LE(dosTime, 10);
    lh.writeUInt16LE(dosDate, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(compressed.length, 18);
    lh.writeUInt32LE(uncompressed.length, 22);
    lh.writeUInt16LE(filenameBuf.length, 26);
    lh.writeUInt16LE(0, 28);         // extra field length
    filenameBuf.copy(lh, 30);

    localHeaders.push(lh);
    if (compressed.length > 0) {
      localHeaders.push(compressed);
    }

    // Central directory file header (46 bytes + filename)
    const cd = Buffer.alloc(46 + filenameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0); // signature
    cd.writeUInt16LE(20, 4);         // version made by (2.0)
    cd.writeUInt16LE(20, 6);         // version needed (2.0)
    cd.writeUInt16LE(0x0800, 8);      // UTF-8 flag
    cd.writeUInt16LE(method, 10);     // compression method
    cd.writeUInt16LE(dosTime, 12);
    cd.writeUInt16LE(dosDate, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(compressed.length, 20);
    cd.writeUInt32LE(uncompressed.length, 24);
    cd.writeUInt16LE(filenameBuf.length, 28);
    cd.writeUInt16LE(0, 30);         // extra length
    cd.writeUInt16LE(0, 32);         // comment length
    cd.writeUInt16LE(0, 34);         // disk number start
    cd.writeUInt16LE(0, 36);         // internal attrs
    cd.writeUInt32LE(0x81ed0000, 38); // external attrs (unix 0644)
    cd.writeUInt32LE(offset, 42);    // relative offset of local header
    filenameBuf.copy(cd, 46);

    centralHeaders.push(cd);
    offset += lh.length + compressed.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((acc, h) => acc + h.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);           // disk number
  eocd.writeUInt16LE(0, 6);           // start disk
  eocd.writeUInt16LE(entries.length, 8);  // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);          // comment length

  const fullZip = Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  fs.writeFileSync(outputPath, fullZip);
}

function collectFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(collectFiles(fullPath, baseDir));
    } else if (stat.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ arcname: relPath, filePath: fullPath });
    }
  }
  return results;
}

function packageUserDownload() {
  console.log('Creating user download bundle at code/download/haticons.zip...');
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  const entries = [];

  // 1. CSS
  const distCss = path.join(DIST_DIR, 'css');
  if (fs.existsSync(distCss)) {
    collectFiles(distCss).forEach(f => {
      entries.push({ arcname: `css/${f.arcname}`, filePath: f.filePath });
    });
  }

  // 2. Fonts
  const distFonts = path.join(DIST_DIR, 'fonts');
  if (fs.existsSync(distFonts)) {
    collectFiles(distFonts).forEach(f => {
      entries.push({ arcname: `fonts/${f.arcname}`, filePath: f.filePath });
    });
  }

  // 3. SVGs
  const distSvg = path.join(DIST_DIR, 'svg');
  if (fs.existsSync(distSvg)) {
    collectFiles(distSvg).forEach(f => {
      entries.push({ arcname: `svg/${f.arcname}`, filePath: f.filePath });
    });
  }

  // 4. SCSS
  const scssDir = path.join(ROOT_DIR, 'scss');
  if (fs.existsSync(scssDir)) {
    collectFiles(scssDir).forEach(f => {
      entries.push({ arcname: `scss/${f.arcname}`, filePath: f.filePath });
    });
  }

  // 5. LESS
  const lessDir = path.join(ROOT_DIR, 'less');
  if (fs.existsSync(lessDir)) {
    collectFiles(lessDir).forEach(f => {
      entries.push({ arcname: `less/${f.arcname}`, filePath: f.filePath });
    });
  }

  // 6. Documentation
  ['README.md', 'CHANGELOG.md', 'LICENSE'].forEach(doc => {
    const docPath = path.join(ROOT_DIR, doc);
    if (fs.existsSync(docPath)) {
      entries.push({ arcname: doc, filePath: docPath });
    }
  });

  createZip(USER_ZIP_PATH, entries);
  const sizeKb = (fs.statSync(USER_ZIP_PATH).size / 1024).toFixed(1);
  console.log(`User download bundle created successfully: ${sizeKb} KB (${entries.length} files)`);
}

function packageSharedHostingSite() {
  console.log('Creating shared hosting deployment archive at site-deploy.zip...');
  const entries = collectFiles(CODE_DIR);

  createZip(DEPLOY_ZIP_PATH, entries);
  const sizeMb = (fs.statSync(DEPLOY_ZIP_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`Shared hosting deploy archive created successfully: ${sizeMb} MB (${entries.length} files)`);
}

function main() {
  packageUserDownload();
  packageSharedHostingSite();
  console.log('All packages built successfully for shared hosting deployment!');
}

if (require.main === module) {
  main();
}

module.exports = {
  createZip,
  packageUserDownload,
  packageSharedHostingSite
};
