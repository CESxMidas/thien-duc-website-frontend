# BÁO CÁO PHƯƠNG ÁN KỸ THUẬT WEBSITE — CÔNG TY THIÊN ĐỨC

## Thông tin tài liệu

| Thông tin | Nội dung |
| --- | --- |
| Dự án | Website giới thiệu Công ty TNHH ĐT – XD – TM Thiên Đức |
| Phương án | Phương án 2 (PA2) — Cân bằng thời gian, chi phí và khả năng mở rộng |
| Phiên bản | 3.0 (gộp báo cáo PA2 + báo cáo kỹ thuật + so sánh domain) |
| Ngày lập | 17/06/2026 |
| Trạng thái | Bản trình phê duyệt triển khai |
| Tài liệu tham chiếu | docs/diagrams/ |

## Tóm tắt

Website Thiên Đức là trang giới thiệu doanh nghiệp (corporate website), không phải thương mại điện tử. Mục tiêu: xây dựng uy tín, giới thiệu dự án/sản phẩm, hỗ trợ tư vấn qua form liên hệ, phục vụ tuyển dụng và thu hút nhà đầu tư.

- **Phần 1:** Phân tích hiện trạng website và hệ thống, nêu điểm tốt / chưa tốt.
- **Phần 2:** Thiết kế và đề xuất triển khai PA2 (Next.js + CMS + NestJS + PostgreSQL).
- **Phần 3:** Hạn chế, rủi ro và kế hoạch triển khai 8–10 tuần.
- **Phụ lục F:** So sánh domain & triển khai Trong nước vs Vercel (đã tích hợp vào báo cáo).

Nhân viên nội bộ không cần biết lập trình — tự cập nhật nội dung trên CMS sau khi hệ thống hoàn thiện.

## Đối tượng và cách đọc báo cáo

Báo cáo này trình bày Phương án 2 (PA2) làm website giới thiệu Công ty Thiên Đức. Đối tượng chính là phòng IT triển khai và vận hành; đồng thời Ban giám đốc và các phòng nghiệp vụ (Marketing, HR) có thể đọc phần mục tiêu, chức năng và rủi ro vận hành.
Thuật ngữ kỹ thuật (CMS, API, CSDL…) được giải thích ngắn gọn khi xuất hiện lần đầu. Các bảng so sánh dùng ký hiệu thống nhất: Có / Hạn chế / Không / Phù hợp / Không phù hợp / Giai đoạn sau — không dùng icon. Kết luận luôn gắn với quy mô và nhu cầu thực tế của Thiên Đức (website giới thiệu, cập nhật dự án/tin tức, form liên hệ).



# PHẦN 1 — PHÂN TÍCH HỆ THỐNG


## 1.1 Phân tích hệ thống (hiện trạng & đánh giá)

Phương pháp (theo góp ý review): Phần 1 chỉ mô tả hiện trạng website/dự án và đánh giá điểm tốt / chưa tốt. Mọi giải pháp, kiến trúc PA2, stack công nghệ, quy trình CMS, hosting được trình bày ở Phần 2 — Thiết kế.

### 1.1.1 Bối cảnh và mục tiêu

Công ty Thiên Đức hoạt động đầu tư, xây dựng, phát triển bất động sản và dự án đô thị (thành lập 2010). Website giới thiệu nhằm:
Đối tượng
Mục đích sử dụng
Khách hàng / cư dân tiềm năng
Tìm hiểu công ty, xem dự án, liên hệ tư vấn
Nhà đầu tư
Đánh giá năng lực, portfolio, hợp tác phát triển
Ứng viên / nhân sự
Xem tuyển dụng, chính sách HR, sơ đồ tổ chức
Nội bộ (HR / Marketing)
(Mục tiêu nghiệp vụ) Cập nhật nội dung website không phụ thuộc developer
Phạm vi website: Trang giới thiệu doanh nghiệp — không bán hàng, không tài khoản khách hàng, không thanh toán trực tuyến.

### 1.1.2 Hiện trạng hệ thống (06/2026)

Dự án đang ở giai đoạn prototype giao diện frontend — chưa go-live production, chưa có backend/admin hoàn chỉnh.
Thành phần
Hiện trạng
Ghi chú
Website công khai
✅ Đang phát triển
Next.js 16, React 19, Tailwind CSS 4
Số trang / route
✅ ~12/14 route
Trang chủ, giới thiệu, dự án, tin tức, HR, liên hệ…
Giao diện (UI)
✅ ~70% khung layout
Header, footer, section trang chủ, trang dự án mẫu
Nguồn dữ liệu
⚠️ Tĩnh trong mã nguồn
Thư mục src/data/ — cập nhật phải sửa code
Ảnh / media
⚠️ Lưu local
public/images/ — chưa CDN, chưa tối ưu hàng loạt
Form liên hệ
⚠️ Mở ứng dụng mail
mailto: trên trình duyệt — không lưu CSDL, không email tự động cho admin
Song ngữ Vi/En
❌ Chưa có
Chưa tích hợp next-intl / route /vi, /en
SEO production
⚠️ Một phần
Có metadata cơ bản từng trang; chưa sitemap/robots go-live
Backend API
❌ Chưa có
Chưa có NestJS, chưa có REST API
Admin CMS
❌ Chưa có
Chưa có trang quản trị cho nhân viên nội bộ
Database
❌ Chưa có
Chưa có PostgreSQL / lưu form & nội dung
Domain / hosting
❌ Chưa production
Chạy local localhost:3000; chưa thienduc.vn
Mô hình vận hành hiện tại (rút gọn):
mermaid

flowchart LR

    Dev[Nhân sự kỹ thuật] -->|Sửa file src/data| FE[Next.js Frontend]

    Khach[Khách truy cập] -->|Xem trang| FE

    Khach -->|Form liên hệ| Mail[mailto email công ty]

### 1.1.3 Hiện trạng nội dung & trải nghiệm người dùng

Khách truy cập (hiện tại):
Nhu cầu
Đáp ứng hiện tại
Hạn chế
Xem giới thiệu, dự án, tin
✅ Có trang demo + data mẫu
Nội dung gắn trong code, khó cập nhật thường xuyên
Xem 7 lĩnh vực, banner
✅ Có section trang chủ
Banner/ảnh cần dev thay file
Liên hệ / tư vấn
⚠️ Form → mở mail client
Không theo dõi trạng thái, dễ sót yêu cầu
Song ngữ
❌
Chỉ tiếng Việt
Mobile
✅ Responsive cơ bản
Cần kiểm tra Lighthouse trước go-live
Nội bộ cập nhật nội dung (hiện tại):
Việc cần làm
Cách làm hiện tại
Vấn đề
Thêm/sửa dự án, tin, banner
Nhờ developer sửa src/data + ảnh trong public/
Không phù hợp HR/Marketing tự vận hành
Duyệt bài trước khi đăng
❌ Không có quy trình
Rủi ro nội dung nếu sửa trực tiếp trên code
Quản lý form liên hệ
❌ Không có danh sách tập trung
Chỉ nhận qua email cá nhân (khi khách gửi mail)

### 1.1.4 Điểm tốt (ưu điểm hiện trạng)

#
Điểm tốt
Giải thích
1
Nền tảng kỹ thuật hiện đại
Next.js 16 + React 19 + TypeScript — phù hợp SEO, mở rộng lâu dài
2
Khung 14 trang đã có hướng đi rõ
Route và layout chính đã dựng, giảm rủi ro thiết kế lại từ đầu
3
UI theo nhận diện thương hiệu
Tông trắng + nâu vàng #B06613, logo, cấu trúc header/footer thống nhất
4
Có tài nguyên ảnh & nội dung mẫu
Dự án Hưng Phú, banner, tin tức mẫu — làm reference triển khai thật
5
Phân tách data tạm (src/data)
Dễ migrate sang API sau này; code frontend không trộn logic backend
6
Responsive
Tailwind CSS 4 — hiển thị tốt trên mobile/tablet/desktop

### 1.1.5 Điểm chưa tốt / hạn chế (cần xử lý ở Phần 2)

#
Hạn chế
Tác động
1
Nội dung hard-code
Mỗi lần đổi tin/dự án phải nhờ dev → chậm, không bền vững
2
Không có CMS / admin
Nhân viên không biết code không thể tự cập nhật như yêu cầu nghiệp vụ
3
Form liên hệ qua mailto
Không lưu lịch sử, không phân trạng thái, dễ bỏ sót lead
4
Thiếu backend & database
Không có API, auth, workflow duyệt bài, backup dữ liệu
5
Chưa song ngữ
Chưa đáp ứng yêu cầu Vi/En toàn site
6
Chưa production
Chưa domain, SSL, staging/UAT, monitoring
7
Ảnh chưa qua CDN
Ảnh lớn/local có thể ảnh hưởng tốc độ khi scale
8
SEO chưa hoàn thiện go-live
Thiếu quy trình kiểm tra Lighthouse, sitemap production

### 1.1.6 So sánh tham chiếu (website cùng ngành)

Khảo sát công khai website xây dựng / BĐS — không phải benchmark chính thức.
Tiêu chí
Thiên Đức (hiện trạng + mục tiêu)
Đất Xanh Group
Novaland
Quy mô
DN vừa, TP.HCM + tỉnh
Tập đoàn BĐS lớn
Tập đoàn top đầu
Giao diện
Trắng + nâu vàng, hiện đại (prototype)
Rich media
Premium
Trang dự án
Đang dựng filter, gallery, map
Danh mục đa dạng
Showcase lớn
Form liên hệ
mailto (hiện tại)
Form + CRM
Form + hotline
CMS nội dung
Chưa có (mục tiêu: có)
CMS doanh nghiệp
CMS doanh nghiệp
Song ngữ
Chưa có (mục tiêu: Vi/En)
Vi + En
Vi + En
Nhận xét: Hiện trạng mới dừng ở frontend demo. Để ngang tầm website giới thiệu doanh nghiệp trong ngành cần bổ sung CMS, form có backend, song ngữ — các hạng mục này sẽ được đề xuất cụ thể ở Phần 2.

### 1.1.7 Kết luận phần phân tích

Hiện trạng: Website Thiên Đức đã có nền frontend tốt (~70% UI, ~12/14 route) nhưng chưa phải hệ thống vận hành hoàn chỉnh — thiếu backend, CMS, database và môi trường production.
Điểm mạnh: Stack hiện đại, layout rõ, brand nhất quán, sẵn sàng nối API.
Điểm yếu: Cập nhật nội dung phụ thuộc developer; form liên hệ chưa chuyên nghiệp; chưa đáp ứng song ngữ và vận hành lâu dài.
Hướng xử lý: Các giải pháp kỹ thuật (Phương án 2: Next.js + CMS + NestJS + PostgreSQL…) không trình bày tại đây — xem Phần 2 — Thiết kế.

## 1.2 Yêu cầu chức năng (phát sinh từ hiện trạng & mục tiêu)

Lưu ý: Bảng dưới mô tả yêu cầu nghiệp vụ cần đáp ứng. Cách triển khai kỹ thuật (API, CMS, database…) nằm ở Phần 2.

