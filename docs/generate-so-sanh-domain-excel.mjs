/**
 * Tạo file Excel so sánh domain trong nước vs Vercel.
 * Chạy: node docs/generate-so-sanh-domain-excel.mjs
 */
import ExcelJS from "exceljs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "so-sanh-domain-trong-nuoc-va-vercel.xlsx");

const COLORS = {
  title: "FF1F4E79",
  header: "FFB06613",
  headerFont: "FFFFFFFF",
  trongNuoc: "FFEEF5FF",
  vercel: "FFF6EFFF",
  alt: "FFF9F9F9",
  green: "FFD5E8D4",
  red: "FFF8CECC",
};

function stripMd(text) {
  return String(text)
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/☐/g, "□");
}

function addTitle(sheet, title, subtitle) {
  sheet.mergeCells("A1:D1");
  const t = sheet.getCell("A1");
  t.value = title;
  t.font = { bold: true, size: 16, color: { argb: COLORS.title } };
  t.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 28;

  if (subtitle) {
    sheet.mergeCells("A2:D2");
    const s = sheet.getCell("A2");
    s.value = subtitle;
    s.font = { size: 11, italic: true, color: { argb: "FF59646A" } };
    s.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
    sheet.getRow(2).height = 36;
  }
}

function styleHeaderRow(row, colCount) {
  row.height = 22;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.header },
    };
    cell.font = { bold: true, color: { argb: COLORS.headerFont }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } },
    };
  }
}

function styleDataRows(sheet, startRow, endRow, colCount, options = {}) {
  const { col2Fill, col3Fill } = options;
  for (let r = startRow; r <= endRow; r++) {
    const row = sheet.getRow(r);
    row.height = 40;
    for (let c = 1; c <= colCount; c++) {
      const cell = row.getCell(c);
      cell.alignment = { vertical: "top", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } },
      };
      if (c === 1 && (r - startRow) % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: COLORS.alt },
        };
      }
      if (c === 2 && col2Fill) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: COLORS.trongNuoc },
        };
      }
      if (c === 3 && col3Fill) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: COLORS.vercel },
        };
      }
    }
  }
}

function addCompareTable(sheet, startRow, headers, rows, options = {}) {
  const headerRow = sheet.getRow(startRow);
  headers.forEach((h, i) => {
    headerRow.getCell(i + 1).value = h;
  });
  styleHeaderRow(headerRow, headers.length);

  rows.forEach((rowData, i) => {
    const row = sheet.getRow(startRow + 1 + i);
    rowData.forEach((val, j) => {
      row.getCell(j + 1).value = stripMd(val);
    });
  });

  const endRow = startRow + rows.length;
  styleDataRows(sheet, startRow + 1, endRow, headers.length, {
    col2Fill: options.highlightCols !== false,
    col3Fill: options.highlightCols !== false,
  });
  return endRow + 2;
}

