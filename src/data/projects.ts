// Dữ liệu dự án dùng khi chưa cấu hình `NEXT_PUBLIC_API_URL` (chế độ mock của
// `src/lib/api/*`). Nội dung phải khớp seed backend `prisma/seed-projects.js`.
// Nhãn trạng thái nay nằm ở `src/lib/project-status.ts`.

import type { Project } from "@/types/content";
import { hungPhuGallerySections } from "@/data/hung-phu-gallery";

export const projects: Project[] = [
  {
    title: "Khu đô thị Hưng Phú",
    slug: "khu-do-thi-hung-phu",
    summary:
      "Dự án đô thị tiêu biểu của Thiên Đức, được định hướng phát triển với hạ tầng đồng bộ và không gian sống hiện đại tại Bến Tre.",
    status: "dang-thi-cong",
    location: "Bến Tre",
    category: "Khu đô thị",
    image: "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
    gallerySections: hungPhuGallerySections,
    description:
      "Khu đô thị Hưng Phú là một trong những dự án Thiên Đức đồng hành phát triển tại Bến Tre. Dự án hướng đến việc kiến tạo không gian sống ổn định, thuận tiện và phù hợp với nhu cầu an cư, kết nối của cư dân trong khu vực.",
    highlights: [
      "Định hướng phát triển khu đô thị hiện đại tại Bến Tre.",
      "Tập trung vào hạ tầng, cảnh quan và trải nghiệm sử dụng lâu dài.",
      "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt.",
    ],
    quickFacts: [
      { label: "Chủ đầu tư", value: "Công ty TNHH ĐT - XD - TM Thiên Đức" },
      { label: "Tổng diện tích", value: "112.521 m² (~11,3 ha)" },
      { label: "Diện tích đất ở", value: "43.403 m²" },
      { label: "Mật độ xây dựng", value: "38,5%" },
      {
        label: "Sản phẩm",
        value: "Nhà phố liền kề, biệt thự và căn hộ Fancy Tower (19 tầng)",
      },
      { label: "Quy hoạch", value: "Chi tiết 1/500 (phê duyệt năm 2015)" },
    ],
    mapLocation: {
      image:
        "/images/projects/hung-phu/location/hung-phu-location-map-base.png",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kh%C3%B9+%C4%91%C3%B4+th%E1%BB%8B+H%C6%B0ng+Ph%C3%BA+B%E1%BA%BFn+Tre",
      heading: "Tọa lạc tại trung tâm nổi bật của thành phố Bến Tre",
      description:
        "Phong cách sống sang trọng đi đôi với hệ thống các tiện ích công cộng hiện đại, khu đô thị hứa hẹn mang đến cho thành phố Bến Tre một diện mạo mới.",
      address: "Phường Phú Tân, thành phố Bến Tre, tỉnh Bến Tre",
      markerLeft: 65,
      markerTop: 27,
      labels: [
        { text: "Hướng đi chợ Lách", left: 22, top: 9, kind: "direction" },
        {
          text: "Hướng đi cầu Rạch Miễu TP.HCM",
          left: 44,
          top: 12,
          kind: "direction",
        },
        { text: "Hướng đi Tỉnh Lộ 886", left: 83, top: 9, kind: "direction" },
        {
          text: "Hướng đi cầu Hàm Lương",
          left: 24,
          top: 66,
          kind: "direction",
        },
        { text: "Tỉnh lộ 887", left: 35, top: 17, kind: "road" },
        { text: "QL.60", left: 49, top: 14, kind: "road" },
        { text: "Ngã tư Tân Thành", left: 47, top: 28, kind: "road" },
        { text: "Ngã tư Phú Khương", left: 56, top: 42, kind: "road" },
        { text: "D.Đồng Văn Cống", left: 43, top: 40, kind: "road" },
        { text: "D.Nguyễn Thị Định", left: 74, top: 33, kind: "road" },
        { text: "D.Đoàn Hoàng Minh", left: 49, top: 57, kind: "road" },
        { text: "D.Đồng Khởi", left: 67, top: 52, kind: "road" },
        { text: "D.Nguyễn Huệ", left: 80, top: 38, kind: "road" },
        { text: "D.Nguyễn Đình Chiểu", left: 84, top: 71, kind: "road" },
        { text: "D.Hùng Vương", left: 45, top: 90, kind: "road" },
        { text: "PHƯỜNG PHÚ TÂN", left: 60, top: 20, kind: "area" },
        { text: "PHƯỜNG PHÚ KHƯƠNG", left: 84, top: 47, kind: "area" },
        {
          text: "Trường Cao Đẳng Bến Tre CS2",
          left: 50,
          top: 14,
          kind: "place",
        },
        { text: "Trường Cao Đẳng Bến Tre", left: 30, top: 27, kind: "place" },
        {
          text: "Trường CĐ Công Nghệ Đông Khởi",
          left: 38,
          top: 31,
          kind: "place",
        },
        { text: "Bến xe Bến Tre", left: 57, top: 24, kind: "place" },
        { text: "Bến xe Minh Tâm", left: 86, top: 30, kind: "place" },
        {
          text: "BV Đa Khoa Nguyễn Đình Chiểu",
          left: 49,
          top: 75,
          kind: "place",
        },
        {
          text: "Khu Trung Tâm Hành Chính",
          left: 63,
          top: 70,
          kind: "place",
        },
        { text: "TT Thương Mại", left: 65, top: 84, kind: "place" },
        { text: "ĐL Hàm Luông", left: 50, top: 89, kind: "place" },
        { text: "SÔNG BẾN TRE", left: 80, top: 83, kind: "area" },
      ],
    },
    items: [
      {
        title: "Chung cư Fancy Tower",
        slug: "fancy-tower",
        summary:
          "Tòa căn hộ cao cấp 19 tầng nổi và 1 tầng hầm với 196 căn hộ — dự án chung cư cao tầng đầu tiên tại khu vực.",
        description:
          "Fancy Tower đã được Sở Xây dựng nghiệm thu hoàn thành công trình và sẵn sàng cấp sổ hồng cho cư dân. Tòa nhà đã hoàn thiện thi công, bàn giao và đưa vào vận hành.",
        status: "da-ban-giao",
        image:
          "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
        highlights: [
          "19 tầng nổi, 1 tầng hầm, 196 căn hộ.",
          "Đã nghiệm thu hoàn thành công trình, sẵn sàng cấp sổ hồng.",
          "Hồ bơi và khu tiện ích nội khu đã vận hành.",
        ],
        quickFacts: [
          { label: "Quy mô", value: "19 tầng nổi + 1 tầng hầm" },
          { label: "Số căn hộ", value: "196 căn" },
          { label: "Tình trạng", value: "Đã bàn giao, đang vận hành" },
        ],
        gallery: [
          "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-evening-01.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-01.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-plaza-02.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-amenity-pool-01.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-amenity-pool-02.jpg",
          "/images/projects/hung-phu/fancy-tower/fancy-tower-amenity-pool-03.jpg",
        ],
      },
      {
        title: "Trung tâm thương mại Hưng Phú Mall",
        slug: "hung-phu-mall",
        summary:
          "Trung tâm thương mại 5 tầng trong nội khu, đang hoàn thiện giai đoạn cuối để đưa vào khai thác.",
        status: "dang-thi-cong",
        quickFacts: [{ label: "Quy mô", value: "5 tầng" }],
      },
      {
        title: "Khu nhà ở thấp tầng",
        slug: "khu-nha-o-thap-tang",
        summary:
          "330 căn nhà phố liền kề, shophouse đi bộ và biệt thự — đã hoàn thiện, cư dân đã dọn vào sinh sống ổn định.",
        status: "da-ban-giao",
        quickFacts: [{ label: "Số căn", value: "330 căn" }],
      },
    ],
  },
  {
    title: "Chung cư La Bonita",
    slug: "chung-cu-la-bonita",
    summary:
      "Dự án căn hộ tại TP.HCM, được giới thiệu trong danh mục dự án Thiên Đức với hình ảnh và thông tin tổng quan.",
    status: "da-ban-giao",
    location: "TP.HCM",
    category: "Chung cư",
    image:
      "/images/projects/la-bonita/building/la-bonita-building-render-01.jpg",
    gallery: [
      "/images/projects/la-bonita/building/la-bonita-building-render-02.jpg",
    ],
    description:
      "Chung cư La Bonita là dự án được giới thiệu trong danh mục dự án của Thiên Đức tại TP.HCM. Các thông tin chi tiết về quy mô, pháp lý và tiến độ nên được cập nhật theo tài liệu chính thức đã duyệt.",
    highlights: [
      "Vị trí tại TP.HCM.",
      "Hình ảnh dự án đã có trong thư viện media hiện tại.",
      "Các thông tin chi tiết cần được xác nhận trước khi công bố rộng rãi.",
    ],
  },
  {
    title: "Dự án Vũng Tàu",
    slug: "du-an-vung-tau",
    summary:
      "Dự án chung cư tại Vũng Tàu, đang được bổ sung hình ảnh và thông tin tổng quan theo tài liệu được duyệt.",
    status: "da-ban-giao",
    location: "Vũng Tàu",
    category: "Chung cư",
    image: "/images/projects/vung-tau/vung-tau-center-exterior-01.webp",
    gallery: [
      "/images/projects/vung-tau/vung-tau-center-exterior-02.webp",
    ],
    description:
      "Dự án Vũng Tàu được giới thiệu trong danh mục dự án chung cư của Thiên Đức. Các thông tin chi tiết về vị trí, quy mô, pháp lý và tiến độ cần được cập nhật theo hồ sơ chính thức trước khi công bố rộng rãi.",
    highlights: [
      "Loại hình chung cư tại khu vực Vũng Tàu.",
      "Hình ảnh hiện đang dùng làm ảnh tham khảo phù hợp với nhóm dự án chung cư.",
      "Thông tin chi tiết về pháp lý, quy mô và tiến độ sẽ được cập nhật theo tài liệu được duyệt.",
    ],
  },
  {
    title: "Dự án Bảy Hiền",
    slug: "du-an-bay-hien",
    summary:
      "Dự án chung cư tại khu vực Bảy Hiền, đang được bổ sung thông tin chi tiết và hình ảnh phù hợp.",
    status: "da-ban-giao",
    location: "Bảy Hiền, TP.HCM",
    category: "Chung cư",
    image: "/images/projects/bay-hien/bay-hien-tower-exterior-01.jpg",
    description:
      "Dự án Bảy Hiền được giới thiệu trong danh mục dự án chung cư của Thiên Đức tại TP.HCM. Nội dung hiện trình bày ở mức tổng quan an toàn, chờ công ty xác nhận thêm thông tin chính thức về pháp lý, quy mô và tiến độ.",
    highlights: [
      "Loại hình chung cư tại khu vực Bảy Hiền, TP.HCM.",
      "Hình ảnh hiện đang dùng làm ảnh tham khảo phù hợp với nhóm dự án chung cư.",
      "Các thông tin chi tiết cần được xác nhận trước khi công bố rộng rãi.",
    ],
  },
];
