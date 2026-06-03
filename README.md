# Thien Duc Frontend

Frontend website cho Cong ty Thien Duc, xay dung bang Next.js App Router.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint

## Chay project

```bash
npm install
npm run dev
```

Mo `http://localhost:3000`.

## Cau truc thu muc

```txt
src/
  app/                    Route pages cua Next.js App Router
    page.tsx              Trang chu
    gioi-thieu/           Trang gioi thieu
    du-an/                Danh sach va chi tiet du an
    tin-tuc/              Danh sach va chi tiet tin tuc
    cong-ty-thanh-vien/   Trang cong ty thanh vien
    tuyen-dung/           Trang tuyen dung
    lien-he/              Trang lien he
  components/
    layout/               Header, footer, shell layout
    sections/             Section theo tung trang
    ui/                   Component UI dung chung
  config/                 Cau hinh site, mau sac, thong tin cong ty
  data/                   Du lieu tam thoi truoc khi ket noi CMS/API
  lib/                    Helper, route constants, utilities
  types/                  TypeScript types dung chung
public/
  images/
    brand/                Logo, favicon, brand assets
    projects/             Hinh anh du an
    news/                 Hinh anh tin tuc
```

## Ghi chu phat trien

- Du lieu trong `src/data` la placeholder, sau nay co the thay bang CMS/API.
- Mau chinh cua website cu dang duoc giu theo tong trang, xam, nau vang.
- Cac trang chi tiet hien dung static params tu du lieu trong `src/data`.
