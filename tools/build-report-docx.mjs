/**
 * Xuất báo cáo Word có trang bìa, mục lục tự động (cập nhật bằng F9), số trang, heading chuẩn.
 * Nguồn: docs/BAO-CAO-PHUONG-AN-KI-THUAT-WEBSITE.md
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
  ImageRun,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MD_PATH = path.join(ROOT, "docs", "BAO-CAO-PHUONG-AN-KI-THUAT-WEBSITE.md");
const OUT_PATH = path.join(
  ROOT,
  "docs",
  "Báo cáo phương án kỹ thuật website Thiên Đức.docx",
);

const FONT = "Times New Roman";
const COLOR_PRIMARY = "B06613";

function parseInline(text, base = {}) {
  const runs = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: 24, ...base }));
    }
    if (m[1]) {
      runs.push(new TextRun({ text: m[1], font: FONT, size: 24, bold: true, ...base }));
    } else if (m[2]) {
      runs.push(
        new TextRun({ text: m[2], font: "Consolas", size: 22, ...base }),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), font: FONT, size: 24, ...base }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text, font: FONT, size: 24, ...base }));
  }
  return runs;
}

function headingParagraph(text, level) {
  const map = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
  };
  return new Paragraph({
    heading: map[level] ?? HeadingLevel.HEADING_2,
    spacing: { before: level <= 2 ? 360 : 240, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        bold: true,
        color: level === 1 ? COLOR_PRIMARY : "1F4E79",
        size: level === 1 ? 32 : level === 2 ? 28 : 26,
      }),
    ],
  });
}

function bodyParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    children: parseInline(text, { size: opts.small ? 22 : 24 }),
  });
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isTableSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function buildTable(lines) {
  const rows = lines.map(parseTableRow);
  const header = rows[0];
  const body = rows.slice(1);
  const colCount = header.length;
  const colWidth = Math.floor(9360 / colCount);

  const tableRows = [header, ...body].map((cells, ri) => {
    return new TableRow({
      children: cells.map(
        (cell) =>
          new TableCell({
            width: { size: colWidth, type: WidthType.DXA },
            shading: ri === 0 ? { fill: "FFF4CF" } : undefined,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: parseInline(cell, {
                  size: 22,
                  bold: ri === 0,
                }),
              }),
            ],
          }),
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "B06613" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "B06613" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "B06613" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "B06613" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
  });
}

function imageParagraph(relPath, alt) {
  const full = path.join(ROOT, "docs", relPath);
  if (!fs.existsSync(full)) {
    return bodyParagraph(`[Hình: ${alt} — chưa tìm thấy ${relPath}]`);
  }
  const data = fs.readFileSync(full);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 },
    children: [
      new ImageRun({
        type: full.endsWith(".png") ? "png" : "jpg",
        data,
        transformation: { width: 520, height: 360 },
        altText: { title: alt, description: alt, name: alt },
      }),
    ],
  });
}

function coverSection() {
  const center = (text, size, bold = false, color) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text,
          font: FONT,
          size,
          bold,
          color,
        }),
      ],
    });

  return {
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
      titlePage: true,
    },
    children: [
      new Paragraph({ spacing: { before: 2400 } }),
      center("CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG", 28, true, COLOR_PRIMARY),
      center("THIÊN ĐỨC", 36, true, COLOR_PRIMARY),
      new Paragraph({ spacing: { before: 600 } }),
      center("BÁO CÁO", 32, true, "1F4E79"),
      center("PHƯƠNG ÁN KỸ THUẬT", 32, true, "1F4E79"),
      center("WEBSITE GIỚI THIỆU CÔNG TY", 28, true, "1F4E79"),
      new Paragraph({ spacing: { before: 800 } }),
      center("Phương án 2 (PA2)", 26, false, "333333"),
      center("Ngày cập nhật: 26/06/2026", 24, false, "666666"),
      new Paragraph({ spacing: { before: 400 } }),
      center("Demo: thien-duc-website-frontend.vercel.app", 22, false, "666666"),
      new Paragraph({
        children: [new PageBreak()],
      }),
    ],
  };
}

function tocSection() {
  return {
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "— ", font: FONT, size: 20, color: "888888" }),
              new TextRun({
                children: [PageNumber.CURRENT],
                font: FONT,
                size: 20,
                color: "888888",
              }),
              new TextRun({ text: " —", font: FONT, size: 20, color: "888888" }),
            ],
          }),
        ],
      }),
    },
    children: [
      headingParagraph("MỤC LỤC", 1),
      bodyParagraph(
        "Mở file Word → nhấn Ctrl+A rồi F9 (hoặc chuột phải Mục lục → Cập nhật trường) để hiển thị đúng số trang.",
        { small: true },
      ),
      new TableOfContents("Mục lục", {
        hyperlink: true,
        headingStyleRange: "1-3",
      }),
      new Paragraph({ children: [new PageBreak()] }),
    ],
  };
}

function parseMarkdownToChildren(md) {
  const lines = md.split(/\r?\n/);
  const children = [];
  let i = 0;
  let skipUntilSummary = true;

  while (i < lines.length) {
    const line = lines[i];

    if (skipUntilSummary) {
      if (line.startsWith("## TÓM TẮT ĐIỀU HÀNH")) {
        skipUntilSummary = false;
        children.push(headingParagraph("TÓM TẮT ĐIỀU HÀNH", 1));
        i++;
        continue;
      }
      i++;
      continue;
    }

  if (line.startsWith("#### ")) {
      children.push(headingParagraph(line.slice(5).trim(), 4));
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      children.push(headingParagraph(line.slice(4).trim(), 3));
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      if (title !== "MỤC LỤC") {
        if (title.startsWith("PHẦN ") || title.startsWith("PHỤ LỤC")) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
        children.push(headingParagraph(title, 1));
      }
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      i++;
      continue;
    }

    if (line.trim() === "---") {
      i++;
      continue;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
    if (img) {
      children.push(imageParagraph(img[2], img[1]));
      i++;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (!isTableSeparator(lines[i])) {
          tableLines.push(lines[i]);
        }
        i++;
      }
      if (tableLines.length > 0) {
        children.push(buildTable(tableLines));
        children.push(new Paragraph({ spacing: { after: 120 } }));
      }
      continue;
    }

    if (line.startsWith("> ")) {
      const quote = line.slice(2).trim();
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 120 },
          indent: { left: 360 },
          shading: { fill: "F5F5F5" },
          children: parseInline(quote, { size: 22, italics: quote.includes("Chi tiết kỹ thuật") }),
        }),
      );
      i++;
      continue;
    }

    if (line.trim().startsWith("- ")) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          indent: { left: 360, hanging: 360 },
          children: [
            new TextRun({ text: "• ", font: FONT, size: 24 }),
            ...parseInline(line.trim().slice(2)),
          ],
        }),
      );
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      children.push(bodyParagraph(line.trim()));
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    children.push(bodyParagraph(line.trim()));
    i++;
  }

  return children;
}

async function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const contentChildren = parseMarkdownToChildren(md);

  const doc = new Document({
    features: { updateFields: true },
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 24 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [
      coverSection(),
      tocSection(),
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Báo cáo PA2 — Website Thiên Đức  |  Trang ",
                    font: FONT,
                    size: 18,
                    color: "888888",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT,
                    size: 18,
                    color: "888888",
                  }),
                ],
              }),
            ],
          }),
        },
        children: contentChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_PATH, buffer);
  console.log("DOCX (trang bìa + mục lục + số trang):", OUT_PATH);
  console.log("Lưu ý: Mở Word → Ctrl+A → F9 để cập nhật mục lục và số trang.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
