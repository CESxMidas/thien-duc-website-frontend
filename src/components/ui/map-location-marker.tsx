"use client";

import { MapPin } from "lucide-react";

type MapLocationMarkerProps = {
  href: string;
  label: string;
  left: number;
  top: number;
};

function RippleRing({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 size-6 rounded-full border border-[#fdcd04] bg-[#fdcd04]/45"
      style={{
        animation: "map-ripple 2s ease-out infinite",
        animationDelay: delay,
        animationFillMode: "backwards",
      }}
    />
  );
}

export function MapLocationMarker({
  href,
  label,
  left,
  top,
}: MapLocationMarkerProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <span className="relative block h-0 w-0">
        <RippleRing delay="0s" />
        <RippleRing delay="0.66s" />
        <RippleRing delay="1.32s" />

        <span className="absolute left-1/2 top-1/2 z-10 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#fdcd04] text-[#191919] shadow-[0_2px_10px_rgba(0,0,0,0.4)] ring-2 ring-white transition group-hover:scale-110">
          <MapPin className="size-3" strokeWidth={2.5} aria-hidden="true" />
        </span>
      </span>

      <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#c99248] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#fdcd04] opacity-0 shadow-lg transition group-hover:opacity-100">
        Xem chi tiết
      </span>
    </a>
  );
}
