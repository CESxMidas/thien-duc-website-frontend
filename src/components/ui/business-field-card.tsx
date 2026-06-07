import type { BusinessField } from "@/data/business-fields";
import { BusinessFieldIcon } from "@/components/ui/business-field-icon";

type BusinessFieldCardProps = {
  item: BusinessField;
  index: number;
};

export function BusinessFieldCard({ item, index }: BusinessFieldCardProps) {
  return (
    <article className="hover-card group border border-black/10 bg-white p-5 hover:border-[#B06613]/35">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="icon-badge flex size-11 items-center justify-center bg-[#fff4cf] text-[#B06613] group-hover:bg-[#fdcd04] group-hover:text-[#191919]">
          <BusinessFieldIcon index={index} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B06613]">
          Mã {item.code}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-[#191919]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#59646a]">{item.description}</p>
    </article>
  );
}
