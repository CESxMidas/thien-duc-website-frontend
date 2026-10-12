"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type NaturalRatioImageFrameProps = {
  src?: string | null;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  fallbackRatio?: number;
  priority?: boolean;
  quality?: number;
  children?: ReactNode;
};

export function NaturalRatioImageFrame({
  src,
  alt,
  sizes,
  className,
  imageClassName = "object-contain",
  fallbackRatio = 4 / 3,
  priority,
  quality,
  children,
}: NaturalRatioImageFrameProps) {
  const [ratio, setRatio] = useState(fallbackRatio);
  const imageSrc = src?.trim();

  return (
    <div
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={imageClassName}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (!naturalWidth || !naturalHeight) return;
            setRatio(naturalWidth / naturalHeight);
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
