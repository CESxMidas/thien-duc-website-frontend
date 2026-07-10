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

Bổ sung 2026-07-11 (đồng nhất bố cục mọi dự án, lấy Hưng Phú làm chuẩn):

- **Bản đồ vị trí**: dự án có `mapLocation` (ảnh minh hoạ vẽ tay + nhãn) dùng
  `ProjectLocationMap`; dự án **không** có thì dùng `ProjectMapEmbed` (nhúng
  Google Maps `output=embed`, không cần API key). Chuỗi địa chỉ suy ra từ
  quickFact có nhãn khớp `/địa chỉ/i`, không thì `"{title} {location}"`. **Có
  bản đồ (bất kỳ loại nào) thì ẩn ảnh hero trên cùng** — ảnh dự án hiện trong
  khối bản đồ (cột trái), tránh lặp. Không suy được địa chỉ → không render map
  (không để khối trống).
- **Cân hai panel Thông tin nhanh / Tổng quan**: cột trái `<dl>` dùng
  `flex-1 auto-rows-fr` + ô `flex flex-col justify-center` để giãn đều lấp hết
  chiều cao, **không để khoảng trống thừa ở đáy**. Cột phải `line-clamp` mô tả
  (6/3 dòng) để không cao vống hơn cột trái.
- **Thư viện ảnh dự án không hạng mục**: dùng `ProjectPhotoStrip` — xếp ảnh
  thành hàng tối đa 3 ảnh, tự trượt (scroll-snap) khi có > 3 ảnh, ít ảnh thì
  hiện lưới tĩnh. Đây là khối song song với carousel hạng mục để bố cục giữa các
  dự án đồng nhất. **Cần ≥ 4 ảnh thật thì mới thấy hiệu ứng trượt** — hiện mock
  chỉ 1–2 ảnh/dự án nên đang hiện hàng tĩnh.