### 1.2.0 Danh sách chức năng tổng hợp

Chức năng chia theo vai trò. Khách truy cập không có tài khoản, không CRUD — chỉ xem nội dung công khai và gửi form liên hệ (không liệt kê như quyền quản trị).

### 1.2.1 Chức năng công khai (Website — khách truy cập)

ID
Chức năng
Mô tả
P01
Trang chủ
Banner, giới thiệu, 7 lĩnh vực, dự án nổi bật, tin, CTA
P02
Giới thiệu
Tổng quan, tầm nhìn, sứ mệnh
P03
Danh sách dự án
Lọc trạng thái
P04
Chi tiết dự án
Gallery, map, facts, CTA
P05
Chi tiết hạng mục
Trang con hạng mục trong dự án
P06–P07
Tin tức
List + detail
P08–P09
HR + CTTV
Tuyển dụng, đào tạo, CSNS, sơ đồ TC, CTTV
P10
Liên hệ
Phone, email, map, form
P11
Gửi form
POST API → PostgreSQL + email admin
P12
Song ngữ Vi/En
Locale switcher
P13
SEO
Metadata, sitemap, OG, schema
P14
Responsive
Mobile / tablet / desktop

### 1.2.2 Chức năng quản trị — Editor (Nhân viên nội dung)

ID
Chức năng
Mô tả
Giai đoạn
E01
Đăng nhập admin
JWT qua API
P0
E02
Dashboard
Xem liên hệ mới, bài nháp của mình
P0
E03
CRUD dự án (nháp)
Tạo/sửa/xóa — không publish
P1
E04
CRUD tin tức (nháp)
Soạn bài, gửi duyệt
P1
E05
Upload ảnh / video
Cloudinary; lưu URL vào CSDL
P1
E06
Sửa banner trang chủ
Nội dung + ảnh + thứ tự
P1
E07
Sửa trang tĩnh (nháp)
HR, giới thiệu mở rộng
P2
E08
Đặt lịch đăng bài
Chọn published_at tương lai
Phase 2 (PA2 cơ bản: publish thủ công; lịch tự động cần cron job)

### 1.2.3 Chức năng quản trị — Admin

ID
Chức năng
Mô tả
Giai đoạn
A01
Tất cả quyền Editor
+ publish
P1
A02
Duyệt & publish tin
DRAFT → PENDING → PUBLISHED
P1
A03
Publish dự án / banner
Hiển thị website
P1
A04
Quản lý form liên hệ
List, detail, đổi trạng thái, ghi chú nội bộ
P0
A05
Quản lý trang tĩnh
Publish nội dung HR, CTTV
P2
A06
Xem báo cáo nhanh
Số liên hệ theo trạng thái, tin chờ duyệt
P0

### 1.2.4 Chức năng quản trị — Super Admin

ID
Chức năng
Mô tả
Giai đoạn
S01
Cài đặt site
Phone, email, địa chỉ, metadata global
P2
S02
Quản lý tài khoản
CRUD user Editor/Admin; khóa/mở
P2
S03
Phân quyền
SUPER_ADMIN / ADMIN / EDITOR
P2
S04
Cấu hình email
SMTP Gmail / Workspace
P0
Ghi chú: Giai đoạn đầu có thể chỉ 1 Super Admin; mở rộng sau.

### 1.2.5 Ánh xạ 14 trang ↔ module CMS

#
Trang
Route
Module admin
1
Trang chủ
/
Banner + Featured
2
Giới thiệu
/gioi-thieu
Trang tĩnh
3
Dự án
/du-an
Dự án
4
Chi tiết dự án
/du-an/[slug]
Dự án
5
Chi tiết hạng mục
/du-an/[slug]/[hang-muc]
Dự án → Hạng mục
6–7
Tin tức
/tin-tuc, /tin-tuc/[slug]
Tin tức
8, 10
Tuyển dụng
/tuyen-dung
Trang tĩnh
9
CTTV
/cong-ty-thanh-vien
Trang tĩnh
11–13
Sơ đồ TC, Đào tạo, CSNS
/so-do-..., /dao-tao, /chinh-sach-...
Trang tĩnh + media
14
Liên hệ
/lien-he
Cài đặt + Form (read)


## 1.3 Sơ đồ tham chiếu (minh họa)

Các sơ đồ chi tiết được lưu tại thư mục `docs/diagrams/`:

| ID | Sơ đồ | File |
| --- | --- | --- |
| 01 | Đăng nhập Admin | diagrams/01-dang-nhap.png |
| 02 | Form liên hệ | diagrams/02-form-lien-he.png |
| 03 | Upload ảnh Cloudinary | diagrams/03-upload-anh.png |
| 04 | Tính năng tổng quan | diagrams/04-tinh-nang-tong-quan.png |
| 05 | Kiến trúc 3 tầng | diagrams/05-kien-truc-3-tang.png |
| 06 | DFD mức 0 | diagrams/06-dfd-muc-0.png |
| 07 | ERD tóm tắt | diagrams/07-erd-tom-tat.png |
| 08 | Duyệt tin tức | diagrams/08-duyet-tin.png |
| 09 | Xử lý form liên hệ | diagrams/09-xu-ly-form.png |



# PHẦN 2 — THIẾT KẾ (PHƯƠNG ÁN 2)

> **Quy ước trong Phần 2:** Các bảng so sánh dùng ký hiệu thống nhất: **Có** / **Không** / **Hạn chế** / **Phù hợp** / **Không phù hợp** / **Giai đoạn sau**. Không dùng biểu tượng (icon). Thuật ngữ kỹ thuật được giải thích ngắn gọn ngay tại bảng hoặc đoạn văn trước bảng.

Phần 2 trả lời câu hỏi: *“Với các yêu cầu đã phân tích ở Phần 1, Phương án 2 sẽ được thiết kế và triển khai cụ thể như thế nào?”* Mỗi mục dưới đây đi theo thứ tự: **mục đích** → **giải thích cho người đọc** → **bảng so sánh / thiết kế** → **kết luận áp dụng cho Thiên Đức**. Các sơ đồ minh họa (đăng nhập, form liên hệ, upload ảnh, duyệt tin, kiến trúc 3 tầng, ERD…) nằm tại `docs/diagrams/` và được tham chiếu trực tiếp trong từng mục tương ứng.

---

## 2.1 Thiết kế giao diện website công khai

### 2.1.0 Mục đích

Thiết kế phần **website công khai** — nơi khách hàng, nhà đầu tư và ứng viên truy cập qua trình duyệt — sao cho: (1) thể hiện đúng thương hiệu Thiên Đức, (2) tải nhanh trên điện thoại, (3) dễ được Google tìm thấy, (4) sẵn sàng nhận nội dung động từ CMS thay vì sửa mã nguồn như hiện tại.

**Liên kết Phần 1:** Các chức năng P01–P14 (mục 1.2.1) và 14 route (mục 1.2.5) là đầu vào; Phần 2.1 mô tả cách hiện thực hóa trên giao diện.

### 2.1.1 Yêu cầu giao diện và nhận diện thương hiệu

| Hạng mục | Quy định | Lý do / ghi chú vận hành |
| --- | --- | --- |
| Phong cách | Doanh nghiệp hiện đại, sáng, thể hiện uy tín; nền trắng chủ đạo | Phù hợp ngành BĐS — tạo cảm giác minh bạch, chuyên nghiệp; đồng bộ prototype hiện có |
| Màu chính | #B06613 (nâu vàng thương hiệu), #c99248, #fdcd04 (điểm nhấn) | Đã dùng trong mã nguồn (`src/config/site.ts`); giữ nhất quán trên mọi trang |
| Nền / chữ | #FFFFFF, #F2F2F2, #191919, #8f8f8f | Đảm bảo độ tương phản đọc được trên mobile ngoài trời |
| Logo / favicon | Thư mục `public/images/brand/` | Một bộ file dùng chung website và email mẫu |
| Phông chữ | Geist Sans (mặc định Next.js) | Miễn phí, tải nhanh, hỗ trợ tiếng Việt có dấu |
| Hiển thị đa thiết bị | Ưu tiên mobile trước (mobile-first) | Phần lớn khách xem dự án trên điện thoại; breakpoint theo Tailwind CSS 4 |
| Song ngữ | Tiếng Việt và tiếng Anh; đường dẫn `/vi/...` và `/en/...` | Phục vụ nhà đầu tư nước ngoài; chi tiết tại mục 2.1.6 |
| Hiệu ứng | Chuyển động nhẹ (fade/reveal) | Tăng trải nghiệm nhưng không làm chậm LCP (chỉ bật sau khi nội dung chính hiển thị) |

**Kết luận PA2:** Giữ nguyên hướng thiết kế đã có trong prototype (~70% UI), chỉ bổ sung lớp dữ liệu động và song ngữ — không thiết kế lại từ đầu để tiết kiệm thời gian.

### 2.1.2 Lựa chọn công nghệ giao diện (Frontend)

**Giải thích nhanh:** *Frontend* (giao diện người dùng) là phần khách nhìn thấy trên trình duyệt: trang chủ, dự án, tin tức, liên hệ. *Framework* là bộ khung lập trình giúp dựng website nhanh và bảo trì lâu dài.

**Bảng 1 — Công nghệ đã chọn cho PA2**

| Thành phần | Công nghệ | Phiên bản | Lý do chọn cụ thể cho Thiên Đức |
| --- | --- | --- | --- |
| Khung website | Next.js (App Router) | 16.2.6 | Hỗ trợ SEO (Google đọc được nội dung), tải trang nhanh; dự án đã có ~70% mã nguồn và ~12/14 route — tái sử dụng tối đa |
| Thư viện giao diện | React | 19.2.4 | Chuẩn công nghiệp, đội dev đã quen; dùng chung với Admin CMS |
| Ngôn ngữ lập trình | TypeScript | 5.x | Giảm lỗi khi mở rộng; thống nhất với backend NestJS |
| Trang trí giao diện | Tailwind CSS | 4.x | Dựng responsive nhanh, đồng bộ với Admin (shadcn/ui) |
| Biểu tượng | lucide-react | 1.17.x | Bộ icon nhẹ, không cần tải file ảnh riêng cho từng icon |
| Đa ngôn ngữ | next-intl (đề xuất) | Mới nhất | Tích hợp tốt App Router; quản lý file dịch Vi/En tách biệt |
| Kiểm tra mã nguồn | ESLint | 9.x | Giữ chất lượng khi nhiều người cùng sửa |

**Bảng 2 — So sánh khung làm website công khai**

