# Trang dự án Thiên Đức

File này chỉ dùng cho **task chi tiết trang Dự án**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## KẾT QUẢ KIỂM TRA TRANG DỰ ÁN - 2026-06-04

**Phạm vi kiểm tra:** route danh sách `/du-an`, route chi tiết `/du-an/[slug]`, data `src/data/projects.ts`, type `src/types/content.ts`, ảnh trong `public/images/projects`, component Home đang đọc `projects[]`.

**Kết luận:** Trang Dự án đã có route danh sách và route chi tiết động, data đã có 2 dự án là Khu đô thị Hưng Phú và Chung cư La Bonita, type `Project` đã có `gallery`. Tuy nhiên trang vẫn chưa đạt mức production: copy còn lỗi chính tả/chuẩn hóa, `/du-an` chưa có metadata riêng, chưa xử lý filter query theo navigation, trang chi tiết còn rất mỏng, chưa có tổng quan/highlights/CTA và chưa kiểm soát rủi ro dữ liệu chưa duyệt.

### Đã có sẵn

- Route `/du-an` tồn tại tại `src/app/du-an/page.tsx`.
- Route `/du-an/[slug]` tồn tại tại `src/app/du-an/[slug]/page.tsx`.
- `generateStaticParams()` tạo path chi tiết từ `projects[]`.
- `notFound()` xử lý slug không tồn tại.
- `ProjectStatus` đã có 3 trạng thái:
  - `da-ban-giao`
  - `dang-thi-cong`
  - `chuan-bi-khoi-cong`
- `Project` hiện có:
  - `title`
  - `slug`
  - `summary`
  - `status`
  - `location?`
  - `image?`
  - `gallery?`
- `src/data/projects.ts` hiện có 2 dự án:
  - `khu-do-thi-hung-phu`
  - `chung-cu-la-bonita`
- Ảnh dự án hiện có trong `public/images/projects`:
  - `hung-phu/fancy-tower/*.jpg`
  - `hung-phu/master-plan/*.jpg`
  - `la-bonita/building/*.jpg`
- Home đang dùng `projects[]` qua `src/components/sections/home-featured-projects.tsx`.

### Còn thiếu / cần xử lý

- Chuẩn hóa copy tiếng Việt trong `src/data/projects.ts`:
  - Sửa lỗi `Dư án` thành `Dự án`.
  - Chuẩn hóa `Thành Phố Hồ Chí Minh` thành `TP.HCM` nếu thống nhất với toàn site.
  - Tránh mô tả Hưng Phú và La Bonita giống nhau kiểu placeholder.
- Kiểm tra đường dẫn ảnh:
  - Hưng Phú dùng ảnh trong `public/images/projects/hung-phu/master-plan` và `public/images/projects/hung-phu/fancy-tower`.
  - La Bonita dùng đường dẫn semantic như `la-bonita/building/la-bonita-building-render-01.jpg`.
  - Vũng Tàu và Bảy Hiền đang dùng ảnh tham khảo tải từ web, cần công ty xác nhận quyền dùng/độ đúng dự án trước production.
- `src/app/du-an/page.tsx` còn copy chưa nhất quán:
  - `Danh sách dự án`
  - `Thien Duc Group`
- `/du-an` chưa có metadata riêng.
- `/du-an/[slug]` chưa có metadata động.
- `/du-an` chưa xử lý query filter theo navigation:
  - `/du-an?status=da-ban-giao`
  - `/du-an?status=dang-thi-cong`
  - `/du-an?status=chuan-bi-khoi-cong`
- Trang chi tiết `/du-an/[slug]` hiện mới có heading và ảnh chính, chưa có:
  - thông tin nhanh
  - tổng quan dự án
  - gallery thật
  - highlights
  - CTA liên hệ
- `HomeFeaturedProjects` đang filter `(project.slug === "khu-do-thi-hung-phu" || project.status)`, điều kiện `project.status` luôn truthy nên sẽ lấy mọi project. Cần quyết định có giữ hay chỉnh về logic dự án tiêu biểu khi làm Dự án.
- Cần tránh bịa dữ liệu chưa được duyệt: pháp lý, diện tích, số block/căn/nền, vốn, doanh thu, đối tác, tiến độ cụ thể, bàn giao, giải thưởng.
- Chạy `npm run build` sau khi sửa code.

