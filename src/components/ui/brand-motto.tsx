
function splitMotto(motto: string) {
  const [first, ...rest] = motto.split(/\s*[—–]\s*|\s+-\s+/);
  return { first: first.trim(), second: rest.join(" ").trim() || undefined };
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
    
      className={`relative overflow-hidden bg-brand-dark px-6 py-6 text-white sm:px-8 sm:py-8 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-gold"
      />

      {label ? (
        <figcaption className="text-eyebrow text-gold-soft">{label}</figcaption>
      ) : null}

      <blockquote
      
        className={`font-display text-xl font-bold leading-[1.15] tracking-tight sm:text-2xl ${label ? "mt-3" : ""}`}
      >
        <span className="block text-balance">{first}</span>
        {second ? (
          <span className="mt-1 block text-balance text-gold">{second}</span>
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
