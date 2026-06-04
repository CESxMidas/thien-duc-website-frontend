# Trang chủ (Home) Thiên Đức

File này chỉ dùng cho **task chi tiết trang chủ**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## KẾT QUẢ KIỂM TRA TRANG CHỦ — 2026-06-03

**Phạm vi kiểm tra:** chỉ trang chủ Home (`src/app/page.tsx`, `src/components/sections/home-*.tsx`, `src/data/home.ts`, `src/data/banners.ts`). Không dùng file này để kiểm tra header/footer/toàn site hoặc các trang `/du-an`, `/tin-tuc`, `/gioi-thieu`, `/lien-he`.

**Kết luận:** Trang chủ đã hoàn thành phần chính theo prompt Home production. Các hạng mục bắt buộc như banner overlay + CTA, HomeHero production, dự án tiêu biểu, lĩnh vực hoạt động, CTA liên hệ, metadata riêng và build production đều đã có. Chưa thể xem là hoàn thành tuyệt đối vì phần số liệu/uy tín đang để optional, tin tức thật chưa có nên section tin mới đang được ẩn, và copy SEO metadata chưa khớp 100% với mẫu đề xuất trong prompt.

### Đã hoàn thành

- `src/app/page.tsx` đã gắn đúng thứ tự: `HomeBannerSlider`, `HomeHero`, `HomeFeaturedProjects`, `HomeCapabilities`, `HomeLatestNews`, `HomeContactCta`.
- `HomeBannerSlider` đã hiển thị ảnh, overlay, title, subtitle, CTA từ `homeBanners`; có autoplay, nút chuyển slide và dot navigation.
- `HomeHero` đã xóa placeholder dev, có một H1 production, mô tả công ty, CTA chính/phụ và 4 điểm mạnh từ `src/data/home.ts`.
- `src/data/home.ts` đã được tạo để quản lý copy Home: hero, strengths, capabilities, featured project copy, contact CTA.
- `HomeFeaturedProjects` đã lấy dữ liệu từ `projects[]`, ưu tiên Khu đô thị Hưng Phú/dự án đang thi công, có link `/du-an/khu-do-thi-hung-phu`.
- `HomeCapabilities` đã có 4 lĩnh vực hoạt động.
- `HomeContactCta` đã lấy phone, email, address từ `siteConfig`.
- Metadata riêng cho Home đã có trong `src/app/page.tsx`.
- `npm run build` đã PASS ngày 2026-06-03.

### Dữ liệu Home còn là mẫu / chưa duyệt

- Layout và component Home đã có; phần còn lại chủ yếu là nội dung/data cần CTY duyệt trước production.
- Section con số/uy tín chưa triển khai vì chưa có số liệu được duyệt. Đây là mục optional.
- `HomeLatestNews` đã có component và logic ẩn tin placeholder, nhưng hiện không hiển thị trên Home vì chưa có bài tin thật đã duyệt.
- Dữ liệu dự án/tin tức dùng cho Home đang ở mức tối thiểu/mẫu. Home đã bù copy hiển thị cho Khu đô thị Hưng Phú, nhưng data gốc vẫn cần chuẩn hóa khi làm task toàn web.
- SEO description trong `src/app/page.tsx` đã tách riêng nhưng vẫn là bản nháp, chưa khớp hoàn toàn mẫu SEO bên dưới.

### TASK làm tiếp

```
TASK: Chỉ hoàn thiện dữ liệu/nội dung còn là mẫu của trang chủ: cập nhật SEO description Home theo copy đã duyệt, quyết định có/không thêm section con số sau khi CTY duyệt số liệu, chuẩn hóa dữ liệu dự án/tin tức dùng cho Home, và chỉ bật HomeLatestNews khi đã có bài tin thật đã duyệt. Không sửa layout Home và không sửa các trang khác.
```
---

## PROMPT

═══════════════════════════════════════
PHẠM VI — CHỈ TRANG CHỦ
═══════════════════════════════════════
- Route: src/app/page.tsx
- Components: src/components/sections/home-*.tsx
- Data: src/data/banners.ts, src/data/home.ts (tạo mới), src/data/projects.ts, src/data/news.ts
- Đọc tham chiếu: src/config/site.ts, src/lib/routes.ts, src/components/layout/site-shell.tsx
- KHÔNG refactor header/footer/toàn site trừ khi TASK yêu cầu rõ

═══════════════════════════════════════
STACK & KỸ THUẬT
═══════════════════════════════════════
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- page.tsx = Server Component; slider/tương tác = "use client"
- Import: @/components, @/data, @/config, @/lib, @/types
- Ảnh: next/image, đường dẫn /images/...
- Diff tối thiểu; không thêm UI library nặng; a11y (aria, alt, keyboard)
- Liên hệ chỉ từ siteConfig (không hardcode khác header)
- npm run build sau thay đổi lớn; không commit trừ khi user yêu cầu