| Tiêu chí | Giải thích ngắn | Next.js (PA2) | Vite + React (SPA) | WordPress |
| --- | --- | --- | --- | --- |
| Hiển thị tốt trên Google (SEO) | Google đọc được nội dung khi chưa chạy JavaScript | Phù hợp — render phía máy chủ | Hạn chế — cần bổ sung SSR hoặc pre-render | Phù hợp — có sẵn plugin SEO |
| Tốc độ với mã sẵn có | Thời gian ra mắt | Phù hợp — tái dùng repo hiện tại | Phù hợp cho Admin, không cho website công khai | Không phù hợp — phải làm lại toàn bộ giao diện |
| Tái sử dụng prototype Thiên Đức | Giữ layout, màu, component đã dựng | Phù hợp | Không phù hợp cho FE công khai | Không phù hợp |
| Bảo trì lâu dài | Ai sửa được sau 2–3 năm | Phù hợp — tài liệu phong phú | Phù hợp | Hạn chế — phụ thuộc plugin, bảo mật cần cập nhật liên tục |
| Phù hợp website giới thiệu BĐS | Gallery ảnh lớn, nhiều trang tĩnh | Phù hợp | Hạn chế cho SEO | Phù hợp nhưng không dùng được mã hiện tại |
| **Kết luận PA2** | — | **Chọn** | Chỉ dùng cho **Admin CMS** | **Không chọn** |

**Giải thích thêm (tại sao không WordPress):** WordPress phù hợp blog hoặc site nhỏ cần plugin có sẵn, nhưng Thiên Đức đã đầu tư prototype Next.js với layout tùy biến (dự án, gallery, bản đồ). Chuyển sang WordPress đồng nghĩa bỏ toàn bộ mã hiện có và vẫn phải xây Admin riêng cho quy trình duyệt tin nội bộ — không tiết kiệm thời gian.

**Kết luận PA2:** Giữ **Next.js 16 App Router** cho website công khai; **Vite + React** chỉ dùng cho trang quản trị (mục 2.3).

### 2.1.3 Cấu trúc trang và đường dẫn (14 route)

Bảng dưới ánh xạ từng trang website sang module CMS và nguồn dữ liệu API sau go-live. Hiện tại dữ liệu nằm trong `src/data/`; khi go-live sẽ chuyển sang gọi API công khai.

| STT | Trang | Đường dẫn (Vi) | Module CMS | Nguồn dữ liệu PA2 |
| --- | --- | --- | --- | --- |
| 1 | Trang chủ | `/` hoặc `/vi` | Banner + Dự án nổi bật + Tin mới | API banner, featured projects, posts |
| 2 | Giới thiệu | `/gioi-thieu` | Trang tĩnh | API trang tĩnh `about` |
| 3 | Danh sách dự án | `/du-an` | Dự án | API danh sách dự án (lọc trạng thái) |
| 4 | Chi tiết dự án | `/du-an/[slug]` | Dự án | API chi tiết + gallery + bản đồ |
| 5 | Chi tiết hạng mục | `/du-an/[slug]/[hang-muc]` | Dự án → Hạng mục con | API hạng mục thuộc dự án |
| 6 | Danh sách tin | `/tin-tuc` | Tin tức | API bài đã publish |
| 7 | Chi tiết tin | `/tin-tuc/[slug]` | Tin tức | API chi tiết bài |
| 8 | Tuyển dụng | `/tuyen-dung` | Trang tĩnh | API trang `careers` |
| 9 | Công ty thành viên | `/cong-ty-thanh-vien` | Trang tĩnh | API trang `members` |
| 10–13 | Sơ đồ TC, Đào tạo, CSNS | `/so-do-to-chuc-cong-ty`, `/dao-tao`, `/chinh-sach-nhan-su` | Trang tĩnh + media | API trang tĩnh + ảnh Cloudinary |
| 14 | Liên hệ | `/lien-he` | Cài đặt site + Form | API cài đặt + POST form |

**Menu điều hướng:** 7 mục chính (Trang chủ, Giới thiệu, Dự án, Tin tức, Công ty thành viên, Nhân sự, Liên hệ) với menu con — đã khai báo trong `src/data/navigation.ts`, giữ nguyên khi nối API.

### 2.1.4 Thành phần giao diện theo từng khu vực

| Khu vực / trang | Thành phần bắt buộc | Hành vi / ghi chú kỹ thuật |
| --- | --- | --- |
| Dải thông tin trên cùng | Địa chỉ (link Google Maps), điện thoại, email | Lấy từ `site_settings` API; sửa một lần trên CMS, hiển thị mọi trang |
| Header | Logo, menu 7 mục + menu con, tìm kiếm, chuyển Vi/En, nút CTA | Menu con dự án theo trạng thái; CTA dẫn tới `/lien-he` |
| Trang chủ | Banner (carousel), 7 lĩnh vực, dự án nổi bật, tin mới, CTA liên hệ | Banner quản lý trên CMS; ISR 60–120 giây để cập nhật nhanh |
| Trang dự án | Thẻ dự án, bộ lọc trạng thái, gallery, bản đồ, link hạng mục | Ảnh gallery tải lười; ảnh qua Cloudinary (WebP) |
| Trang tin tức | Danh sách phân trang, lọc danh mục, chi tiết có ngày đăng | Chỉ hiển thị bài `PUBLISHED` và `published_at <= hiện tại` |
| Trang HR / CTTV | Nội dung khối (block) có thể sửa trên CMS | Hỗ trợ ảnh sơ đồ tổ chức, file PDF tuyển dụng (link) |
| Trang liên hệ | Form 5 trường, bản đồ, validate phía trình duyệt | Form gửi HTTPS tới API — xem sơ đồ 02, 09 |
| Footer | Thông tin công ty, nhóm link, mạng xã hội (nếu có) | Đồng bộ với `footer.ts` hiện tại, dữ liệu từ CMS |
| SEO / chia sẻ | Tiêu đề trang, mô tả, ảnh Open Graph, sitemap, robots.txt | Mỗi trang có metadata riêng; chi tiết mục 2.1.7 |

### 2.1.5 Song ngữ Việt — Anh

**Mục đích:** Phục vụ khách trong nước (tiếng Việt) và nhà đầu tư / đối tác quốc tế (tiếng Anh) mà không cần hai website riêng.

| Hạng mục | Thiết kế PA2 |
| --- | --- |
| Cấu trúc URL | Tiền tố locale: `/vi/du-an`, `/en/projects` (slug Anh có thể map riêng trong CSDL) |
| Nội dung dịch | Mỗi bản ghi (dự án, tin, trang tĩnh) có trường `title_vi`, `title_en`, `content_vi`, `content_en` |
| Chuyển ngôn ngữ | Nút trên Header; giữ nguyên trang tương đương (ví dụ `/vi/tin-tuc/slug` → `/en/news/slug`) |
| Mặc định | Tiếng Việt; trình duyệt không tự đoán ngôn ngữ ở giai đoạn đầu |
| CMS | Editor nhập cả hai ngôn ngữ trên cùng một form; có thể để trống bản Anh nếu chưa dịch |

**Kết luận PA2:** Dùng **next-intl** + cột đa ngôn ngữ trên PostgreSQL; không dùng hai bản copy bài viết riêng biệt để tránh lệch nội dung.

### 2.1.6 SEO và khả năng tìm kiếm

| Hạng mục | Cách triển khai PA2 | Lợi ích cho Thiên Đức |
| --- | --- | --- |
| Metadata từng trang | `title`, `description`, `keywords` lấy từ CMS hoặc mặc định theo trang | Google hiển thị đúng tên dự án khi khách tìm kiếm |
| Open Graph | Ảnh chia sẻ khi đăng link Facebook/Zalo | Tin dự án mới có ảnh preview đẹp |
| Sitemap XML | Tự sinh từ danh sách route + slug dự án/tin đã publish | Google index trang mới sau khi Admin publish |
| robots.txt | Cho phép index trang công khai; chặn `/admin` | Tránh lộ trang quản trị |
| Schema.org | `Organization`, `LocalBusiness` trên trang chủ và liên hệ | Rich snippet trên kết quả tìm kiếm |
| URL thân thiện | Slug tiếng Việt không dấu: `khu-do-thi-hung-phu` | Dễ đọc, dễ chia sẻ |

### 2.1.7 Hiệu năng tải trang

**Giải thích chỉ số (cho người không chuyên):**

- **TTFB:** Thời gian từ khi bấm link đến khi máy chủ bắt đầu gửi dữ liệu — càng thấp càng “phản hồi nhanh”.
- **LCP:** Thời gian hiển thị phần nội dung chính (banner, tiêu đề lớn) — ảnh hưởng trực tiếp cảm giác chậm/nhanh.
- **CLS:** Độ giật layout khi ảnh/font tải xong — gây khó chịu nếu cao.
- **Lighthouse:** Công cụ đo của Google Chrome; điểm hiệu năng mobile từ 70 trở lên được coi là chấp nhận được cho website doanh nghiệp.

| Chỉ số | Ý nghĩa | Hiện trạng (local) | Mục tiêu go-live | Biện pháp đạt mục tiêu |
| --- | --- | --- | --- | --- |
| TTFB trang chủ | Phản hồi máy chủ | ~204 ms | Dưới 600 ms | Deploy Vercel + ISR; API cache 60 giây |
| TTFB trang liên hệ | Như trên | ~66 ms | Dưới 400 ms | Trang tĩnh, ít gọi API |
| Dung lượng HTML trang chủ | Kích thước mã HTML | ~95 KB | Dưới 150 KB | Không nhúng ảnh base64; tách JSON lớn |
| LCP | Nội dung chính hiển thị | Chưa đo production | Dưới 2,5 giây | Ảnh banner priority; WebP qua Cloudinary |
| CLS | Giật bố cục | Chưa đo | Dưới 0,1 | Khai báo kích thước ảnh (`width`/`height`) |
| Lighthouse mobile | Điểm tổng hợp | Chưa đo | Từ 70 trở lên | Tối ưu ảnh, lazy load gallery, giảm JS client |

**ISR (tái tạo trang định kỳ):** Next.js lưu bản HTML đã render; sau 60–300 giây mới build lại khi có người truy cập — giúp trang chủ/tin tức nhanh mà vẫn cập nhật nội dung CMS không cần deploy lại toàn site.

**Kết luận PA2:** Hiệu năng đạt được bằng kết hợp **Vercel CDN + ISR + Cloudinary WebP + lazy load** — không cần máy chủ riêng giai đoạn đầu.

---

## 2.2 Thiết kế máy chủ và cơ sở dữ liệu

### 2.2.0 Mục đích

Thiết kế **backend** (máy chủ xử lý nghiệp vụ) và **cơ sở dữ liệu** (nơi lưu dự án, tin, form, tài khoản) để: (1) nhân viên Marketing/HR cập nhật nội dung qua CMS, (2) form liên hệ lưu vào CSDL và gửi email, (3) phân quyền đăng nhập an toàn.

**Liên kết Phần 1:** Chức năng E01–S04 (mục 1.2.2–1.2.4) và P11 (gửi form) được hiện thực tại tầng backend này.

### 2.2.1 Kiến trúc 3 tầng (tổng quan)

**Giải thích nhanh:** Website PA2 chia **3 tầng** tách biệt — mỗi tầng có thể nâng cấp hoặc thay nhà cung cấp độc lập. Sơ đồ chi tiết: `diagrams/05-kien-truc-3-tang.png`.

