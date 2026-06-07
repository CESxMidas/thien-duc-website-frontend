import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BANNER_DIR = path.join(process.cwd(), "public", "images", "banners", "home");
const BANNER_WIDTH = 1920;
const BANNER_HEIGHT = 640;
const MIN_BYTES = 250 * 1024;
const MAX_BYTES = 500 * 1024;

/** @type {Array<{ file: string; focusY?: number }>} */
const banners = [
  { file: "home-banner-hung-phu-master-plan-02.jpg" },
  { file: "home-banner-hung-phu-fancy-tower-01.jpg", focusY: 0.55 },
  { file: "home-banner-hung-phu-master-plan-top-01.jpg" },
  { file: "home-banner-hung-phu-aerial-01.jpg" },
];

const filesToDelete = [
  "home-banner-hung-phu-master-plan-01.png",
  "MASTER_33 - Photo.jpg",
];

function getCoverExtract({ width, height }, focusY = 0.5) {
  const targetAspect = BANNER_WIDTH / BANNER_HEIGHT;
  const sourceAspect = width / height;

  if (sourceAspect > targetAspect) {
    const cropHeight = height;
    const cropWidth = Math.round(cropHeight * targetAspect);
    const maxLeft = width - cropWidth;

    return {
      left: Math.max(0, Math.round(maxLeft * 0.5)),
      top: 0,
      width: cropWidth,
      height: cropHeight,
    };
  }

  const cropWidth = width;
  const cropHeight = Math.round(cropWidth / targetAspect);
  const maxTop = height - cropHeight;

  return {
    left: 0,
    top: Math.max(0, Math.min(maxTop, Math.round(focusY * height - cropHeight / 2))),
    width: cropWidth,
    height: cropHeight,
  };
}

async function optimizeBanner({ file, focusY }) {
  const inputPath = path.join(BANNER_DIR, file);
  const tempPath = `${inputPath}.tmp`;
  const metadata = await sharp(inputPath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing metadata for ${file}`);
  }

  const extract = getCoverExtract(
    { width: metadata.width, height: metadata.height },
    focusY ?? 0.5,
  );

  let quality = 84;
  let output = null;

  while (quality >= 58) {
    output = await sharp(inputPath)
      .rotate()
      .extract(extract)
      .resize(BANNER_WIDTH, BANNER_HEIGHT, { fit: "fill" })
      .jpeg({
        quality,
        mozjpeg: true,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();

    if (output.length <= MAX_BYTES) {
      break;
    }

    quality -= 4;
  }

  if (!output) {
    throw new Error(`Failed to optimize ${file}`);
  }

  await fs.writeFile(tempPath, output);
  await fs.rename(tempPath, inputPath);

  return {
    file,
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    kb: Math.round(output.length / 1024),
    quality,
    withinTarget: output.length >= MIN_BYTES && output.length <= MAX_BYTES,
  };
}

async function main() {
  const results = [];

  for (const banner of banners) {
    results.push(await optimizeBanner(banner));
  }

  for (const file of filesToDelete) {
    await fs.rm(path.join(BANNER_DIR, file), { force: true });
  }

  console.log(JSON.stringify({ results, deleted: filesToDelete }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
