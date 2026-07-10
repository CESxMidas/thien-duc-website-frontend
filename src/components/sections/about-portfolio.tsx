import Image from "next/image";
import Link from "next/link";
import { Handshake } from "lucide-react";
import type { PortfolioProject } from "@/data/about";
import { localizePath, type Locale } from "@/lib/i18n/config";

/**
 * Thẻ dự án tiêu biểu, cùng ngôn ngữ thị giác với khối dự án ở trang chủ.
 *
 * Trước đây khối này là một bảng 5 cột — khách hàng phải đọc ngang để ghép "Vai
 * trò" với "Quy mô", và trên điện thoại phải cuộn ngang. Thẻ đặt các thông tin
 * đó cạnh nhau theo chiều dọc.
 */

/**
 * Dự án hợp tác cùng CapitaLand không có ảnh dùng được (bản quyền bên thứ ba).
 * Thay vì mượn ảnh dự án khác — sẽ thành nói dối bằng hình — thẻ hiển thị đúng
 * thứ làm nên giá trị của nó: quan hệ đối tác.
 */
function PartnerPlate({ partner }: { partner: string }) {
  return (
    <div className="relative flex aspect-4/3 flex-col justify-center overflow-hidden bg-brand-dark px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(253,205,4,0.16),transparent_42%)]" />
      <Handshake
        className="absolute -bottom-6 -right-4 size-40 text-white/6"
        aria-hidden="true"
      />
      <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-gold">
        Hợp tác phát triển
      </p>
      <p className="relative mt-3 text-2xl font-semibold leading-tight">
        {partner}
      </p>
      <span
        className="relative mt-5 h-px w-16 bg-gold"
        aria-hidden="true"
      />
    </div>
  );
}

function PortfolioCardBody({ project }: { project: PortfolioProject }) {
  return (
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        <span>{project.location}</span>
        <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
        <span>{project.role}</span>
      </div>

      <h3 className="mt-3 text-2xl font-semibold leading-tight">
        {project.name}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate">{project.scale}</p>

      <dl className="mt-5 grid gap-3 border-t border-black/10 pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Đối tác
          </dt>
          <dd className="mt-1 font-medium text-ink">{project.partner}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">
            Trạng thái
          </dt>
          <dd className="mt-1 font-medium text-ink">{project.status}</dd>
        </div>
      </dl>

      {project.href ? (
        <span className="link-arrow mt-6 inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
          Xem chi tiết
        </span>
      ) : null}
    </div>
  );
}

export function AboutPortfolio({
  projects,
  locale,
}: {
  projects: PortfolioProject[];
  locale: Locale;
}) {
  return (
    <div className="stagger-sides mt-10 grid gap-5 md:grid-cols-2">
      {projects.map((project) => {
        const media = project.image ? (
          <div className="image-reveal relative aspect-4/3 overflow-hidden bg-surface">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <PartnerPlate partner={project.partner} />
        );

        const className =
          "hover-card group flex flex-col overflow-hidden border border-black/10 bg-white hover:border-brand";

        // Chỉ dự án có trang chi tiết mới là liên kết; thẻ còn lại là bài đọc.
        return project.href ? (
          <Link
            key={project.name}
            href={localizePath(project.href, locale)}
            className={className}
          >
            {media}
            <PortfolioCardBody project={project} />
          </Link>
        ) : (
          <article key={project.name} className={className}>
            {media}
            <PortfolioCardBody project={project} />
          </article>
        );
      })}
    </div>
  );
}
