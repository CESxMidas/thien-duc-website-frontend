# Thiên Đức — Website công khai

Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4 cho
`https://www.thienduccons.vn`.

## Local Development

### Yêu cầu và cài đặt

- Node.js **22.x LTS** (nguồn chuẩn: `.nvmrc` và `package.json#engines`).
- npm với `package-lock.json`; Backend cần chạy để dùng dữ liệu nghiệp vụ thật.

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Cấu hình tối thiểu:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` bắt buộc ở runtime; không có mock fallback.
`NEXT_PUBLIC_SITE_URL` tạo canonical, Open Graph, JSON-LD, sitemap và robots.
Các biến `NEXT_PUBLIC_*` là công khai và được đóng vào bundle lúc build.
`NEXT_PUBLIC_SENTRY_DSN` là tùy chọn; `SENTRY_AUTH_TOKEN` là secret build-only,
không bao giờ thêm tiền tố `NEXT_PUBLIC_` hoặc commit.

### Kiểm tra và build

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

CI có thể build với `NEXT_PUBLIC_API_URL` rỗng để kiểm tra compile mà không cần
Backend; production bắt buộc đặt URL API thật. Khi đồng bộ ảnh từ kho resources,
chạy `npm run sync:images` theo hướng dẫn dự án.

## CI/CD

`.github/workflows/ci.yml` chạy trên push lên `main` và pull request vào `main`:
`npm ci` → lint → typecheck → Jest → production build. Build CI cố ý không gọi
Backend; đường full-stack được kiểm tra bởi Playwright ở repo Admin.

CI không chứa secret và không trực tiếp deploy. Vercel triển khai từ Git
integration; required status checks/branch protection phải cấu hình ở GitHub và
Vercel. Xem [CI/CD](../thien-duc-website-docs/07-deployment/ci-cd.md).

## Deployment / Handover

- Production: `https://www.thienduccons.vn`.
- Vercel: Framework Next.js, root `./`, install `npm ci`, build `npm run build`.
- Production bắt buộc `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_SITE_URL`; thay env
  build-time phải redeploy.
- Frontend proxy `/admin` sang Vercel project Admin; không biến nó thành route
  Next.js hoặc bỏ tiền tố `/admin`.
- Sau deploy kiểm tra trang chủ, `/du-an`, `/tin-tuc`, `/lien-he`,
  `/sitemap.xml`, `/robots.txt`, canonical và `/admin`.

Quy trình chi tiết, rollback và checklist nằm trong
[hướng dẫn deploy](../thien-duc-website-docs/07-deployment/deployment-guide.md)
và [checklist bàn giao](../thien-duc-website-docs/09-handover/handover-checklist.md).
