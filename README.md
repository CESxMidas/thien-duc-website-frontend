# Thiên Đức Frontend

Frontend website cho Công ty Thiên Đức, xây dựng bằng Next.js App Router.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint

## Chạy project

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu trúc thư mục

```txt
src/
  app/                    Route pages của Next.js App Router
    page.tsx              Trang chủ
    gioi-thieu/           Trang giới thiệu
    du-an/                Danh sách và chi tiết dự án
    tin-tuc/              Danh sách và chi tiết tin tức
    cong-ty-thanh-vien/   Trang công ty thành viên
    tuyen-dung/           Trang tuyển dụng
    lien-he/              Trang liên hệ
  components/
    layout/               Header, footer, shell layout
    sections/             Section theo từng trang
    ui/                   Component UI dùng chung
  config/                 Cấu hình site, màu sắc, thông tin công ty
  data/                   Dữ liệu tạm thời trước khi kết nối CMS/API
  lib/                    Helper, route constants, utilities
  types/                  TypeScript types dùng chung
public/
  images/
    brand/                Logo, favicon
    banners/home/         Banner trang chủ
    projects/hung-phu/    Hình ảnh dự án Hưng Phú
    news/                 Hình ảnh tin tức
```

## Ghi chú phát triển

- Dữ liệu trong `src/data` là lớp tạm thời trước khi kết nối CMS/API.
- Tài liệu dự án (kế hoạch coding, câu hỏi xác nhận, báo cáo kỹ thuật, sơ đồ) đã dời ra `../docs/` (cấp workspace, dùng chung cho cả frontend và backend).
- Báo cáo phương án kỹ thuật: `../docs/Báo cáo phương án kỹ thuật website Thiên Đức.docx`.
- Tạo lại file Word: `npm run report:docx` (có trang bìa, mục lục tự động, số trang). Sau khi mở Word: **Ctrl+A → F9** để cập nhật mục lục; xem ở chế độ **Bố cục Trang in** (Print Layout).
- Ảnh gốc 8K cần xuất bản bản web-optimized trước khi dùng rộng trong UI production.
