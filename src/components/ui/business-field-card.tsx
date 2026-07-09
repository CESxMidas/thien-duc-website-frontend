import type { BusinessField } from "@/data/business-fields";
import { BusinessFieldIcon } from "@/components/ui/business-field-icon";

type BusinessFieldCardProps = {
  item: BusinessField;
  index: number;
};

export function BusinessFieldCard({ item, index }: BusinessFieldCardProps) {
  return (
    <article className="hover-card group border border-black/10 bg-white p-5 hover:border-brand/35">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="icon-badge flex size-11 items-center justify-center bg-gold-soft text-brand group-hover:bg-gold group-hover:text-ink">
          <BusinessFieldIcon index={index} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          Mã {item.code}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate">{item.description}</p>
    </article>
  );
}
