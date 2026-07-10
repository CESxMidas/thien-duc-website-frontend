import Image from "next/image";

type ProjectMapEmbedProps = {
  /** Chuỗi tìm kiếm địa chỉ (địa chỉ đầy đủ hoặc "tên dự án + địa danh"). */
  query: string;
  title: string;
  aerialImage?: string;
};

/**
 * Bản đồ vị trí dùng iframe Google Maps cho các dự án chưa có ảnh bản đồ minh
 * hoạ riêng (khác Khu đô thị Hưng Phú dùng `ProjectLocationMap`). Đặt cùng bố
 * cục hai cột (ảnh dự án | bản đồ) để đồng nhất giao diện giữa các dự án.
 *
 * `output=embed` không cần API key. Không có ảnh dự án thì bản đồ chiếm trọn
 * chiều ngang, tránh để nửa khung trống.
 */
export function ProjectMapEmbed({
  query,
  title,
  aerialImage,
}: ProjectMapEmbedProps) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&hl=vi&z=16&output=embed`;

  return (
    <section className="project-detail-band reveal-section overflow-hidden py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid w-full gap-4 lg:items-stretch ${
            aerialImage ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {aerialImage ? (
            <div
              className="image-reveal relative w-full overflow-hidden border border-brand/18 bg-surface shadow-[0_16px_36px_rgba(127,75,13,0.1)]"
              style={{ aspectRatio: "1024 / 683" }}
            >
              <Image
                src={aerialImage}
                alt={`Hình ảnh ${title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div
            className="relative w-full overflow-hidden border border-brand/18 bg-surface shadow-[0_16px_36px_rgba(127,75,13,0.12)]"
            style={{ aspectRatio: aerialImage ? "1024 / 683" : "1024 / 460" }}
          >
            <iframe
              src={src}
              title={`Bản đồ vị trí ${title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
