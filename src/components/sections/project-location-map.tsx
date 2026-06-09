import Image from "next/image";
import { MapLocationMarker } from "@/components/ui/map-location-marker";
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
      <div className="reveal-sides-pair grid items-stretch gap-4 lg:grid-cols-2">
        {aerialImage ? (
          <div
            className="reveal-from-left image-reveal relative overflow-hidden border border-[#B06613]/18 bg-[#f2f2f2] shadow-[0_16px_36px_rgba(127,75,13,0.1)]"
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
          className="reveal-from-right image-reveal relative border border-[#B06613]/18 bg-[#0c5b3f] shadow-[0_16px_36px_rgba(127,75,13,0.12)]"
          style={{ aspectRatio: "1024 / 683" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={image}
              alt={`Bản đồ vị trí ${title}`}
              fill
              quality={100}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>

          <MapLocationMarker
            href={googleMapsUrl}
            label={`Mở vị trí ${title} trên Google Maps`}
            left={markerLeft}
            top={markerTop}
          />

          {(labels ?? []).map((label) => (
            <span
              key={`${label.text}-${label.left}-${label.top}`}
              className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_55%)] ${
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
