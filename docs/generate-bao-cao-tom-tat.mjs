/**
 * Tạo BẢN TÓM TẮT rút gọn từ báo cáo tổng hợp
 * Chạy: node docs/generate-bao-cao-tom-tat.mjs
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "Bao-cao-tom-tat-phuong-an-ky-thuat-website-Thien-Duc.docx");
const FULL_REPORT = "Bao-cao-tom-tat-phuong-an-ky-thuat-website-Thien-Duc.docx";

const BRAND = "B06613";
const BRAND_RGB = "B06613";
const MUTED_BG = "F2F2F2";

const today = new Date().toLocaleDateString("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 300 : 200, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: BRAND_RGB,
        size: level === HeadingLevel.HEADING_1 ? 30 : 26,
        font: "Arial",
      }),
    ],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { after: opts.after ?? 140, line: 276 },
    indent: opts.indent ? { firstLine: 360 } : undefined,
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italics,
        size: opts.size ?? 24,
        font: "Arial",
        color: opts.color,
      }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 70 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `• ${text}`, size: 24, font: "Arial" })],
  });
}

function numbered(index, text) {
  return new Paragraph({
    spacing: { after: 70 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `${index}. ${text}`, size: 24, font: "Arial" })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 100 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function tableHeaderCell(text, width) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    shading: { fill: BRAND, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 22, font: "Arial" })],
      }),
    ],
  });
}

function tableCell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.shade ? { fill: MUTED_BG, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({ text, size: 22, font: "Arial", bold: opts.bold }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        children: headers.map((h, i) => tableHeaderCell(h, colWidths?.[i])),
      }),
      ...rows.map(
        (row, ri) =>
          new TableRow({
            children: row.map((cell, ci) =>
              tableCell(cell, { width: colWidths?.[ci], shade: ri % 2 === 1, bold: cell.includes("ĐỀ XUẤT") })
            ),
          })
      ),
    ],
  });
}

const children = [
  spacer(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BRAND_RGB, space: 8 } },
    children: [
      new TextRun({
        text: "CÔNG TY TNHH ĐẦU TƯ – XÂY DỰNG – THƯƠNG MẠI THIÊN ĐỨC",
        bold: true,
        size: 26,
        font: "Arial",
        color: BRAND_RGB,
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    shading: { fill: MUTED_BG, type: ShadingType.CLEAR },
    spacing: { before: 300, after: 300 },
    children: [
      new TextRun({ text: "BẢN TÓM TẮT", bold: true, size: 52, font: "Arial", color: BRAND_RGB }),
    ],
  }),
  para("PHƯƠNG ÁN KỸ THUẬT XÂY DỰNG WEBSITE GIỚI THIỆU CÔNG TY", { center: true, bold: true, size: 28 }),
  spacer(),
  para(`Ngày lập: ${today}`, { center: true }),
  para(`Tham chiếu: ${FULL_REPORT}`, { center: true, italics: true }),
  pageBreak(),

  heading("1. MỤC ĐÍCH VÀ PHẠM VI"),
  para(
    "Bản tóm tắt này trích yếu nội dung báo cáo đầy đủ về ba phương án kỹ thuật xây dựng website Công ty Thiên Đức, nhằm phục vụ trình ban lãnh đạo nắm nhanh bối cảnh, so sánh phương án và quyết định kiến trúc. Chi tiết kỹ thuật, phân tích sâu và bảng biểu đầy đủ xem trong báo cáo tổng hợp.",
    { indent: true }
  ),
  bullet("Dự án: Website công khai + Backend API + Trang quản trị."),
  bullet("Hiện trạng: Đang phát triển frontend (Next.js 16, React 19, Tailwind CSS 4)."),
  bullet("Phạm vi: Giới thiệu, dự án, tin tức, liên hệ, tuyển dụng và quản trị nội dung."),
  spacer(),

  heading("2. SO SÁNH NHANH BA PHƯƠNG ÁN"),
  makeTable(
    ["Phương án", "Mô hình", "Quản trị", "Form/HR", "Chi phí", "Điểm", "Khuyến nghị"],
    [
      ["PA1\nStatic", "Next.js + data tĩnh", "Không", "Hạn chế", "Thấp", "2.4/5", "Giai đoạn FE"],
      ["PA2\nCMS", "Next.js + Headless CMS", "Có (content)", "Hạn chế", "TB", "3.3/5", "Không tối ưu"],
      ["PA3\nFull-stack", "FE + BE + Admin + DB", "Đầy đủ", "Native", "Cao hơn", "4.5/5", "ĐỀ XUẤT"],
    ],
    [11, 18, 12, 12, 10, 10, 17]
  ),
  spacer(),

  heading("3. MA TRẬN QUYẾT ĐỊNH"),
  makeTable(
    ["Tiêu chí", "Trọng số", "PA1", "PA2", "PA3"],
    [
      ["Quản trị nội dung", "25%", "Thấp", "Cao", "Cao"],
      ["Form liên hệ & tuyển dụng", "25%", "Thấp", "Thấp", "Cao"],
      ["Mở rộng dài hạn", "20%", "Thấp", "TB", "Cao"],
      ["Chi phí", "15%", "Tốt", "TB", "TB"],
      ["Tốc độ làm FE", "15%", "Tốt", "TB", "Tốt (GĐ1)"],
      ["Kết luận", "—", "Không đủ", "Chưa đồng bộ", "Chọn PA3"],
    ],
    [36, 12, 14, 14, 24]
  ),
  spacer(),

  heading("4. PHƯƠNG ÁN ĐỀ XUẤT: PA3 — FULL-STACK"),
  para(
    "Đề xuất triển khai kiến trúc Full-stack với ba repository độc lập, một API trung tâm phục vụ cả website công khai và trang quản trị.",
    { indent: true, bold: true }
  ),
  heading("4.1. Lý do chọn (tóm tắt)", HeadingLevel.HEADING_2),
  numbered(1, "Đáp ứng đầy đủ yêu cầu Backend + Trang quản trị đã được xác định."),
  numbered(2, "Tái sử dụng frontend Next.js đang phát triển — không đập lại giao diện."),
  numbered(3, "Quản lý tập trung: nội dung + lead liên hệ + hồ sơ tuyển dụng."),
  numbered(4, "Chủ động dữ liệu, bảo mật và phân quyền (admin / editor / HR)."),
  numbered(5, "Mở rộng tốt: CRM, báo cáo, tích hợp hệ thống khác."),
  spacer(),

  heading("4.2. Kiến trúc ba repository", HeadingLevel.HEADING_2),
  makeTable(
    ["Repository", "Công nghệ", "Vai trò"],
    [
      ["thien-duc-website-frontend", "Next.js 16", "Website công khai, SEO, gọi API"],
      ["thien-duc-website-backend", "NestJS / tương đương", "API, database, auth, upload"],
      ["thien-duc-website-admin", "Vite + React", "Dashboard quản trị nội dung & nghiệp vụ"],
    ],
    [30, 28, 42]
  ),
  spacer(),

  heading("5. LỘ TRÌNH TRIỂN KHAI"),
  makeTable(
    ["Giai đoạn", "Thời gian", "Nội dung chính", "Kết quả"],
    [
      ["G1 — Frontend", "4–8 tuần", "Hoàn thiện UI, mock data", "Website demo"],
      ["G2 — Backend", "4–6 tuần", "Auth, Projects, News, upload", "API staging"],
      ["G3 — Admin", "3–5 tuần", "CRUD nội dung", "Admin staging"],
      ["G4 — Tích hợp", "2–3 tuần", "FE nối API, kiểm thử", "Beta"],
      ["G5 — Mở rộng", "2–4 tuần", "Liên hệ, tuyển dụng", "Production v1"],
    ],
    [18, 14, 40, 28]
  ),
  spacer(),

  heading("6. ƯU — NHƯỢC ĐIỂM PA3 (TÓM TẮT)"),
  makeTable(
    ["Ưu điểm", "Nhược điểm"],
    [
      ["Một hệ thống admin thống nhất", "Chi phí & thời gian cao hơn PA1, PA2"],
      ["Kiểm soát toàn bộ nghiệp vụ & dữ liệu", "Cần nhân sự backend & vận hành"],
      ["Tái sử dụng FE hiện tại", "Phải tự xây giao diện admin"],
      ["Mở rộng linh hoạt (CRM, HR, báo cáo)", "Phức tạp hơn ở giai đoạn đầu"],
    ],
    [50, 50]
  ),
  spacer(),

  heading("7. KIẾN NGHỊ CHÍNH"),
  numbered(1, "Phê duyệt PA3 làm kiến trúc chính thức."),
  numbered(2, "Tiếp tục hoàn thiện frontend giai đoạn 1; chuẩn bị layer API sẵn sàng tích hợp."),
  numbered(3, "Khởi tạo repo backend & admin; thiết kế schema DB và API contract trước."),
  numbered(4, "Triển khai theo 5 giai đoạn; nghiệm thu từng milestone."),
  numbered(5, "Ưu tiên bảo mật dữ liệu liên hệ và hồ sơ ứng viên."),
  spacer(),

  heading("8. KẾT LUẬN"),
  para(
    "Trong ba phương án được xem xét, Phương án 3 (Full-stack — Frontend + Backend + Admin) là lựa chọn phù hợp nhất với định hướng dự án website Thiên Đức. Giai đoạn hiện tại tiếp tục tập trung hoàn thiện giao diện; song song chuẩn bị backend và admin theo lộ trình đã đề xuất.",
    { indent: true }
  ),
  para(`(Xem báo cáo chi tiết: ${FULL_REPORT})`, { center: true, italics: true }),
  spacer(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: "— HẾT BẢN TÓM TẮT —", bold: true, size: 24, font: "Arial", color: BRAND_RGB }),
    ],
  }),
  spacer(),
  para("Người lập: ........................................", { center: true }),
  para("Phê duyệt: ........................................", { center: true }),
];

const doc = new Document({
  creator: "Công ty Thiên Đức",
  title: "Bản tóm tắt — Phương án kỹ thuật website",
  description: "Bản tóm tắt rút gọn từ báo cáo tổng hợp phương án kỹ thuật website Thiên Đức",
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 },
        paragraph: { spacing: { line: 276 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 } },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Thiên Đức — Bản tóm tắt báo cáo kỹ thuật",
                  size: 18,
                  color: "8F8F8F",
                  font: "Arial",
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Bản tóm tắt",
                  size: 18,
                  color: "8F8F8F",
                  font: "Arial",
                }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(OUTPUT, buffer);
console.log(`Đã tạo bản tóm tắt: ${OUTPUT}`);
