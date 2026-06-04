# Trang dự án Thiên Đức

File này chỉ dùng cho **task chi tiết trang Dự án**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## KẾT QUẢ KIỂM TRA TRANG DỰ ÁN - 2026-06-03

**Phạm vi kiểm tra:** route danh sách `/du-an`, route chi tiết `/du-an/[slug]`, data `src/data/projects.ts`, type `src/types/content.ts`, ảnh trong `public/images/projects`.

**Kết luận:** Trang Dự án đã có route danh sách, route chi tiết động, render card dự án bằng `next/image` và `projects[]`. Tuy nhiên nội dung vẫn ở mức mẫu/tối thiểu, nhiều chỗ còn tiếng Việt không dấu hoặc lỗi encoding, chưa có metadata riêng, chưa có nội dung chi tiết dự án, chưa có bộ lọc theo trạng thái dù navigation đang link query `?status=...`. Đây là phần nên làm tiếp sau Home và Giới thiệu.

### Đã có sẵn

- Route `/du-an` tồn tại tại `src/app/du-an/page.tsx`.
- Route `/du-an/[slug]` tồn tại tại `src/app/du-an/[slug]/page.tsx`.
- `generateStaticParams()` đã tạo path chi tiết từ `projects[]`.
- `notFound()` đã xử lý slug không tồn tại.
- `ProjectStatus` đã có 3 trạng thái:
  - `da-ban-giao`
  - `dang-thi-cong`
  - `chuan-bi-khoi-cong`
- `src/data/projects.ts` đã có 1 dự án mẫu: `khu-do-thi-hung-phu`.
- Ảnh dự án đã có:
  - `/images/projects/hung-phu/legacy/hung-phu-building-render-legacy-01.jpg`
  - `/images/projects/hung-phu/legacy/hung-phu-building-render-legacy-02.jpg`
- Home đã dùng `projects[]` để render dự án tiêu biểu.

### Còn thiếu / cần xử lý

- Chuẩn hóa tiếng Việt có dấu trong `src/data/projects.ts`:
  - `Khu do thi Hung Phu`
  - `Du an do thi trong diem cua Thien Duc.`
  - `Ben Tre`
- Chuẩn hóa copy trong `src/app/du-an/page.tsx`, hiện còn `Thien Duc Group` và một số text chưa nhất quán với tên công ty.
- Chuẩn hóa copy trong `src/app/du-an/[slug]/page.tsx`, hiện eyebrow chi tiết còn `Chi tiet du an`.
- Thêm metadata riêng cho `/du-an`.
- Thêm metadata động cho `/du-an/[slug]` nếu phù hợp với Next.js version hiện tại.
- Mở rộng model `Project` nếu cần trang chi tiết production:
  - `description`
  - `location`
  - `status`
  - `category`
  - `gallery`
  - `highlights`
  - `scope`
  - `cta`
- Bổ sung nội dung chi tiết cho dự án Khu đô thị Hưng Phú ở mức an toàn, không bịa pháp lý/quy mô/tiến độ chưa duyệt.
- Xử lý query filter `?status=da-ban-giao`, `?status=dang-thi-cong`, `?status=chuan-bi-khoi-cong` hoặc bỏ/đổi navigation nếu chưa làm filter.
- Thêm trạng thái empty khi không có dự án theo filter.
- Kiểm tra ảnh có đúng với dự án và alt text có nghĩa.
- Chạy `npm run build` sau khi sửa.

### TASK làm tiếp

```text
TASK: Hoàn thiện trang Dự án Thiên Đức ở mức production cho cả `/du-an` và `/du-an/[slug]`: chuẩn hóa data `projects[]` bằng tiếng Việt có dấu, thêm metadata riêng, làm danh sách dự án có trạng thái/filter theo query nếu navigation đang dùng, hoàn thiện trang chi tiết dự án Khu đô thị Hưng Phú với gallery/nội dung/highlights an toàn, không bịa số liệu pháp lý/quy mô/tiến độ chưa duyệt. Có thể mở rộng type Project và data nếu cần. Không sửa Home/Giới thiệu trừ khi cần giữ tương thích data. Chạy `npm run build` sau khi hoàn tất.
```