async function buildWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Thien Duc Website";
  wb.created = new Date();

  // ── Sheet 1: Tổng quan ──
  const s1 = wb.addWorksheet("1. Tổng quan", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s1.columns = [
    { width: 28 },
    { width: 42 },
    { width: 42 },
    { width: 12 },
  ];
  addTitle(
    s1,
    "SO SÁNH DOMAIN & TRIỂN KHAI — TRONG NƯỚC vs VERCEL",
    "Website Công ty Thiên Đức | Next.js FE + API/PostgreSQL/Cloudinary BE",
  );

  addCompareTable(
    s1,
    4,
    ["Tiêu chí", "Trong nước (Domain VN + VPS VN)", "Vercel", "Ghi chú"],
    [
      [
        "Ai phù hợp?",
        "Công ty muốn toàn bộ hạ tầng trong VN, tự kiểm soát server",
        "Đội dev muốn ra mắt nhanh, ít vận hành server",
        "",
      ],
      [
        "Độ khó vận hành",
        "Cao — cần người biết cấu hình server, bảo mật, backup",
        "Thấp — nền tảng lo phần lớn deploy & CDN",
        "",
      ],
      [
        "Tốc độ FE tại VN",
        "Tốt nếu server đặt tại VN",
        "Tốt nhờ CDN toàn cầu",
        "",
      ],
      [
        "BE (API + DB)",
        "Tự cài trên VPS: Node.js API + PostgreSQL",
        "API serverless trên Vercel; DB thường dịch vụ bên thứ 3",
        "",
      ],
      [
        "Upload ảnh (Cloudinary)",
        "FE/BE gọi Cloudinary — không phụ thuộc nơi host",
        "Giống phương án trong nước",
        "Giống nhau",
      ],
      [
        "SSL/HTTPS",
        "Tự cài Let's Encrypt miễn phí hoặc mua SSL VN",
        "Tự động, miễn phí",
        "",
      ],
      [
        "Backup & khôi phục",
        "Tự thiết lập snapshot VPS, dump DB",
        "Rollback deploy trên Vercel; DB backup riêng",
        "",
      ],
      [
        "Hỗ trợ khi sự cố",
        "Nhà cung cấp VN — tiếng Việt, giờ hành chính",
        "Tiếng Anh, ticket/email",
        "",
      ],
      [
        "Tuân thủ dữ liệu VN",
        "Dễ đặt server + DB trong lãnh thổ VN",
        "Server/CDN có thể ở nước ngoài — cần rà chính sách",
        "",
      ],
      [
        "Chi phí khởi điểm",
        "~500k–2tr/tháng (VPS) + ~300k–800k/năm (domain .vn)",
        "$0 Hobby hoặc ~$20/tháng Pro + domain + DB",
        "",
      ],
    ],
  );

  // ── Sheet 2: Thuật ngữ ──
  const s2 = wb.addWorksheet("2. Thuật ngữ", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s2.columns = [{ width: 22 }, { width: 70 }];
  addTitle(s2, "THUẬT NGỮ — TRA CỨU NHANH", "Giải thích cho người không cần biết lập trình");

  addCompareTable(
    s2,
    4,
    ["Khái niệm", "Giải thích đơn giản"],
    [
      ["Domain (tên miền)", "Địa chỉ website, ví dụ thienduc.com.vn — giống biển hiệu cửa hàng"],
      ["Hosting (lưu trữ)", "Nơi đặt mã nguồn website chạy trên internet — giống mặt bằng cửa hàng"],
      ["FE (Frontend)", "Phần khách nhìn thấy: trang chủ, giới thiệu, dự án, tin tức, liên hệ"],
      ["BE (Backend)", "Phần ẩn: đăng nhập admin, lưu bài viết, kiểm tra quyền, upload ảnh"],
      ["DNS", "Bảng chỉ đường: gõ tên miền → trình duyệt biết đi tới máy chủ nào"],
      ["SSL (HTTPS)", "Khóa bảo mật (ổ khóa xanh) — bảo vệ dữ liệu khi truy cập"],
      ["VPS", "Máy chủ ảo — thuê phòng riêng trong tòa nhà server"],
      ["CDN", "Copy website gần người dùng để tải nhanh"],
      ["Deploy", "Đưa bản code mới lên môi trường thật"],
      ["Serverless", "Server tự bật khi có người dùng — trả theo lượt dùng"],
      ["CI/CD", "Quy trình tự động: sửa code → kiểm tra → lên web"],
      ["Rollback", "Quay lại phiên bản website cũ khi bản mới lỗi"],
    ],
    { highlightCols: false },
  );

  // ── Sheet 3: FE ──
  const s3 = wb.addWorksheet("3. Frontend (FE)", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s3.columns = [{ width: 28 }, { width: 42 }, { width: 42 }];
  addTitle(
    s3,
    "CHI TIẾT FRONTEND (FE)",
    "Trang công khai: /, /gioi-thieu, /du-an, /tin-tuc, /lien-he — Next.js 16",
  );

  let r = 4;
  r = addCompareTable(s3, r, ["Hạng mục FE", "Trong nước", "Vercel"], [
    [
      "Cách đưa website lên mạng",
      "Build trên server → npm run build → PM2/systemd + Nginx",
      "Push code Git → Vercel tự build & deploy trong vài phút",
    ],
    [
      "Cập nhật giao diện",
      "SSH, pull code, build lại, restart — thủ công hoặc CI/CD tự viết",
      "Merge code → deploy tự động; có preview URL xem thử",
    ],
    [
      "Tốc độ tải trang",
      "Phụ thuộc VPS & băng thông; cần tự bật nén, cache",
      "CDN toàn cầu; cache static/edge tối ưu Next.js",
    ],
    [
      "SEO (Google)",
      "Tốt nếu cấu hình đúng metadata",
      "SSR/SSG Next.js out-of-the-box",
    ],
    [
      "Ảnh tĩnh (public/images)",
      "Lưu trên VPS — tốn ổ cứng",
      "Deploy kèm build; ảnh lớn nên Cloudinary/CDN",
    ],
    [
      "Khi server lỗi",
      "Website ngừng cho đến khi sửa VPS",
      "Failover tốt hơn; uptime SLA cao",
    ],
    [
      "Chi phí FE riêng",
      "Gộp trong tiền VPS",
      "Hobby miễn phí (giới hạn); Pro ~$20/tháng",
    ],
  ]);

  s3.getCell(`A${r}`).value = "Ai làm gì? (FE)";
  s3.getCell(`A${r}`).font = { bold: true, size: 12, color: { argb: COLORS.title } };
  r += 1;

  addCompareTable(s3, r, ["Việc cần làm", "Trong nước", "Vercel"], [
    ["Cài Node.js, Nginx", "Công ty / đơn vị vận hành", "Không cần"],
    ["Deploy mỗi lần sửa", "Dev hoặc kỹ thuật viên server", "Dev push Git — tự động"],
    ["Giám sát website", "UptimeRobot, Zabbix...", "Dashboard Vercel + công cụ ngoài"],
    ["Domain trỏ về FE", "A record → IP VPS", "CNAME → cname.vercel-dns.com"],
  ]);

  // ── Sheet 4: BE ──
  const s4 = wb.addWorksheet("4. Backend (BE)", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s4.columns = [{ width: 28 }, { width: 42 }, { width: 42 }];
  addTitle(
    s4,
    "CHI TIẾT BACKEND (BE)",
    "Đăng nhập admin, API dự án/tin tức, PostgreSQL, upload Cloudinary",
  );

  r = 4;
  r = addCompareTable(s4, r, ["Chức năng BE", "Mô tả đơn giản", ""], [
    ["Đăng nhập admin", "Kiểm tra email/mật khẩu, cấp token phiên làm việc", ""],
    ["Phân quyền", "Chỉ người có quyền mới upload ảnh / sửa nội dung", ""],
    ["API dự án & tin tức", "Lưu, sửa, xóa bài viết qua cơ sở dữ liệu", ""],
    ["Upload ảnh", "Cấp phiếu cho phép → tải thẳng lên Cloudinary", ""],
    ["Cơ sở dữ liệu", "PostgreSQL — lưu nội dung + link ảnh", ""],
  ], { highlightCols: false });

  addCompareTable(s4, r, ["Hạng mục BE", "Trong nước", "Vercel"], [
    [
      "Chạy API (Node.js)",
      "Cài trên VPS; chạy 24/7",
      "Serverless Functions — chạy khi có request, tự scale",
    ],
    [
      "PostgreSQL",
      "Cài VPS hoặc DB hosting VN (Vietnix, VNPT...)",
      "Neon / Supabase / Vercel Postgres (thường server nước ngoài)",
    ],
    [
      "Upload ảnh lớn",
      "API cấp chữ ký → ảnh lên Cloudinary, không qua server",
      "Giống — kiến trúc không đổi",
    ],
    [
      "Bảo mật",
      "Tự cấu hình firewall, fail2ban, patch OS",
      "Vercel lo platform; app vẫn phải code an toàn",
    ],
    [
      "Backup DB",
      "Tự lên lịch pg_dump, snapshot",
      "Bật backup ở nhà cung cấp DB",
    ],
    [
      "Chi phí BE",
      "Gộp VPS (~1–3 triệu/tháng)",
      "DB ~$0–25/tháng + Vercel Pro nếu traffic cao",
    ],
  ]);

  // ── Sheet 5: Domain & DNS ──
  const s5 = wb.addWorksheet("5. Domain & DNS", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s5.columns = [{ width: 24 }, { width: 38 }, { width: 38 }];
  addTitle(s5, "DOMAIN & DNS", "Mua tên miền, trỏ DNS, subdomain");

  r = 4;
  r = addCompareTable(s5, r, ["Mua tên miền", "Trong nước (đăng ký VN)", "Vercel"], [
    [
      "Nhà cung cấp",
      "PA Vietnam, Nhân Hòa, Mắt Bão, Viettel, VNPT...",
      "Vercel không bán domain — mua nơi khác rồi trỏ DNS",
    ],
    [
      "Đuôi phổ biến",
      ".vn, .com.vn — uy tín với khách VN",
      ".com, .vn đều dùng được",
    ],
    [
      "Giá tham khảo",
      ".com.vn: ~400k–700k/năm; .vn: ~600k–900k/năm",
      ".com: ~250k–350k/năm (Namecheap...)",
    ],
    [
      "Thủ tục .vn",
      "Cần GPKD, hồ sơ doanh nghiệp",
      "Mua .vn qua nhà đăng ký VN, trỏ DNS về Vercel",
    ],
  ]);

  s5.getCell(`A${r}`).value = "Trỏ domain về website";
  s5.getCell(`A${r}`).font = { bold: true, size: 12, color: { argb: COLORS.title } };
  r += 1;

  r = addCompareTable(s5, r, ["Bước", "Trong nước (VPS VN)", "Vercel"], [
    ["1", "Mua domain tại PA/Nhân Hòa...", "Mua domain (VN hoặc quốc tế)"],
    ["2", "Thuê VPS, lấy IP cố định", "Tạo project Vercel, thêm domain"],
    ["3", "DNS: A record → IP VPS", "DNS: CNAME www → Vercel, A apex theo hướng dẫn"],
    ["4", "Cài SSL trên Nginx (Certbot)", "SSL tự động trong vài phút"],
    ["5", "Mở port 80/443, firewall", "Không cần mở port"],
  ]);

  addCompareTable(s5, r, ["Subdomain", "Mục đích", "Trong nước / Vercel"], [
    ["www.thienduc.com.vn", "Website chính (FE)", "VN: IP VPS | Vercel: trỏ Vercel"],
    ["api.thienduc.com.vn", "API backend", "VN: IP VPS | Vercel: Vercel hoặc server riêng"],
    ["admin.thienduc.com.vn", "Trang quản trị", "VN: IP VPS | Vercel: trỏ Vercel"],
  ]);

  // ── Sheet 6: Chi phí ──
  const s6 = wb.addWorksheet("6. Chi phí", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s6.columns = [{ width: 28 }, { width: 38 }, { width: 38 }];
  addTitle(
    s6,
    "CHI PHÍ ƯỚC TÍNH HÀNG NĂM",
    "Tham khảo 2025–2026 | Website doanh nghiệp vừa | Chưa gồm phí dev",
  );

  const costEnd = addCompareTable(
    s6,
    4,
    ["Hạng mục", "Trong nước", "Vercel"],
    [
      ["Domain .com.vn", "~500.000 ₫/năm", "~500.000 ₫/năm (mua VN, DNS trỏ Vercel)"],
      [
        "Hosting FE + BE",
        "VPS 2 CPU/4GB: ~1.200.000–2.400.000 ₫/tháng",
        "Hobby $0 hoặc Pro ~500.000 ₫/tháng",
      ],
      [
        "PostgreSQL",
        "Gộp VPS hoặc DB managed ~300.000–800.000 ₫/tháng",
        "Neon/Supabase free → ~250.000–600.000 ₫/tháng khi scale",
      ],
      ["Cloudinary (ảnh)", "Free tier → ~0–500.000 ₫/tháng", "Giống"],
      ["SSL", "Miễn phí (Let's Encrypt)", "Miễn phí"],
      ["Vận hành kỹ thuật", "Cần người/am hiểu server", "Ít hơn — tập trung code"],
      ["TỔNG ƯỚC TÍNH/NĂM", "~18–35 triệu ₫", "~6–15 triệu ₫ (tùy gói & traffic)"],
    ],
  );

  const totalRow = s6.getRow(costEnd - 2);
  totalRow.eachCell((cell) => {
    cell.font = { bold: true, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.green },
    };
  });

  // ── Sheet 7: Ưu nhược ──
  const s7 = wb.addWorksheet("7. Ưu & Nhược", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s7.columns = [{ width: 40 }, { width: 40 }];
  addTitle(s7, "ƯU & NHƯỢC ĐIỂM", "Tóm tắt để quyết định nhanh");

  r = 4;
  s7.mergeCells(`A${r}:B${r}`);
  s7.getCell(`A${r}`).value = "PHƯƠNG ÁN TRONG NƯỚC (Domain VN + VPS VN)";
  s7.getCell(`A${r}`).font = { bold: true, size: 12, color: { argb: COLORS.title } };
  s7.getCell(`A${r}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.trongNuoc },
  };
  r += 1;

  r = addCompareTable(s7, r, ["Ưu điểm", "Nhược điểm"], [
    [
      "Server & DB có thể nằm hoàn toàn tại VN",
      "Cần nhân sự vận hành server",
    ],
    [
      "Hỗ trợ tiếng Việt, hóa đơn VAT VN",
      "Deploy & cập nhật chậm hơn nếu không có CI/CD",
    ],
    [
      "Kiểm soát 100% cấu hình, backup",
      "Tự chịu trách nhiệm bảo mật, patch, chống tấn công",
    ],
    [
      "Phù hợp lưu trữ dữ liệu trong nước",
      "Uptime phụ thuộc 1 VPS — cần kế hoạch dự phòng",
    ],
  ], { highlightCols: false });

  s7.mergeCells(`A${r}:B${r}`);
  s7.getCell(`A${r}`).value = "PHƯƠNG ÁN VERCEL";
  s7.getCell(`A${r}`).font = { bold: true, size: 12, color: { argb: COLORS.title } };
  s7.getCell(`A${r}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORS.vercel },
  };
  r += 1;

  addCompareTable(s7, r, ["Ưu điểm", "Nhược điểm"], [
    ["Ra mắt nhanh — tối ưu sẵn cho Next.js", "Một phần hạ tầng ở nước ngoài"],
    ["Deploy tự động, preview, rollback dễ", "DB/ảnh vẫn cần dịch vụ riêng"],
    ["CDN mạnh, ít lo server chết", "Chi phí tăng khi traffic lớn"],
    ["Đội dev tập trung code, ít DevOps", "Hỗ trợ chính thức chủ yếu tiếng Anh"],
    ["Có thể dùng domain .com.vn từ đăng ký VN", "Serverless giới hạn thời gian/request"],
  ], { highlightCols: false });

  // ── Sheet 8: Khuyến nghị ──
  const s8 = wb.addWorksheet("8. Khuyến nghị", {
    views: [{ state: "frozen", ySplit: 2 }],
  });
  s8.columns = [{ width: 22 }, { width: 78 }];
  addTitle(s8, "KHUYẾN NGHỊ CHO WEBSITE THIÊN ĐỨC", "");

  const rec = [
    [
      "Tình huống A",
      "Ưu tiên ra mắt nhanh, ít vận hành:\n• Domain .com.vn → PA Vietnam / Nhân Hòa\n• FE (Next.js) → Vercel\n• BE (API) → Vercel Serverless hoặc VPS nhỏ VN\n• PostgreSQL → Neon/Supabase (hoặc DB VPS VN nếu cần data in-country)\n• Ảnh → Cloudinary",
    ],
    [
      "Tình huống B",
      "Ưu tiên hạ tầng trong lãnh thổ VN:\n• Domain .com.vn → nhà đăng ký VN\n• VPS VN (Vietnix / Viettel IDC):\n  - FE: Next.js + Nginx\n  - BE: API Node.js\n  - PostgreSQL (cùng VPS hoặc DB managed VN)\n  - Ảnh: Cloudinary",
    ],
  ];

  const recHeader = s8.getRow(3);
  recHeader.getCell(1).value = "Kịch bản";
  recHeader.getCell(2).value = "Kiến trúc đề xuất";
  styleHeaderRow(recHeader, 2);

  rec.forEach((row, i) => {
    const excelRow = s8.getRow(4 + i);
    excelRow.getCell(1).value = row[0];
    excelRow.getCell(2).value = row[1];
    excelRow.height = 100;
    excelRow.getCell(1).font = { bold: true };
    excelRow.getCell(1).alignment = { vertical: "top", wrapText: true };
    excelRow.getCell(2).alignment = { vertical: "top", wrapText: true };
    if (i === 0) {
      excelRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLORS.vercel },
      };
    } else {
      excelRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLORS.trongNuoc },
      };
    }
  });

  let r8 = 7;
  s8.getCell(`A${r8}`).value = "KHÔNG NÊN LÀM";
  s8.getCell(`A${r8}`).font = { bold: true, size: 12, color: { argb: "FFB85450" } };
  r8 += 1;

  addCompareTable(s8, r8, ["Cách làm", "Vì sao tránh"], [
    [
      "Chỉ mua domain, không thuê hosting",
      "Domain chỉ là tên — không có chỗ chạy website",
    ],
    [
      "Shared hosting PHP giá rẻ cho Next.js",
      "Next.js cần Node.js — hosting PHP thường không chạy được",
    ],
    [
      "Nhét FE + BE + DB trên VPS 1 GB",
      "Dễ chậm và sập khi có ảnh lớn + nhiều khách",
    ],
    ["Bỏ HTTPS", "Trình duyệt cảnh báo; form liên hệ không an toàn"],
  ], { highlightCols: false });

  // ── Sheet 9: Checklist ──
  const s9 = wb.addWorksheet("9. Checklist go-live", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s9.columns = [
    { width: 6 },
    { width: 30 },
    { width: 32 },
    { width: 32 },
    { width: 14 },
    { width: 14 },
  ];
  addTitle(s9, "CHECKLIST TRƯỚC KHI GO-LIVE", "Đánh dấu □ khi hoàn thành");

  const clHeader = s9.getRow(4);
  ["#", "Hạng mục", "Trong nước", "Vercel", "VN ✓", "Vercel ✓"].forEach((h, i) => {
    clHeader.getCell(i + 1).value = h;
  });
  styleHeaderRow(clHeader, 6);

  const checklist = [
    ["Domain đã trỏ đúng DNS", "A record → IP VPS", "CNAME/A theo Vercel"],
    ["SSL/HTTPS hoạt động", "Certbot / SSL mua", "Tự động trên Vercel"],
    ["FE build thành công", "npm run build trên server", "Build log Vercel xanh"],
    ["BE API trả lời", "https://api.../health", "Route API test OK"],
    ["PostgreSQL kết nối", "Migration chạy xong", "Connection string đúng"],
    ["Cloudinary upload", "Ảnh test hiển thị trên web", "Giống"],
    ["Form liên hệ / email", "Gửi được thử", "Giống"],
    ["Backup", "Lịch backup DB + snapshot VPS", "Backup DB provider"],
    ["Biến môi trường bí mật", "Không lộ trong code public", "Cấu hình Vercel Env"],
    ["NEXT_PUBLIC_SITE_URL", "Trỏ domain thật", "Trỏ domain thật"],
  ];

  checklist.forEach((row, i) => {
    const excelRow = s9.getRow(5 + i);
    excelRow.getCell(1).value = i + 1;
    excelRow.getCell(2).value = row[0];
    excelRow.getCell(3).value = row[1];
    excelRow.getCell(4).value = row[2];
    excelRow.getCell(5).value = "□";
    excelRow.getCell(6).value = "□";
    excelRow.height = 32;
    for (let c = 1; c <= 6; c++) {
      excelRow.getCell(c).alignment = { vertical: "middle", wrapText: true };
      excelRow.getCell(c).border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } },
      };
    }
    excelRow.getCell(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.trongNuoc },
    };
    excelRow.getCell(4).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.vercel },
    };
  });

  // ── Sheet 10: 4 câu hỏi quyết định ──
  const s10 = wb.addWorksheet("10. Quyết định", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  s10.columns = [{ width: 8 }, { width: 50 }, { width: 40 }];
  addTitle(s10, "4 CÂU HỎI KHI HỌP CHỌN PHƯƠNG ÁN", "");

  const qHeader = s10.getRow(4);
  ["#", "Câu hỏi", "Gợi ý trả lời"].forEach((h, i) => {
    qHeader.getCell(i + 1).value = h;
  });
  styleHeaderRow(qHeader, 3);

  const questions = [
    [
      "Dữ liệu khách hàng & nội dung admin có bắt buộc lưu trong VN không?",
      "Có → VPS/DB VN | Không bắt buộc → Vercel khả thi",
    ],
    [
      "Có nhân sự bảo trì server hàng tháng không?",
      "Không → Vercel | Có → cả hai đều được",
    ],
    [
      "Ngân sách hàng năm dự kiến?",
      "Thấp + ít traffic → Vercel Hobby + free DB | Cao + kiểm soát → VPS VN",
    ],
    [
      "Thời gian ra mắt?",
      "Gấp (< 2 tuần) → Vercel | Không gấp + cần hạ tầng VN → VPS VN",
    ],
  ];

  questions.forEach((row, i) => {
    const excelRow = s10.getRow(5 + i);
    excelRow.getCell(1).value = i + 1;
    excelRow.getCell(2).value = row[0];
    excelRow.getCell(3).value = row[1];
    excelRow.height = 45;
    excelRow.getCell(2).font = { bold: true };
    for (let c = 1; c <= 3; c++) {
      excelRow.getCell(c).alignment = { vertical: "top", wrapText: true };
      excelRow.getCell(c).border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } },
      };
    }
  });

  const fallback = path.join(__dirname, "so-sanh-domain-trong-nuoc-va-vercel-moi.xlsx");
  try {
    await wb.xlsx.writeFile(OUT);
    console.log(`Đã tạo: ${OUT}`);
  } catch (err) {
    if (err.code === "EBUSY" || err.code === "EPERM") {
      await wb.xlsx.writeFile(fallback);
      console.log(`File gốc đang mở — đã tạo bản mới: ${fallback}`);
      console.log("Đóng file Excel cũ rồi chạy lại để ghi đè file chính.");
    } else {
      throw err;
    }
  }
}

buildWorkbook().catch((err) => {
  console.error(err);
  process.exit(1);
});