| Tầng | Thành phần | Vai trò với người dùng | Công nghệ PA2 |
| --- | --- | --- | --- |
| Trình bày (Presentation) | Website công khai + Admin CMS | Khách xem trang; nhân viên soạn nội dung | Next.js + Vite/React |
| Nghiệp vụ (Application) | API backend | Xử lý đăng nhập, duyệt bài, lưu form, cấp quyền upload | NestJS |
| Dữ liệu (Data) | CSDL + lưu file | Lưu bài viết, form, link ảnh | PostgreSQL + Cloudinary |

Luồng điển hình khi khách gửi form liên hệ: Trình duyệt → Next.js (hiển thị form) → HTTPS POST → NestJS (kiểm tra dữ liệu) → PostgreSQL (lưu) + Gmail SMTP (email admin). Sơ đồ: `diagrams/02-form-lien-he.png`, `diagrams/09-xu-ly-form.png`.

### 2.2.2 Thành phần kỹ thuật backend

| Thành phần | Công nghệ PA2 | Vai trò chi tiết |
| --- | --- | --- |
| Khung máy chủ | NestJS (Node.js + TypeScript) | Chia module: Auth, Projects, Posts, Pages, Contacts, Media, Users, Settings |
| Kết nối CSDL | Prisma ORM | Viết truy vấn an toàn, quản lý migration (thay đổi cấu trúc bảng có kiểm soát) |
| Cơ sở dữ liệu | PostgreSQL 15+ | Lưu quan hệ dự án → hạng mục → ảnh; transaction khi ghi form |
| Xác thực | JWT (JSON Web Token) | Sau đăng nhập, CMS gửi token mỗi request; hết hạn sau 8 giờ (cấu hình được) |
| Gửi email | Gmail SMTP / Google Workspace | Email thông báo khi có form mới; template HTML đơn giản |
| Lưu ảnh/video | Cloudinary | Upload trực tiếp từ trình duyệt Admin — API chỉ cấp chữ ký, không nhận file nặng |
| Kiểm tra đầu vào | class-validator (NestJS) + Zod (shared) | Chặn email sai định dạng, trường trống, XSS cơ bản |
| Chống spam form | Giới hạn 5 request / IP / giờ | Tránh bot gửi hàng loạt; bổ sung captcha ở giai đoạn sau nếu cần |
| Nhật ký lỗi | Log tập trung (Render/Railway) | Theo dõi khi API lỗi 500; không ghi mật khẩu |

### 2.2.3 Lựa chọn cơ sở dữ liệu (CSDL)

**Giải thích cho người không chuyên CNTT:**

- **Cơ sở dữ liệu (CSDL)** giống “sổ sách điện tử” có cấu trúc: mỗi **bảng** là một loại dữ liệu (dự án, tin tức, form liên hệ…), mỗi **dòng** là một bản ghi (một dự án cụ thể), các bảng **liên kết** với nhau (một dự án có nhiều ảnh).
- **PostgreSQL / MySQL** thuộc loại CSDL **quan hệ** — phù hợp khi dữ liệu có quan hệ rõ (dự án → hạng mục → ảnh).
- **MongoDB** thuộc loại **phi quan hệ** — linh hoạt khi cấu trúc thay đổi liên tục, nhưng website Thiên Đức đã có mô hình ổn định từ prototype.
- **Redis** **không phải** CSDL chính. Redis là **bộ nhớ đệm** (cache): lưu tạm kết quả đã truy vấn để lần sau trả lời nhanh hơn, mất điện có thể mất cache nhưng dữ liệu gốc vẫn nằm trong PostgreSQL. PA2 **chưa bắt buộc** Redis vì lượt truy cập dự kiến ~100–5.000/ngày; chỉ xem xét khi API chậm hoặc traffic tăng mạnh (xem Phần 3).

**Bảng so sánh CSDL — theo nhu cầu website giới thiệu Thiên Đức**

| Tiêu chí | Giải thích ngắn | PostgreSQL (PA2) | MySQL | MongoDB | Redis |
| --- | --- | --- | --- | --- | --- |
| Quan hệ dự án → hạng mục → ảnh | Một dự án nhiều hạng mục, mỗi hạng mục nhiều ảnh | Có — khóa ngoại rõ ràng | Có | Hạn chế — phải mô phỏng quan hệ | Không — chỉ lưu key-value tạm |
| Lưu form liên hệ + trạng thái | Mới / đang xử lý / đã xử lý | Có | Có | Hạn chế | Không |
| Quy trình duyệt tin | Nháp → chờ duyệt → đăng | Có — cột `status` | Có | Hạn chế | Không |
| Công cụ Prisma với NestJS | Một ngôn ngữ schema, migration | Có — hỗ trợ tốt nhất | Có | Có | Không |
| Nội dung trang HR (khối linh hoạt) | JSON trong cột `content_blocks` | Có | Có | Có | Không |
| Tìm kiếm tiếng Việt trong Admin | Tìm tên dự án, tiêu đề tin | Có — mở rộng full-text search | Có | Có | Không |
| Sao lưu / khôi phục | Backup khi sự cố | Có — pg_dump, managed backup | Có | Có | Giai đoạn sau |
| Quy mô ~100–5.000 lượt/ngày | Website giới thiệu, không sàn TMĐT | Phù hợp | Phù hợp | Không phù hợp — thừa độ phức tạp | Không phù hợp làm CSDL chính |
| **Kết luận PA2** | — | **Chọn làm CSDL chính** | Thay thế được, không lợi thế rõ | Không ưu tiên | **Giai đoạn sau** (cache API) |

**Kết luận PA2:** Chọn **PostgreSQL** vì mô hình dữ liệu Thiên Đức có quan hệ chặt, cần độ tin cậy khi lưu form và duyệt bài, đồng bộ với NestJS + Prisma. **Redis** không thay PostgreSQL; nếu sau này traffic cao, Redis chỉ cache danh sách dự án/tin đã publish.

### 2.2.4 Lựa chọn khung máy chủ (Backend framework)

| Tiêu chí | Giải thích | NestJS (PA2) | Laravel (PHP) | Spring Boot (Java) |
| --- | --- | --- | --- | --- |
| Cùng TypeScript với frontend | Một ngôn ngữ cho FE + BE + Admin | Có | Không (PHP) | Không (Java) |
| Chia module nghiệp vụ | Auth, CMS, Media tách file riêng | Phù hợp | Phù hợp | Phù hợp |
| Tốc độ triển khai PA2 | Tuần 4–5 trong kế hoạch | Nhanh — ecosystem Node | Trung bình — học PHP riêng | Chậm — cấu hình nặng |
| Độ khó với đội hiện tại | Đã dùng TypeScript trên Next.js | Thấp | Trung bình | Cao |
| Chạy trên Render/Railway | Node process 24/7 | Phù hợp | Phù hợp (PHP-FPM) | Hạn chế (cần JVM lớn) |
| **Kết luận PA2** | — | **Chọn** | Không chọn | Không chọn |

### 2.2.5 Lựa chọn lưu trữ ảnh và video

**Quy trình upload (sơ đồ 03):** Admin chọn ảnh → CMS gọi API lấy **chữ ký Cloudinary** → trình duyệt upload **thẳng** lên Cloudinary → nhận URL → CMS lưu URL vào PostgreSQL. API không mang file 2–5 MB, tránh timeout.

| Tiêu chí | Giải thích | Cloudinary (PA2) | Lưu trên VPS | AWS S3 |
| --- | --- | --- | --- | --- |
| Tự động WebP / thu nhỏ | Giảm dung lượng, tăng tốc LCP | Có | Không — xử lý thủ công | Phải cấu hình Lambda |
| CDN toàn cầu | Ảnh tải từ máy chủ gần khách | Có | Hạn chế — phụ thuộc VPS VN | Có |
| Upload từ Admin | Kéo thả trong CMS | Có — SDK sẵn | Phức tạp — tốn ổ cứng VPS | Trung bình |
| Chi phí giai đoạn đầu | 25 GB miễn phí | 0–600.000 VND/tháng khi vượt | Gộp VPS | Trả theo GB |
| **Kết luận PA2** | — | **Chọn** | Không chọn | Có thể thay sau |

### 2.2.6 Mô hình dữ liệu tóm tắt (ERD)

Sơ đồ quan hệ đầy đủ: `diagrams/07-erd-tom-tat.png`. Bảng dưới mô tả **bảng chính** và mục đích — giúp Ban giám đốc hình dung dữ liệu lưu ở đâu.

| Bảng (entity) | Lưu gì | Quan hệ chính |
| --- | --- | --- |
| `users` | Tài khoản Admin/Editor: email, mật khẩu băm, vai trò | Một user tạo nhiều bài nháp |
| `projects` | Dự án: tên, slug, trạng thái, mô tả Vi/En, vị trí | Một dự án → nhiều `project_items`, nhiều `project_images` |
| `project_items` | Hạng mục con trong dự án (phân khu, tiện ích…) | Thuộc một `project` |
| `project_images` | URL ảnh gallery, thứ tự hiển thị | Thuộc `project` hoặc `project_item` |
| `posts` | Tin tức: tiêu đề, nội dung, trạng thái duyệt, ngày đăng | Tạo bởi `users`; workflow mục 2.3.4 |
| `pages` | Trang tĩnh: giới thiệu, HR, CTTV (khối nội dung JSON) | Slug cố định: `about`, `careers`… |
| `banners` | Banner trang chủ: ảnh, link, thứ tự, bật/tắt | Độc lập |
| `contacts` | Form liên hệ: họ tên, SĐT, email, nội dung, trạng thái | Admin đổi trạng thái, ghi chú nội bộ |
| `site_settings` | Phone, email, địa chỉ, metadata global | Một bản ghi cấu hình site |
| `media_assets` (tùy chọn) | Thư viện ảnh dùng chung CMS | Link Cloudinary + alt text |

**Trạng thái nội dung (workflow):**

| Đối tượng | Trạng thái | Ai được chuyển | Hiển thị website |
| --- | --- | --- | --- |
| Tin tức / Dự án | `DRAFT` (nháp) | Editor | Không |
| | `PENDING` (chờ duyệt) | Editor gửi, Admin duyệt | Không |
| | `PUBLISHED` (đã đăng) | Admin | Có |
| | `ARCHIVED` (lưu trữ) | Admin | Không |
| Form liên hệ | `NEW` → `IN_PROGRESS` → `DONE` | Admin | Không (chỉ trong CMS) |

### 2.2.7 Phân quyền và đăng nhập

Tham chiếu sơ đồ `diagrams/01-dang-nhap.png`.

| Vai trò | Mã | Quyền chính |
| --- | --- | --- |
| Super Admin | `SUPER_ADMIN` | Cài đặt site, quản lý tài khoản, SMTP, toàn quyền nội dung |
| Admin | `ADMIN` | Duyệt/publish tin và dự án, quản lý form, banner, trang tĩnh |
| Editor | `EDITOR` | Soạn nháp, upload ảnh, gửi duyệt — **không** publish |

