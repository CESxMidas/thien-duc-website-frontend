/**
 * Ghép NỘI DUNG từ BAO-CAO-PHUONG-AN-KI-THUAT-WEBSITE.md
 * vào KHUNG (format) của file backup — giữ nguyên Phần 1 (ảnh, sơ đồ).
 *
 * Chạy: node tools/merge-bao-cao-into-backup.mjs
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import JSZip from "jszip";

const root = process.cwd();
const docs = path.join(root, "docs");

const backupFile = fs
  .readdirSync(docs)
  .find((f) => f.includes("backup") && f.endsWith(".docx"));
const outputFile = fs
  .readdirSync(docs)
  .find(
    (f) =>
      f.endsWith(".docx") &&
      !f.startsWith("~$") &&
      !f.startsWith("BAO-CAO") &&
      !f.includes("backup") &&
      !f.includes("Bao-cao") &&
      !f.includes("minh-hoa"),
  );

if (!backupFile || !outputFile) {
  console.error("Thiếu file backup hoặc file đích.", { backupFile, outputFile });
  process.exit(1);
}

const backupPath = path.join(docs, backupFile);
const outputPath = path.join(docs, outputFile);
const sourceMd = path.join(docs, "BAO-CAO-PHUONG-AN-KI-THUAT-WEBSITE.md");
const fullMd = fs.readFileSync(sourceMd, "utf8");

const part2Md = fullMd.split(/# PHẦN 2 — THIẾT KẾ/i)[1]?.split(/# PHẦN 3 —/i)[0]?.trim();
const part3Md = fullMd.split(/# PHẦN 3 —/i)[1]?.trim();

if (!part2Md || !part3Md) {
  console.error("Không tách được Phần 2 / Phần 3 từ BAO-CAO md.");
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "merge-bao-cao-"));
const part2MdPath = path.join(tmp, "part2.md");
const part3MdPath = path.join(tmp, "part3.md");
fs.writeFileSync(part2MdPath, `# PHẦN 2 — THIẾT KẾ (PHƯƠNG ÁN 2)\n\n${part2Md}`, "utf8");
fs.writeFileSync(part3MdPath, `# PHẦN 3 — HẠN CHẾ, RỦI RO & KẾ HOẠCH\n\n${part3Md}`, "utf8");

const part2Docx = path.join(tmp, "part2.docx");
const part3Docx = path.join(tmp, "part3.docx");
execSync(`npx --yes @mohtasham/md-to-docx "${part2MdPath}" "${part2Docx}"`, {
  stdio: "inherit",
  cwd: root,
});
execSync(`npx --yes @mohtasham/md-to-docx "${part3MdPath}" "${part3Docx}"`, {
  stdio: "inherit",
  cwd: root,
});

function unzip(docx, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const zip = path.join(dest, "in.zip");
  fs.copyFileSync(docx, zip);
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip.replace(/'/g, "''")}' -DestinationPath '${dest.replace(/'/g, "''")}' -Force"`,
    { stdio: "pipe" },
  );
}

async function zipDir(src, out) {
  const zip = new JSZip();
  function add(dir, z) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) add(full, z.folder(name));
      else z.file(name, fs.readFileSync(full));
    }
  }
  add(src, zip);
  fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

function paragraphText(xmlChunk) {
  return [...xmlChunk.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((m) =>
      m[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
    )
    .join("")
    .trim();
}

function splitBody(bodyInner) {
  const sectMatch = bodyInner.match(/<w:sectPr[\s\S]*<\/w:sectPr>\s*$/);
  const sect = sectMatch ? sectMatch[0] : "";
  const inner = sect ? bodyInner.slice(0, -sect.length) : bodyInner;
  const elements = [];
  const re = /<w:(p|tbl|sdt)[\s\S]*?<\/w:\1>/g;
  let m;
  while ((m = re.exec(inner)) !== null) elements.push(m[0]);
  return { elements, sect };
}

const MARKER_P1 = /PHẦN\s*1\s*[:\-—]\s*PHÂN\s*TÍCH/i;
const MARKER_P2 = /PHẦN\s*2\s*[:\-—]\s*THIẾT\s*KẾ/i;
const MARKER_P3 = /PHẦN\s*3\s*[:\-—]\s*HẠN/i;

function findIndex(elements, re) {
  return elements.findIndex((el) => re.test(paragraphText(el)));
}

// Bắt đầu từ backup (giữ format + Phần 1)
fs.copyFileSync(backupPath, outputPath);
const shellDir = path.join(tmp, "shell");
const p2Dir = path.join(tmp, "p2");
const p3Dir = path.join(tmp, "p3");
unzip(outputPath, shellDir);
unzip(part2Docx, p2Dir);
unzip(part3Docx, p3Dir);

const shellXml = fs.readFileSync(path.join(shellDir, "word", "document.xml"), "utf8");
const p2Xml = fs.readFileSync(path.join(p2Dir, "word", "document.xml"), "utf8");
const p3Xml = fs.readFileSync(path.join(p3Dir, "word", "document.xml"), "utf8");

const shellBody = shellXml.match(/<w:body>([\s\S]*)<\/w:body>/);
const p2Body = p2Xml.match(/<w:body>([\s\S]*)<\/w:body>/);
const p3Body = p3Xml.match(/<w:body>([\s\S]*)<\/w:body>/);
if (!shellBody || !p2Body || !p3Body) throw new Error("Không đọc được w:body");

const shell = splitBody(shellBody[1]);
const p2 = splitBody(p2Body[1]);
const p3 = splitBody(p3Body[1]);

const i1 = findIndex(shell.elements, MARKER_P1);
const i2 = findIndex(shell.elements, MARKER_P2);
const i3 = findIndex(shell.elements, MARKER_P3);

if (i1 < 0 || i2 < 0 || i3 < 0 || !(i1 < i2 && i2 < i3)) {
  throw new Error(`Sai ranh giới phần: P1=${i1}, P2=${i2}, P3=${i3}`);
}

console.log(`Ranh giới backup: P1@${i1}, P2@${i2}, P3@${i3} (tổng ${shell.elements.length} khối)`);
console.log(`Nội dung BAO-CAO: P2=${p2.elements.length} khối, P3+PL=${p3.elements.length} khối`);

const merged = [
  ...shell.elements.slice(0, i2),
  ...p2.elements,
  ...p3.elements,
];

const newBody = merged.join("") + shell.sect;
const newXml = shellXml.replace(/<w:body>[\s\S]*<\/w:body>/, `<w:body>${newBody}</w:body>`);
fs.writeFileSync(path.join(shellDir, "word", "document.xml"), newXml, "utf8");

await zipDir(shellDir, outputPath);

// Kiểm tra sau khi ghép
execSync(`node tools/check-docx-sections.mjs`, { stdio: "inherit", cwd: root });

fs.rmSync(tmp, { recursive: true, force: true });

console.log("Nguồn nội dung:", sourceMd);
console.log("Khung format (backup):", backupPath);
console.log("Đã ghi:", outputPath);
console.log("- Giữ nguyên: Phần 1 (ảnh, layout gốc)");
console.log("- Cập nhật từ BAO-CAO: Phần 2, Phần 3, Phụ lục");
