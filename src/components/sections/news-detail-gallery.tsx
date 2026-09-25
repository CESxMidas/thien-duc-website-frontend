import Image from "next/image";

const MAX_PREVIEW_IMAGES = 5;

type NewsDetailGalleryProps = {
  images: string[];
  title: string;
};

function uniqueImages(images: string[]) {
  return images.filter((image, index) => image && images.indexOf(image) === index);
}

export function NewsDetailGallery({ images, title }: NewsDetailGalleryProps) {
  const gallery = uniqueImages(images);
  const mainImage = gallery[0];
  const secondaryImages = gallery.slice(1, MAX_PREVIEW_IMAGES);
  const hiddenCount = Math.max(gallery.length - MAX_PREVIEW_IMAGES, 0);

  if (!mainImage) return null;

  if (gallery.length === 1) {
    return (
      <section className="reveal-section page-container pb-6">
        <div className="image-reveal relative aspect-video max-h-140 overflow-hidden border border-black/10 bg-surface">
          <Image
            src={mainImage}
            alt={title}
            fill
            preload
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="reveal-section page-container pb-6"
      aria-label="Hinh anh bai viet"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
        <div className="image-reveal relative aspect-[16/10] overflow-hidden border border-black/10 bg-surface lg:min-h-[27rem]">
          <Image
            src={mainImage}
            alt={title}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 68vw"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:auto-rows-fr">
          {secondaryImages.map((image, index) => {
            const showMore = index === secondaryImages.length - 1 && hiddenCount > 0;

            return (
              <div
                key={image}
                className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-surface lg:aspect-auto"
              >
                <Image
                  src={image}
                  alt={`${title} - anh ${index + 2}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 18vw"
                  className={`object-cover ${showMore ? "brightness-75" : ""}`}
                />
                {showMore ? (
                  <span className="absolute inset-0 grid place-items-center bg-ink/28 text-2xl font-semibold text-white">
                    +{hiddenCount}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
