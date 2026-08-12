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

      <div className="relative mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        {/* Bố cục biên tập hai cột: eyebrow + tiêu đề bên trái, đoạn giới thiệu
            bên phải. Trước đây cả khối bị bó trong `max-w-3xl` (768px) trong khi
            lưới thẻ bên dưới trải hết 1072px → dư ~304px trống bên phải, đọc ra
            như hai hệ lưới khác nhau dù lề trái vẫn trùng.

            Không nới đoạn văn ra full 1072px: ở `lg:text-lg` bề rộng đó cho
            ~106 ký tự/dòng, trong khi `--measure-prose` của hệ thống là 68ch.
            Cột phải ~648px giữ ~65ch, vừa lấp hết bề ngang bằng NỘI DUNG ĐÃ CÓ
            vừa đúng chuẩn đọc.

            Hai cột chỉ bật từ `lg`: ở 768–1023px cột phải sẽ chỉ còn ~370px
            (~41 ký tự), tức chữa desktop bằng cách làm hỏng tablet. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
          <div>
            {/* Nhãn mục biên tập, KHÔNG tương tác. Bản trước dùng khối chữ nhật
                nền `bg-brand` đặc + `min-h-11` (đúng bằng kích thước vùng chạm
                tối thiểu của nút) + shadow nổi → đọc ra như một CTA bấm được,
                trong khi nó chỉ là chữ. Nay dùng đúng utility `.text-eyebrow`
                mà 17 file khác trong site đã dùng cho vai trò này. Không hover,
                không con trỏ, không ngữ nghĩa nút. */}
            <p className="text-eyebrow text-brand">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.15] text-brand-dark md:text-[2.5rem]">
              {title}
            </h2>
          </div>

          {/* `max-w-[72ch]` là chốt chặn: ở bề ngang container hiện tại cột này
              vốn đã ~65ch nên nó không ràng buộc, chỉ có tác dụng nếu sau này
              `--container-site` được nới rộng. `mt-6` cũ đã bỏ — khoảng cách
              giữa hai khối nay do `gap` của grid quản. */}
          {/* `text-justified` = thụt dòng đầu (1.5em mobile / 2em từ 640px) +
              căn đều hai bên, theo lối văn bản hành chính. Đây là đoạn giới
              thiệu doanh nghiệp — TYPE A body paragraph, không phải deck dẫn
              dắt hay copy trong thẻ. Trước đây đoạn này nằm NGOÀI hệ prose nên
              không nhận thụt dòng nào, dù `.text-justified` đã tồn tại sẵn.
              `pl-5` là khoảng cách tới đường kẻ vàng bên trái — độc lập với
              `text-indent`, nên thụt dòng vẫn chỉ tác động dòng đầu. */}
          <p className="text-justified max-w-[72ch] border-l-4 border-gold bg-white/70 py-1 pl-5 text-base leading-8 text-slate lg:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                {/* `h3` chứ không phải `h2`: từ khi dải có tiêu đề mục `<h2>`,
                    tiêu đề thẻ là cấp con của nó. Thuần ngữ nghĩa — class giữ
                    nguyên nên hiển thị không đổi. */}
                {/* Bỏ gạch chân vàng trang trí (`inline-block border-b-2
                    border-gold/80 pb-0.5`): tiêu đề đã đủ phân cấp nhờ đậm +
                    màu brand + cỡ chữ. `inline-block`/`pb-0.5` cũng bỏ theo vì
                    chúng chỉ tồn tại để bó gạch chân vừa bề ngang chữ. */}
                <h3 className="mt-4 text-base font-bold text-brand">
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
