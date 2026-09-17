
import { createHash } from "node:crypto";
import { cp, mkdir, readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "../../thien-duc-website-resources/images");
const target = resolve(here, "../public/images");
const write = process.argv.includes("--write");

if (!existsSync(source)) {
  console.error(`Không thấy kho nguồn: ${source}`);
  process.exit(1);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function sha1(path) {
  return createHash("sha1")
    .update(await readFile(path))
    .digest("hex");
}

let copied = 0;
let skipped = 0;

for await (const file of walk(source)) {
  const rel = relative(source, file);
  const dest = join(target, rel);

  if (existsSync(dest)) {
    const [a, b] = await Promise.all([stat(file), stat(dest)]);
    if (a.size === b.size && (await sha1(file)) === (await sha1(dest))) {
      skipped += 1;
      continue;
    }
  }

  console.log(`${write ? "chép" : "sẽ chép"}: ${rel}`);
  if (write) {
    await mkdir(dirname(dest), { recursive: true });
    await cp(file, dest);
  }
  copied += 1;
}

console.log(
  `\n${copied} file ${write ? "đã chép" : "cần chép"}, ${skipped} file bỏ qua (không đổi).`,
);
if (!write && copied > 0) console.log("Chạy lại với --write để ghi thật.");
