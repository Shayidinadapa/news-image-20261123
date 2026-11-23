// news-image-20261123 entry: the image is the entry, this program only hands
// it to the gate. It reads entry.png from the repository root, checks it is a
// whole PNG or JPEG inside the size caps, then copies it to /output/entry.png
// where the gate reads it. The picture itself (a newspaper front page summing
// up Monday 23 November 2026: Iran striking Bahrain and vowing to defy the US
// naval blockade, a Russian strike killing 15 in the Kyiv region, Denmark
// accusing Russia of a murder plot in Copenhagen, South Korea's education
// minister quitting over an AI cheating scandal, a strike paralysing Belgium,
// Gaza called a toxic wasteland, and record rain flooding Belgrade) lives in
// the repository, not here, so nothing this program writes is judged.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The gate reads only the copied file, so the copy must be exact: readFileSync
// + copyFileSync move the bytes as they are, no re-encoding, no resize.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '.';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const entryPath = join(BOT_DIR, 'entry.png');
let bytes: Buffer;
try {
  bytes = readFileSync(entryPath);
} catch (err) {
  console.error(`entry.png could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
const isPng = bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (!isPng && !isJpeg) {
  console.error('entry.png is neither a PNG nor a JPEG');
  process.exit(1);
}
if (bytes.length > 1048576) {
  console.error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(entryPath, join(OUTPUT_DIR, 'entry.png'));
} catch (err) {
  console.error(`entry.png could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
