# So sánh dịch vụ domain & triển khai website: Trong nước vs Vercel

> **Dành cho ai?** Ban lãnh đạo, phòng marketing, người quản trị nội dung — không cần biết lập trình.  
> **Ngữ cảnh:** Website Công ty Thiên Đức (Next.js) gồm **phần hiển thị công khai (FE)** và **phần xử lý phía sau (BE)** như đăng nhập admin, lưu dự án/tin tức, upload ảnh.

---

## 1. Hiểu nhanh trong 1 phút

| Khái niệm | Giải thích đơn giản |
|-----------|---------------------|
| **Domain (tên miền)** | Địa chỉ website, ví dụ `thienduc.com.vn` — giống **biển hiệu** trên cửa hàng. |
| **Hosting (lưu trữ)** | Nơi đặt **mã nguồn website** chạy trên internet — giống **mặt bằng** để đặt cửa hàng. |
| **FE (Frontend)** | Phần khách truy cập **nhìn thấy**: trang chủ, giới thiệu, dự án, tin tức, liên hệ. |
| **BE (Backend)** | Phần **ẩn phía sau**: đăng nhập admin, lưu bài viết, kiểm tra quyền, gọi cơ sở dữ liệu, upload ảnh. |
| **DNS** | Bảng chỉ đường: khi gõ tên miền, trình duyệt biết **đi tới máy chủ nào**. |
| **SSL (HTTPS)** | Khóa bảo mật trên thanh địa chỉ (ổ khóa xanh) — bảo vệ dữ liệu khi truy cập. |

### Hai hướng triển khai chính

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHƯƠNG ÁN A — TRONG NƯỚC (tự quản lý)                                     │
│                                                                             │
│  Khách truy cập ──► Tên miền .vn (PA/Nhân Hòa/Mắt Bão...)                  │
│                         │                                                   │
│                         ▼                                                   │
│                    VPS/Server tại VN (Vietnix, Viettel IDC, FPT...)       │
│                    ┌──────────────┬──────────────┐                          │
│                    │ FE (Next.js) │ BE (API)     │                          │
│                    │ trang công   │ đăng nhập,   │                          │
│                    │ khai         │ lưu dữ liệu  │                          │
│                    └──────────────┴──────┬───────┘                          │
│                                          ▼                                  │
│                               PostgreSQL + Cloudinary (ảnh)                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PHƯƠNG ÁN B — VERCEL (nền tảng quốc tế, tối ưu Next.js)                  │
│                                                                             │
│  Khách truy cập ──► Tên miền (mua ở VN hoặc nước ngoài)                   │
│                         │                                                   │
│                         ▼ DNS trỏ về Vercel                                 │
│                    Vercel Edge Network (CDN toàn cầu)                       │
│                    ┌──────────────┬──────────────┐                          │
│                    │ FE (Next.js) │ BE (API      │                          │
│                    │ tự build &   │ routes /     │                          │
│                    │ deploy       │ serverless)  │                          │
│                    └──────────────┴──────┬───────┘                          │
│                                          ▼                                  │
│                    DB & ảnh: dịch vụ riêng (Neon, Supabase, Cloudinary...)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bảng so sánh tổng quan