---

## PROMPT

```text
PHẠM VI - CHỈ TRANG DỰ ÁN

- Route danh sách: src/app/du-an/page.tsx
- Route chi tiết: src/app/du-an/[slug]/page.tsx
- Data: src/data/projects.ts
- Type: src/types/content.ts
- Ảnh: public/images/projects/*
- Đọc tham chiếu: src/components/ui/page-heading.tsx, src/components/sections/home-featured-projects.tsx, src/data/home.ts, src/lib/routes.ts, src/data/navigation.ts
- KHÔNG refactor header/footer/toàn site trừ khi TASK yêu cầu rõ
- KHÔNG sửa Home/Giới thiệu trừ khi thay đổi Project type khiến component đang dùng projects[] cần cập nhật tương thích

STACK & KỸ THUẬT

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- Trước khi sửa API metadata/searchParams/params, đọc guide liên quan trong node_modules/next/dist/docs/
- page.tsx là Server Component
- Route detail hiện dùng params dạng Promise; giữ đúng convention của version Next.js hiện tại
- Import dùng alias: @/components, @/data, @/config, @/lib, @/types
- Ảnh dùng next/image, đường dẫn /images/projects/...
- Link nội bộ dùng next/link
- Diff gọn, ưu tiên pattern hiện có
- Chạy npm run build sau khi hoàn thiện

Design system tham chiếu:
- Primary #B06613, hover #7f4b0d
- Accent #fdcd04
- Nền shell #f6f3ee hoặc trắng theo layout hiện có
- Card trắng, border black/10, shadow nhẹ nếu cần
- Text #1d2428 / #191919, muted #59646a
- Eyebrow uppercase tracking-[0.24em]
- Section max-width tương tự Home: mx-auto max-w-7xl px-6

TRẠNG THÁI CODE HIỆN TẠI

1. src/app/du-an/page.tsx render PageHeading + grid card từ projects[].
2. src/app/du-an/[slug]/page.tsx render PageHeading + ảnh chính, chưa có nội dung chi tiết.
3. src/data/projects.ts hiện chỉ có 1 dự án:
   - title: "Khu do thi Hung Phu"
   - slug: "khu-do-thi-hung-phu"
   - summary: "Du an do thi trong diem cua Thien Duc."
   - status: "dang-thi-cong"
   - location: "Ben Tre"
   - image: "/images/projects/hung-phu/legacy/hung-phu-building-render-legacy-01.jpg"
4. src/types/content.ts Project hiện chỉ có title, slug, summary, status, location?, image?.
5. Navigation đang có các link query theo status:
   - /du-an?status=da-ban-giao
   - /du-an?status=dang-thi-cong
   - /du-an?status=chuan-bi-khoi-cong
   nhưng trang /du-an hiện chưa xử lý filter query.
6. Ảnh dự án hiện có khu-do-thi-hung-phu-01.jpg và khu-do-thi-hung-phu-02.jpg.

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
- Nếu chưa có dữ liệu duyệt, dùng nhãn trung tính như "Thông tin đang được cập nhật" hoặc ẩn trường đó.
- CTA phải dẫn đến route có thật: /lien-he.
- Home đang dùng projects[], nên nếu mở rộng type phải không làm vỡ HomeFeaturedProjects.

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
   - Đọc query searchParams.status nếu navigation đang dùng query.
   - Nếu chưa muốn làm filter, phải chỉnh navigation/query hoặc ghi rõ không hỗ trợ.

3. Grid dự án
   - Card có ảnh, location, status label, title, summary.
   - Link tới /du-an/[slug].
   - Nếu chỉ có 1 dự án, layout không nên trống hoặc quá loãng trên desktop.

4. Empty state
   - Nếu filter không có dự án, hiển thị thông báo gọn và link về /du-an.

5. CTA cuối trang
   - Mời khách hàng/đối tác liên hệ để nhận thông tin dự án.
   - Link /lien-he.

THỨ TỰ SECTION MỤC TIÊU - /du-an/[slug]

1. Page heading
   - Eyebrow: Chi tiết dự án
   - H1: project.title
   - Description: project.summary

2. Ảnh chính / gallery
   - Dùng project.image làm ảnh chính.
   - Nếu có project.gallery thì render thêm ảnh phụ.

3. Thông tin nhanh
   - Vị trí
   - Trạng thái
   - Loại hình/lĩnh vực nếu có data
   - Ghi "Đang cập nhật" cho trường chưa duyệt, hoặc không hiển thị.

4. Tổng quan dự án
   - Một đoạn mô tả dự án an toàn, không bịa số liệu.

5. Điểm nổi bật
   - Chỉ dùng các điểm chung có thể xác nhận từ định hướng:
     - Định hướng không gian sống đô thị.
     - Hạ tầng và tiện ích đồng bộ nếu copy đã duyệt.
     - Gắn với nhu cầu an cư/phát triển khu vực.
   - Nếu chưa chắc, dùng câu mềm: "được định hướng", "tập trung", "hướng đến".

6. CTA cuối trang
   - Title: Quan tâm dự án này?
   - Description: Liên hệ Thiên Đức để được hỗ trợ thông tin.
   - CTA: Liên hệ tư vấn -> /lien-he

DATA MODEL GỢI Ý

type Project = {
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

statusLabels:
- da-ban-giao: Đã bàn giao
- dang-thi-cong: Đang thi công
- chuan-bi-khoi-cong: Chuẩn bị khởi công

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
description: "Khu đô thị Hưng Phú là một trong những dự án trọng điểm được Thiên Đức đồng hành phát triển. Dự án hướng đến việc kiến tạo không gian sống ổn định, thuận tiện và phù hợp với nhu cầu an cư, kết nối của cư dân trong khu vực."
highlights:
- "Định hướng phát triển khu đô thị hiện đại tại Bến Tre."
- "Tập trung vào hạ tầng, cảnh quan và trải nghiệm sử dụng lâu dài."
- "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt."

CHECKLIST TRIỂN KHAI

- [ ] Đọc docs/prompt-ai-tong-web.md trước khi sửa.
- [ ] Đọc docs/prompt-ai-trang-chu.md để giữ projects[] tương thích với Home.
- [ ] Đọc hướng dẫn Next.js trong node_modules/next/dist/docs/ nếu sửa metadata/searchParams/params.
- [ ] Chuẩn hóa tiếng Việt có dấu trong projects[].
- [ ] Thêm metadata riêng cho /du-an.
- [ ] Thêm metadata động cho /du-an/[slug] nếu phù hợp.
- [ ] Xử lý filter status theo query hoặc điều chỉnh logic liên quan.
- [ ] Hoàn thiện card dự án có status/location/summary/ảnh.
- [ ] Hoàn thiện trang chi tiết dự án có ảnh, thông tin nhanh, tổng quan, highlights, CTA.
- [ ] Không bịa dữ liệu chưa được duyệt.
- [ ] Kiểm tra /du-an, /du-an?status=dang-thi-cong, /du-an/khu-do-thi-hung-phu.
- [ ] Chạy npm run build.

ĐẦU RA MONG ĐỢI

1. Danh sách file đã sửa/tạo.
2. Tóm tắt nội dung dự án đã đưa vào UI.
3. Ghi chú rõ dữ liệu nào còn cần công ty duyệt.
4. Kết quả kiểm tra các route/filter.
5. Kết quả npm run build.
```