**Luồng đăng nhập:** CMS gửi email + mật khẩu (HTTPS) → API kiểm tra → trả JWT → CMS lưu token (bộ nhớ phiên, không localStorage lâu dài) → mỗi thao tác gửi kèm header `Authorization`. Sai mật khẩu 5 lần / 15 phút → tạm khóa IP (cấu hình được).

### 2.2.8 Danh sách API REST (thiết kế chi tiết)

**Giải thích:** *API* là “cửa giao tiếp” giữa website/Admin với máy chủ — mỗi *endpoint* là một địa chỉ URL + phương thức (GET = đọc, POST = gửi mới, PATCH = sửa, DELETE = xóa). Tiền tố đề xuất: `https://api.thienduc.vn/api/v1`.

**API công khai (không cần đăng nhập)**

| Phương thức | Đường dẫn | Mục đích | Dữ liệu trả về / ghi chú |
| --- | --- | --- | --- |
| GET | `/health` | Kiểm tra API sống | `{ status: "ok" }` — dùng go-live checklist |
| GET | `/projects` | Danh sách dự án đã publish | Lọc `?status=`, phân trang `?page=` |
| GET | `/projects/:slug` | Chi tiết một dự án | Kèm gallery, map, hạng mục |
| GET | `/projects/:slug/items/:itemSlug` | Chi tiết hạng mục | Ảnh và mô tả hạng mục |
| GET | `/posts` | Danh sách tin đã publish | Sắp xếp `published_at` giảm dần |
| GET | `/posts/:slug` | Chi tiết tin | Nội dung đầy đủ Vi/En |
| GET | `/pages/:slug` | Trang tĩnh (about, careers…) | Khối nội dung JSON |
| GET | `/banners` | Banner trang chủ đang bật | Theo `sort_order` |
| GET | `/site-settings` | Phone, email, địa chỉ công khai | Không trả secret |
| POST | `/contacts` | Gửi form liên hệ | Body: họ tên, email, SĐT, nội dung; rate limit |

**API quản trị (bắt buộc JWT + đúng vai trò)**

| Phương thức | Đường dẫn | Vai trò tối thiểu | Mục đích |
| --- | --- | --- | --- |
| POST | `/auth/login` | — | Đăng nhập, nhận JWT |
| POST | `/auth/refresh` | Đã đăng nhập | Làm mới token |
| GET | `/admin/dashboard` | EDITOR | Số liên hệ mới, bài nháp của tôi |
| GET/POST/PATCH/DELETE | `/admin/projects` | EDITOR (POST/PATCH nháp) | CRUD dự án |
| POST | `/admin/projects/:id/submit` | EDITOR | Gửi duyệt → `PENDING` |
| POST | `/admin/projects/:id/publish` | ADMIN | Publish → `PUBLISHED` |
| GET/POST/PATCH/DELETE | `/admin/posts` | EDITOR | CRUD tin tức |
| POST | `/admin/posts/:id/submit` | EDITOR | Gửi duyệt |
| POST | `/admin/posts/:id/publish` | ADMIN | Publish tin |
| GET/PATCH/DELETE | `/admin/contacts` | ADMIN | Danh sách form, đổi trạng thái, ghi chú |
| GET/PATCH | `/admin/banners` | ADMIN | Quản lý banner trang chủ |
| GET/PATCH | `/admin/pages/:slug` | ADMIN | Sửa trang tĩnh |
| POST | `/admin/media/signature` | EDITOR | Cấp chữ ký upload Cloudinary |
| GET/POST/PATCH/DELETE | `/admin/users` | SUPER_ADMIN | Quản lý tài khoản |
| GET/PATCH | `/admin/settings` | SUPER_ADMIN | Cài đặt site, SMTP |

**Kết luận PA2:** API tách **công khai** (chỉ đọc nội dung publish + gửi form) và **quản trị** (CRUD đầy đủ có phân quyền) — website công khai không lộ endpoint sửa/xóa.

### 2.2.9 Quy trình nghiệp vụ chính

**A. Gửi và xử lý form liên hệ** (`diagrams/02`, `09`)

1. Khách điền form trên `/lien-he`, trình duyệt kiểm tra định dạng email/SĐT.
2. Frontend gửi POST `/contacts` (HTTPS).
3. API validate → lưu `contacts` trạng thái `NEW` → gửi email tới hộp thư công ty.
4. Admin mở CMS mục Liên hệ → đổi `IN_PROGRESS` → `DONE`, ghi chú nội bộ.

**B. Upload ảnh** (`diagrams/03`)

1. Editor chọn ảnh trong form dự án/tin.
2. CMS gọi POST `/admin/media/signature`.
3. Upload trực tiếp Cloudinary → nhận `secure_url`.
4. CMS lưu URL vào bản ghi dự án/tin khi submit form.

**C. Duyệt và đăng tin** (`diagrams/08`)

1. Editor soạn tin, trạng thái `DRAFT`.
2. Editor bấm “Gửi duyệt” → `PENDING`; Admin nhận thông báo trên dashboard.
3. Admin xem preview → “Publish” → `PUBLISHED`, ghi `published_at`.
4. Website công khai gọi GET `/posts` — chỉ thấy bài `PUBLISHED`.

---

## 2.3 Thiết kế trang quản trị nội dung (Admin CMS)

### 2.3.0 Mục đích

Xây dựng **trang quản trị riêng** (`admin.thienduc.vn`) để nhân viên Marketing, HR **không cần biết lập trình** vẫn cập nhật dự án, tin tức, banner và xử lý form — thay thế việc nhờ developer sửa file `src/data/`.

### 2.3.1 Công nghệ Admin CMS

| Hạng mục | Lựa chọn PA2 | Lý do |
| --- | --- | --- |
| Khung ứng dụng | Vite + React + TypeScript | SPA nhẹ, build nhanh; không cần SEO cho trang admin |
| Giao diện thành phần | shadcn/ui + Tailwind CSS | Form, bảng, dialog đồng bộ style; copy component dễ |
| Lấy dữ liệu API | TanStack Query | Cache, tự làm mới danh sách sau khi lưu |
| Biểu mẫu | React Hook Form + Zod | Validate trùng rule với backend |
| Đăng nhập | JWT qua API NestJS | Không lưu mật khẩu trên CMS |
| Trình soạn thảo | TipTap hoặc React Quill (đề xuất) | Soạn tin tức có định dạng (đậm, link, danh sách) |
| Địa chỉ triển khai | `admin.thienduc.vn` | Tách subdomain — dễ phân quyền firewall sau này |

**Bảng so sánh — CMS tự xây (PA2) vs giải pháp có sẵn**

| Tiêu chí | Giải thích | CMS tự xây PA2 | WordPress Admin | Strapi (headless) |
| --- | --- | --- | --- | --- |
| Quy trình duyệt 3 cấp Thiên Đức | Editor → Admin → publish | Phù hợp — thiết kế theo mục 1.2 | Hạn chế — plugin phức tạp | Phù hợp nhưng học thêm |
| Giao diện khớp nghiệp vụ BĐS | Form dự án, gallery, bản đồ | Phù hợp — tùy chỉnh 100% | Không phù hợp | Trung bình |
| Cùng stack TypeScript với FE | Một đội bảo trì | Phù hợp | Không (PHP) | Phù hợp |
| Chi phí license | — | Không | Plugin trả phí có thể phát sinh | Miễn phí / cloud trả phí |
| **Kết luận PA2** | — | **Chọn** | Không chọn | Có thể thay nếu muốn giảm code admin |

### 2.3.2 Cấu trúc menu và màn hình

| Menu CMS | Màn hình chính | Vai trò sử dụng | Giai đoạn |
| --- | --- | --- | --- |
| Dashboard | Thống kê liên hệ mới, tin chờ duyệt | Editor, Admin | P0 |
| Dự án | Danh sách, tạo/sửa, gallery, bản đồ, gửi duyệt | Editor soạn; Admin publish | P1 |
| Tin tức | Danh sách, soạn bài, gửi duyệt | Editor soạn; Admin publish | P1 |
| Banner | Sắp xếp banner trang chủ | Admin | P1 |
| Trang tĩnh | Giới thiệu, HR, CTTV (editor khối) | Admin | P2 |
| Liên hệ | Danh sách form, chi tiết, trạng thái | Admin | P0 |
| Cài đặt | Phone, email, SMTP, metadata | Super Admin | P2 |
| Tài khoản | CRUD user, khóa/mở | Super Admin | P2 |

### 2.3.3 Ánh xạ chức năng Phần 1 → thiết kế CMS

| ID (Phần 1) | Chức năng | Cách hiện thực PA2 |
| --- | --- | --- |
| E01 | Đăng nhập | Màn hình login → POST `/auth/login` |
| E02 | Dashboard | GET `/admin/dashboard` |
| E03–E04 | CRUD dự án/tin nháp | Form CMS + API `/admin/projects`, `/admin/posts` |
| E05 | Upload ảnh | Chữ ký Cloudinary + thư viện media |
| E06 | Sửa banner | Màn hình Banner |
| E07 | Trang tĩnh nháp | Module Pages (P2) |
| A02–A03 | Duyệt & publish | Nút Submit / Publish + sơ đồ 08 |
| A04 | Quản lý form | Màn hình Liên hệ |
| S01–S04 | Cài đặt, user, SMTP | Màn hình Cài đặt + Tài khoản |

**Kết luận PA2:** Admin CMS là **ứng dụng web riêng** (Vite), không nhúng vào Next.js — tránh lẫn code công khai và code nội bộ, dễ giới hạn IP truy cập sau này nếu cần.

---

## 2.4 Thiết kế hosting và hạ tầng

### 2.4.0 Mục đích

Xác định **nơi đặt từng thành phần** (website, admin, API, CSDL, ảnh) để người dùng truy cập `thienduc.vn` ổn định, chi phí dự đoán được, và đội kỹ thuật vận hành được với nguồn lực hiện có.

### 2.4.1 Ánh xạ thành phần → hosting (PA2)

| Thành phần | Công nghệ | Hosting đề xuất | Tên miền / ghi chú |
| --- | --- | --- | --- |
| Website công khai | Next.js 16 | Vercel | `thienduc.vn`, `www.thienduc.vn` |
| Trang quản trị CMS | Vite + React | Vercel (project riêng) | `admin.thienduc.vn` |
| Backend API | NestJS + Prisma | Render hoặc Railway | `api.thienduc.vn` — **không** đặt NestJS trên Vercel Serverless |
| Cơ sở dữ liệu | PostgreSQL | Render PostgreSQL / Neon | Managed backup hàng ngày |
| Media | Cloudinary | Cloudinary CDN | Upload từ Admin |
| Email form | Gmail SMTP | Google Workspace công ty | Thông báo admin khi có form |
| Staging | Bản build UAT | Vercel preview hoặc subdomain | `staging.thienduc.vn` |

**Giải thích tại sao API không đặt Vercel Serverless:** NestJS CMS cần chạy liên tục (WebSocket, upload signature, kết nối DB pool). Serverless giới hạn thời gian mỗi request và khó giữ kết nối PostgreSQL ổn định — Render/Railway phù hợp hơn cho API 24/7.

