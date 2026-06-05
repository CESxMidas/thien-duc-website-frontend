# Trang tin tức Thiên Đức

File này chỉ dùng cho **task chi tiết trang Tin tức**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## KẾT QUẢ CẬP NHẬT TRANG TIN TỨC - 2026-06-04

**Kết luận:** Stack Tin tức đã đạt mức hoàn thiện cơ bản để tiếp tục sang stack tiếp theo. `/tin-tuc` đã có metadata riêng, danh sách bài viết sắp xếp mới trước, card có ảnh/chuyên mục/ngày đăng/summary và empty state. `/tin-tuc/[slug]` đã có metadata động, `generateStaticParams()`, ảnh bài viết, nội dung thân bài, thông tin nhanh và điều hướng về danh sách.

### Đã hoàn thành

- Mở rộng `NewsPost` với `eventDate`, `category`, `content`, `author`.
- Chuẩn hóa `publishedAt` về ISO date để dễ sort và chuẩn bị nối CMS/API.
- Thêm helper `formatDate()` để hiển thị ngày theo định dạng Việt Nam.
- Thêm metadata riêng cho route danh sách và metadata động cho route chi tiết.
- Trang chi tiết đã render nội dung bài viết thay vì chỉ có heading.
- Home Latest News đã dùng cùng formatter ngày và sắp xếp bài mới trước.
- Copy giữ ở mức an toàn, không bịa thêm số liệu ngoài dữ liệu hiện có.

### Còn lưu ý

- Hiện chỉ có 1 bài viết thật trong `src/data/news.ts`; cần bổ sung bài đã duyệt trước khi xem đây là trang tin tức production đầy đủ.
- Nội dung bài viết đang ở dạng paragraph array tạm thời; khi nối CMS/API nên chuyển sang rich text hoặc markdown đã sanitize.
- Ảnh tin tức đang dùng file trong `public/images/news/2021`; cần tối ưu bản web trước khi dùng rộng nếu dung lượng lớn.

## PHẠM VI STACK TIN TỨC

- Route danh sách: `src/app/tin-tuc/page.tsx`
- Route chi tiết: `src/app/tin-tuc/[slug]/page.tsx`
- Data: `src/data/news.ts`
- Type dùng chung: `src/types/content.ts`
- Section liên quan Home: `src/components/sections/home-latest-news.tsx`
- Helper định dạng: `src/lib/format.ts`

## CHECKLIST KHI LÀM TIẾP

- Mỗi bài viết có `title`, `slug`, `summary`, `publishedAt`, `category`, `content`, `image`.
- `publishedAt` và `eventDate` dùng ISO date `YYYY-MM-DD`.
- Không đăng thông tin pháp lý, quy mô, tiến độ hoặc cam kết khi chưa có nội dung duyệt.
- Mỗi route có metadata phù hợp.
- Ảnh bài viết có `alt`, tồn tại trong `public/images` và dùng `next/image`.
- `npm run lint` và `npm run build` pass sau khi sửa.
