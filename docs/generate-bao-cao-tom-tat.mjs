/**
 * Tạo báo cáo Word: Phương án kỹ thuật website Thiên Đức (1 file duy nhất)
 * Chạy: npm run report
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Header,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { ALL_PAS, DECISION_MATRIX } from "./bao-cao-tom-tat-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "Bao-cao-tom-tat-phuong-an-ky-thuat-website-Thien-Duc.docx");

const BRAND = "B06613";
const MUTED_BG = "F2F2F2";
const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 300 : 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: BRAND, size: level === HeadingLevel.HEADING_1 ? 30 : 26, font: "Arial" })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { after: opts.after ?? 140, line: 276 },
    indent: opts.indent ? { firstLine: 360 } : undefined,
    children: [new TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size ?? 24, font: "Arial", color: opts.color })],
  });
}

function bullet(text) {
  return new Paragraph({ spacing: { after: 70 }, indent: { left: 720, hanging: 360 }, children: [new TextRun({ text: `• ${text}`, size: 24, font: "Arial" })] });
}

function numbered(i, text) {
  return new Paragraph({ spacing: { after: 70 }, indent: { left: 720, hanging: 360 }, children: [new TextRun({ text: `${i}. ${text}`, size: 24, font: "Arial" })] });
}

function spacer() {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function th(text, w) {
  return new TableCell({
    width: w ? { size: w, type: WidthType.PERCENTAGE } : undefined,
    shading: { fill: BRAND, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Arial" })] })],
  });
}

function td(text, opts = {}) {
  return new TableCell({
    width: opts.w ? { size: opts.w, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.shade ? { fill: MUTED_BG, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial", bold: opts.bold || text.includes("✓") || text.includes("ĐỀ XUẤT") })] })],
  });
}

function table(headers, rows, widths) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: [
      new TableRow({ children: headers.map((h, i) => th(h, widths?.[i])) }),
      ...rows.map((row, ri) => new TableRow({ children: row.map((c, ci) => td(c, { w: widths?.[ci], shade: ri % 2 === 1 })) })),
    ],
  });
}

function renderLayer(l) {
  return [
    heading(l.title, HeadingLevel.HEADING_2),
    table(l.compare.headers, l.compare.rows, [22, 39, 39]),
    spacer(),
    para("→ Lý do chọn:", { bold: true }),
    para(l.choice, { indent: true }),
    ...(l.note ? [para(l.note, { indent: true, italics: true, color: "8B4513" })] : []),
    spacer(),
  ];
}

function renderPA(pa, n) {
  const blocks = [
    heading(`${n}. ${pa.code} — ${pa.name}`),
    para(`Ưu tiên: ${pa.priority}`, { bold: true, indent: true, color: BRAND }),
    para(pa.description, { indent: true }),
    spacer(),
    heading(`${n}.1. So sánh công nghệ và lý do chọn`, HeadingLevel.HEADING_2),
    ...pa.layers.flatMap(renderLayer),
    heading(`${n}.2. Tiêu chí phi chức năng`, HeadingLevel.HEADING_2),
    table(pa.nfr.headers, pa.nfr.rows, [30, 18, 52]),
    spacer(),
    para(pa.conclusion, { indent: true, bold: true }),
  ];
  if (pa.architecture) {
    blocks.push(
      heading(`${n}.3. Kiến trúc`, HeadingLevel.HEADING_2),
      table(["Repository", "Công nghệ", "Vai trò"], pa.architecture.repos, [30, 30, 40]),
      spacer(),
      ...pa.architecture.flow.map((f) => para(f, { indent: true, italics: true }))
    );
  }
  blocks.push(pageBreak());
  return blocks;
}

const children = [
  spacer(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BRAND, space: 8 } },
    children: [new TextRun({ text: "CÔNG TY TNHH ĐẦU TƯ – XÂY DỰNG – THƯƠNG MẠI THIÊN ĐỨC", bold: true, size: 26, font: "Arial", color: BRAND })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { fill: MUTED_BG, type: ShadingType.CLEAR },
    spacing: { before: 300, after: 300 },
    children: [new TextRun({ text: "BÁO CÁO PHƯƠNG ÁN KỸ THUẬT", bold: true, size: 44, font: "Arial", color: BRAND })],
  }),
  para("WEBSITE GIỚI THIỆU CÔNG TY THIÊN ĐỨC", { center: true, bold: true, size: 28 }),
  para(`Ngày lập: ${today}`, { center: true }),
  pageBreak(),

  heading("1. MỤC ĐÍCH"),
  para("Trình bày 3 phương án kỹ thuật. Mỗi PA: so sánh ưu/nhược từng công nghệ → lý do chọn → đánh giá mở rộng, bảo trì, tốc độ phản hồi.", { indent: true }),
  bullet("Hiện trạng: Frontend Next.js 16 đang phát triển, mock data trong src/data/."),
  bullet("Yêu cầu: Website + Backend + CSDL + Admin + form liên hệ + tuyển dụng."),
  spacer(),

  heading("2. TỔNG QUAN 3 PHƯƠNG ÁN"),
  table(
    ["PA", "Ưu tiên", "Backend", "CSDL", "Admin", "Điểm", "Đề xuất"],
    [
      ["PA1", "Tốc độ + chi phí", "Không", "Không", "Không", "2.4/5", "GĐ1"],
      ["PA2", "Tự đăng bài", "CMS", "PostgreSQL", "CMS", "3.3/5", "Chưa tối ưu"],
      ["PA3", "Kiểm soát + mở rộng", "NestJS", "PostgreSQL", "Tự xây", "4.5/5", "ĐỀ XUẤT"],
    ],
    [8, 20, 12, 12, 12, 10, 16]
  ),
  pageBreak(),

  ...ALL_PAS.flatMap((pa, i) => renderPA(pa, i + 3)),

  heading("6. MA TRẬN QUYẾT ĐỊNH"),
  table(DECISION_MATRIX.headers, DECISION_MATRIX.rows, [30, 12, 14, 14, 30]),
  spacer(),

  heading("7. LỘ TRÌNH TRIỂN KHAI (PA3)"),
  table(
    ["Giai đoạn", "Thời gian", "Nội dung", "Kết quả"],
    [
      ["G1 — Frontend", "4–8 tuần", "Hoàn thiện UI, mock data", "Demo"],
      ["G2 — Backend", "4–6 tuần", "NestJS + Prisma + PostgreSQL", "API staging"],
      ["G3 — Admin", "3–5 tuần", "Vite + React dashboard", "Admin staging"],
      ["G4 — Tích hợp", "2–3 tuần", "FE nối API, ISR", "Beta"],
      ["G5 — Mở rộng", "2–4 tuần", "Liên hệ, tuyển dụng", "Production"],
    ],
    [16, 14, 42, 28]
  ),
  spacer(),

  heading("8. KẾT LUẬN"),
  numbered(1, "Đề xuất PA3: NestJS (backend) + PostgreSQL (CSDL) + Prisma + Admin riêng."),
  numbered(2, "Tiếp tục FE giai đoạn 1; chuẩn hóa types làm API contract."),
  numbered(3, "Thiết kế schema PostgreSQL trước khi code backend."),
  para("NestJS chỉ là framework — PostgreSQL mới là nơi lưu dữ liệu bền vững.", { indent: true, bold: true }),
  spacer(),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "— HẾT BÁO CÁO —", bold: true, color: BRAND, font: "Arial" })] }),
  spacer(),
  para("Người lập: ........................................", { center: true }),
  para("Phê duyệt: ........................................", { center: true }),
];

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Thiên Đức — Báo cáo kỹ thuật", size: 18, color: "8F8F8F", italics: true, font: "Arial" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Báo cáo phương án kỹ thuật", size: 18, color: "8F8F8F", font: "Arial" })] })] }) },
    children,
  }],
});

fs.writeFileSync(OUTPUT, await Packer.toBuffer(doc));
console.log(`Đã tạo: ${OUTPUT}`);
