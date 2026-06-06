/**
 * Nội dung báo cáo tóm tắt — website Thiên Đức
 * Em đọc, hiểu, rồi sửa bằng lời mình trước khi nộp.
 */

function layer(title, compare, choice, note = "") {
  return { title, compare, choice, note };
}

export const PA1 = {
  code: "PA1",
  name: "Static-first (SSG / Jamstack)",
  priority: "Ưu tiên TỐC ĐỘ RA MẮT GIAO DIỆN và CHI PHÍ THẤP NHẤT",
  description:
    "Website dạng trang tĩnh. Nội dung trong src/data/. Không backend, không CSDL, không admin. Phù hợp giai đoạn 1 — demo giao diện.",
  nfr: {
    headers: ["Tiêu chí", "PA1", "Giải thích"],
    rows: [
      ["Mở rộng tính năng", "★★☆☆☆", "Mỗi tính năng mới cần developer sửa code"],
      ["Dễ bảo trì", "★★★★☆", "Ít thành phần; nhưng sửa nội dung phải qua dev"],
      ["Cập nhật nội dung", "★☆☆☆☆", "Marketing không tự đăng bài được"],
      ["Tốc độ phản hồi", "★★★★★", "HTML tĩnh CDN ~50–100ms — nhanh nhất"],
      ["Chi phí vận hành", "★★★★★", "~0–5 USD/tháng"],
      ["Đáp ứng BE + Admin", "★☆☆☆☆", "Không đáp ứng — hạn chế cố hữu"],
    ],
  },
  layers: [
    layer(
      "Frontend — tại sao chọn Next.js?",
      {
        headers: ["Công nghệ", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Next.js 16 ✓", "SSG/ISR; SEO tốt; đang dùng — không đập lại FE", "App Router cần học"],
          ["Astro", "Trang tĩnh rất nhanh", "Phải migrate toàn bộ FE"],
          ["Remix", "Form/action tốt", "Phải viết lại; ít tài liệu VN"],
          ["React SPA (Vite)", "Dev nhanh", "SEO kém — không phù hợp web giới thiệu"],
        ],
      },
      "Chọn Next.js 16 vì: (1) dự án đã code sẵn Next.js; (2) SSG nhanh, SEO tốt; (3) sau này chỉ thay layer data, không đổi UI."
    ),
    layer(
      "Dữ liệu — tại sao KHÔNG dùng CSDL?",
      {
        headers: ["Phương án", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["File TS/JSON trong repo ✓", "Đơn giản; version Git; chi phí 0", "Cập nhật qua developer"],
          ["PostgreSQL", "ACID; multi-user", "Cần backend — vượt PA1"],
          ["Headless CMS", "Marketing tự đăng", "Đó là PA2"],
        ],
      },
      "Chọn file trong repo vì PA1 ưu tiên đơn giản, chi phí 0. Khi cần CSDL → chuyển PA3.",
      "PA1 KHÔNG có CSDL — chủ đích, không phải thiếu sót."
    ),
    layer(
      "Backend — tại sao KHÔNG có?",
      {
        headers: ["Phương án", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Không có backend ✓", "Chi phí 0; bảo mật tốt", "Không form/CV/admin"],
          ["NestJS + PostgreSQL", "Đầy đủ nghiệp vụ", "Đó là PA3"],
        ],
      },
      "Không có backend vì PA1 chỉ demo giao diện.",
      "NestJS là framework — nếu có backend thì BẮT BUỘC cần CSDL. PA1 cố ý không có cả hai."
    ),
    layer(
      "Form liên hệ",
      {
        headers: ["Dịch vụ", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Formspree ✓", "Không cần backend", "Dữ liệu ở bên thứ ba"],
          ["Backend tự xây", "Kiểm soát", "Vượt PA1"],
        ],
      },
      "Chọn Formspree tạm thời vì PA1 không có backend."
    ),
    layer(
      "Hosting — Vercel",
      {
        headers: ["Nền tảng", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Vercel ✓", "Tối ưu Next.js; CDN; free tier", "Giới hạn bandwidth free"],
          ["Cloudflare Pages", "CDN mạnh", "Cấu hình Next phức tạp hơn"],
        ],
      },
      "Chọn Vercel vì được tạo bởi team Next.js — deploy tự động."
    ),
  ],
  conclusion: "PA1 phù hợp giai đoạn 1 (FE + demo). Không đủ cho BE + CSDL + Admin.",
};