### TASK làm tiếp

```text
TASK: Hoàn thiện trang Dự án Thiên Đức ở mức production cho cả `/du-an` và `/du-an/[slug]`: chuẩn hóa `projects[]` bằng tiếng Việt có dấu, kiểm tra đường dẫn ảnh, thêm metadata riêng/dynamic metadata, làm danh sách dự án có filter theo query status, hoàn thiện trang chi tiết dự án với ảnh/gallery, thông tin nhanh, tổng quan, highlights an toàn và CTA `/lien-he`. Có thể mở rộng type Project nếu cần. Không sửa Home/Giới thiệu trừ khi cần giữ tương thích data hoặc sửa logic HomeFeaturedProjects bị ảnh hưởng bởi projects[]. Chạy `npm run build` sau khi hoàn tất.
```

---

## PROMPT

```text
PHẠM VI - CHỈ TRANG DỰ ÁN

- Route danh sách: src/app/du-an/page.tsx
- Route chi tiết: src/app/du-an/[slug]/page.tsx
- Data: src/data/projects.ts
- Type: src/types/content.ts
- Component liên quan do projects[] ảnh hưởng: src/components/sections/home-featured-projects.tsx
- Ảnh: public/images/projects/*
- Đọc tham chiếu:
  - docs/prompt-ai-tong-web.md
  - docs/prompt-ai-trang-chu.md
  - docs/prompt-ai-gioi-thieu.md
  - src/components/ui/page-heading.tsx
  - src/data/home.ts
  - src/lib/routes.ts
  - src/data/navigation.ts
- KHÔNG refactor header/footer/toàn site trừ khi TASK yêu cầu rõ.
- KHÔNG sửa Home/Giới thiệu, trừ khi thay đổi `Project` hoặc logic `projects[]` làm vỡ component đang dùng chung.

STACK & KỸ THUẬT

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- Trước khi sửa API metadata/searchParams/params, đọc guide liên quan trong `node_modules/next/dist/docs/`.
- `page.tsx` là Server Component.
- Route detail hiện dùng `params` dạng `Promise`; giữ đúng convention đang dùng trong repo.
- Nếu xử lý query filter ở `/du-an`, dùng `searchParams` theo Next.js 16 App Router.
- Import dùng alias: `@/components`, `@/data`, `@/config`, `@/lib`, `@/types`.
- Ảnh dùng `next/image`, đường dẫn `/images/projects/...` hoặc asset đã xác nhận tồn tại.
- Link nội bộ dùng `next/link`.
- Nội dung liên hệ lấy từ `siteConfig` nếu hiển thị contact.
- Diff gọn, ưu tiên pattern hiện có.
- Chạy `npm run build` sau khi hoàn thiện. Nếu cần, chạy thêm `npm run lint`.

Design system tham chiếu:
- Primary `#B06613`, hover `#7f4b0d`.
- Accent `#fdcd04`.
- Nền shell `#f6f3ee` hoặc trắng theo layout hiện có.
- Card trắng, border `black/10`, shadow nhẹ nếu cần.
- Text `#1d2428` / `#191919`, muted `#59646a`.
- Eyebrow uppercase `tracking-[0.24em]`.
- Section max-width tương tự Home/About: `mx-auto max-w-7xl px-6`.

TRẠNG THÁI CODE HIỆN TẠI

1. `src/app/du-an/page.tsx` render `SiteShell`, `PageHeading`, grid card từ `projects[]`.
2. `/du-an` chưa có `metadata`.
3. `/du-an` chưa nhận/xử lý `searchParams.status`.
4. `src/app/du-an/[slug]/page.tsx` render `PageHeading` và ảnh chính.
5. `/du-an/[slug]` đã có `generateStaticParams()` và `notFound()`.
6. `/du-an/[slug]` chưa có `generateMetadata`.
7. `src/data/projects.ts` hiện có:
   - `Khu đô thị Hưng Phú`
   - `Chung cư La Bonita`
