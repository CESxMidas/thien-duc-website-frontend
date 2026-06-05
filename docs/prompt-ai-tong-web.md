# Prompt AI — Tổng Website Thiên Đức

File này dùng cho **task tổng quan toàn bộ website**. Các task chi tiết từng trang sẽ tách thành file riêng.

File chi tiết hiện có:
- Trang chủ Home: `docs/prompt-ai-trang-chu.md`
- Giới thiệu: `docs/prompt-ai-gioi-thieu.md`
- Dự án: `docs/prompt-ai-du-an.md`
- Tin tức: `docs/prompt-ai-tin-tuc.md`
- Liên hệ: `docs/prompt-ai-lien-he.md`
- Cấu trúc hình ảnh: `docs/cau-truc-hinh-anh.md`

File chi tiết còn nên tạo ở stack tiếp theo:
- Công ty thành viên: `docs/prompt-ai-cong-ty-thanh-vien.md`
- Tuyển dụng: `docs/prompt-ai-tuyen-dung.md`
- Chính sách nhân sự: `docs/prompt-ai-chinh-sach-nhan-su.md`
- Đào tạo: `docs/prompt-ai-dao-tao.md`
- Sơ đồ tổ chức công ty: `docs/prompt-ai-so-do-to-chuc-cong-ty.md`

---

## NGUYÊN TẮC TÁCH TASK

### Task tổng website

Dùng file này khi cần kiểm tra hoặc triển khai các phần ảnh hưởng toàn site:

- Cấu trúc route, điều hướng, header, footer, shell layout.
- `siteConfig`, `routes`, metadata global, favicon, brand, thông tin liên hệ.
- Design system dùng chung: màu sắc, typography, spacing, trạng thái responsive.
- Data dùng chung: `projects`, `newsPosts`, media trong `public/images`.
- SEO toàn site: title/description từng route, canonical/open graph nếu có.
- Kiểm tra placeholder, tiếng Việt có dấu, link hỏng, ảnh thiếu, build/lint.
- Lập danh sách task chi tiết cho từng trang.

### Task chi tiết từng trang

Dùng file riêng cho từng trang khi cần sửa sâu layout/copy/data của một route cụ thể:

- Home: `docs/prompt-ai-trang-chu.md`
- Giới thiệu: `docs/prompt-ai-gioi-thieu.md`
- Dự án: `docs/prompt-ai-du-an.md`
- Tin tức: `docs/prompt-ai-tin-tuc.md`
- Liên hệ: `docs/prompt-ai-lien-he.md`
- Tuyển dụng/chính sách/đào tạo/công ty thành viên/sơ đồ tổ chức: tạo file riêng khi bắt đầu làm.

---

## PHẠM VI WEBSITE

Routes chính hiện có:

- `/` — Trang chủ.
- `/gioi-thieu` — Giới thiệu công ty.
- `/du-an` — Danh sách dự án.
- `/du-an/[slug]` — Chi tiết dự án.
- `/tin-tuc` — Danh sách tin tức.
- `/tin-tuc/[slug]` — Chi tiết tin tức.
- `/lien-he` — Liên hệ.
- `/cong-ty-thanh-vien` — Công ty thành viên.
- `/tuyen-dung` — Tuyển dụng.
- `/chinh-sach-nhan-su` — Chính sách nhân sự.
- `/dao-tao` — Đào tạo.
- `/so-do-to-chuc-cong-ty` — Sơ đồ tổ chức công ty.

Files dùng chung cần đọc khi làm task tổng web:

- `src/app/layout.tsx`
- `src/components/layout/site-shell.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/config/site.ts`
- `src/lib/routes.ts`
- `src/data/projects.ts`
- `src/data/news.ts`
- `src/data/navigation.ts`
- `src/app/globals.css`

---

## TRẠNG THÁI CẬP NHẬT TOÀN WEB — 2026-06-04

### Đã xác nhận

- `npm run lint` PASS.
- `npm run build` PASS với Next.js 16.2.6.
- Home đã có layout/content chính, metadata riêng và đang dùng data từ `src/data/home.ts`, `projects[]`, `newsPosts[]`.
- Giới thiệu đã có metadata riêng, data `src/data/about.ts`, các section tổng quan/nguyên tắc/lĩnh vực/năng lực/CTA.
- Dự án đã có metadata riêng cho `/du-an`, metadata động cho `/du-an/[slug]`, filter `?status=...`, empty state, data model mở rộng và trang chi tiết có tổng quan/highlights/gallery/CTA.
- Tin tức đã có metadata riêng cho `/tin-tuc`, metadata động cho `/tin-tuc/[slug]`, data model mở rộng, formatter ngày, danh sách bài viết, empty state và trang chi tiết có ảnh/nội dung/thông tin nhanh.
- Liên hệ đã có metadata riêng, thông tin liên hệ lấy từ `siteConfig`, link gọi điện/email/Google Maps, nhóm nhu cầu liên hệ và fallback gửi yêu cầu qua email.
- Media đã được gom lại theo cấu trúc mới trong `public/images`, có guide riêng tại `docs/cau-truc-hinh-anh.md`.
- Global metadata trong `src/app/layout.tsx` đã chuyển sang tiếng Việt có dấu và dùng `metadataBase` từ `siteConfig.url`.
- README đã cập nhật theo cấu trúc thư mục hiện tại.