Design system:
- Primary #B06613 (hover #7f4b0d / #7f6127)
- Accent #fdcd04 | Nền shell #f6f3ee | Card trắng, border black/10
- Text #1d2428 / #191919 | Muted #59646a
- Typography như PageHeading: eyebrow uppercase tracking-[0.24em], h1 lớn
- Banner: h-[260px] sm:h-[310px] lg:h-[380px]

Media đã có:
- /images/banners/home/home-banner-interior-living-room-01.jpg … 02.jpg
- /images/banners/home/home-banner-hung-phu-aerial-01.jpg
- /images/banners/home/home-banner-hung-phu-overview-01.jpg
- /images/brand/logo-thien-duc.png
- /images/projects/hung-phu/legacy/hung-phu-building-render-legacy-01.jpg
- /images/news/2021/le-khoi-cong-fancy-tower-2021-04-07.jpg

═══════════════════════════════════════
TRẠNG THÁI CODE HIỆN TẠI
═══════════════════════════════════════
1. HomeBannerSlider: ĐÃ hiển thị ảnh + overlay + title/subtitle/CTA từ homeBanners; có autoplay, nút prev/next và dot navigation.
2. HomeHero: ĐÃ thay placeholder dev bằng khối định vị production; có một H1, CTA chính/phụ và 4 điểm mạnh từ src/data/home.ts.
3. Section Home: ĐÃ có HomeFeaturedProjects, HomeCapabilities, HomeLatestNews, HomeContactCta và đã gắn vào src/app/page.tsx đúng thứ tự chính.
4. Metadata Home: ĐÃ tách riêng trong src/app/page.tsx; NÊN rà lại description nếu muốn khớp đúng copy SEO đề xuất bên dưới.
5. Tin tức mới: component đã có logic ẩn tin placeholder; hiện đang ẩn trên Home vì src/data/news.ts chỉ có bài mẫu "Cap nhat tin tuc Thien Duc".
6. Con số / uy tín: CHƯA triển khai, nhưng là optional và chỉ nên làm khi CTY duyệt số liệu.
7. Build kiểm tra ngày 2026-06-03: npm run build PASS.

═══════════════════════════════════════
LOGIC NỘI DUNG PRODUCTION (BẮT BUỘC)
═══════════════════════════════════════
- Ngôn ngữ: tiếng Việt, tone chuyên nghiệp, tin cậy, BĐS/xây dựng
- Home = HUB: tóm tắt + điều hướng; chi tiết ở /gioi-thieu, /du-an, /tin-tuc, /lien-he
- Một H1 duy nhất (khối định vị, không trùng banner)
- Không copy placeholder dev; không link trang trống
- Không bịa số liệu; không cam kết lợi nhuận/pháp lý chưa duyệt
- Phương châm CTY (đã dùng công khai): "Khách hàng hài lòng — Thiên Đức thành công"

Thứ tự section mục tiêu:
1. Banner (ảnh + title + subtitle + CTA)
2. Định vị + 4 điểm mạnh + CTA
3. Dự án tiêu biểu
4. Lĩnh vực hoạt động
5. (Optional) Con số / uy tín — chỉ số đã xác nhận
6. Tin tức mới — ẩn nếu chưa có bài thật
7. CTA liên hệ

═══════════════════════════════════════
Ý TƯỞNG NỘI DUNG — DÙNG LÀM COPY MẪU
═══════════════════════════════════════

▸ THÔNG ĐIỆP CỐT LÕI
"Thiên Đức — đối tác đầu tư và phát triển bất động sản, kiến tạo không gian sống bền vững."

▸ BANNER (4 slide) — map với homeBanners + đối chiếu ảnh thật

Slide 1:
- Title: Khu đô thị Hưng Phú
- Subtitle: Dự án đô thị tại Bến Tre — không gian sống hiện đại, tiện ích đồng bộ.
- CTA: Xem dự án → /du-an/khu-do-thi-hung-phu

Slide 2:
- Title: Hợp tác phát triển dự án
- Subtitle: Đồng hành cùng đơn vị phát triển uy tín — chất lượng và tiến độ minh bạch.
- CTA: Danh sách dự án → /du-an

Slide 3:
- Title: Thiên Đức — Uy tín từ 2010
- Subtitle: Hơn một thập kỷ trong đầu tư, xây dựng và phát triển bất động sản.
- CTA: Giới thiệu công ty → /gioi-thieu

Slide 4:
- Title: Tin tức & hoạt động
- Subtitle: Tiến độ dự án, sự kiện doanh nghiệp và thông tin thị trường.
- CTA: Xem tin tức → /tin-tuc

(Lưu ý: nếu ảnh banner là Fancy Tower, Silver Sea… thì đổi title/subtitle cho khớp ảnh.)

▸ KHỐI ĐỊNH VỊ (thay HomeHero)

Eyebrow: Công ty Thiên Đức