8. `Project` đã có `gallery?: string[]`.
9. `HomeFeaturedProjects` đang phụ thuộc vào `projects[]`, cần kiểm tra sau khi sửa data/type.

LOGIC NỘI DUNG PRODUCTION

- Ngôn ngữ: tiếng Việt có dấu.
- Tone: chuyên nghiệp, tin cậy, phù hợp bất động sản/xây dựng.
- Trang Dự án dùng để giới thiệu danh mục dự án và dẫn người dùng vào chi tiết.
- Chi tiết dự án chỉ đưa thông tin đã chắc chắn hoặc diễn đạt an toàn.
- Không bịa:
  - diện tích
  - pháp lý
  - tổng vốn
  - số block/số nền/số căn
  - tiến độ cụ thể
  - đối tác
  - tỷ suất lợi nhuận
  - thời gian bàn giao
  - giải thưởng
- Nếu chưa có dữ liệu duyệt, dùng nhãn trung tính như `Đang cập nhật` hoặc ẩn trường đó.
- CTA phải dẫn đến route có thật: `/lien-he`.

THỨ TỰ SECTION MỤC TIÊU - /du-an

1. Page heading
   - Eyebrow: Dự án
   - H1: Dự án của Thiên Đức
   - Description: Tổng hợp các dự án Thiên Đức đang triển khai, đã hoàn thành hoặc đang chuẩn bị phát triển.

2. Bộ lọc trạng thái
   - Tất cả
   - Đang thi công
   - Chuẩn bị khởi công
   - Đã bàn giao
   - Đọc `searchParams.status` vì navigation đang link query.
   - Filter không được làm 404 khi query không hợp lệ; nên fallback về Tất cả hoặc empty state có link reset.

3. Grid dự án
   - Card có ảnh, location, status label, title, summary.
   - Link tới `/du-an/[slug]`.
   - Nếu chỉ có 1 dự án theo filter, layout vẫn phải cân đối trên desktop.

4. Empty state
   - Nếu filter không có dự án, hiển thị thông báo gọn và link về `/du-an`.

5. CTA cuối trang
   - Mời khách hàng/đối tác liên hệ để nhận thông tin dự án.
   - Link `/lien-he`.

THỨ TỰ SECTION MỤC TIÊU - /du-an/[slug]

1. Page heading
   - Eyebrow: Chi tiết dự án
   - H1: `project.title`
   - Description: `project.summary`

2. Ảnh chính / gallery
   - Dùng `project.image` làm ảnh chính.
   - Nếu có `project.gallery`, render ảnh phụ.
   - Không dùng `project.gallery[0]` thay ảnh chính nếu gallery là ảnh phụ, trừ khi data quy ước rõ.

3. Thông tin nhanh
   - Vị trí
   - Trạng thái
   - Loại hình/lĩnh vực nếu có data
   - Ghi `Đang cập nhật` cho trường chưa duyệt, hoặc không hiển thị.

4. Tổng quan dự án
   - Một đoạn mô tả dự án an toàn, không bịa số liệu.

5. Điểm nổi bật
   - Chỉ dùng các điểm chung có thể xác nhận từ định hướng:
     - Định hướng không gian sống đô thị.
     - Hạ tầng/cảnh quan/tiện ích nếu copy đã duyệt.
     - Gắn với nhu cầu an cư hoặc phát triển khu vực.
   - Nếu chưa chắc, dùng câu mềm: `được định hướng`, `tập trung`, `hướng đến`.

6. CTA cuối trang
   - Title: Quan tâm dự án này?
   - Description: Liên hệ Thiên Đức để được hỗ trợ thông tin.
   - CTA: Liên hệ tư vấn -> `/lien-he`

DATA MODEL GỢI Ý

```ts
export type Project = {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  location?: string;
  image?: string;
  gallery?: string[];
  category?: string;
  description?: string;
  highlights?: string[];
};
```

Status labels:
- `da-ban-giao`: Đã bàn giao
- `dang-thi-cong`: Đang thi công
- `chuan-bi-khoi-cong`: Chuẩn bị khởi công

COPY MẪU

