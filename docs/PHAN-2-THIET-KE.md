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
