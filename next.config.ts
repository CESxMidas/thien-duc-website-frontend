import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép HMR/dev assets khi truy cập qua IP LAN (điện thoại, máy khác cùng Wi-Fi).
  allowedDevOrigins: [
    "192.168.*.*",
    "172.28.*.*",
    "10.*.*.*",
  ],
  async redirects() {
    return [
      {
        source: "/vi",
        destination: "/",
        permanent: false,
      },
      {
        source: "/vi/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
