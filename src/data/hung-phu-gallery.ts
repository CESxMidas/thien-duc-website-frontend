import type { ProjectGallerySection } from "@/types/content";

const hotelImage = (name: string) =>
  `/images/projects/hung-phu/hotel/${name}` as const;

const fancyTowerImage = (name: string) =>
  `/images/projects/hung-phu/fancy-tower/${name}` as const;

export const hungPhuGallerySections: ProjectGallerySection[] = [
  {
    title: "Khách sạn",
    description:
      "Không gian lưu trú Cannes Hotel với phòng nghỉ hiện đại và tiện nghi đồng bộ trong khu đô thị.",
    images: [
      hotelImage("hung-phu-hotel-exterior-01.jpg"),
      hotelImage("hung-phu-hotel-bedroom-double-01.jpg"),
      hotelImage("hung-phu-hotel-bedroom-twin-01.jpg"),
      hotelImage("hung-phu-hotel-bedroom-twin-02.jpg"),
      hotelImage("hung-phu-hotel-living-room-01.jpg"),
      hotelImage("hung-phu-hotel-living-room-02.jpg"),
    ],
  },
  {
    title: "Chung cư Fancy Tower",
    description:
      "Tòa căn hộ cao cấp 19 tầng với tiện ích nội khu và không gian sống hiện đại.",
    images: [
      fancyTowerImage("fancy-tower-exterior-day-01.jpg"),
      fancyTowerImage("fancy-tower-exterior-evening-01.jpg"),
      fancyTowerImage("fancy-tower-exterior-plaza-01.jpg"),
      fancyTowerImage("fancy-tower-exterior-plaza-02.jpg"),
      fancyTowerImage("fancy-tower-amenity-pool-01.jpg"),
      fancyTowerImage("fancy-tower-amenity-pool-02.jpg"),
      fancyTowerImage("fancy-tower-amenity-pool-03.jpg"),
    ],
  },
];