### 2.4.2 Hosting website công khai và Admin

| Tiêu chí | Giải thích | Vercel (PA2) | VPS Việt Nam | Hosting PHP giá rẻ |
| --- | --- | --- | --- | --- |
| Tối ưu Next.js / Vite | Build và CDN có sẵn | Có | Hạn chế — tự cài Node, Nginx | Không — không chạy Node |
| Triển khai từ Git | Push code → tự build | Có — vài phút | Hạn chế — SSH, build tay | Không |
| HTTPS | Chứng chỉ bảo mật | Có — tự động | Có — Let's Encrypt | Có |
| CDN | Tải CSS/JS/ảnh tĩnh nhanh | Có — toàn cầu | Hạn chế — thường một vùng VN | Hạn chế |
| Preview trước go-live | URL xem thử mỗi nhánh | Có | Phải tự dựng staging | Không |
| Chi phí/tháng | — | 0–500.000 VND | 200.000–800.000 VND | 50.000–150.000 VND |
| **Kết luận PA2** | — | **Chọn** FE + Admin | Dự phòng khi bắt buộc data in-country | **Không phù hợp** |

### 2.4.3 Hosting API và PostgreSQL

| Tiêu chí | Giải thích | Render / Railway (PA2) | VPS VN tự quản | Neon DB + VPS API |
| --- | --- | --- | --- | --- |
| Chạy NestJS 24/7 | Process Node không bị giới hạn 10s | Có | Có — tự cài PM2 | API trên VPS, DB tách |
| PostgreSQL managed | Backup, patch bảo mật | Có — gói kèm hoặc add-on | Có — tự cài + pg_dump | Neon free tier → trả phí |
| Triển khai | Git connect, một click | Gần như tự động | Cấu hình tay, bảo trì định kỳ | Kết hợp được |
| Vị trí máy chủ | Độ trễ từ VN | US/EU (+50–150 ms) | VN (thấp hơn) | Tùy chọn region |
| Chi phí/tháng | — | 350.000–600.000 VND | 300.000–1.000.000 + công vận hành | 0–350.000 VND (giai đoạn đầu) |
| **Kết luận PA2** | — | **Chọn** giai đoạn đầu | Khi cần tuân thủ lưu trữ VN | Có thể tách DB sau |

### 2.4.4 Tên miền, DNS và các bước triển khai

| Địa chỉ | Mục đích | Cách trỏ DNS (kịch bản A — Vercel + Render) |
| --- | --- | --- |
| `thienduc.vn` | Website công khai | CNAME hoặc A record theo hướng dẫn Vercel |
| `www.thienduc.vn` | Alias website | CNAME → Vercel |
| `admin.thienduc.vn` | CMS | CNAME → project Vercel Admin |
| `api.thienduc.vn` | API | CNAME → host Render/Railway |
| `staging.thienduc.vn` | Kiểm thử UAT | Vercel preview hoặc subdomain riêng |

**Các bước đăng ký (tóm tắt):**

1. Đăng ký tên miền `.vn` / `.com.vn` tại nhà cung cấp Việt Nam (PA Vietnam, Nhân Hòa…) — cần GPKD cho `.vn`.
2. Tạo project Vercel (FE + Admin), project Render (API + PostgreSQL).
3. Thêm domain vào Vercel/Render; copy bản ghi DNS vào trang quản lý tên miền.
4. Chờ SSL tự cấp (thường 5–30 phút).
5. Cấu hình biến môi trường (mục 2.4.6); chạy migration Prisma; kiểm tra `/health`.

### 2.4.5 So sánh triển khai: trong nước và Vercel + Render

| Tiêu chí | Trong nước (domain VN + VPS VN) | Vercel + Render (PA2) |
| --- | --- | --- |
| Đối tượng phù hợp | Công ty bắt buộc server + DB trong lãnh thổ VN | Muốn ra mắt nhanh, ít người vận hành server |
| Độ khó vận hành | Cao — firewall, backup, patch OS | Thấp — nền tảng lo phần lớn |
| Tốc độ tại VN | Tốt nếu VPS đặt VN | Tốt nhờ CDN; API có thể +50–150 ms |
| Chi phí năm đầu | ~18–35 triệu VND (VPS + nhân sự) | ~6–15 triệu VND (gói thấp + domain) |
| Tuân thủ dữ liệu | Dễ đáp ứng “lưu trữ trong nước” | Một phần server nước ngoài — cần rà soát chính sách công ty |
| **Khuyến nghị PA2** | **Phương án dự phòng (kịch bản B)** | **Ưu tiên giai đoạn đầu (kịch bản A)** |

**Kịch bản A (khuyến nghị):** Domain VN → FE + Admin trên Vercel → API + PostgreSQL trên Render/Railway → ảnh Cloudinary → email Google Workspace.

**Kịch bản B (dự phòng):** VPS Việt Nam (Vietnix, Viettel IDC) chạy Next.js + Nginx + NestJS + PostgreSQL trên cùng hoặc tách máy; ảnh vẫn Cloudinary; chi phí và nhân sự vận hành cao hơn.

**Không nên:** Chỉ mua domain không thuê hosting; dùng hosting PHP giá rẻ cho Next.js; nhét FE + BE + DB trên VPS 1 GB RAM.

### 2.4.6 Biến môi trường cần cấu hình

| Biến | Đặt ở | Mục đích | Lưu ý bảo mật |
| --- | --- | --- | --- |
| `DATABASE_URL` | API (Render) | Kết nối PostgreSQL | Không commit Git |
| `JWT_SECRET` | API | Ký token đăng nhập | Chuỗi ngẫu nhiên dài |
| `CLOUDINARY_*` | API | Chữ ký upload | Secret chỉ trên server |
| `SMTP_*` | API | Gửi email form | App password Gmail |
| `NEXT_PUBLIC_API_URL` | Next.js (Vercel) | FE gọi API | URL công khai `api.thienduc.vn` |
| `NEXT_PUBLIC_SITE_URL` | Next.js | SEO, canonical | `https://thienduc.vn` |
| `VITE_API_URL` | Admin (Vercel) | CMS gọi API | Giống FE |

### 2.4.7 Ước tính chi phí vận hành/tháng

| Hạng mục | Ước tính (VND/tháng) | Giải thích |
| --- | --- | --- |
| Tên miền `.vn` / `.com.vn` | ~30.000–50.000 (chia đều 12 tháng) | ~300.000–700.000 VND/năm tại nhà đăng ký VN |
| Vercel | 0–500.000 | Gói Hobby miễn phí có thể đủ traffic giai đoạn đầu; Pro khi cần analytics/team |
| Render API + PostgreSQL | ~350.000–600.000 | Tương đương 7–25 USD; gồm instance API + DB nhỏ |
| Cloudinary | 0–600.000 | Miễn phí ~25 GB; trả phí khi gallery dự án lớn |
| Google Workspace | Theo gói công ty | Dùng email công ty gửi thông báo form — không tính vào ngân sách dự án nếu đã có |
| **Tổng ước tính** | **~400.000–1.500.000 VND/tháng** | Chưa gồm lương nhân sự vận hành; chưa gồm phí thiết kế nội dung |

So sánh chi tiết 11 bảng (FE, BE, domain, checklist go-live): **Phụ lục F** cuối báo cáo.

---

## 2.5 Kết luận Phần 2

Phương án 2 cho Công ty Thiên Đức được thiết kế thành **bốn lớp rõ ràng**:

1. **Website công khai (Next.js):** Tái sử dụng ~70% giao diện hiện có; bổ sung song ngữ, SEO, nối API; host Vercel.
2. **Admin CMS (Vite + React):** Cho phép Editor soạn nháp, Admin duyệt publish, xử lý form — host `admin.thienduc.vn`.
3. **Backend (NestJS + PostgreSQL):** API phân quyền, workflow duyệt tin, lưu form, chữ ký Cloudinary — host Render/Railway tại `api.thienduc.vn`.
4. **Hạ tầng bổ trợ:** Cloudinary (ảnh), Gmail Workspace (email), domain VN — chi phí vận hành ước tính 400.000–1.500.000 VND/tháng giai đoạn đầu.

Thiết kế này trực tiếp đáp ứng các hạn chế đã nêu ở Phần 1 (dữ liệu tĩnh, form mailto, chưa CMS, chưa song ngữ) và làm cơ sở cho kế hoạch triển khai 8–10 tuần ở Phần 3.

# PHẦN 3 — HẠN CHẾ, RỦI RO & KẾ HOẠCH


## 3.1 Hạn chế thiết kế (cụ thể)

#
Hạn chế
Mô tả chi tiết
Hướng xử lý
1
Traffic đồng thời
PA2 chưa có load balancing, single instance API + DB. Ước tính: ~50–100 concurrent users ổn định trên Render Starter; >500 concurrent (VD: viral tin tức, sự kiện lớn) có thể timeout 503.
Scale vertical; thêm Redis cache; CDN static; upgrade plan
2
>1000 người truy cập cùng lúc
Với 1 instance NestJS + PostgreSQL basic, không đảm bảo phản hồi <2s cho tất cả. Database connection pool (~10–20) có thể cạn.
Horizontal scaling (PA3): multiple API instances + load balancer + read replica
3
Tập trung địa lý
Deploy US/EU (Vercel/Render): user VN latency +50–150ms so với VPS VN. Một tỉnh/thành truy cập đồng loạt (QC địa phương) không quá tải CDN (CDN phân tán), nhưng API origin vẫn 1 điểm.
Cloudflare; cân nhắc VPS VN cho API nếu latency là vấn đề
4
Ảnh lớn
Upload không giới hạn dung lượng → LCP chậm
Cloudinary auto-format; giới hạn max 2MB/upload
5
Admin đơn giản
Chưa audit log, chưa lịch đăng tự động (Phase 2), chưa phân quyền từng field.
Mở rộng PA3
6
Backup & DR
PA2: backup DB daily cơ bản; RPO ~24h, RTO ~2–4h (restore thủ công)
Cấu hình Render/Neon; test restore hàng quý
7
i18n
Dịch thủ công 2 field (vi/en); không auto-translate
Quy trình nội dung song song
8
Gmail SMTP quota
Free Gmail ~500 email/ngày; form spam có thể vượt
Rate limit 5 req/IP/giờ; Google Workspace; captcha Phase 2
9
Không có WAF
PA2 chưa Web Application Firewall riêng
Cloudflare free tier; rate limit API

## 3.2 Rủi ro

Rủi ro
Mức
Giảm thiểu
Schema DB thay đổi khi triển khai
Thấp
Freeze ERD trước khi code; migration có kiểm soát
Nội dung HR/tin chưa đủ go-live
Trung bình
Go-live theo module; placeholder có nhãn
Phụ thuộc dịch vụ quốc tế
Trung bình
Phương án VPS VN trong Excel
Lighthouse không đạt mục tiêu
Trung bình
Tối ưu ảnh trước UAT

## 3.3 Kế hoạch triển khai (8–10 tuần)