H1 (chọn 1):
- "Đầu tư – Xây dựng – Phát triển bất động sản bền vững"
- "Đồng hành cùng sự phát triển đô thị và cộng đồng"

Body (~80 từ):
"Công ty TNHH Đầu tư – Xây dựng – Thương mại Thiên Đức (thành lập 2010) hoạt động trong lĩnh vực đầu tư và phát triển bất động sản tại TP.HCM và các tỉnh. Với phương châm «Khách hàng hài lòng — Thiên Đức thành công», chúng tôi tập trung vào tiến độ minh bạch, chất lượng thi công và giá trị lâu dài cho từng dự án."

CTA chính: Xem dự án → /du-an
CTA phụ: Liên hệ tư vấn → /lien-he

4 điểm mạnh (thay box Stack):
1. Đầu tư & phát triển — Quỹ đất và dự án đô thị, nhà ở, TM-DV
2. Hợp tác chiến lược — Liên kết đơn vị phát triển trong và ngoài nước
3. Dự án tiêu biểu — Khu đô thị Hưng Phú (Bến Tre) và dự án tại TP.HCM
4. Cam kết thực thi — Tiến độ rõ ràng, chất lượng công trình

▸ DỰ ÁN TIÊU BIỂU

Section title: Dự án tiêu biểu
Description: Một số dự án Thiên Đức đang triển khai và đã hoàn thành.
Card ưu tiên:
- Khu đô thị Hưng Phú | Bến Tre | Đang thi công | /du-an/khu-do-thi-hung-phu
(Mở rộng khi có data: Silver Sea Tower, La Bonita…)
Link: Xem tất cả dự án → /du-an
Logic: lấy từ projects[], ưu tiên status dang-thi-cong + có image, max 3–6.

▸ LĨNH VỰC HOẠT ĐỘNG (3–4 cột)

Title: Lĩnh vực hoạt động
- Phát triển dự án BĐS: Nghiên cứu, đầu tư khu đô thị, nhà ở, TM-DV
- Đầu tư & hợp tác: Hợp tác chủ đầu tư trên quỹ đất chiến lược
- Thi công & EPC: Công trình dân dụng, hạ tầng đô thị
- Phân phối sản phẩm: Giới thiệu sản phẩm dự án (nếu đúng mô hình CTY)

▸ CON SỐ (OPTIONAL — chỉ khi CTY duyệt)

Title: Thiên Đức qua các con số
- 2010 | Năm thành lập
- 10+ | Năm kinh nghiệm (tính đến 2026)
- 1+ | Dự án đô thị trọng điểm
- TP.HCM | Trụ sở chính

▸ TIN TỨC MỚI

Title: Tin tức & sự kiện
Description: Cập nhật hoạt động, tiến độ dự án và thông tin doanh nghiệp.
Chủ đề gợi ý (khi có bài thật):
- Lễ khởi công Khu đô thị Hưng Phú
- Giới thiệu Fancy Tower | KĐT Hưng Phú
- Hoạt động & hợp tác phát triển dự án
Logic: top 3 newsPosts theo publishedAt; ẩn section nếu không có tin.
Link: Xem tất cả → /tin-tuc

▸ CTA LIÊN HỆ (cuối trang)

Title: Kết nối với Thiên Đức
Description: Đội ngũ tư vấn sẵn sàng hỗ trợ thông tin dự án và hợp tác.
Hiển thị: address, phone, email từ siteConfig
CTA: Liên hệ ngay → /lien-he

▸ SEO TRANG CHỦ

title: "Công ty Thiên Đức | Đầu tư & phát triển bất động sản TP.HCM"
description: "Thiên Đức — chủ đầu tư và phát triển dự án bất động sản từ 2010. Khu đô thị Hưng Phú, hợp tác phát triển tại TP.HCM. Liên hệ (028) 3740 7188."

═══════════════════════════════════════
DATA MODEL GỢI Ý (src/data/home.ts)
═══════════════════════════════════════
export const homeContent = {
  hero: { eyebrow, title, description, primaryCta, secondaryCta, highlights[] },
  sections: { projects, capabilities, stats?, news, contact },
}
Tái sử dụng homeBanners, projects, newsPosts — không duplicate dài.

═══════════════════════════════════════
TASK — ĐIỀN TRƯỚC KHI GỬI
═══════════════════════════════════════
[Mô tả task, ví dụ:
"Implement toàn bộ nội dung Home theo prompt: banner overlay, home.ts, HomeHero mới, HomeFeaturedProjects, HomeCapabilities, HomeContactCta, metadata page.tsx"
]

═══════════════════════════════════════
ĐẦU RA MONG ĐỢI
═══════════════════════════════════════
1. Danh sách file sửa/tạo
2. Copy tiếng Việt đã đưa vào UI (hoặc ghi chú chỗ cần CTY duyệt)
3. Giải thích ngắn UX/layout
4. Checklist deploy: không còn placeholder dev, link hợp lệ, build pass
```

