import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ProjectMapLabelKind, ProjectMapLocation } from "@/types/content";

type ProjectLocationMapProps = {
  mapLocation: ProjectMapLocation;
  title: string;
  aerialImage?: string;
};

const labelClassByKind: Record<ProjectMapLabelKind, string> = {
  place: "font-semibold text-white text-[8px] sm:text-[11px]",
  area: "font-bold uppercase tracking-wide text-white text-[8px] sm:text-[11px]",
  road: "italic text-white/85 text-[7px] sm:text-[10px]",
  direction: "font-medium text-white text-[8px] sm:text-[11px]",
};

export function ProjectLocationMap({
  mapLocation,
  title,
  aerialImage,
}: ProjectLocationMapProps) {
  const { image, googleMapsUrl, markerLeft, markerTop, labels } = mapLocation;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {aerialImage ? (
          <div
            className="relative overflow-hidden border border-black/10 bg-[#f2f2f2]"
            style={{ aspectRatio: "1024 / 683" }}
          >
            <Image
              src={aerialImage}
              alt={`Phối cảnh tổng thể ${title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className="relative overflow-hidden border border-black/10 bg-[#0c5b3f]"
          style={{ aspectRatio: "1024 / 683" }}
        >
          <Image
            src={image}
            alt={`Bản đồ vị trí ${title}`}
            fill
            quality={100}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
          />

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Mở vị trí ${title} trên Google Maps`}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${markerLeft}%`, top: `${markerTop}%` }}
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fdcd04] motion-safe:animate-ping" />
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#fdcd04] motion-safe:animate-ping"
              style={{ animationDelay: "0.7s" }}
            />

            <span className="relative grid size-5 place-items-center rounded-full bg-[#fdcd04] text-[#191919] shadow-md shadow-black/40 ring-2 ring-white/80 transition group-hover:scale-110">
              <MapPin className="size-3" />
            </span>

            <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#191919] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdcd04] opacity-0 shadow-lg transition group-hover:opacity-100">
              Xem chi tiết
            </span>
          </a>

          {(labels ?? []).map((label) => (
            <span
              key={`${label.text}-${label.left}-${label.top}`}
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_55%)] ${
                labelClassByKind[label.kind ?? "place"]
              }`}
              style={{ left: `${label.left}%`, top: `${label.top}%` }}
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
