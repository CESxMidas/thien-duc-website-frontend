# Hướng dẫn viết báo cáo (em tự làm, AI chỉ hỗ trợ khung)

## Cấu trúc mỗi phương án PHẢI có

1. **Ưu tiên** — phương án này ưu tiên cái gì? (1 câu rõ ràng)
2. **Từng lớp công nghệ** — mỗi lớp theo format:
   - Bảng so sánh: Công nghệ A / B / C → Ưu điểm / Nhược điểm
   - **→ Lý do chọn:** Chọn X vì (1)... (2)... (3)...
3. **Tiêu chí phi chức năng** — mở rộng, bảo trì, cập nhật, tốc độ phản hồi
4. **Kết luận** — phương án này phù hợp/không phù hợp vì sao

## Lưu ý quan trọng anh hay hỏi

- **NestJS ≠ CSDL.** NestJS là framework xử lý logic. CSDL (PostgreSQL) mới là nơi **lưu dữ liệu**.
- Sơ đồ đúng: `Frontend → NestJS (API) → Prisma (ORM) → PostgreSQL (lưu trữ)`
- PA1: **cố ý không có** backend và CSDL — phải giải thích tại sao
- PA2: **có CSDL qua CMS** (PostgreSQL) — nhưng **không đủ** cho form/HR
- PA3: **đầy đủ** NestJS + PostgreSQL + Admin

## File em cần đọc và chỉnh

| File | Việc em làm |
|------|-------------|
| `docs/bao-cao-tom-tat-content.mjs` | Đọc từng phần `choice`, viết lại bằng lời mình |
| Chạy `npm run report` | Tạo file Word `docs/Bao-cao-tom-tat-phuong-an-ky-thuat-website-Thien-Duc.docx` |
| Hoặc mở file `.html` trong `docs/` | Word → Mở → Lưu thành `.docx` nếu chưa chạy được `npm run report` |

## Câu hỏi tự kiểm tra trước khi nộp

- [ ] Em giải thích được tại sao chọn Next.js thay vì Astro/Remix?
- [ ] Em giải thích được NestJS là gì, PostgreSQL là gì, khác nhau thế nào?
- [ ] Mỗi PA có nói rõ ưu tiên gì không?
- [ ] Có bảng so sánh mở rộng / bảo trì / tốc độ phản hồi không?
- [ ] Em tự viết lại ít nhất 50% nội dung, không copy nguyên AI?