### Còn thiếu / nên làm ở stack tiếp theo

- `/tuyen-dung`, `/cong-ty-thanh-vien`, `/dao-tao`, `/so-do-to-chuc-cong-ty`, `/chinh-sach-nhan-su` còn nhiều copy placeholder hoặc nội dung tối thiểu.
- Tin tức mới có 1 bài viết thật; cần bổ sung thêm bài đã duyệt khi có dữ liệu.
- Home, Giới thiệu, Dự án và Tin tức đã có file prompt chi tiết. Các route còn lại vẫn cần tạo prompt riêng trước khi làm sâu.
- Ảnh 8K đã được gom nhóm nhưng chưa xuất bản bản web-optimized; tổng dung lượng `public/images` vẫn lớn.
- `/du-an` dùng `searchParams` server-side nên là dynamic route; nếu sau này cần static export thuần, cần đổi cách filter.

---

## TRẠNG THÁI KIỂM TRA TOÀN WEB — 2026-06-03

### Đã xác nhận

- `npm run build` đã PASS ngày 2026-06-03.
- Trang Home đã có file task chi tiết riêng: `docs/prompt-ai-trang-chu.md`.
- Home đã hoàn thành phần chính theo prompt Home production.
- `siteConfig` đã có tên công ty, email, phone, address.
- Dự án và tin tức đã có data mẫu để render route động.

### Cần xử lý ở cấp toàn website

- Global metadata trong `src/app/layout.tsx` còn tiếng Việt không dấu: `Cong ty Thien Duc`, `Website gioi thieu...`.
- `src/data/projects.ts` còn title/summary/location tiếng Việt không dấu; ảnh hưởng trang `/du-an` và `/du-an/[slug]`.
- `src/data/news.ts` đã được cập nhật ở stack Tin tức ngày 2026-06-04. Hiện còn ít bài, nhưng không còn là placeholder không dấu.
- Một số trang ngoài Home cần rà lại copy production, metadata riêng, H1, CTA, link và trạng thái placeholder.
- Cần kiểm tra header/footer/navigation toàn site sau khi chuẩn hóa route và nội dung.
- Cần kiểm tra ảnh thật có khớp với title/subtitle của từng banner, dự án, tin tức hay không.

---

## CHECKLIST TỔNG WEBSITE

### Nội dung & data

- Chuẩn hóa tiếng Việt có dấu toàn bộ UI/data.
- Xóa hoặc ẩn placeholder trước production.
- Không bịa số liệu, pháp lý, tiến độ, cam kết lợi nhuận khi chưa có dữ liệu duyệt.
- Dùng `siteConfig` cho phone/email/address, không hardcode lệch giữa các trang.
- Dùng `routes` hoặc path thống nhất cho link nội bộ.

### Layout & UX

- Header/footer nhất quán trên mọi route.
- Mỗi trang có một H1 rõ ràng.
- CTA điều hướng đến trang có nội dung thật.
- Responsive mobile/tablet/desktop không vỡ layout.
- Ảnh có `alt`, dùng `next/image` khi phù hợp.

### SEO & kỹ thuật

- Mỗi route chính có metadata riêng nếu cần.
- Favicon/brand asset đúng.
- Không có link 404 nội bộ.
- `npm run build` pass.
- `npm run lint` pass hoặc ghi rõ lỗi còn lại.

---

## TASK MẪU — TỔNG WEBSITE

### Review toàn website, chưa sửa code

```
TASK: Không sửa code. Review toàn bộ website Thiên Đức ở cấp production: kiểm tra route, header/footer, metadata, data projects/news, placeholder, tiếng Việt có dấu, link nội bộ, ảnh, responsive và build. Xuất checklist ĐÃ XONG / CÒN THIẾU / ƯU TIÊN SỬA, đồng thời đề xuất file prompt chi tiết cần tạo cho từng trang.
```

### Chuẩn hóa nội dung dùng chung

```
TASK: Chỉ sửa nội dung/data dùng chung toàn site, không đổi layout lớn: chuẩn hóa tiếng Việt có dấu trong siteConfig, metadata global, projects, news; thay nội dung placeholder bằng copy đã duyệt hoặc ẩn khỏi UI; kiểm tra link nội bộ và build pass.
```

### Tạo prompt chi tiết cho một trang

```
TASK: Tạo file prompt chi tiết cho trang [tên route], theo format đã tách: phạm vi route/components/data, trạng thái hiện tại, logic nội dung production, copy mẫu, checklist triển khai, đầu ra mong đợi. Không sửa code.
```

---

## ĐẦU RA MONG ĐỢI KHI LÀM TASK TỔNG WEB

1. Danh sách file đã kiểm tra.
2. Checklist toàn site phân loại rõ: đã xong, còn thiếu, rủi ro production.
3. Danh sách task chi tiết cần tách theo từng trang.
4. Nếu có sửa nội dung/code: liệt kê file sửa và chạy `npm run build`.
