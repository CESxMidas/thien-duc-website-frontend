import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { mapCopy } from "@/lib/map-copy";

type ProjectMapEmbedProps = {
  /** Chuỗi tìm kiếm địa chỉ (địa chỉ đầy đủ hoặc "tên dự án + địa danh"). */
  query: string;
  title: string;
  locale: Locale;
  aerialImage?: string;
};

export function ProjectMapEmbed({
  query,
  title,
  locale,
  aerialImage,
}: ProjectMapEmbedProps) {
  const copy = mapCopy[locale];
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&hl=${locale}&z=16&output=embed`;

  return (
    <section className="project-detail-band reveal-section overflow-hidden py-8">
      <div className="page-container">
        <div
          className={`grid w-full gap-4 lg:items-stretch ${
            aerialImage ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {aerialImage ? (
            <div
              className="image-reveal relative w-full overflow-hidden border border-brand/18 bg-surface"
              style={{ aspectRatio: "1024 / 683" }}
            >
              <Image
                src={aerialImage}
                alt={copy.imageAlt(title)}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div
            className="relative w-full overflow-hidden border border-brand/18 bg-surface"
            style={{ aspectRatio: aerialImage ? "1024 / 683" : "1024 / 460" }}
          >
            <iframe
              src={src}
              title={copy.mapAlt(title)}
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
