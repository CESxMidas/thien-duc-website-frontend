<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hướng dẫn chung

Quy ước dùng chung cho cả frontend, admin và backend nằm ở `../AGENTS.md` — đọc
file đó trước. Chỉ thêm vào đây quy tắc riêng của frontend public.

@../AGENTS.md

# Trang dự án & hạng mục (quy ước UI)

Cập nhật 2026-07-11 — sau đợt tinh chỉnh UI/UX phần dự án:

- **Hai panel "Thông tin nhanh / Tổng quan"** ở trang dự án và trang hạng mục
  dùng `lg:items-stretch` để hai cột luôn bằng chiều cao. Mô tả dài **phải**
  `line-clamp-*` để không đẩy một cột cao vống lên. **Không** lặp lại địa chỉ +
  nút Google Maps trong panel Tổng quan — khối bản đồ (`ProjectLocationMap`)
  ngay dưới đã có đủ.
- **Hạng mục con** hiển thị bằng **một** `ProjectItemsCarousel` tự chạy duy
  nhất (`components/sections/project-items-carousel.tsx`). Không dựng thêm lưới
  thẻ tĩnh hay khối `gallerySections` cùng nội dung — trước đây hạng mục hiện
  hai lần gây trùng lặp. Thứ tự ưu tiên khối ảnh ở trang dự án: có `items` →
  carousel hạng mục; không thì `gallerySections`; không thì `gallery` phẳng.
- **Dự án chỉ có `gallery` phẳng** (không hạng mục) render `ProjectGallerySections`
  với `hideHeader` và **bỏ** tiêu đề khối "Thư viện ảnh …" — tên dự án đã nằm ở
  tiêu đề trang, nhắc lại là thừa. Ảnh vẫn tự chạy như slider hạng mục.
- **Trang hạng mục** (`du-an/[slug]/[hang-muc]`) dùng bố cục hai cột cân bằng:
  cột trái `ProjectItemGallery` (ảnh đại diện lớn + list ảnh con chạy dưới), cột
  phải gộp Thông tin nhanh + Tổng quan vào **một** panel. Hạng mục không có ảnh
  thì panel thông tin chiếm `lg:col-span-2`.
- Mọi slider tự chạy tôn trọng `prefers-reduced-motion` (tắt autoplay) và tạm
  dừng khi hover/focus. Autoplay chạy bằng CSS `banner-progress` + `onAnimationEnd`.