SEO /du-an:
title: "Dự án Thiên Đức | Danh mục dự án bất động sản"
description: "Danh mục các dự án bất động sản Thiên Đức đang triển khai, chuẩn bị phát triển hoặc đã hoàn thành, với thông tin tổng quan và hình ảnh dự án."

Heading /du-an:
Eyebrow: Dự án
H1: Dự án của Thiên Đức
Description: Tổng hợp các dự án Thiên Đức đang triển khai, đã hoàn thành hoặc đang chuẩn bị phát triển trong lĩnh vực bất động sản và xây dựng.

Project data an toàn cho Khu đô thị Hưng Phú:
title: "Khu đô thị Hưng Phú"
location: "Bến Tre"
status: "dang-thi-cong"
summary: "Dự án đô thị tiêu biểu của Thiên Đức, được định hướng phát triển với hạ tầng đồng bộ và không gian sống hiện đại tại Bến Tre."
description: "Khu đô thị Hưng Phú là một trong những dự án Thiên Đức đồng hành phát triển tại Bến Tre. Dự án hướng đến việc kiến tạo không gian sống ổn định, thuận tiện và phù hợp với nhu cầu an cư, kết nối của cư dân trong khu vực."
highlights:
- "Định hướng phát triển khu đô thị hiện đại tại Bến Tre."
- "Tập trung vào hạ tầng, cảnh quan và trải nghiệm sử dụng lâu dài."
- "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt."

Project data an toàn cho Chung cư La Bonita:
title: "Chung cư La Bonita"
location: "TP.HCM"
status: "da-ban-giao"
summary: "Dự án căn hộ tại TP.HCM, được giới thiệu trong danh mục dự án Thiên Đức với hình ảnh và thông tin tổng quan."
description: "Chung cư La Bonita là dự án được giới thiệu trong danh mục dự án của Thiên Đức tại TP.HCM. Các thông tin chi tiết về quy mô, pháp lý và tiến độ nên được cập nhật theo tài liệu chính thức đã duyệt."
highlights:
- "Vị trí tại TP.HCM."
- "Hình ảnh dự án đã có trong thư viện media hiện tại."
- "Các thông tin chi tiết cần được xác nhận trước khi công bố rộng rãi."

CHECKLIST TRIỂN KHAI

- [ ] Đọc `docs/prompt-ai-tong-web.md`.
- [ ] Đọc `docs/prompt-ai-trang-chu.md` để giữ `projects[]` tương thích với Home.
- [ ] Đọc `docs/prompt-ai-gioi-thieu.md` để giữ giọng văn nhất quán.
- [ ] Đọc hướng dẫn Next.js trong `node_modules/next/dist/docs/` nếu sửa metadata/searchParams/params.
- [ ] Chuẩn hóa tiếng Việt có dấu trong `projects[]`.
- [ ] Kiểm tra mọi đường dẫn ảnh project thực sự tồn tại.
- [ ] Thêm metadata riêng cho `/du-an`.
- [ ] Thêm metadata động cho `/du-an/[slug]` nếu phù hợp.
- [ ] Xử lý filter status theo query.
- [ ] Hoàn thiện card dự án có status/location/summary/ảnh.
- [ ] Hoàn thiện trang chi tiết dự án có ảnh, gallery, thông tin nhanh, tổng quan, highlights, CTA.
- [ ] Không bịa dữ liệu chưa được duyệt.
- [ ] Kiểm tra `/du-an`, `/du-an?status=dang-thi-cong`, `/du-an?status=da-ban-giao`, `/du-an?status=chuan-bi-khoi-cong`.
- [ ] Kiểm tra `/du-an/khu-do-thi-hung-phu` và `/du-an/chung-cu-la-bonita`.
- [ ] Kiểm tra Home sau khi sửa `projects[]`.
- [ ] Chạy `npm run build`.
- [ ] Chạy `npm run lint` nếu còn thời gian hoặc nếu task yêu cầu.

ĐẦU RA MONG ĐỢI

1. Danh sách file đã sửa/tạo.
2. Tóm tắt nội dung dự án đã đưa vào UI.
3. Ghi chú rõ dữ liệu nào còn cần công ty duyệt.
4. Kết quả kiểm tra các route/filter.
5. Kết quả `npm run build`.
```
