# Trang liên hệ Thiên Đức

File này dùng cho **task chi tiết trang Liên hệ**. Task tổng quan toàn website nằm ở `docs/prompt-ai-tong-web.md`.

## STACK NÊN LÀM TIẾP - LIÊN HỆ

**Kết luận:** Nên làm stack `/lien-he` tiếp theo. Đây là trang đích của nhiều CTA đã có trên Home, Giới thiệu, Dự án và Tin tức. Hiện trang vẫn còn nội dung placeholder, chưa có metadata riêng, chưa có layout liên hệ production, chưa có bản đồ/form hoặc hướng dẫn gửi yêu cầu rõ ràng.

## KẾT QUẢ CẬP NHẬT TRANG LIÊN HỆ - 2026-06-05

**Kết luận:** Stack Liên hệ đã hoàn thành mức production cơ bản. `/lien-he` đã có metadata riêng, PageHeading tiếng Việt có dấu, thông tin điện thoại/email/địa chỉ lấy từ `siteConfig`, link gọi điện/email/Google Maps, nhóm nhu cầu liên hệ và CTA gửi yêu cầu qua email.

### Đã hoàn thành

- Thay placeholder không dấu trong `src/app/lien-he/page.tsx`.
- Thêm metadata riêng cho `/lien-he`.
- Hiển thị phone/email/address từ `siteConfig`.
- Thêm link `tel:`, `mailto:` và Google Maps.
- Thêm nhóm nhu cầu liên hệ:
  - Tư vấn dự án
  - Hợp tác phát triển
  - Thông tin doanh nghiệp
- Dùng fallback `mailto:` cho gửi yêu cầu vì chưa có backend/API submit.

### Còn lưu ý

- Trang chưa có form submit thật; hiện dùng CTA gửi email.
- Nếu sau này có backend, nên tách form thành component client hoặc Server Action theo convention Next.js hiện tại.
- Có thể nhúng bản đồ trực tiếp khi đã duyệt giải pháp tracking/privacy và hiệu năng.

### Lý do ưu tiên

- `/lien-he` là route chuyển đổi chính cho khách hàng, đối tác và người quan tâm dự án.
- Các CTA hiện tại đã trỏ về `/lien-he`, nên trang này cần đủ nội dung trước khi làm các stack phụ như Tuyển dụng hoặc Công ty thành viên.
- Dữ liệu liên hệ đã có trong `src/config/site.ts`, có thể dùng ngay để tránh hardcode lệch giữa header/footer/trang liên hệ.
- Stack này nhỏ hơn các stack nhân sự, dễ hoàn thiện nhanh và tăng độ production cho toàn site.

## PHẠM VI

- Route: `src/app/lien-he/page.tsx`
- Config liên hệ: `src/config/site.ts`
- Component dùng chung:
  - `src/components/layout/site-shell.tsx`
  - `src/components/ui/page-heading.tsx`
- Tham chiếu CTA:
  - `src/components/sections/home-contact-cta.tsx`
  - `src/app/gioi-thieu/page.tsx`
  - `src/app/du-an/[slug]/page.tsx`
  - `src/app/tin-tuc/[slug]/page.tsx`

Không sửa Home/Giới thiệu/Dự án/Tin tức trừ khi phát hiện link `/lien-he` bị sai.

## TRẠNG THÁI HIỆN TẠI

`src/app/lien-he/page.tsx` hiện mới có:

- `SiteShell`
- `PageHeading`
- Một card email lấy từ `siteConfig.email`

Nội dung còn placeholder không dấu:

- `eyebrow="Lien he"`
- `title="Ket noi voi Thien Duc"`
- `description="Trang nay se chua thong tin lien he, dia chi, ban do va form gui yeu cau."`

Chưa có:

- Metadata riêng cho `/lien-he`
- Phone/address hiển thị đầy đủ
- Link gọi điện/email/bản đồ
- Nội dung hướng dẫn khách hàng/đối tác gửi yêu cầu
- Form liên hệ hoặc fallback khi chưa xử lý submit
- CTA/phân nhóm nhu cầu liên hệ
- Layout production trên mobile/desktop

## MỤC TIÊU PRODUCTION

Trang `/lien-he` nên có:

1. Metadata riêng.
2. Page heading tiếng Việt có dấu.
3. Khối thông tin liên hệ chính:
   - Điện thoại
   - Email
   - Địa chỉ
   - Link Google Maps