Tuần
Giai đoạn
Deliverable
1
Phê duyệt báo cáo v2.0 + freeze ERD
Báo cáo ký, Prisma schema draft
2–3
Hoàn thiện UI + i18n shell + SEO cơ bản
14 route, sitemap, robots
4–5
NestJS + PostgreSQL + public API
POST contact, GET content
6
Admin P0
Login, dashboard, liên hệ
7
Admin P1
Dự án, tin, banner
8
Admin P2
Trang tĩnh, settings, users
9
Tích hợp FE ↔ API, staging UAT
staging URLs
10
Go-live production
Domain, SSL, handover
Gantt: minh-hoa-bao-cao-pa2.md — H6

## 3.4 Tiêu chí nghiệm thu

Website: 14 route · responsive · Vi/En · form → DB + email · Lighthouse ≥70 · sitemap + robots + OG
Admin: login 3 cấp · CRUD dự án/tin/banner/trang tĩnh · workflow duyệt · quản lý liên hệ · Cloudinary
Kỹ thuật: staging UAT · backup DB · secrets không lộ client

## 3.5 Vì sao chọn PA2 (tóm tắt cho IT và Ban giám đốc)

(tóm tắt cho IT và Ban giám đốc)
PA2 = Frontend (đã ~70%) + CMS cho nhân viên tự cập nhật + Backend + PostgreSQL + form liên hệ có lưu CSDL.
Điểm mạnh: Vận hành nội dung không phụ thuộc developer mỗi lần đăng tin/dự án; kiến trúc rõ ràng; phù hợp website giới thiệu BĐS.
Điểm yếu / trade-off: Chi phí và thời gian cao hơn “chỉ frontend”; cần hosting và IT vận hành tối thiểu; chưa tối ưu cho traffic rất lớn.
So sánh nhanh
Tiêu chí
PA1 (chỉ FE)
PA2 (đề xuất)
PA3 (mở rộng)
Thời gian
Nhanh nhất
Trung bình
Lâu nhất
Admin + CMS
Hạn chế
Đầy đủ
Đầy đủ + mở rộng
Form + DB + email
Một phần
Đầy đủ
Nâng cao
Phù hợp Thiên Đức
Tạm
Phù hợp nhất
Chưa cần giai đoạn này

# PHỤ LỤC


## Phụ lục A — Thông tin công ty

Trường
Giá trị
Tên
Công ty TNHH ĐT – XD – TM Thiên Đức
Thành lập
2010
Email
dautuxaydungthienduc@yahoo.com
Phone
(028) 3740 7188
Địa chỉ
Số 10 Trần Não, Khu Phố 5, Phường An Phú, TP Thủ Đức, TP.HCM

## Phụ lục B — Màu thương hiệu

Token
Mã màu
primary
#B06613
primarySoft
#c99248
accent
#fdcd04
background
#FFFFFF
surface
#F2F2F2
text
#191919
muted
#8f8f8f

## Phụ lục C — 14 trang website (PA2)

Route
Module CMS
Mô tả
/
Banner + Featured
Trang chủ
/gioi-thieu
Trang tĩnh
Giới thiệu công ty
/du-an, /du-an/[slug]
Dự án
Danh sách + chi tiết
/du-an/[slug]/[hang-muc]
Dự án → Hạng mục
Chi tiết hạng mục
/tin-tuc, /tin-tuc/[slug]
Tin tức
Danh sách + chi tiết
/tuyen-dung, HR pages, /cong-ty-thanh-vien
Trang tĩnh
Nhân sự + CTTV
/lien-he
Cài đặt + Form
Liên hệ

## Phụ lục D — Checklist minh họa

ID
Nội dung
Trạng thái
H01
Sơ đồ 3 tầng PA2 (Mermaid 1.3.2)
✅ Trong báo cáo
H02
Flow khách (Mermaid 1.1.2)
✅
H03
Flow cập nhật nội dung CMS (1.1.4 + minh-hoa H2)
✅
H04
Wireframe trang chủ
✅ minh-hoa-bao-cao-pa2.md
H05
Wireframe admin
✅ minh-hoa-bao-cao-pa2.md
H06
ERD (Mermaid 1.3.5)
✅
H07
6 sequence/state diagrams (1.3.6)
✅
H08
Gantt 8–10 tuần
✅ minh-hoa-bao-cao-pa2.md
H09
Screenshot UI thật (4 màn hình)
☐ Chụp thủ công
H10
Lighthouse screenshot
☐ Chrome DevTools
H11
Export draw.io 01–03 PNG
☐ Export thủ công
H12
Screenshot đối thủ 2–3 site
☐ Chụp thủ công

## Phụ lục E — Lý do chọn PA2

So với
PA1
PA2
PA3
Thời gian
Nhanh nhất
Trung bình
Lâu nhất
Admin tách + CMS
Hạn chế
✅ Đầy đủ
Đầy đủ
Phân quyền
Cơ bản
3 cấp
Chi tiết
Form + DB + email
Một phần
✅
✅
Phù hợp Thiên Đức
Tạm
✅ Nhất
Chưa cần
Kết luận và đề nghị
Chấp nhận Phương án 2 — hệ thống đầy đủ FE + BE + Admin + Database.
Phê duyệt báo cáo v2.1 (phân tích hệ thống hoàn chỉnh + thiết kế + sơ đồ + hạn chế).
Triển khai theo timeline 8–10 tuần (mục 3.3).
Bổ sung screenshot UI + Lighthouse trước trình ký final (Phụ lục D).
Người lập báo cáo: _________________________
Ngày: _________________________
Người phê duyệt: _________________________
Ngày phê duyệt: _________________________
Tài liệu Markdown làm việc — xuất Word/PDF để trình ký. Minh họa: minh-hoa-bao-cao-pa2.md


## Phụ lục F — So sánh Domain & triển khai (Trong nước vs Vercel)

Nội dung so sánh domain & triển khai Trong nước vs Vercel (11 bảng).

### 1. Tổng quan

| SO SÁNH DOMAIN & TRIỂN KHAI — TRONG NƯỚC vs VERCEL |  |  |  |
| --- | --- | --- | --- |
| Tiêu chí | Trong nước (Domain VN + VPS VN) | Vercel | Ghi chú |
| Ai phù hợp? | Công ty muốn toàn bộ hạ tầng trong VN, tự kiểm soát server | Đội dev muốn ra mắt nhanh, ít vận hành server |  |
| Độ khó vận hành | Cao — cần người biết cấu hình server, bảo mật, backup | Thấp — nền tảng lo phần lớn deploy & CDN |  |
| Tốc độ FE tại VN | Tot neu server dat tai VN | Tot nho CDN toan cau |  |
| BE (API + DB) | Tu cai tren VPS: NestJS API + PostgreSQL | PA2: API NestJS tren Render/Railway; FE + Admin tren Vercel | Khong dung Vercel Serverless cho NestJS CMS day du |
| Upload ảnh (Cloudinary) | FE/BE gọi Cloudinary — không phụ thuộc nơi host | Giống phương án trong nước | Giống nhau |
| SSL/HTTPS | Tự cài Let's Encrypt miễn phí hoặc mua SSL VN | Tự động, miễn phí |  |
| Backup & khôi phục | Tự thiết lập snapshot VPS, dump DB | Rollback deploy trên Vercel; DB backup riêng |  |
| Hỗ trợ khi sự cố | Nhà cung cấp VN — tiếng Việt, giờ hành chính | Tiếng Anh, ticket/email |  |
| Tuân thủ dữ liệu VN | Dễ đặt server + DB trong lãnh thổ VN | Server/CDN có thể ở nước ngoài — cần rà chính sách |  |
| Chi phí khởi điểm | ~500k–2tr/tháng (VPS) + ~300k–800k/năm (domain .vn) | $0 Hobby hoặc ~$20/tháng Pro + domain + DB |  |

### 2. Thuật ngữ

| THUẬT NGỮ — TRA CỨU NHANH |  |
| --- | --- |
| Giải thích cho người không cần biết lập trình |  |
| Khái niệm | Giải thích đơn giản |
| Domain (tên miền) | Địa chỉ website, ví dụ thienduc.com.vn — giống biển hiệu cửa hàng |
| Hosting (lưu trữ) | Nơi đặt mã nguồn website chạy trên internet — giống mặt bằng cửa hàng |
| FE (Frontend) | Phần khách nhìn thấy: trang chủ, giới thiệu, dự án, tin tức, liên hệ |
| BE (Backend) | Phần ẩn: đăng nhập admin, lưu bài viết, kiểm tra quyền, upload ảnh |
| DNS | Bảng chỉ đường: gõ tên miền → trình duyệt biết đi tới máy chủ nào |
| SSL (HTTPS) | Khóa bảo mật (ổ khóa xanh) — bảo vệ dữ liệu khi truy cập |
| VPS | Máy chủ ảo — thuê phòng riêng trong tòa nhà server |
| CDN | Copy website gần người dùng để tải nhanh |
| Deploy | Đưa bản code mới lên môi trường thật |
| Serverless | Server tự bật khi có người dùng — trả theo lượt dùng |
| CI/CD | Quy trình tự động: sửa code → kiểm tra → lên web |
| Rollback | Quay lại phiên bản website cũ khi bản mới lỗi |

### 3. Frontend (FE)

| CHI TIẾT FRONTEND (FE) |  |  |
| --- | --- | --- |
| Trang công khai: /, /gioi-thieu, /du-an, /tin-tuc, /lien-he — Next.js 16 |  |  |
| Hạng mục FE | Trong nước | Vercel |
| Cách đưa website lên mạng | Build trên server → npm run build → PM2/systemd + Nginx | Push code Git → Vercel tự build & deploy trong vài phút |
| Cập nhật giao diện | SSH, pull code, build lại, restart — thủ công hoặc CI/CD tự viết | Merge code → deploy tự động; có preview URL xem thử |
| Tốc độ tải trang | Phụ thuộc VPS & băng thông; cần tự bật nén, cache | CDN toàn cầu; cache static/edge tối ưu Next.js |
| SEO (Google) | Tốt nếu cấu hình đúng metadata | SSR/SSG Next.js out-of-the-box |
| Ảnh tĩnh (public/images) | Lưu trên VPS — tốn ổ cứng | Deploy kèm build; ảnh lớn nên Cloudinary/CDN |
| Khi server lỗi | Website ngừng cho đến khi sửa VPS | Failover tốt hơn; uptime SLA cao |
| Chi phí FE riêng | Gộp trong tiền VPS | Hobby miễn phí (giới hạn); Pro ~$20/tháng |
| Ai làm gì? (FE) |  |  |
| Việc cần làm | Trong nước | Vercel |
| Cài Node.js, Nginx | Công ty / đơn vị vận hành | Không cần |
| Deploy mỗi lần sửa | Dev hoặc kỹ thuật viên server | Dev push Git — tự động |
| Giám sát website | UptimeRobot, Zabbix... | Dashboard Vercel + công cụ ngoài |
| Domain trỏ về FE | A record → IP VPS | CNAME → cname.vercel-dns.com |

### 4. Backend (BE)

