import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép HMR/dev assets khi truy cập qua IP LAN (điện thoại, máy khác cùng Wi-Fi).
  allowedDevOrigins: [
    "192.168.*.*",
    "172.28.*.*",
    "10.*.*.*",
  ],
  // Ảnh banner/dự án do CMS lưu trên Cloudinary (cloud `thienduc`). `next/image`
  // chỉ tải ảnh từ host được khai báo — thiếu dòng này ảnh Cloudinary bị chặn.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/thienduc/**",
      },
    ],
  },
  // Định tuyến locale (`/vi` → `/`, rewrite `/du-an` → `/vi/du-an`) nằm ở
  // `src/proxy.ts` vì cần đọc pathname của từng request.
};

export default nextConfig;
