import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const docs = path.resolve("docs");

function readDocx(filePath) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rd-"));
  const zip = path.join(tmp, "z.zip");
  fs.copyFileSync(filePath, zip);
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${tmp.replace(/'/g, "''")}' -Force"`,
    { stdio: "pipe" },
  );
  const xml = fs.readFileSync(path.join(tmp, "word", "document.xml"), "utf8");
  fs.rmSync(tmp, { recursive: true, force: true });
  return xml
    .replace(/<w:tab[^>]*\/>/g, "\t")
    .replace(/<w:br[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const MARKERS = {
  p1: /PHẦN\s*1\s*[:\-—]\s*PHÂN\s*TÍCH/i,
  p2: /PHẦN\s*2\s*[:\-—]\s*THIẾT\s*KẾ/i,
  p3: /PHẦN\s*3\s*[:\-—]\s*HẠN\s*CHẾ/i,
  pl: /PHỤ\s*LỤC/i,
};

function sectionStats(label, text) {
  const i1 = text.search(MARKERS.p1);
  const i2 = text.search(MARKERS.p2);
  const i3 = text.search(MARKERS.p3);
  const ipl = text.search(MARKERS.pl);
  const part1 = i1 >= 0 && i2 > i1 ? text.slice(i1, i2) : "";
  const part2 = i2 >= 0 && i3 > i2 ? text.slice(i2, i3) : "";
  const part3 = i3 >= 0 ? text.slice(i3, ipl > i3 ? ipl : undefined) : "";
  const phuluc = ipl >= 0 ? text.slice(ipl) : "";
  console.log(`\n=== ${label} ===`);
  console.log("markers:", i1, i2, i3, ipl);
  console.log("Part 1:", part1.length);
  console.log("Part 2:", part2.length);
  console.log("Part 3:", part3.length);
  console.log("Phụ lục:", phuluc.length);
}

const files = fs.readdirSync(docs).filter((f) => f.endsWith(".docx") && !f.startsWith("~$"));
for (const f of files) {
  if (f.startsWith("BAO-CAO") || f.includes("Bao-cao") || f.includes("minh-hoa")) continue;
  sectionStats(f, readDocx(path.join(docs, f)));
}
sectionStats("BAO-CAO.md", fs.readFileSync(path.join(docs, "BAO-CAO-PHUONG-AN-KI-THUAT-WEBSITE.md"), "utf8"));