| CHI TIẾT BACKEND (BE) |  |  |
| --- | --- | --- |
| Đăng nhập admin, API dự án/tin tức, PostgreSQL, upload Cloudinary |  |  |
| Chức năng BE | Mô tả đơn giản |  |
| Đăng nhập admin | Kiểm tra email/mật khẩu, cấp token phiên làm việc | Render/Railway (PA2) - NestJS 24/7 |
| Phân quyền | Chỉ người có quyền mới upload ảnh / sửa nội dung |  |
| API dự án & tin tức | Lưu, sửa, xóa bài viết qua cơ sở dữ liệu |  |
| Upload ảnh | Cấp phiếu cho phép → tải thẳng lên Cloudinary |  |
| Cơ sở dữ liệu | PostgreSQL — lưu nội dung + link ảnh |  |
|  |  | Render Starter ~7-25 USD/thang + DB; Vercel chi host FE + Admin |
| Hạng mục BE | Trong nước | Vercel |
| Chạy API (Node.js) | Cài trên VPS; chạy 24/7 | Serverless Functions — chạy khi có request, tự scale |
| PostgreSQL | Cài VPS hoặc DB hosting VN (Vietnix, VNPT...) | Neon / Supabase / Vercel Postgres (thường server nước ngoài) |
| Upload ảnh lớn | API cấp chữ ký → ảnh lên Cloudinary, không qua server | Giống — kiến trúc không đổi |
| Bảo mật | Tự cấu hình firewall, fail2ban, patch OS | Vercel lo platform; app vẫn phải code an toàn |
| Backup DB | Tự lên lịch pg_dump, snapshot | Bật backup ở nhà cung cấp DB |
| Chi phí BE | Gộp VPS (~1–3 triệu/tháng) | DB ~$0–25/tháng + Vercel Pro nếu traffic cao |

### 5. Domain & DNS

| DOMAIN & DNS |  |  |  |
| --- | --- | --- | --- |
| Mua tên miền, trỏ DNS, subdomain |  |  |  |
| Mua tên miền | Trong nước (đăng ký VN) | Vercel |  |
| Nhà cung cấp | PA Vietnam, Nhân Hòa, Mắt Bão, Viettel, VNPT... | Vercel không bán domain — mua nơi khác rồi trỏ DNS |  |
| Đuôi phổ biến | .vn, .com.vn — uy tín với khách VN | .com, .vn đều dùng được |  |
| Giá tham khảo | .com.vn: ~400k–700k/năm; .vn: ~600k–900k/năm | .com: ~250k–350k/năm (Namecheap...) |  |
| Thủ tục .vn | Cần GPKD, hồ sơ doanh nghiệp | Mua .vn qua nhà đăng ký VN, trỏ DNS về Vercel |  |
| Trỏ domain về website |  |  |  |
| Bước | Trong nước (VPS VN) | Vercel |  |
| 1 | Mua domain tại PA/Nhân Hòa... | Mua domain (VN hoặc quốc tế) |  |
| 2 | Thuê VPS, lấy IP cố định | Tạo project Vercel, thêm domain |  |
| 3 | DNS: A record → IP VPS | DNS: CNAME www → Vercel, A apex theo hướng dẫn |  |
| 4 | Cài SSL trên Nginx (Certbot) | SSL tự động trong vài phút |  |
| 5 | Mở port 80/443, firewall | Không cần mở port |  |
| Subdomain | Mục đích | Trong nước / Vercel |  |
| www.thienduc.vn | Website chính (FE) | VN: IP VPS \| Vercel: trỏ Vercel |  |
| api.thienduc.vn | API backend | VN: IP VPS \| Vercel: Vercel hoặc server riêng |  |
| staging.thienduc.vn | Moi truong UAT / kiem thu | VN: IP VPS hoac subdomain | Vercel: preview hoac subdomain staging |

### 6. Chi phí

| CHI PHÍ ƯỚC TÍNH HÀNG NĂM |  |  |
| --- | --- | --- |
| Tham khảo 2025–2026 \| Website doanh nghiệp vừa \| Chưa gồm phí dev |  |  |
| Hạng mục | Trong nước | Vercel |
| Domain .com.vn | ~500.000 ₫/năm | ~500.000 ₫/năm (mua VN, DNS trỏ Vercel) |
| Hosting FE + BE | VPS 2 CPU/4GB: ~1.200.000–2.400.000 ₫/tháng | Hobby $0 hoặc Pro ~500.000 ₫/tháng |
| PostgreSQL | Gộp VPS hoặc DB managed ~300.000–800.000 ₫/tháng | Neon/Supabase free → ~250.000–600.000 ₫/tháng khi scale |
| Cloudinary (ảnh) | Free tier → ~0–500.000 ₫/tháng | Giống |
| SSL | Miễn phí (Let's Encrypt) | Miễn phí |
| Vận hành kỹ thuật | Cần người/am hiểu server | Ít hơn — tập trung code |
| TỔNG ƯỚC TÍNH/NĂM | ~18–35 triệu ₫ | ~6–15 triệu ₫ (tùy gói & traffic) |

### 7. Ưu & Nhược

| ƯU & NHƯỢC ĐIỂM |  |
| --- | --- |
| Tóm tắt để quyết định nhanh |  |
| PHƯƠNG ÁN TRONG NƯỚC (Domain VN + VPS VN) |  |
| Ưu điểm | Nhược điểm |
| Server & DB có thể nằm hoàn toàn tại VN | Cần nhân sự vận hành server |
| Hỗ trợ tiếng Việt, hóa đơn VAT VN | Deploy & cập nhật chậm hơn nếu không có CI/CD |
| Kiểm soát 100% cấu hình, backup | Tự chịu trách nhiệm bảo mật, patch, chống tấn công |
| Phù hợp lưu trữ dữ liệu trong nước | Uptime phụ thuộc 1 VPS — cần kế hoạch dự phòng |
| PHƯƠNG ÁN VERCEL |  |
| Ưu điểm | Nhược điểm |
| Ra mắt nhanh — tối ưu sẵn cho Next.js | Một phần hạ tầng ở nước ngoài |
| Deploy tự động, preview, rollback dễ | DB/ảnh vẫn cần dịch vụ riêng |
| CDN mạnh, ít lo server chết | Chi phí tăng khi traffic lớn |
| Đội dev tập trung code, ít DevOps | Hỗ trợ chính thức chủ yếu tiếng Anh |
| Có thể dùng domain .com.vn từ đăng ký VN | Serverless giới hạn thời gian/request |

### 8. Khuyến nghị

| KHUYẾN NGHỊ CHO WEBSITE THIÊN ĐỨC |  |
| --- | --- |
| Kịch bản | Kiến trúc đề xuất |
| Tinh huong A (PA2 - khuyen nghi Thien Duc) | Uu tien ra mat nhanh + CMS day du: • Domain .vn / .com.vn → PA Vietnam / Nhan Hoa • FE Next.js → thienduc.vn (Vercel) • Admin Vite+React → admin.thienduc.vn (Vercel) • BE NestJS + PostgreSQL → api.thienduc.vn (Render/Railway) • Anh → Cloudinary • Staging → staging.thienduc.vn |
| Tình huống B | Ưu tiên hạ tầng trong lãnh thổ VN: • Domain .com.vn → nhà đăng ký VN • VPS VN (Vietnix / Viettel IDC):   - FE: Next.js + Nginx   - BE: API Node.js   - PostgreSQL (cùng VPS hoặc DB managed VN)   - Ảnh: Cloudinary |
| KHÔNG NÊN LÀM |  |
| Cách làm | Vì sao tránh |
| Chỉ mua domain, không thuê hosting | Domain chỉ là tên — không có chỗ chạy website |
| Shared hosting PHP giá rẻ cho Next.js | Next.js cần Node.js — hosting PHP thường không chạy được |
| Nhét FE + BE + DB trên VPS 1 GB | Dễ chậm và sập khi có ảnh lớn + nhiều khách |
| Bỏ HTTPS | Trình duyệt cảnh báo; form liên hệ không an toàn |

### 9. Checklist go-live

| CHECKLIST TRƯỚC KHI GO-LIVE |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| Đánh dấu □ khi hoàn thành |  |  |  |  |  |
| # | Hạng mục | Trong nước | Vercel | VN ✓ | Vercel ✓ |
| 1 | Domain đã trỏ đúng DNS | A record → IP VPS | CNAME/A theo Vercel | □ | □ |
| 2 | SSL/HTTPS hoạt động | Certbot / SSL mua | Tự động trên Vercel | □ | □ |
| 3 | FE build thành công | npm run build trên server | Build log Vercel xanh | □ | □ |
| 4 | BE API trả lời | https://api.../health | Route API test OK | □ | □ |
| 5 | PostgreSQL kết nối | Migration chạy xong | Connection string đúng | □ | □ |
| 6 | Cloudinary upload | Ảnh test hiển thị trên web | Giống | □ | □ |
| 7 | Form liên hệ / email | Gửi được thử | Giống | □ | □ |
| 8 | Backup | Lịch backup DB + snapshot VPS | Backup DB provider | □ | □ |
| 9 | Biến môi trường bí mật | Không lộ trong code public | Cấu hình Vercel Env | □ | □ |
| 10 | NEXT_PUBLIC_SITE_URL | Trỏ domain thật | Trỏ domain thật | □ | □ |

### 10. Quyết định

| 4 CÂU HỎI KHI HỌP CHỌN PHƯƠNG ÁN |  |  |
| --- | --- | --- |
| # | Câu hỏi | Gợi ý trả lời |
| 1 | Dữ liệu khách hàng & nội dung admin có bắt buộc lưu trong VN không? | Có → VPS/DB VN \| Không bắt buộc → Vercel khả thi |
| 2 | Có nhân sự bảo trì server hàng tháng không? | Không → Vercel \| Có → cả hai đều được |
| 3 | Ngân sách hàng năm dự kiến? | Thấp + ít traffic → Vercel Hobby + free DB \| Cao + kiểm soát → VPS VN |
| 4 | Thời gian ra mắt? | Gấp (< 2 tuần) → Vercel \| Không gấp + cần hạ tầng VN → VPS VN |

### 11. PA2 Thien Duc

| PHUONG AN 2 - ANH XA HOSTING THIEN DUC |  |  |  |
| --- | --- | --- | --- |
| Thanh phan | Cong nghe | Hosting de xuat | Domain / ghi chu |
| Website cong khai | Next.js 16 | Vercel | thienduc.vn + www |
| Trang quan tri CMS | Vite + React | Vercel | admin.thienduc.vn |
| Backend API | NestJS + Prisma | Render / Railway | api.thienduc.vn - khong dat tren Vercel Serverless |
| Co so du lieu | PostgreSQL | Render / Neon | Managed backup |
| Media | Cloudinary | Cloudinary CDN | Upload tu admin |
| Email form | Gmail SMTP | Google Workspace | Thong bao admin |
| Staging | Ban build UAT | Vercel preview / subdomain | staging.thienduc.vn |
| Chi phi uoc tinh/thang | 400k - 1,5 trieu VND | Xem sheet 6 | Free tier co the du giai doan dau |