export const PA2 = {
  code: "PA2",
  name: "Headless CMS",
  priority: "Ưu tiên TỰ QUẢN TRỊ NỘI DUNG — marketing tự đăng bài",
  description:
    "Next.js + CMS (Strapi/Sanity). CMS có CSDL riêng. Form/HR vẫn thiếu — dễ thành 2–3 hệ thống rời.",
  nfr: {
    headers: ["Tiêu chí", "PA2", "Giải thích"],
    rows: [
      ["Mở rộng tính năng", "★★★☆☆", "Content OK; CRM/HR khó"],
      ["Dễ bảo trì", "★★★☆☆", "Phụ thuộc CMS; thêm BE form → 2 hệ thống"],
      ["Cập nhật nội dung", "★★★★★", "Marketing tự đăng bài"],
      ["Tốc độ phản hồi", "★★★★☆", "ISR ~100–200ms"],
      ["Chi phí vận hành", "★★★☆☆", "~15–50 USD/tháng"],
      ["Đáp ứng BE + Admin", "★★☆☆☆", "Content OK; form/HR thiếu"],
    ],
  },
  layers: [
    layer(
      "Frontend — Next.js",
      {
        headers: ["Công nghệ", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Next.js 16 ✓", "ISR từ CMS; tái dùng FE hiện tại", "Cần cấu hình revalidate"],
          ["Nuxt.js", "Tương tự cho Vue", "Team đang dùng React"],
        ],
      },
      "Chọn Next.js vì tái dùng FE đang code; ISR giữ trang nhanh khi có bài mới."
    ),
    layer(
      "CMS — chọn Strapi 5",
      {
        headers: ["CMS", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Strapi 5 ✓", "Open-source; TypeScript; PostgreSQL", "Tốn công vận hành"],
          ["Sanity", "Cloud; preview tốt", "Vendor lock-in; chi phí scale"],
          ["Contentful", "Enterprise", "Đắt khi nhiều user"],
        ],
      },
      "Chọn Strapi vì open-source, tự host, dùng PostgreSQL — đồng bộ với PA3.",
      "Strapi là CMS + backend nội dung — KHÔNG xử lý HR/form phức tạp."
    ),
    layer(
      "CSDL — PostgreSQL (qua Strapi)",
      {
        headers: ["CSDL", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["PostgreSQL ✓", "ACID; Strapi hỗ trợ native", "Cần server DB"],
          ["Sanity cloud", "Managed", "Vendor lock-in"],
        ],
      },
      "PA2 CÓ CSDL — nhưng chỉ cho nội dung (tin, dự án). Form/CV không nằm đây."
    ),
    layer(
      "Backend nghiệp vụ — CHƯA ĐỦ",
      {
        headers: ["Giải pháp", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Chỉ CMS ✓", "Đơn giản cho content", "Không form/CV/HR"],
          ["CMS + NestJS", "Gần PA3", "CMS thừa — không tối ưu"],
        ],
      },
      "PA2 thiếu backend nghiệp vụ — lý do không đề xuất cho Thiên Đức."
    ),
  ],
  conclusion: "PA2 OK nếu chỉ cần đăng bài. Không đủ cho liên hệ + tuyển dụng + phân quyền.",
};