4. Khối hướng dẫn nhu cầu liên hệ:
   - Tư vấn dự án
   - Hợp tác phát triển
   - Thông tin doanh nghiệp
5. Form liên hệ cơ bản nếu chưa có backend:
   - Họ tên
   - Số điện thoại/email
   - Nội dung yêu cầu
   - Nút gửi
   - Nếu chưa có API submit, form có thể là UI tĩnh và ghi rõ sẽ được xử lý khi tích hợp backend, hoặc dùng `mailto:` để gửi email.
6. CTA rõ ràng, không bịa cam kết phản hồi nếu chưa có quy trình duyệt.

## KỸ THUẬT

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- `page.tsx` là Server Component nếu chỉ render thông tin tĩnh.
- Nếu form cần state/interaction client-side, tách component riêng với `"use client"`.
- Metadata dùng `import type { Metadata } from "next"`.
- Thông tin liên hệ lấy từ `siteConfig`, không hardcode lại.
- Link nội bộ dùng `next/link` nếu có.
- Link điện thoại: `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`.
- Link email: `mailto:${siteConfig.email}`.
- Link bản đồ: `https://maps.google.com/?q=${encodeURIComponent(siteConfig.address)}`.
- Chạy `npm run build` sau khi sửa.
- Chạy `npm run lint` nếu có chỉnh form/client component.

## DESIGN GỢI Ý

- Dùng nền shell hiện có.
- Section max-width: `mx-auto max-w-7xl px-6`.
- Card trắng, border `border-black/10`.
- Màu chính: `#B06613`.
- Accent: `#fdcd04`.
- Text chính: `#191919` hoặc `#1d2428`.
- Text phụ: `#59646a`.
- Không làm landing page/hero marketing dài; trang cần đi thẳng vào thông tin liên hệ.

## COPY GỢI Ý

Metadata:

```ts
title: "Liên hệ Thiên Đức | Tư vấn dự án và hợp tác"
description: "Thông tin liên hệ Công ty Thiên Đức, hỗ trợ trao đổi về dự án, hợp tác phát triển và nhu cầu tư vấn bất động sản."
```

Page heading:

```text
Eyebrow: Liên hệ
H1: Kết nối với Thiên Đức
Description: Thiên Đức tiếp nhận thông tin từ khách hàng, đối tác và các bên quan tâm đến dự án, hợp tác hoặc hoạt động doanh nghiệp.
```

Khối hướng dẫn:

```text
Bạn có thể liên hệ Thiên Đức để trao đổi về thông tin dự án, nhu cầu tư vấn, hợp tác phát triển hoặc các nội dung liên quan đến doanh nghiệp. Thông tin sẽ được chuyển đến bộ phận phụ trách phù hợp.
```

Nhãn nhóm nhu cầu:

- Tư vấn dự án
- Hợp tác phát triển
- Thông tin doanh nghiệp

## CHECKLIST TRIỂN KHAI

- [ ] Đọc `docs/prompt-ai-tong-web.md`.
- [ ] Đọc `src/config/site.ts`.
- [ ] Thêm metadata riêng cho `/lien-he`.
- [ ] Thay placeholder không dấu bằng copy tiếng Việt có dấu.
- [ ] Hiển thị phone/email/address từ `siteConfig`.
- [ ] Thêm link gọi điện, email và Google Maps.
- [ ] Thêm section hướng dẫn nhu cầu liên hệ.
- [ ] Quyết định form: UI tĩnh, `mailto:`, hoặc tích hợp API nếu có backend.
- [ ] Kiểm tra responsive mobile/desktop.
- [ ] Chạy `npm run build`.
- [ ] Chạy `npm run lint` nếu có thêm client/form logic.

## ĐẦU RA MONG ĐỢI

1. Danh sách file đã sửa/tạo.
2. Tóm tắt nội dung liên hệ đã đưa vào UI.
3. Ghi rõ form đã có submit thật hay chỉ là UI/fallback.
4. Kết quả kiểm tra build/lint.

## STACK SAU LIÊN HỆ

Sau khi hoàn thiện `/lien-he`, thứ tự đề xuất:

1. `/cong-ty-thanh-vien`
2. `/tuyen-dung`
3. `/chinh-sach-nhan-su`
4. `/dao-tao`
5. `/so-do-to-chuc-cong-ty`
