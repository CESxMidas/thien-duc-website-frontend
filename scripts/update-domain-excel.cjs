const ExcelJS = require("exceljs");

const path = "docs/so-sanh-domain-trong-nuoc-va-vercel-moi.xlsx";

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path);

  function ws(name, index) {
    return wb.getWorksheet(name) ?? wb.worksheets[index];
  }

  const s1 = ws("1. Tổng quan", 0);
  const s4 = ws("4. Backend (BE)", 3);
  const s5 = ws("5. Domain & DNS", 4);
  const s8 = ws("8. Khuyến nghị", 7);

  s1.getRow(7).getCell(2).value =
    "Tự cài trên VPS: NestJS API + PostgreSQL";
  s1.getRow(7).getCell(3).value =
    "PA2: API NestJS trên Render/Railway; FE + Admin trên Vercel";
  s1.getRow(7).getCell(4).value =
    "Không dùng Vercel Serverless cho NestJS CMS đầy đủ";

  s4.getRow(5).getCell(3).value =
    "Render/Railway (PA2) — NestJS 24/7; Serverless chỉ nếu API rất nhỏ";
  s4.getRow(6).getCell(3).value = "Neon / Supabase / Render PostgreSQL";
  s4.getRow(10).getCell(3).value =
    "Render Starter ~7–25 USD/tháng + DB; Vercel chỉ host FE + Admin";

  for (let r = 1; r <= s5.rowCount; r++) {
    const row = s5.getRow(r);
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (typeof cell.value === "string") {
        cell.value = cell.value
          .replace(/thienduc\.com\.vn/g, "thienduc.vn")
          .replace(/www\.thienduc\.com\.vn/g, "www.thienduc.vn");
      }
    });
  }

  s5.getRow(21).values = [
    null,
    "staging.thienduc.vn",
    "Môi trường UAT / kiểm thử",
    "VN: IP VPS hoặc subdomain",
    "Vercel: preview hoặc subdomain staging",
  ];

  s8.getRow(4).getCell(1).value =
    "Tình huống A (PA2 — khuyến nghị Thiên Đức)";
  s8.getRow(4).getCell(2).value = [
    "Ưu tiên ra mắt nhanh + CMS đầy đủ:",
    "• Domain .vn / .com.vn → PA Vietnam / Nhân Hòa",
    "• FE Next.js → thienduc.vn (Vercel)",
    "• Admin Vite+React → admin.thienduc.vn (Vercel)",
    "• BE NestJS + PostgreSQL → api.thienduc.vn (Render/Railway)",
    "• Ảnh → Cloudinary",
    "• Staging → staging.thienduc.vn",
  ].join("\n");

  let s11 = wb.getWorksheet("11. PA2 Thiên Đức");
  if (!s11) {
    s11 = wb.addWorksheet("11. PA2 Thiên Đức");
  }

  s11.columns = [{ width: 22 }, { width: 35 }, { width: 35 }, { width: 42 }];

  const pa2Rows = [
    ["PHƯƠNG ÁN 2 — ÁNH XẠ HOSTING THIÊN ĐỨC", "", "", ""],
    ["Thành phần", "Công nghệ", "Hosting đề xuất", "Domain / ghi chú"],
    ["Website công khai", "Next.js 16", "Vercel", "thienduc.vn + www"],
    ["Trang quản trị CMS", "Vite + React", "Vercel", "admin.thienduc.vn"],
    [
      "Backend API",
      "NestJS + Prisma",
      "Render / Railway",
      "api.thienduc.vn — không đặt trên Vercel Serverless",
    ],
    ["Cơ sở dữ liệu", "PostgreSQL", "Render / Neon", "Managed backup"],
    ["Media", "Cloudinary", "Cloudinary CDN", "Upload từ admin"],
    ["Email form", "Gmail SMTP", "Google Workspace", "Thông báo admin"],
    ["Staging", "Bản build UAT", "Vercel preview / subdomain", "staging.thienduc.vn"],
    [
      "Chi phí ước tính/tháng",
      "400k – 1,5 triệu VND",
      "Xem sheet 6",
      "Free tier có thể đủ giai đoạn đầu",
    ],
    [
      "Lưu ý giá domain",
      "Cập nhật hàng năm",
      "Đối chiếu PA Vietnam / Nhân Hòa 2026",
      "Sheet 5 mang tính tham khảo",
    ],
  ];

  pa2Rows.forEach((vals, i) => {
    const row = s11.getRow(i + 1);
    row.values = [null, ...vals];
    if (i === 0) row.font = { bold: true, size: 12 };
    if (i === 1) row.font = { bold: true };
  });

  await wb.xlsx.writeFile(path);
  console.log("Updated:", path);
})();
