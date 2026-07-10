import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép HMR/dev assets khi truy cập qua IP LAN (điện thoại, máy khác cùng Wi-Fi).
  allowedDevOrigins: [
    "192.168.*.*",
    "172.28.*.*",
    "10.*.*.*",
  ],
  // Định tuyến locale (`/vi` → `/`, rewrite `/du-an` → `/vi/du-an`) nằm ở
  // `src/proxy.ts` vì cần đọc pathname của từng request.
};

export default nextConfig;
