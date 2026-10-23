
export const brandMottoTextClassName =
  "font-display font-semibold uppercase leading-[1.04] tracking-normal text-charcoal sm:leading-[1.02]";

export function splitMotto(motto: string) {
  const normalizedMotto = motto.replace(/[—–-]/g, " ").replace(/\s+/g, " ").trim();
  for (const marker of ["Thiên Đức", "Thien Duc"]) {
    const markerIndex = normalizedMotto.indexOf(marker);

    if (markerIndex > 0) {
      return {
        first: normalizedMotto.slice(0, markerIndex).trim().replace(/,$/, ""),
        second: normalizedMotto.slice(markerIndex).trim(),
      };
    }
  }

  return { first: normalizedMotto, second: undefined };
}

type BrandMottoProps = {
  motto: string;
  label?: string;
  className?: string;
};


export function BrandMotto({ motto, label, className }: BrandMottoProps) {
  const { first, second } = splitMotto(motto);

  return (
    <figure
      className={`relative overflow-hidden rounded-[8px] border border-gold/30 bg-[linear-gradient(102deg,#f1e3d4_0%,#f7eee5_36%,#ffffff_68%,#f3e6d8_100%)] px-6 py-6 text-charcoal shadow-[0_12px_30px_rgba(74,48,35,0.075),inset_0_1px_0_rgba(255,255,255,0.9)] sm:px-8 sm:py-8 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-gold"
      />

      {label ? (
        <figcaption className="text-eyebrow text-earth">{label}</figcaption>
      ) : null}

      <blockquote
        className={`${brandMottoTextClassName} text-[1.6rem] sm:text-[2.38rem] ${label ? "mt-3" : ""}`}
      >
        <span className="block text-balance text-charcoal">{first}</span>
        {second ? (
          <span className="block text-balance text-charcoal">{second}</span>
        ) : null}
      </blockquote>
    </figure>
  );
}


export function BrandMottoCompact({ motto, className }: BrandMottoProps) {
  const { first, second } = splitMotto(motto);

  return (
    <blockquote
      className={`font-display text-lg font-bold leading-snug text-white sm:text-xl ${className ?? ""}`}
    >
      <span className="block">{first}</span>
      {second ? (
        <span className="mt-1 block text-gold">{second}</span>
      ) : null}
    </blockquote>
  );
}