export const PA3 = {
  code: "PA3",
  name: "Full-stack (FE + BE + CSDL + Admin)",
  priority: "Ưu tiên KIỂM SOÁT TOÀN DIỆN, MỞ RỘNG, MỘT HỆ THỐNG THỐNG NHẤT",
  description:
    "3 repo: Frontend Next.js + Backend NestJS + PostgreSQL + Admin Vite+React. Một API cho cả web và admin.",
  nfr: {
    headers: ["Tiêu chí", "PA3", "Giải thích"],
    rows: [
      ["Mở rộng tính năng", "★★★★★", "Thêm module API + admin tùy ý"],
      ["Dễ bảo trì", "★★★★☆", "NestJS module hóa; 3 repo tách biệt"],
      ["Cập nhật nội dung", "★★★★★", "Admin tùy workflow công ty"],
      ["Tốc độ phản hồi", "★★★★☆", "SSG/ISR + API <200ms"],
      ["Chi phí vận hành", "★★★☆☆", "~30–80 USD/tháng"],
      ["Đáp ứng BE + Admin", "★★★★★", "Duy nhất đáp ứng 100%"],
    ],
  },
  layers: [
    layer(
      "Frontend — Next.js",
      {
        headers: ["Công nghệ", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Next.js 16 ✓", "SSG/ISR từ API; tái dùng FE", "Phức tạp hơn SPA"],
          ["React SPA", "Đơn giản", "SEO kém"],
        ],
      },
      "Chọn Next.js vì tái dùng 100% giao diện; publish admin → revalidate trang public."
    ),
    layer(
      "Backend — NestJS (KHÔNG phải CSDL)",
      {
        headers: ["Framework", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["NestJS 11 ✓", "TypeScript; module rõ; Swagger; RBAC", "Boilerplate nhiều"],
          ["Express.js", "Nhẹ", "Dễ lộn xộn khi scale"],
          ["Laravel", "Admin scaffold", "Stack PHP — khác FE"],
        ],
      },
      "Chọn NestJS vì cùng TypeScript với FE/Admin; cấu trúc module dễ bảo trì.",
      "⚠️ NestJS chỉ là framework xử lý logic — CẦN CSDL bên dưới."
    ),
    layer(
      "CSDL — PostgreSQL (BẮT BUỘC)",
      {
        headers: ["CSDL", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["PostgreSQL 16 ✓", "ACID; quan hệ; full-text search; Neon/Supabase", "Cần thiết kế schema"],
          ["MySQL", "Phổ biến", "JSON/search kém hơn Postgres"],
          ["MongoDB", "Linh hoạt", "Khó đảm bảo quan hệ lead/job/CV"],
        ],
      },
      "Chọn PostgreSQL vì dữ liệu có quan hệ; form/CV cần ACID.",
      "Sơ đồ: NestJS → Prisma → PostgreSQL."
    ),
    layer(
      "ORM — Prisma",
      {
        headers: ["ORM", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Prisma 6 ✓", "Type-safe; migration tự động", "SQL phức tạp cần raw query"],
          ["TypeORM", "Quen NestJS", "Migration hay lỗi"],
        ],
      },
      "Chọn Prisma vì schema.prisma là chuẩn duy nhất cho DB."
    ),
    layer(
      "Admin — Vite + React (repo riêng)",
      {
        headers: ["Admin", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Vite + React ✓", "Tách repo; shadcn/ui; không cần SEO", "Tự code CRUD"],
          ["Strapi Admin", "Có sẵn", "Không có HR/lead"],
        ],
      },
      "Chọn Vite+React repo riêng vì bảo mật; admin không cần SSG."
    ),
    layer(
      "Auth — JWT + RBAC",
      {
        headers: ["Auth", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["JWT ✓", "Stateless; FE + Admin dùng chung API", "Revoke khó hơn session"],
          ["Session cookie", "Revoke dễ", "Cần sticky session"],
        ],
      },
      "Phân quyền: admin / editor / HR qua NestJS Guards."
    ),
    layer(
      "Storage — Cloudinary",
      {
        headers: ["Storage", "Ưu điểm", "Nhược điểm"],
        rows: [
          ["Cloudinary ✓", "Auto-resize ảnh; CDN", "Chi phí khi scale"],
          ["S3", "Rẻ scale lớn", "Tự cấu hình CDN"],
        ],
      },
      "Ảnh dự án/tin cần resize tự động; CV qua signed URL."
    ),
  ],
  architecture: {
    repos: [
      ["thien-duc-website-frontend", "Next.js 16", "Website công khai"],
      ["thien-duc-website-backend", "NestJS + Prisma + PostgreSQL", "API, auth, logic"],
      ["thien-duc-website-admin", "Vite + React", "Dashboard nội bộ"],
    ],
    flow: [
      "Khách → Frontend → GET /api/public/* → NestJS → PostgreSQL",
      "Nhân viên → Admin → JWT → NestJS → PostgreSQL / Cloudinary",
    ],
  },
  conclusion: "PA3 DUY NHẤT đáp ứng BE + CSDL + Admin + form/HR. ĐỀ XUẤT chính thức.",
};

export const ALL_PAS = [PA1, PA2, PA3];

export const DECISION_MATRIX = {
  headers: ["Tiêu chí", "Trọng số", "PA1", "PA2", "PA3"],
  rows: [
    ["Quản trị nội dung", "25%", "1/5", "5/5", "5/5"],
    ["Form & tuyển dụng", "25%", "2/5", "2/5", "5/5"],
    ["Mở rộng", "20%", "2/5", "3/5", "5/5"],
    ["Dễ bảo trì", "10%", "3/5", "3/5", "5/5"],
    ["Tốc độ phản hồi", "10%", "5/5", "4/5", "4/5"],
    ["Chi phí", "10%", "5/5", "3/5", "2/5"],
    ["Tổng", "100%", "2.4/5", "3.3/5", "4.5/5"],
    ["Kết luận", "—", "Không đủ", "Chưa tối ưu", "ĐỀ XUẤT"],
  ],
};
