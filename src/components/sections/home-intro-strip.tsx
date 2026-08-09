import { Building2, Handshake, ShieldCheck, Star } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const strengthIcons = [Building2, Handshake, Star, ShieldCheck];

/**
 * Dải giới thiệu rút gọn thay cho hero cũ (H1 + CTA đã dời lên banner slider
 * theo UI-UX-HANDOFF-SPEC.md mục H1). Mục tiêu chiều cao ≤ 50vh.
 */
export async function HomeIntroStrip({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  const { eyebrow, title, description, strengths } = dictionary.homeIntro;

  return (
    <section className="relative overflow-hidden border-y border-brand/10 bg-linear-to-br from-surface-warm via-cream to-surface-warm">
      <div
        className="hero-accent-grow pointer-events-none absolute inset-y-0 left-0 w-1 bg-gold"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-16">
        {/* Bố cục biên tập hai cột: tiêu đề trái, đoạn giới thiệu phải.
            Trước đây cả khối bị bó trong `max-w-3xl` (768px) trong khi lưới thẻ
            bên dưới trải hết 1072px → dư ~304px trống bên phải, và hai khối lệch
            lề phải nên đọc ra rời rạc. Nay khối intro dùng trọn bề ngang bằng
            NỘI DUNG ĐÃ CÓ, đồng thời cột phải ~648px giữ độ dài dòng ~69 ký tự,
            sát chuẩn `--measure-prose` (68ch) — nới đoạn văn ra full 1072px sẽ
            đẩy lên ~117 ký tự/dòng, hại khả năng đọc.
            Hai cột chỉ bật từ `lg`: ở 768–1023px cột phải sẽ chỉ còn ~370px
            (~41 ký tự), tức chữa desktop bằng cách làm hỏng tablet. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div>
            <p className="text-eyebrow text-brand">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.15] text-brand-dark md:text-[2.5rem]">
              {title}
            </h2>
            {/* Gạch vàng ngắn — cùng ngôn ngữ với `border-l` vàng của đoạn văn và
                `border-b` vàng của tiêu đề thẻ. Thuần trang trí. */}
            <div aria-hidden="true" className="mt-5 h-1 w-16 bg-gold" />
          </div>

          {/* `max-w-[72ch]` là chốt chặn: ở bề ngang container hiện tại cột này
              vốn đã ~69ch nên nó không ràng buộc, chỉ có tác dụng nếu sau này
              `--container-site` được nới rộng. */}
          <p className="max-w-[72ch] border-l-4 border-gold bg-white/70 py-1 pl-5 text-base leading-8 text-slate lg:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((item, index) => {
            const Icon = strengthIcons[index];

            return (
              <div
                key={item.title}
                className="strength-row group border border-brand/15 bg-white p-5 shadow-[0_10px_28px_rgba(25,25,25,0.05)]"
              >
                <div className="icon-badge flex size-11 shrink-0 items-center justify-center bg-gold-soft text-brand group-hover:bg-gold group-hover:text-ink">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 inline-block border-b-2 border-gold/80 pb-0.5 text-base font-bold text-brand">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
