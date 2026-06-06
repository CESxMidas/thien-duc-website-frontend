/**
 * Script tạo báo cáo Word: Phương án kỹ thuật website Công ty Thiên Đức
 * Chạy: node docs/generate-bao-cao.mjs
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
const OUTPUT = path.join(__dirname, "Bao-cao-phuong-an-ky-thuat-website-Thien-Duc.docx");

const BRAND = "B06613";
const BRAND_RGB = "B06613";
const ACCENT = "FDCF04";
const MUTED_BG = "F2F2F2";

const today = new Date().toLocaleDateString("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: BRAND_RGB,
        size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24,
        font: "Arial",
      }),
    ],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { after: opts.after ?? 160, line: 276 },
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
    spacing: { after: 80 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `• ${text}`, size: 24, font: "Arial" })],
  });
}

function numbered(index, text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 720, hanging: 360 },
    children: [new TextRun({ text: `${index}. ${text}`, size: 24, font: "Arial" })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
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
          new TextRun({
            text,
            size: 22,
            font: "Arial",
            bold: opts.bold,
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => tableHeaderCell(h, colWidths?.[i])),
  });
  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map((cell, ci) =>
          tableCell(cell, { width: colWidths?.[ci], shade: ri % 2 === 1 })
        ),
      })
  );
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
    rows: [headerRow, ...dataRows],
  });
}

function coverBlock() {
  return [
    spacer(),
    spacer(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BRAND_RGB, space: 8 } },
      children: [
        new TextRun({
          text: "CÔNG TY TNHH ĐẦU TƯ – XÂY DỰNG – THƯƠNG MẠI THIÊN ĐỨC",
          bold: true,
          size: 28,
          font: "Arial",
          color: BRAND_RGB,
        }),
      ],
    }),
    spacer(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      shading: { fill: MUTED_BG, type: ShadingType.CLEAR },
      spacing: { before: 400, after: 400 },
      children: [
        new TextRun({
          text: "BÁO CÁO",
          bold: true,
          size: 56,
          font: "Arial",
          color: BRAND_RGB,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "PHƯƠNG ÁN KỸ THUẬT XÂY DỰNG",
          bold: true,
          size: 36,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "WEBSITE GIỚI THIỆU CÔNG TY",
          bold: true,
          size: 36,
          font: "Arial",
          color: BRAND_RGB,
        }),
      ],
    }),
    spacer(),
    spacer(),
    para("Dự án: Hệ thống website công khai, backend API và trang quản trị nội dung", {
      center: true,
    }),
    para(`Ngày lập: ${today}`, { center: true }),
    para("Phân loại: Báo cáo kỹ thuật – Nội bộ", { center: true, italics: true }),
    pageBreak(),
  ];
}

function tocBlock() {
  const items = [
    ["1.", "Tóm tắt điều hành", "3"],
    ["2.", "Bối cảnh và mục tiêu dự án", "4"],
    ["3.", "Hiện trạng kỹ thuật", "5"],
    ["4.", "Phương án 1: Static-first (Jamstack / SSG)", "6"],
    ["5.", "Phương án 2: Headless CMS", "8"],
    ["6.", "Phương án 3: Full-stack (API + Database + Admin)", "10"],
    ["7.", "Bảng so sánh tổng hợp ba phương án", "13"],
    ["8.", "Phương án được đề xuất và lý do lựa chọn", "15"],
    ["9.", "Kiến trúc triển khai đề xuất (3 repository)", "17"],
    ["10.", "Lộ trình triển khai theo giai đoạn", "19"],
    ["11.", "Ưu nhược điểm tổng hợp của phương án 3", "21"],
    ["12.", "Rủi ro, giải pháp và yêu cầu vận hành", "22"],
    ["13.", "Kết luận và kiến nghị", "24"],
  ];
  return [
    heading("MỤC LỤC", HeadingLevel.HEADING_1),
    spacer(),
    ...items.flatMap(([num, title, page]) => [
      new Paragraph({
        spacing: { after: 60 },
        tabStops: [{ type: "right", position: 9000 }],
        children: [
          new TextRun({ text: `${num} ${title}`, size: 24, font: "Arial" }),
          new TextRun({ text: `\t${page}`, size: 24, font: "Arial" }),
        ],
      }),
    ]),
    pageBreak(),
  ];
}

const children = [
  ...coverBlock(),
  ...tocBlock(),

  heading("1. TÓM TẮT ĐIỀU HÀNH"),
  para(
    "Báo cáo này trình bày ba phương án kỹ thuật khả thi cho việc xây dựng website giới thiệu Công ty Thiên Đức, bao gồm trang công khai, hệ thống backend (API) và trang quản trị nội dung. Dự án hiện đang trong giai đoạn phát triển giao diện frontend với Next.js 16, React 19 và Tailwind CSS 4, dữ liệu tạm thời được lưu trong mã nguồn.",
    { indent: true }
  ),
  para(
    "Sau khi phân tích nhu cầu nghiệp vụ (giới thiệu công ty, dự án, tin tức, liên hệ, tuyển dụng), khả năng mở rộng và yêu cầu vận hành lâu dài, Công ty đề xuất lựa chọn Phương án 3: Kiến trúc Full-stack với ba repository độc lập — thien-duc-website-frontend, thien-duc-website-backend và thien-duc-website-admin.",
    { indent: true }
  ),
  para(
    "Phương án này đáp ứng đồng thời mục tiêu ngắn hạn (hoàn thiện giao diện, demo nhanh) và mục tiêu dài hạn (quản trị nội dung, xử lý form liên hệ, quản lý tuyển dụng, phân quyền người dùng nội bộ).",
    { indent: true }
  ),
  heading("1.1. Bảng tóm tắt ba phương án", HeadingLevel.HEADING_2),
  para(
    "Bảng dưới đây tổng hợp nhanh đặc điểm, mức độ phù hợp và khuyến nghị của từng phương án nhằm hỗ trợ ban lãnh đạo nắm bắt nội dung báo cáo trong thời gian ngắn.",
    { indent: true }
  ),
  makeTable(
    ["Phương án", "Mô hình kỹ thuật", "Trang quản trị", "Form & tuyển dụng", "Chi phí", "Điểm đánh giá", "Khuyến nghị"],
    [
      [
        "PA1\nStatic-first",
        "Next.js + dữ liệu tĩnh\n(SSG / Jamstack)",
        "Không có",
        "Chỉ qua dịch vụ ngoài",
        "Thấp",
        "2.4 / 5",
        "Dùng giai đoạn 1\n(làm FE trước)",
      ],
      [
        "PA2\nHeadless CMS",
        "Next.js + CMS\n(Sanity, Strapi...)",
        "Có (soạn nội dung)",
        "Hạn chế, thường cần BE riêng",
        "Trung bình",
        "3.3 / 5",
        "Không tối ưu\ncho dự án này",
      ],
      [
        "PA3\nFull-stack",
        "Frontend + Backend\n+ Admin + Database",
        "Có (đầy đủ,\ntùy biến)",
        "Tích hợp native,\nquản lý tập trung",
        "Cao hơn PA1, PA2",
        "4.5 / 5",
        "ĐỀ XUẤT\nchính thức",
      ],
    ],
    [12, 20, 14, 16, 10, 12, 16]
  ),
  spacer(),
  heading("1.2. Bảng tóm tắt quyết định", HeadingLevel.HEADING_2),
  makeTable(
    ["Tiêu chí quyết định", "Trọng số", "PA1", "PA2", "PA3"],
    [
      ["Quản trị nội dung (tin, dự án, banner)", "25%", "Thấp", "Cao", "Cao"],
      ["Form liên hệ & tuyển dụng", "25%", "Thấp", "Thấp–TB", "Cao"],
      ["Khả năng mở rộng dài hạn", "20%", "Thấp", "Trung bình", "Cao"],
      ["Chi phí phát triển & vận hành", "15%", "Cao", "Trung bình", "Thấp–TB"],
      ["Tốc độ triển khai giao diện FE", "15%", "Cao", "Trung bình", "Cao (giai đoạn 1)"],
      ["Tổng kết", "100%", "Không đủ\nyêu cầu BE + Admin", "Chưa đồng bộ\nmột hệ thống", "Phù hợp nhất\n→ Chọn PA3"],
    ],
    [34, 12, 14, 14, 26]
  ),
  spacer(),

  heading("2. BỐI CẢNH VÀ MỤC TIÊU DỰ ÁN", HeadingLevel.HEADING_1),
  heading("2.1. Bối cảnh", HeadingLevel.HEADING_2),
  para(
    "Công ty Thiên Đức hoạt động trong lĩnh vực đầu tư, xây dựng và phát triển bất động sản. Website giới thiệu đóng vai trò kênh truyền thông chính thức, cung cấp thông tin về năng lực doanh nghiệp, dự án tiêu biểu, tin tức hoạt động và kênh tiếp nhận liên hệ từ khách hàng, đối tác, ứng viên tuyển dụng.",
    { indent: true }
  ),
  heading("2.2. Mục tiêu dự án", HeadingLevel.HEADING_2),
  bullet("Xây dựng website công khai chuyên nghiệp, tối ưu trải nghiệm người dùng và SEO."),
  bullet("Cho phép bộ phận nội dung tự cập nhật tin tức, dự án, banner mà không phụ thuộc hoàn toàn vào lập trình viên."),
  bullet("Tiếp nhận và quản lý yêu cầu liên hệ, hồ sơ ứng tuyển qua hệ thống tập trung."),
  bullet("Đảm bảo khả năng mở rộng, bảo mật và vận hành ổn định trong dài hạn."),
  heading("2.3. Phạm vi chức năng dự kiến", HeadingLevel.HEADING_2),
  makeTable(
    ["Nhóm chức năng", "Mô tả", "Đối tượng sử dụng"],
    [
      ["Trang công khai", "Trang chủ, Giới thiệu, Dự án, Tin tức, Liên hệ, Tuyển dụng...", "Khách hàng, đối tác, ứng viên"],
      ["Backend API", "Cung cấp dữ liệu, xử lý form, upload file, xác thực", "Frontend & Admin"],
      ["Trang quản trị", "CRUD nội dung, duyệt/xuất bản, xem lead & hồ sơ", "Nhân viên nội bộ"],
    ],
    [25, 45, 30]
  ),
  spacer(),

  heading("3. HIỆN TRẠNG KỸ THUẬT", HeadingLevel.HEADING_1),
  heading("3.1. Công nghệ đang sử dụng", HeadingLevel.HEADING_2),
  makeTable(
    ["Thành phần", "Phiên bản / Công nghệ", "Ghi chú"],
    [
      ["Framework", "Next.js 16.2.6 (App Router)", "Hỗ trợ SSG, SSR, ISR"],
      ["UI Library", "React 19.2.4", "Component-based"],
      ["Ngôn ngữ", "TypeScript 5", "Type-safe"],
      ["Styling", "Tailwind CSS 4", "Utility-first CSS"],
      ["Icon", "Lucide React", "Icon set nhẹ"],
      ["Lint", "ESLint 9 + eslint-config-next", "Chất lượng mã"],
    ],
    [25, 35, 40]
  ),
  spacer(),
  heading("3.2. Cấu trúc mã nguồn hiện tại", HeadingLevel.HEADING_2),
  bullet("src/app/: Các route trang công khai (trang chủ, giới thiệu, dự án, tin tức, liên hệ...)."),
  bullet("src/components/: Layout (header, footer), sections theo trang, UI components dùng chung."),
  bullet("src/data/: Dữ liệu mock tạm thời (projects, news, navigation, banners...)."),
  bullet("src/types/content.ts: Định nghĩa type dữ liệu — chuẩn bị cho tích hợp API."),
  bullet("public/images/: Hình ảnh tĩnh (logo, banner, dự án, tin tức)."),
  heading("3.3. Hạn chế giai đoạn hiện tại", HeadingLevel.HEADING_2),
  bullet("Nội dung thay đổi phải qua developer chỉnh sửa mã nguồn."),
  bullet("Form liên hệ chưa có API submit thực tế (đang dùng giải pháp tạm)."),
  bullet("Chưa có hệ thống xác thực, phân quyền và trang quản trị."),
  bullet("Chưa có cơ sở dữ liệu tập trung và quy trình publish nội dung."),

  pageBreak(),
  heading("4. PHƯƠNG ÁN 1: STATIC-FIRST (JAMSTACK / SSG)", HeadingLevel.HEADING_1),
  heading("4.1. Mô tả phương án", HeadingLevel.HEADING_2),
  para(
    "Phương án 1 xây dựng website dưới dạng trang tĩnh (Static Site Generation — SSG). Toàn bộ nội dung được định nghĩa trong mã nguồn (TypeScript/JSON) và hình ảnh trong thư mục public. Khi build (next build), Next.js sinh HTML tĩnh và phân phối qua CDN.",
    { indent: true }
  ),
  heading("4.2. Kiến trúc", HeadingLevel.HEADING_2),
  para("Luồng dữ liệu: Developer → src/data + public/images → next build (SSG) → CDN/Hosting → Người dùng.", {
    indent: true,
    italics: true,
  }),
  heading("4.3. Công nghệ đề xuất", HeadingLevel.HEADING_2),
  makeTable(
    ["Lớp", "Công nghệ"],
    [
      ["Frontend", "Next.js 16 + React 19 + Tailwind CSS 4"],
      ["Dữ liệu", "File TypeScript/JSON trong repo"],
      ["Hosting", "Vercel, Cloudflare Pages, Netlify"],
      ["Form", "Dịch vụ bên thứ ba (Formspree, Resend) — nếu cần"],
    ],
    [30, 70]
  ),
  spacer(),
  heading("4.4. Ưu điểm", HeadingLevel.HEADING_2),
  numbered(1, "Tốc độ tải trang rất cao — HTML được phục vụ từ CDN, Time to First Byte thấp."),
  numbered(2, "Chi phí hosting thấp, có thể miễn phí ở mức traffic vừa phải."),
  numbered(3, "Bảo mật tốt — không có server động, bề mặt tấn công nhỏ."),
  numbered(4, "SEO thuận lợi — nội dung HTML sẵn có cho crawler."),
  numbered(5, "Phù hợp giai đoạn làm giao diện trước — đúng với hiện trạng dự án."),
  numbered(6, "Stack gọn, ít phụ thuộc, dễ onboard developer mới."),
  heading("4.5. Nhược điểm", HeadingLevel.HEADING_2),
  numbered(1, "Cập nhật nội dung phụ thuộc developer — không phù hợp cập nhật thường xuyên."),
  numbered(2, "Không có trang quản trị nội bộ — marketing/HR không tự vận hành được."),
  numbered(3, "Form liên hệ, tuyển dụng chỉ xử lý được ở mức cơ bản qua dịch vụ ngoài."),
  numbered(4, "Khó mở rộng nghiệp vụ (phân quyền, workflow duyệt bài, báo cáo)."),
  numbered(5, "Không đáp ứng yêu cầu backend và admin mà Công ty đã xác định."),
  heading("4.6. Đánh giá mức độ phù hợp", HeadingLevel.HEADING_2),
  makeTable(
    ["Tiêu chí", "Đánh giá (1–5)", "Nhận xét"],
    [
      ["Tốc độ triển khai FE", "5/5", "Rất phù hợp giai đoạn hiện tại"],
      ["Tự quản trị nội dung", "1/5", "Không đáp ứng"],
      ["Form & tuyển dụng", "2/5", "Chỉ qua dịch vụ ngoài"],
      ["Mở rộng dài hạn", "2/5", "Hạn chế"],
      ["Chi phí vận hành", "5/5", "Rất thấp"],
    ],
    [35, 20, 45]
  ),
  spacer(),
  para("Kết luận phương án 1: Phù hợp làm nền tảng giai đoạn 1 (FE + mock data), nhưng không đủ cho mục tiêu cuối có backend và trang quản trị.", {
    bold: true,
    indent: true,
  }),

  pageBreak(),
  heading("5. PHƯƠNG ÁN 2: HEADLESS CMS", HeadingLevel.HEADING_1),
  heading("5.1. Mô tả phương án", HeadingLevel.HEADING_2),
  para(
    "Phương án 2 tách biệt lớp nội dung và lớp hiển thị. Frontend Next.js fetch dữ liệu từ hệ thống Headless CMS (Sanity, Strapi, Payload CMS, Contentful...) qua API. CMS cung cấp giao diện soạn thảo cho người không chuyên kỹ thuật.",
    { indent: true }
  ),
  heading("5.2. Kiến trúc", HeadingLevel.HEADING_2),
  para(
    "Luồng: Nhân viên marketing → CMS Admin UI → Content API → Next.js (SSG/ISR) → CDN → Người dùng.",
    { indent: true, italics: true }
  ),
  heading("5.3. Lựa chọn CMS phổ biến", HeadingLevel.HEADING_2),
  makeTable(
    ["CMS", "Ưu điểm", "Nhược điểm"],
    [
      ["Sanity", "Realtime preview, schema linh hoạt, free tier tốt", "Học curve schema GROQ"],
      ["Strapi", "Open-source, self-host hoặc cloud", "Tốn công vận hành server"],
      ["Payload CMS", "TypeScript-native, gắn Next.js", "Cộng đồng nhỏ hơn Strapi"],
      ["Contentful", "Ổn định, enterprise-ready", "Chi phí cao khi scale"],
    ],
    [20, 40, 40]
  ),
  spacer(),
  heading("5.4. Ưu điểm", HeadingLevel.HEADING_2),
  numbered(1, "Người không chuyên kỹ thuật có thể tự đăng/sửa tin tức, dự án."),
  numbered(2, "Frontend giữ nguyên Next.js — chỉ thay layer lấy dữ liệu."),
  numbered(3, "ISR (Incremental Static Regeneration) giúp trang vẫn nhanh khi nội dung mới."),
  numbered(4, "Triển khai nhanh hơn tự xây admin từ đầu cho phần nội dung."),
  numbered(5, "Preview bài viết trước khi publish — workflow content tốt."),
  heading("5.5. Nhược điểm", HeadingLevel.HEADING_2),
  numbered(1, "CMS mạnh về nội dung nhưng yếu về nghiệp vụ giao dịch (form, CV, lead CRM)."),
  numbered(2, "Form liên hệ, tuyển dụng thường vẫn cần backend riêng — dễ thành 2 hệ thống."),
  numbered(3, "Phụ thuộc nhà cung cấp CMS hoặc phải tự host Strapi."),
  numbered(4, "Chi phí license/hosting CMS khi dữ liệu và user tăng."),
  numbered(5, "Schema CMS khó tùy biến sâu cho quy trình nội bộ đặc thù."),
  numbered(6, "Phân quyền phức tạp (editor vs admin vs HR) có thể vượt khả năng CMS."),
  heading("5.6. Đánh giá mức độ phù hợp", HeadingLevel.HEADING_2),
  makeTable(
    ["Tiêu chí", "Đánh giá (1–5)", "Nhận xét"],
    [
      ["Quản trị nội dung", "5/5", "Rất tốt cho tin tức, dự án"],
      ["Form & tuyển dụng", "2/5", "Cần bổ sung backend"],
      ["Kiểm soát toàn diện", "3/5", "Phụ thuộc CMS"],
      ["Chi phí dài hạn", "3/5", "Trung bình — có thể tăng"],
      ["Thống nhất một admin", "2/5", "Khó gộp content + HR + lead"],
    ],
    [35, 20, 45]
  ),
  spacer(),
  para("Kết luận phương án 2: Phù hợp nếu nhu cầu chính chỉ là đăng bài. Với yêu cầu backend + admin thống nhất (nội dung + liên hệ + tuyển dụng), phương án này không tối ưu.", {
    bold: true,
    indent: true,
  }),

  pageBreak(),
  heading("6. PHƯƠNG ÁN 3: FULL-STACK (API + DATABASE + ADMIN)", HeadingLevel.HEADING_1),
  heading("6.1. Mô tả phương án", HeadingLevel.HEADING_2),
  para(
    "Phương án 3 xây dựng hệ thống hoàn chỉnh gồm ba thành phần độc lập: (1) Website công khai (Next.js), (2) Backend API với cơ sở dữ liệu, (3) Trang quản trị nội bộ. Cả frontend public và admin đều giao tiếp với cùng một API trung tâm.",
    { indent: true }
  ),
  heading("6.2. Kiến trúc tổng thể", HeadingLevel.HEADING_2),
  para("Ba repository đề xuất:", { indent: true }),
  bullet("thien-duc-website-frontend — Website công khai, SEO, trải nghiệm người dùng."),
  bullet("thien-duc-website-backend — REST/GraphQL API, auth, database, upload file."),
  bullet("thien-duc-website-admin — Giao diện quản trị cho nhân viên nội bộ."),
  heading("6.3. Công nghệ đề xuất", HeadingLevel.HEADING_2),
  makeTable(
    ["Thành phần", "Công nghệ đề xuất", "Vai trò"],
    [
      ["Frontend public", "Next.js 16 + Tailwind 4", "Trang công khai"],
      ["Backend", "NestJS / .NET / Laravel + Prisma/ORM", "API & business logic"],
      ["Database", "PostgreSQL", "Lưu trữ dữ liệu"],
      ["Admin", "Vite + React + Tailwind", "CRUD & dashboard"],
      ["Storage", "S3 / Cloudinary / local", "Ảnh, CV, tài liệu"],
      ["Auth", "JWT / Session + RBAC", "Đăng nhập & phân quyền"],
      ["Email", "Resend / SMTP", "Thông báo form liên hệ"],
    ],
    [22, 38, 40]
  ),
  spacer(),
  heading("6.4. Phân chia API", HeadingLevel.HEADING_2),
  makeTable(
    ["Module", "API công khai (FE)", "API quản trị (Admin)"],
    [
      ["Dự án", "GET /projects, GET /projects/:slug", "CRUD, publish/unpublish"],
      ["Tin tức", "GET /news, GET /news/:slug", "CRUD, lên lịch publish"],
      ["Trang chủ/Banner", "GET /home", "Cập nhật banner, section"],
      ["Giới thiệu", "GET /pages/about", "CRUD nội dung trang"],
      ["Liên hệ", "POST /contact", "GET danh sách, đánh dấu xử lý"],
      ["Tuyển dụng", "GET /jobs, POST /applications", "CRUD job, xem CV"],
      ["Media", "URL công khai", "Upload, xóa, quản lý thư viện"],
      ["Auth", "—", "Login, refresh token, phân quyền"],
    ],
    [20, 40, 40]
  ),
  spacer(),
  heading("6.5. Ưu điểm", HeadingLevel.HEADING_2),
  numbered(1, "Kiểm soát hoàn toàn nghiệp vụ — không phụ thuộc CMS bên thứ ba."),
  numbered(2, "Một hệ thống admin thống nhất: nội dung + lead + tuyển dụng."),
  numbered(3, "Phân quyền linh hoạt (admin, editor, HR) theo nhu cầu Công ty."),
  numbered(4, "Dữ liệu nằm trong database của Công ty — chủ động backup, bảo mật."),
  numbered(5, "Frontend hiện tại tái sử dụng tối đa — chỉ thay layer data."),
  numbered(6, "Mở rộng dễ dàng: tích hợp CRM, Zalo OA, báo cáo, đa ngôn ngữ."),
  numbered(7, "Ba repo tách biệt — team FE, BE, vận hành làm việc song song."),
  heading("6.6. Nhược điểm", HeadingLevel.HEADING_2),
  numbered(1, "Thời gian và chi phí phát triển cao hơn phương án 1 và 2."),
  numbered(2, "Cần nhân sự backend và vận hành server/database."),
  numbered(3, "Trách nhiệm bảo mật, backup, monitoring thuộc về Công ty."),
  numbered(4, "Phải tự xây giao diện admin (không có sẵn như CMS)."),
  numbered(5, "Phức tạp hơn trong giai đoạn đầu — cần lộ trình triển khai rõ ràng."),
  heading("6.7. Đánh giá mức độ phù hợp", HeadingLevel.HEADING_2),
  makeTable(
    ["Tiêu chí", "Đánh giá (1–5)", "Nhận xét"],
    [
      ["Quản trị nội dung", "5/5", "Admin tùy chỉnh theo nhu cầu"],
      ["Form & tuyển dụng", "5/5", "Xử lý tập trung qua API"],
      ["Kiểm soát & mở rộng", "5/5", "Toàn quyền kiến trúc"],
      ["Tái sử dụng FE hiện tại", "5/5", "Giữ nguyên UI, đổi data layer"],
      ["Chi phí ban đầu", "2/5", "Cao hơn PA1, PA2"],
      ["Thời gian ra mắt đầy đủ", "3/5", "Triển khai theo giai đoạn"],
    ],
    [35, 20, 45]
  ),

  pageBreak(),
  heading("7. BẢNG SO SÁNH TỔNG HỢP BA PHƯƠNG ÁN", HeadingLevel.HEADING_1),
  makeTable(
    ["Tiêu chí so sánh", "PA1: Static", "PA2: Headless CMS", "PA3: Full-stack"],
    [
      ["Thời gian ra mắt FE", "Rất nhanh", "Trung bình", "FE nhanh, full system lâu hơn"],
      ["Chi phí phát triển", "Thấp", "Trung bình", "Cao nhất"],
      ["Chi phí vận hành/tháng", "Rất thấp", "Trung bình", "Trung bình — Cao"],
      ["Tự cập nhật nội dung", "Không", "Có", "Có"],
      ["Trang quản trị", "Không", "CMS có sẵn", "Tự xây — tùy biến"],
      ["Form liên hệ", "Dịch vụ ngoài", "Dịch vụ ngoài / plugin", "Tích hợp native"],
      ["Tuyển dụng & CV", "Không / email", "Hạn chế", "Đầy đủ"],
      ["Phân quyền nội bộ", "Không", "Hạn chế", "Linh hoạt"],
      ["SEO", "Xuất sắc", "Tốt (SSG/ISR)", "Tốt (SSG/ISR)"],
      ["Bảo mật dữ liệu", "Cao (ít surface)", "Phụ thuộc CMS", "Chủ động kiểm soát"],
      ["Khả năng mở rộng", "Thấp", "Trung bình", "Cao"],
      ["Phù hợp có BE + Admin", "Không", "Một phần", "Hoàn toàn"],
    ],
    [28, 24, 24, 24]
  ),
  spacer(),
  heading("7.1. Ma trận quyết định", HeadingLevel.HEADING_2),
  para(
    "Dựa trên trọng số nghiệp vụ: (1) Quản trị nội dung — 25%, (2) Form & tuyển dụng — 25%, (3) Khả năng mở rộng — 20%, (4) Chi phí — 15%, (5) Tốc độ triển khai FE — 15%.",
    { indent: true }
  ),
  makeTable(
    ["Phương án", "Điểm có trọng số (thang 5)", "Xếp hạng"],
    [
      ["PA1 — Static-first", "2.4 / 5", "Thứ 3"],
      ["PA2 — Headless CMS", "3.3 / 5", "Thứ 2"],
      ["PA3 — Full-stack", "4.5 / 5", "Thứ 1 — Đề xuất"],
    ],
    [40, 35, 25]
  ),

  pageBreak(),
  heading("8. PHƯƠNG ÁN ĐƯỢC ĐỀ XUẤT VÀ LÝ DO LỰA CHỌN", HeadingLevel.HEADING_1),
  heading("8.1. Phương án được đề xuất", HeadingLevel.HEADING_2),
  para("Công ty đề xuất triển khai Phương án 3: Kiến trúc Full-stack với ba repository độc lập.", {
    bold: true,
    indent: true,
    size: 26,
  }),
  heading("8.2. Lý do lựa chọn chi tiết", HeadingLevel.HEADING_2),
  numbered(
    1,
    "Đồng bộ với định hướng dự án: Ban lãnh đạo đã xác định website sẽ có Backend và Trang quản trị — PA3 là phương án duy nhất đáp ứng đầy đủ mà không phải ghép nhiều hệ thống rời rạc."
  ),
  numbered(
    2,
    "Tái sử dụng tài sản hiện có: Frontend Next.js đang phát triển (components, types, routes) được giữ nguyên. Giai đoạn 1 tiếp tục dùng mock data; khi API sẵn sàng chỉ thay layer lib/api — không đập lại giao diện."
  ),
  numbered(
    3,
    "Quản lý nghiệp vụ tập trung: Ngoài tin tức và dự án, website có Liên hệ và Tuyển dụng — cần lưu trữ, theo dõi, phân công xử lý. CMS thuần không xử lý tốt; API tự xây cho phép workflow nội bộ."
  ),
  numbered(
    4,
    "Chủ động dữ liệu và bảo mật: Thông tin khách hàng, ứng viên thuộc dữ liệu nhạy cảm. Lưu trữ trên hạ tầng kiểm soát được giúp tuân thủ chính sách nội bộ và quy định bảo vệ dữ liệu."
  ),
  numbered(
    5,
    "Phân quyền theo vai trò: Editor đăng tin, HR quản lý tuyển dụng, Admin cấu hình hệ thống — RBAC trên backend linh hoạt hơn CMS đóng gói."
  ),
  numbered(
    6,
    "Mở rộng tương lai: Tích hợp CRM, chatbot, đa ngôn ngữ, báo cáo thống kê truy cập — PA3 có nền tảng kỹ thuật sẵn sàng."
  ),
  numbered(
    7,
    "Tách ba repo phù hợp tổ chức phát triển: Team có thể phân công rõ — frontend, backend, admin — deploy độc lập, giảm rủi ro ảnh hưởng chéo."
  ),
  heading("8.3. Chiến lược triển khai lai (khuyến nghị)", HeadingLevel.HEADING_2),
  para(
    "Không bỏ giai đoạn FE hiện tại. Áp dụng chiến lược 'Frontend-first, API-ready':",
    { indent: true }
  ),
  bullet("Giai đoạn 1: Hoàn thiện PA1 trong repo frontend (mock data, UI, SEO cơ bản)."),
  bullet("Giai đoạn 2: Xây backend — auth, CRUD dự án/tin tức, upload ảnh."),
  bullet("Giai đoạn 3: Xây admin — login, dashboard, quản lý nội dung."),
  bullet("Giai đoạn 4: Nối frontend vào API; bật ISR/revalidate khi publish."),
  bullet("Giai đoạn 5: Form liên hệ, tuyển dụng, báo cáo và tối ưu vận hành."),

  pageBreak(),
  heading("9. KIẾN TRÚC TRIỂN KHAI ĐỀ XUẤT (3 REPOSITORY)", HeadingLevel.HEADING_1),
  heading("9.1. Sơ đồ tương tác", HeadingLevel.HEADING_2),
  para(
    "[Khách truy cập] → thien-duc-website-frontend → GET API công khai → thien-duc-website-backend → PostgreSQL / Storage",
    { indent: true, italics: true }
  ),
  para(
    "[Nhân viên nội bộ] → thien-duc-website-admin → API có xác thực → thien-duc-website-backend → PostgreSQL / Storage",
    { indent: true, italics: true }
  ),
  heading("9.2. Trách nhiệm từng repository", HeadingLevel.HEADING_2),
  makeTable(
    ["Repository", "Công nghệ", "Trách nhiệm chính", "Không làm"],
    [
      ["frontend", "Next.js 16", "UI public, SEO, gọi API read + submit form", "Auth admin, CRUD"],
      ["backend", "NestJS / tương đương", "API, DB, auth, upload, business rules", "Render HTML public"],
      ["admin", "Vite + React", "Dashboard, CRUD, xem lead/CV", "Truy cập DB trực tiếp"],
    ],
    [18, 22, 35, 25]
  ),
  spacer(),
  heading("9.3. Hợp đồng dữ liệu (API Contract)", HeadingLevel.HEADING_2),
  para(
    "Các type trong src/types/content.ts (Project, NewsPost, NavItem...) là chuẩn tham chiếu. Backend trả JSON đúng shape; frontend và admin dùng chung schema. Khuyến nghị bổ sung package shared hoặc OpenAPI spec.",
    { indent: true }
  ),
  heading("9.4. Biến môi trường", HeadingLevel.HEADING_2),
  makeTable(
    ["Repository", "Biến môi trường", "Ví dụ"],
    [
      ["frontend", "NEXT_PUBLIC_API_URL", "https://api.thienduc.vn/v1"],
      ["frontend", "NEXT_PUBLIC_SITE_URL", "https://thienduc.vn"],
      ["backend", "DATABASE_URL", "postgresql://..."],
      ["backend", "CORS_ORIGINS", "https://thienduc.vn,https://admin.thienduc.vn"],
      ["admin", "VITE_API_URL", "https://api.thienduc.vn/v1"],
    ],
    [22, 38, 40]
  ),

  pageBreak(),
  heading("10. LỘ TRÌNH TRIỂN KHAI THEO GIAI ĐOẠN", HeadingLevel.HEADING_1),
  makeTable(
    ["Giai đoạn", "Thời gian dự kiến", "Hạng mục", "Kết quả bàn giao"],
    [
      ["G1 — Frontend", "4–8 tuần", "Hoàn thiện UI tất cả trang, mock data, responsive", "Website demo static"],
      ["G2 — Backend core", "4–6 tuần", "Auth, Projects, News, Media upload", "API document + staging"],
      ["G3 — Admin", "3–5 tuần", "Login, CRUD Projects/News, upload ảnh", "Admin staging"],
      ["G4 — Tích hợp", "2–3 tuần", "FE nối API, ISR, kiểm thử E2E", "Website beta"],
      ["G5 — Mở rộng", "2–4 tuần", "Contact, Careers, email notify", "Production v1"],
      ["G6 — Vận hành", "Liên tục", "Monitoring, backup, bảo mật, tối ưu", "Hệ thống ổn định"],
    ],
    [18, 15, 42, 25]
  ),
  spacer(),
  heading("10.1. Tiêu chí nghiệm thu từng giai đoạn", HeadingLevel.HEADING_2),
  bullet("G1: Tất cả route hoạt động, Lighthouse Performance ≥ 80, mobile responsive."),
  bullet("G2: API đúng contract, unit test core modules, Swagger/OpenAPI."),
  bullet("G3: Admin thao tác CRUD không cần can thiệp DB, phân quyền cơ bản."),
  bullet("G4: Publish tin trên admin → hiển thị trên website trong thời gian chấp nhận được."),
  bullet("G5: Form liên hệ lưu DB + gửi email; upload CV thành công."),

  pageBreak(),
  heading("11. ƯU NHƯỢC ĐIỂM TỔNG HỢP CỦA PHƯƠNG ÁN 3", HeadingLevel.HEADING_1),
  heading("11.1. Ưu điểm tổng hợp", HeadingLevel.HEADING_2),
  makeTable(
    ["Nhóm", "Ưu điểm cụ thể"],
    [
      ["Nghiệp vụ", "Một admin cho content + lead + HR; workflow tùy chỉnh"],
      ["Kỹ thuật", "Tách repo rõ ràng; scale từng phần; API làm trung tâm"],
      ["Tài chính dài hạn", "Không phụ thuộc license CMS; chi phí dự đoán được khi scale"],
      ["Bảo mật", "RBAC, audit log, backup DB chủ động"],
      ["Tài sản hiện có", "FE Next.js tái sử dụng 100% giao diện"],
      ["Trải nghiệm", "Website public vẫn nhanh nhờ SSG/ISR từ API"],
    ],
    [25, 75]
  ),
  spacer(),
  heading("11.2. Nhược điểm tổng hợp", HeadingLevel.HEADING_2),
  makeTable(
    ["Nhóm", "Nhược điểm cụ thể", "Giảm thiểu"],
    [
      ["Nhân sự", "Cần dev backend, DevOps", "Thuê outsource giai đoạn đầu; tài liệu hóa"],
      ["Thời gian", "Ra mắt full system lâu hơn PA1", "Triển khai theo giai đoạn; demo FE sớm"],
      ["Chi phí", "Server, DB, storage", "Cloud free tier; tối ưu khi traffic thấp"],
      ["Phức tạp", "Nhiều repo, CI/CD", "Docker compose dev; pipeline chuẩn hóa"],
      ["Admin UI", "Phải tự thiết kế", "Dùng component library (shadcn, Ant Design)"],
    ],
    [18, 42, 40]
  ),

  heading("12. RỦI RO, GIẢI PHÁP VÀ YÊU CẦU VẬN HÀNH", HeadingLevel.HEADING_1),
  makeTable(
    ["Rủi ro", "Mức độ", "Giải pháp"],
    [
      ["Lệch contract API giữa FE và BE", "Cao", "Shared types / OpenAPI; review trước mỗi sprint"],
      ["Lộ dữ liệu khách hàng/ứng viên", "Cao", "HTTPS, RBAC, mã hóa, audit log"],
      ["Chậm tiến độ do thiếu BE", "Trung bình", "FE tiếp tục mock; song song phát triển"],
      ["Server downtime", "Trung bình", "Hosting SLA, health check, backup"],
      ["Upload file độc hại", "Trung bình", "Validate MIME, giới hạn size, scan virus"],
      ["SEO giảm khi chuyển sang API", "Thấp", "SSG/ISR; cache; metadata động"],
    ],
    [30, 15, 55]
  ),
  spacer(),
  heading("12.1. Yêu cầu hạ tầng tối thiểu", HeadingLevel.HEADING_2),
  bullet("Hosting frontend: Vercel / Cloudflare Pages (CDN toàn cầu)."),
  bullet("Hosting backend: VPS hoặc cloud (2 vCPU, 4GB RAM tối thiểu cho giai đoạn đầu)."),
  bullet("Database: PostgreSQL managed (Neon, Supabase, RDS)."),
  bullet("Storage: S3-compatible hoặc Cloudinary cho ảnh/CV."),
  bullet("Domain & SSL: *.thienduc.vn, admin.thienduc.vn, api.thienduc.vn."),
  bullet("Monitoring: Uptime check, error logging (Sentry)."),

  pageBreak(),
  heading("13. KẾT LUẬN VÀ KIẾN NGHỊ", HeadingLevel.HEADING_1),
  heading("13.1. Kết luận", HeadingLevel.HEADING_2),
  para(
    "Ba phương án kỹ thuật đều có giá trị trong các bối cảnh khác nhau. Phương án 1 phù hợp website tĩnh, ít thay đổi. Phương án 2 phù hợp khi ưu tiên tốc độ có admin nội dung mà không cần nghiệp vụ phức tạp. Với bối cảnh Công ty Thiên Đức — đang phát triển frontend, xác định cần Backend và Trang quản trị, có module Liên hệ và Tuyển dụng — Phương án 3 Full-stack với ba repository là lựa chọn tối ưu và bền vững nhất.",
    { indent: true }
  ),
  heading("13.2. Kiến nghị", HeadingLevel.HEADING_2),
  numbered(1, "Phê duyệt Phương án 3 làm kiến trúc chính thức cho dự án website Thiên Đức."),
  numbered(2, "Tiếp tục đầu tư hoàn thiện frontend trong giai đoạn 1; chuẩn hóa types và layer lib/api."),
  numbered(3, "Khởi tạo repository backend và admin; thiết kế database schema và API contract trước khi code."),
  numbered(4, "Bổ sung package shared types hoặc OpenAPI spec để đồng bộ ba repo."),
  numbered(5, "Lập kế hoạch nhân sự: tối thiểu 1 FE, 1 BE, 1 người fullstack/lead kiến trúc."),
  numbered(6, "Triển khai theo lộ trình 6 giai đoạn; nghiệm thu từng milestone trước khi chuyển giai đoạn."),
  numbered(7, "Ưu tiên bảo mật dữ liệu form liên hệ và hồ sơ tuyển dụng ngay từ thiết kế backend."),
  spacer(),
  spacer(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [
      new TextRun({
        text: "— HẾT BÁO CÁO —",
        bold: true,
        size: 24,
        font: "Arial",
        color: BRAND_RGB,
      }),
    ],
  }),
  spacer(),
  para("Người lập báo cáo: ........................................", { center: true }),
  para("Chức danh: ........................................", { center: true }),
  para("Ngày: ........................................", { center: true }),
  spacer(),
  para("Phê duyệt: ........................................", { center: true }),
  para("Chức danh: ........................................", { center: true }),
  para("Ngày: ........................................", { center: true }),
];

const doc = new Document({
  creator: "Công ty Thiên Đức",
  title: "Báo cáo phương án kỹ thuật website",
  description: "Báo cáo so sánh 3 phương án kỹ thuật và đề xuất Phương án 3 Full-stack",
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
        page: {
          margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Công ty Thiên Đức — Báo cáo kỹ thuật",
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
                  text: "Báo cáo phương án kỹ thuật Website",
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
console.log(`Đã tạo file: ${OUTPUT}`);
