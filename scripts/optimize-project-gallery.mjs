import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SLIDER_WIDTH = 1920;
const SLIDER_HEIGHT = 1200;
const MAX_BYTES = 380 * 1024;

const galleryFolders = [
  {
    dir: path.join("public", "images", "projects", "hung-phu", "hotel"),
    focusY: (file) => {
      if (file.includes("exterior")) return 0.42;
      if (file.includes("living-room")) return 0.48;
      return 0.5;
    },
  },
  {
    dir: path.join("public", "images", "projects", "hung-phu", "fancy-tower"),
    focusY: (file) => (file.includes("pool") ? 0.55 : 0.5),
  },
];

function getCoverExtract({ width, height }, focusY = 0.5) {
  const targetAspect = SLIDER_WIDTH / SLIDER_HEIGHT;
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

async function optimizeImage(filePath, focusY) {
  const tempPath = `${filePath}.tmp`;
  const beforeBytes = (await fs.stat(filePath)).size;
  const metadata = await sharp(filePath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing metadata for ${filePath}`);
  }

  const extract = getCoverExtract(
    { width: metadata.width, height: metadata.height },
    focusY,
  );

  let quality = 84;
  let buffer = null;

  while (quality >= 58) {
    buffer = await sharp(filePath)
      .rotate()
      .extract(extract)
      .resize(SLIDER_WIDTH, SLIDER_HEIGHT, { fit: "fill" })
      .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer();

    if (buffer.length <= MAX_BYTES || quality <= 58) {
      break;
    }

    quality -= 4;
  }

  if (!buffer) {
    throw new Error(`Failed to optimize ${filePath}`);
  }

  await fs.writeFile(tempPath, buffer);
  await fs.rename(tempPath, filePath);

  console.log(
    `${path.basename(filePath)}: ${Math.round(beforeBytes / 1024)}KB -> ${Math.round(buffer.length / 1024)}KB (q${quality})`,
  );
}

for (const { dir, focusY } of galleryFolders) {
  const folderPath = path.join(process.cwd(), dir);
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      continue;
    }

    const filePath = path.join(folderPath, entry.name);
    await optimizeImage(filePath, focusY(entry.name));
  }
}

console.log("Done optimizing project gallery images.");
