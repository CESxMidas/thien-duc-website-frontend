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
      "Khu đô thị 11,25 ha do Thiên Đức làm chủ đầu tư tại trung tâm TP. Bến Tre, gồm 330 căn nhà ở thấp tầng và tòa căn hộ Fancy Tower.",
    status: "dang-thi-cong",
    location: "Bến Tre",
    category: "Khu đô thị",
    image: "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
    gallerySections: hungPhuGallerySections,
    description:
      "Khu đô thị Hưng Phú nằm mặt tiền đường Nguyễn Thị Định, Phường Phú Tân, TP. Bến Tre, trên khu đất hậu cần Tỉnh đội cũ. Hạ tầng kỹ thuật, đường nội khu và các phân khu nhà phố thấp tầng đã hoàn thiện, phần lớn cư dân đã dọn vào sinh sống ổn định. Trung tâm thương mại Hưng Phú Mall và nhà trẻ nội khu đang hoàn thiện giai đoạn cuối để đưa vào khai thác.",
    highlights: [
      "Quy mô 11,25 ha với 330 căn nhà phố liền kề, shophouse đi bộ và biệt thự.",
      "Sổ hồng lâu dài; đã hoàn tất nghiệm thu hạ tầng kỹ thuật.",
      "Tòa nhà hành chính Liên Sở của tỉnh nằm ngay trong nội khu.",
      "Tiện ích nội khu: khu dịch vụ ngầm, hồ bơi, trường mẫu giáo, trung tâm văn hóa thể thao, công viên cây xanh và siêu thị.",
    ],
    quickFacts: [
      { label: "Chủ đầu tư", value: "Công ty TNHH ĐT - XD - TM Thiên Đức" },
      { label: "Tổng diện tích", value: "112.521 m² (11,25 ha)" },
      { label: "Diện tích đất ở", value: "43.403 m²" },
      { label: "Mật độ xây dựng", value: "38,5%" },
      { label: "Nhà ở thấp tầng", value: "330 căn" },
      {
        label: "Sản phẩm",
        value: "Nhà phố liền kề, biệt thự và căn hộ Fancy Tower (19 tầng)",
      },
      { label: "Pháp lý", value: "Sổ hồng lâu dài" },
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
      "Tòa căn hộ 14 tầng với 60 căn hộ trên tuyến đường Nguyễn Gia Trí, Quận Bình Thạnh, TP.HCM.",
    status: "da-ban-giao",
    location: "Bình Thạnh, TP.HCM",
    category: "Chung cư",
    image:
      "/images/projects/la-bonita/building/la-bonita-building-render-01.jpg",
    gallery: [
      "/images/projects/la-bonita/building/la-bonita-building-render-02.jpg",
    ],
    description:
      "La Bonita tọa lạc tại số 6 - 8 đường Nguyễn Gia Trí (đường D2 cũ), Phường 25, Quận Bình Thạnh. Bốn tầng khối đế dành cho trung tâm thương mại, officetel và văn phòng cho thuê; từ tầng 5 đến tầng 14 là khu căn hộ. Công trình đã hoàn thiện xây dựng và bàn giao từ năm 2018.",
    highlights: [
      "1 block cao 14 tầng nổi và 2 tầng hầm gửi xe.",
      "Chỉ 60 căn hộ, khoảng 6 căn mỗi sàn.",
      "Kết nối trực tiếp ra Điện Biên Phủ và Xô Viết Nghệ Tĩnh, khoảng 5 - 10 phút vào trung tâm Quận 1.",
    ],
    quickFacts: [
      { label: "Địa chỉ", value: "6 - 8 Nguyễn Gia Trí, Phường 25, Bình Thạnh" },
      { label: "Diện tích đất", value: "1.374 m²" },
      { label: "Diện tích sàn xây dựng", value: "11.654 m²" },
      { label: "Quy mô", value: "14 tầng nổi + 2 tầng hầm" },
      { label: "Số căn hộ", value: "60 căn" },
      { label: "Bàn giao", value: "Năm 2018" },
    ],
  },
  {
    // Slug giữ nguyên `du-an-vung-tau` dù tiêu đề đổi thành tên chính thức —
    // đổi slug sẽ làm hỏng mọi liên kết đã phát ra ngoài.
    title: "Silver Sea Tower",
    slug: "du-an-vung-tau",
    summary:
      "Tòa nhà phức hợp 18 tầng tại số 47 Ba Cu, trung tâm TP. Vũng Tàu, với 80 căn hộ đã có sổ hồng lâu dài.",
    status: "da-ban-giao",
    location: "TP. Vũng Tàu",
    category: "Chung cư",
    image: "/images/projects/vung-tau/vung-tau-center-exterior-01.webp",
    gallery: [
      "/images/projects/vung-tau/vung-tau-center-exterior-02.webp",
    ],
    description:
      "Silver Sea Tower nằm tại số 47 đường Ba Cu, Phường 1, TP. Vũng Tàu — sát cạnh UBND thành phố và cách Bãi Trước khoảng 500m, nên cả hai mặt tòa nhà đều có tầm nhìn hướng biển. Công trình đã hoàn thiện và đưa vào vận hành: khối căn hộ có cư dân sinh sống ổn định, khối văn phòng và thương mại tầng đế đã hoạt động đồng bộ.",
    highlights: [
      "18 tầng nổi và 2 tầng hầm; tầng áp mái có sân vườn trên cao và bãi đáp trực thăng phục vụ PCCC.",
      "80 căn hộ diện tích 101 - 162 m², thiết kế 2 - 3 phòng ngủ.",
      "Đã có sổ hồng lâu dài riêng cho từng căn hộ, chuyển nhượng công chứng sang tên bình thường.",
    ],
    quickFacts: [
      { label: "Địa chỉ", value: "47 Ba Cu, Phường 1, TP. Vũng Tàu" },
      { label: "Diện tích khu đất", value: "1.490,3 m²" },
      { label: "Quy mô", value: "18 tầng nổi + 2 tầng hầm" },
      { label: "Số căn hộ", value: "80 căn (101 - 162 m²)" },
      { label: "Phân khu", value: "Tầng 1-3 thương mại · 4-7 văn phòng · 8-18 căn hộ" },
      { label: "Pháp lý", value: "Sổ hồng lâu dài từng căn" },
    ],
  },
  {
    // Slug giữ nguyên `du-an-bay-hien` vì lý do như trên.
    title: "Bảy Hiền Tower",
    slug: "du-an-bay-hien",
    summary:
      "Tòa nhà 23 tầng tại số 9 Phạm Phú Thứ, Quận Tân Bình, TP.HCM, gồm khối chợ sỉ phụ liệu dệt may và khu căn hộ.",
    status: "da-ban-giao",
    location: "Tân Bình, TP.HCM",
    category: "Chung cư",
    image: "/images/projects/bay-hien/bay-hien-tower-exterior-01.jpg",
    description:
      "Bảy Hiền Tower tọa lạc tại số 9 Phạm Phú Thứ, Phường 11, Quận Tân Bình — cách Ngã tư Bảy Hiền khoảng 300m và sát Chợ sỉ Tân Bình. Khối căn hộ đã hoàn thiện và bàn giao, hiện có hơn 150 hộ dân sinh sống. Khối thương mại 5 tầng đã xây dựng xong phần thô và đang chờ hoàn tất thủ tục để đưa vào khai thác.",
    highlights: [
      "23 tầng nổi và 2 tầng hầm gửi xe, diện tích hầm khoảng 5.500 m².",
      "Khối đế 5 tầng thương mại, sàn gần 7.000 m², bố trí khoảng 500 sạp chợ sỉ phụ liệu dệt may.",
      "Đối diện Bệnh viện Thống Nhất, gần THPT Nguyễn Thượng Hiền và Công viên Lê Thị Riêng.",
    ],
    quickFacts: [
      { label: "Địa chỉ", value: "9 Phạm Phú Thứ, Phường 11, Tân Bình" },
      { label: "Diện tích khu đất", value: "2.712 m²" },
      { label: "Quy mô", value: "23 tầng nổi + 2 tầng hầm" },
      { label: "Số căn hộ", value: "168 - 196 căn (70 - 101 m² và Duplex)" },
      { label: "Khối thương mại", value: "5 tầng, sàn gần 7.000 m²" },
    ],
  },
];