| Tiêu chí | Trong nước (Domain VN + VPS/Hosting VN) | Vercel |
|----------|------------------------------------------|--------|
| **Ai phù hợp?** | Công ty muốn **toàn bộ hạ tầng trong VN**, tự kiểm soát server | Đội dev muốn **ra mắt nhanh**, ít vận hành server |
| **Độ khó vận hành** | Cao — cần người biết cấu hình server, bảo mật, backup | Thấp — nền tảng lo phần lớn việc deploy & CDN |
| **Tốc độ FE tại VN** | Tốt nếu server đặt tại VN | Tốt nhờ CDN; có thể thêm edge gần VN |
| **BE (API + DB)** | Tự cài trên VPS: Node.js API + PostgreSQL | API chạy serverless trên Vercel; DB thường **dịch vụ bên thứ 3** |
| **Upload ảnh (Cloudinary)** | FE/BE gọi Cloudinary như nhau — **không phụ thuộc** nơi host | Giống phương án trong nước |
| **SSL/HTTPS** | Tự cài (Let's Encrypt miễn phí) hoặc mua SSL VN | Tự động, miễn phí |
| **Backup & khôi phục** | Tự thiết lập (snapshot VPS, dump DB) | Vercel: rollback deploy; DB phải backup riêng |
| **Hỗ trợ khi sự cố** | Nhà cung cấp VN (tiếng Việt, giờ hành chính) | Tiếng Anh, ticket/email; cộng đồng lớn |
| **Tuân thủ dữ liệu VN** | Dễ đặt server + DB trong lãnh thổ VN | Server/CDN có thể ở nước ngoài — cần rà chính sách nội bộ |
| **Chi phí khởi điểm** | ~500k–2tr/tháng (VPS) + ~300k–800k/năm (domain .vn) | $0 (Hobby) hoặc ~$20/tháng (Pro) + domain + DB |

---

## 3. Chi tiết phần FE (Frontend — trang khách xem)

### FE là gì với website Thiên Đức?

Các trang công khai mà mọi người truy cập:

- `/` — Trang chủ  
- `/gioi-thieu`, `/du-an`, `/tin-tuc`, `/lien-he`  
- Hình ảnh banner, logo, gallery dự án  

Hiện tại FE dùng **Next.js 16** — công nghệ hiện đại, tải nhanh, thân thiện SEO.

### So sánh FE

| Hạng mục | Trong nước | Vercel |
|----------|------------|--------|
| **Cách đưa website lên mạng** | Build trên server → chạy `npm run build` → khởi động bằng PM2/systemd; phía trước đặt Nginx | Push code lên Git → Vercel **tự build & deploy** trong vài phút |
| **Cập nhật giao diện** | SSH vào server, pull code, build lại, restart — **thủ công** hoặc cần CI/CD tự viết | Mỗi lần merge code → deploy tự động; có **preview URL** để xem thử trước khi lên chính thức |
| **Tốc độ tải trang** | Phụ thuộc cấu hình VPS & băng thông; cần tự bật nén, cache | CDN toàn cầu sẵn có; cache static/edge tối ưu cho Next.js |
| **SEO (Google tìm thấy)** | Cả hai đều tốt nếu cấu hình đúng metadata | Vercel hỗ trợ SSR/SSG của Next.js **out-of-the-box** |
| **Ảnh tĩnh (`public/images`)** | Lưu trên VPS — tốn dung lượng ổ cứng | Deploy kèm build; ảnh lớn nên dùng Cloudinary/CDN |
| **Khi server lỗi** | Website **ngừng** cho đến khi sửa VPS | Vercel failover tốt hơn; uptime SLA cao hơn hosting thường |
| **Chi phí FE riêng** | Gộp trong tiền VPS | Hobby: miễn phí (giới hạn); Pro: ~$20/tháng/team |

### FE — Ai làm gì?

| Việc cần làm | Trong nước | Vercel |
|--------------|------------|--------|
| Cài Node.js, Nginx | **Công ty / đơn vị vận hành** | Không cần |
| Deploy mỗi lần sửa | Dev hoặc kỹ thuật viên server | Dev push Git — **tự động** |
| Giám sát website sống | Tự đặt UptimeRobot, Zabbix... | Dashboard Vercel + công cụ ngoài |
| Domain trỏ về FE | A record → IP VPS | CNAME → `cname.vercel-dns.com` |

---

## 4. Chi tiết phần BE (Backend — hệ thống xử lý phía sau)

### BE là gì với website Thiên Đức?

Theo quy trình đã thiết kế (đăng nhập admin, upload ảnh):

| Chức năng BE | Mô tả đơn giản |
|--------------|----------------|
| **Đăng nhập admin** | Kiểm tra email/mật khẩu, cấp token phiên làm việc |
| **Phân quyền** | Chỉ người có quyền mới upload ảnh / sửa nội dung |
| **API dự án & tin tức** | Lưu, sửa, xóa bài viết qua cơ sở dữ liệu |
| **Upload ảnh** | Cấp "phiếu cho phép" → tải thẳng lên **Cloudinary** |
| **Cơ sở dữ liệu** | **PostgreSQL** — lưu nội dung + link ảnh |

### So sánh BE

| Hạng mục | Trong nước | Vercel |
|----------|------------|--------|
| **Chạy API (Node.js)** | Cài trên cùng VPS hoặc VPS riêng; chạy 24/7 | **Serverless Functions** — chạy khi có request, tự scale |
| **PostgreSQL** | Cài trên VPS hoặc thuê **DB hosting VN** (VD: Vietnix DB, cloud VNPT) | Vercel Postgres, hoặc **Neon / Supabase / Railway** (thường server nước ngoài) |
| **Thời gian chạy liên tục** | API process chạy liên tục — phù hợp tác vụ nền | Serverless giới hạn thời gian mỗi request (vài phút) — đủ cho CRUD thông thường |
| **Upload ảnh lớn** | API chỉ cấp chữ ký → ảnh lên Cloudinary, **không qua server** | Giống — kiến trúc không đổi |
| **Bảo mật** | Tự cấu hình firewall, fail2ban, patch OS | Vercel lo lớp platform; app vẫn phải code an toàn |
| **Backup DB** | Tự lên lịch `pg_dump`, snapshot | Phải bật backup ở nhà cung cấp DB |
| **Log & debug** | SSH xem log file | Dashboard Vercel + log provider |
| **Chi phí BE** | Gộp VPS (~1–3 triệu/tháng tùy cấu hình) | DB ~$0–25/tháng + Vercel Pro nếu traffic cao |

### BE — Sơ đồ luồng (giống nhau về logic, khác nơi đặt máy)

```
Admin đăng nhập
      │
      ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  API Login  │────►│  PostgreSQL  │     │ Cloudinary  │
│  (BE)       │     │  (lưu user,  │     │ (lưu ảnh)   │
└─────────────┘     │   bài viết)  │     └─────────────┘
      │             └──────────────┘            ▲
      │ Cấp token                               │
      ▼                                         │
 Admin upload ảnh ──► API cấp phiếu ──────────┘
      │
      ▼
 Lưu link ảnh vào PostgreSQL → FE hiển thị cho khách
```

**Điểm quan trọng:** Dù chọn trong nước hay Vercel, **Cloudinary** và **PostgreSQL** vẫn là 2 dịch vụ riêng — chỉ khác **máy chủ API và DB đặt ở đâu**.

---

## 5. Domain & DNS — So sánh chi tiết

### Mua tên miền

| Loại | Trong nước (nhà đăng ký VN) | Vercel |
|------|-----------------------------|--------|
| **Nhà cung cấp domain** | PA Vietnam, Nhân Hòa, Mắt Bão, Viettel, VNPT... | Vercel **không bán** domain — mua ở nơi khác rồi trỏ DNS |
| **Đuôi phổ biến** | `.vn`, `.com.vn` — uy tín với khách VN | `.com`, `.vn` đều dùng được |
| **Giá tham khảo** | `.com.vn`: ~400k–700k/năm; `.vn`: ~600k–900k/năm | Domain `.com`: ~250k–350k/năm (Namecheap, Google Domains...) |
| **Thủ tục .vn** | Cần giấy phép kinh doanh, hồ sơ doanh nghiệp | Mua domain .vn vẫn qua **nhà đăng ký VN**, sau đó trỏ DNS về Vercel |
| **Quản lý DNS** | Portal tiếng Việt của nhà đăng ký | Portal Vercel (tiếng Anh) hoặc giữ DNS tại nhà đăng ký VN |

### Trỏ domain về website

| Bước | Trong nước (VPS VN) | Vercel |
|------|---------------------|--------|
| 1 | Mua domain tại PA/Nhân Hòa... | Mua domain (VN hoặc quốc tế) |
| 2 | Thuê VPS, lấy **IP cố định** | Tạo project trên Vercel, thêm domain |
| 3 | DNS: **A record** → IP VPS | DNS: **CNAME** `www` → Vercel, **A** apex theo hướng dẫn |
| 4 | Cài SSL trên Nginx (Certbot) | SSL tự động trong vài phút |
| 5 | Mở port 80/443, cấu hình firewall | Không cần mở port |

### Subdomain thường dùng

| Subdomain | Mục đích | Trong nước | Vercel |
|-----------|----------|------------|--------|
| `www.thienduc.com.vn` | Website chính (FE) | Trỏ IP VPS | Trỏ Vercel |
| `api.thienduc.com.vn` | API backend | Trỏ IP VPS (cùng hoặc khác server) | Trỏ Vercel hoặc server riêng |
| `admin.thienduc.com.vn` | Trang quản trị (nếu tách) | Trỏ IP VPS | Trỏ Vercel |

---

## 6. Chi phí ước tính hàng năm (website doanh nghiệp vừa)

> Số liệu tham khảo 2025–2026, chưa gồm phí dev. Giá thực tế thay đổi theo nhà cung cấp.

| Hạng mục | Trong nước | Vercel |
|----------|------------|--------|
| Domain `.com.vn` | ~500.000 ₫/năm | ~500.000 ₫/năm (mua ở VN, DNS trỏ Vercel) |
| Hosting FE + BE | VPS 2 CPU / 4 GB: ~1.200.000–2.400.000 ₫/tháng | Hobby $0 hoặc Pro ~500.000 ₫/tháng |
| PostgreSQL | Gộp VPS hoặc DB managed ~300.000–800.000 ₫/tháng | Neon/Supabase free tier → ~250.000–600.000 ₫/tháng khi scale |
| Cloudinary (ảnh) | Free tier → ~0–500.000 ₫/tháng | Giống |
| SSL | Miễn phí (Let's Encrypt) | Miễn phí |
| Vận hành kỹ thuật | Cần người/am hiểu server | Ít hơn — tập trung vào code |
| **Tổng ước tính/năm** | **~18–35 triệu ₫** | **~6–15 triệu ₫** (tùy gói & traffic) |

---

## 7. Ưu & nhược điểm — Tóm tắt dễ quyết định

### Phương án trong nước (Domain VN + VPS VN)

| Ưu điểm | Nhược điểm |
|---------|------------|
| Server & DB có thể **nằm hoàn toàn tại VN** | Cần **nhân sự vận hành** server |
| Hỗ trợ **tiếng Việt**, hóa đơn VAT VN | Deploy & cập nhật **chậm hơn** nếu không có CI/CD |
| Kiểm soát **100%** cấu hình, backup | Tự chịu trách nhiệm bảo mật, patch, chống tấn công |
| Phù hợp yêu cầu **lưu trữ dữ liệu trong nước** | Uptime phụ thuộc 1 VPS — cần kế hoạch dự phòng |

### Phương án Vercel

| Ưu điểm | Nhược điểm |
|---------|------------|
| **Ra mắt nhanh** — tối ưu sẵn cho Next.js | Một phần hạ tầng **ở nước ngoài** |
| Deploy tự động, preview, rollback dễ | DB/ảnh vẫn cần **dịch vụ riêng** |
| CDN mạnh, ít lo server chết | Chi phí tăng khi traffic lớn |
| Đội dev **tập trung code**, ít DevOps | Hỗ trợ chính thức chủ yếu **tiếng Anh** |
| Có thể vẫn dùng **domain .com.vn** từ nhà đăng ký VN | Serverless có giới hạn thời gian/request |

---

## 8. Khuyến nghị cho website Thiên Đức

### Tình huống A — Ưu tiên ra mắt nhanh, ít nhân sự vận hành

```
Domain .com.vn  ──►  mua tại PA Vietnam / Nhân Hòa (uy tín VN)
       │
       ├── FE (Next.js)  ──►  Vercel
       ├── BE (API)      ──►  Vercel Serverless hoặc VPS nhỏ VN
       ├── PostgreSQL    ──►  Neon / Supabase (hoặc DB trên VPS VN nếu cần data in-country)
       └── Ảnh           ──►  Cloudinary (như sơ đồ quy trình upload)
```

**Lý do:** FE Next.js đã sẵn sàng deploy Vercel; admin & upload ảnh không cần server nặng.

### Tình huống B — Ưu tiên toàn bộ hạ tầng trong lãnh thổ VN

```
Domain .com.vn  ──►  nhà đăng ký VN
       │
       └── VPS tại VN (Vietnix / Viettel IDC)
              ├── FE: Next.js + Nginx
              ├── BE: API Node.js
              ├── PostgreSQL (cùng VPS hoặc DB managed VN)
              └── Ảnh: Cloudinary (CDN ảnh vẫn có thể quốc tế)
```

**Lý do:** Kiểm soát dữ liệu, hóa đơn nội địa, hỗ trợ tiếng Việt — đổi lại cần người bảo trì server.

### Không nên

| Cách làm | Vì sao tránh |
|----------|--------------|
| Chỉ mua domain, không thuê hosting | Domain chỉ là tên — **không có chỗ chạy website** |
| Shared hosting PHP giá rẻ cho Next.js | Next.js cần **Node.js** — hosting PHP thường không chạy được |
| Nhét FE + BE + DB trên VPS 1 GB | Dễ **chậm và sập** khi có ảnh lớn + nhiều khách truy cập |
| Bỏ HTTPS | Trình duyệt cảnh báo; form liên hệ **không an toàn** |

---

## 9. Checklist trước khi go-live

| # | Hạng mục | Trong nước | Vercel |
|---|----------|------------|--------|
| 1 | Domain đã trỏ đúng DNS | ☐ A record → IP VPS | ☐ CNAME/A theo Vercel |
| 2 | SSL/HTTPS hoạt động | ☐ Certbot / SSL mua | ☐ Tự động trên Vercel |
| 3 | FE build thành công | ☐ `npm run build` trên server | ☐ Build log Vercel xanh |
| 4 | BE API trả lời | ☐ `https://api.../health` | ☐ Route API test OK |
| 5 | PostgreSQL kết nối | ☐ Migration chạy xong | ☐ Connection string đúng |
| 6 | Cloudinary upload | ☐ Ảnh test hiển thị trên web | ☐ Giống |
| 7 | Form liên hệ / email | ☐ Gửi được thử | ☐ Giống |
| 8 | Backup | ☐ Lịch backup DB + snapshot VPS | ☐ Backup DB provider |
| 9 | Biến môi trường bí mật | ☐ Không lộ trong code public | ☐ Cấu hình trong Vercel Env |
| 10 | `NEXT_PUBLIC_SITE_URL` | ☐ Trỏ domain thật | ☐ Trỏ domain thật |

---

## 10. Thuật ngữ — Tra cứu nhanh

| Thuật ngữ | Nghĩa |
|-----------|-------|
| **VPS** | Máy chủ ảo — như thuê một căn phòng riêng trong tòa nhà server |
| **CDN** | Mạng phân phối nội dung — copy website gần người dùng để tải nhanh |
| **Deploy** | Đưa bản code mới lên môi trường thật để khách truy cập |
| **Serverless** | Server tự bật khi có người dùng, tự tắt khi không — trả theo lượt dùng |
| **CI/CD** | Quy trình tự động: sửa code → kiểm tra → lên web |
| **Environment variable** | Thông tin cấu hình bí mật (mật khẩu DB, API key) — không ghi vào code |
| **Rollback** | Quay lại phiên bản website cũ khi bản mới lỗi |

---

## 11. Liên hệ nội bộ khi cần quyết định

Khi họp chọn phương án, nên trả lời 4 câu hỏi:

1. **Dữ liệu khách hàng & nội dung admin có bắt buộc lưu trong VN không?**  
   → Có: nghiêng **VPS/DB VN**. Không bắt buộc: **Vercel** khả thi.

2. **Có nhân sự bảo trì server hàng tháng không?**  
   → Không: **Vercel**. Có: cả hai đều được.

3. **Ngân sách hàng năm dự kiến?**  
   → Thấp + ít traffic: **Vercel Hobby + free tier DB**. Cao + kiểm soát: **VPS VN**.

4. **Thời gian ra mắt?**  
   → Gấp (&lt; 2 tuần): **Vercel**. Không gấp + cần hạ tầng VN: **VPS VN**.

---

*Tài liệu tham chiếu kiến trúc dự án: `docs/diagrams/01-dang-nhap.drawio`, `docs/diagrams/03-upload-anh.drawio`, stack FE trong `README.md`.*
