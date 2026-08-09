import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  href: string;
  statusLabel: string;
  viewDetailLabel: string;
  /**
   * Bố cục ngang (ảnh trái / chữ phải) dùng khi danh sách chỉ có **một** dự án —
   * giữ nguyên cách trình bày sẵn có của trang, tránh một thẻ lẻ loi cao ngồng.
   */
  featured?: boolean;
  /** `sizes` của next/image khác nhau giữa chế độ carousel và lưới tìm kiếm. */
  sizes?: string;
};

/**
 * Thẻ dự án dùng chung cho **cả** carousel (danh sách mặc định + đã lọc) lẫn
 * lưới kết quả tìm kiếm. Trước đây markup này nằm inline trong `du-an/page.tsx`;
 * tách ra để hai chế độ hiển thị không phải nhân đôi.
 *
 * Là Server Component (không `"use client"`) nên `next/image` giữ nguyên tối ưu
 * hoá phía server kể cả khi thẻ được truyền xuống làm children của carousel.
 */
export function ProjectCard({
  project,
  href,
  statusLabel,
  viewDetailLabel,
  featured = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      className={`hover-card group overflow-hidden border border-black/10 bg-white hover:border-brand ${
        featured
          ? "reveal-sides-pair md:grid md:grid-cols-[1.08fr_0.92fr]"
          : // `h-full` + cột dọc: trong carousel các thẻ nằm trên một hàng flex
            // `items-stretch`, cần cao bằng nhau để nút "Xem chi tiết" không trôi
            // lên xuống theo độ dài mô tả.
            "flex h-full flex-col"
      }`}
    >
      {project.image ? (
        <div
          className={`image-reveal relative overflow-hidden bg-surface ${
            featured
              ? "reveal-from-left aspect-16/10 md:aspect-auto md:min-h-80"
              : "aspect-3/2"
          }`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ) : null}
      <div
        className={`flex flex-col p-5 md:p-6 ${
          featured ? "reveal-from-right justify-center" : "flex-1"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          {project.location ? <span>{project.location}</span> : null}
          {project.location ? (
            <span className="h-1 w-1 rounded-full bg-gold" />
          ) : null}
          <span>{statusLabel}</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-tight">
          {project.title}
        </h2>
        {project.category ? (
          <p className="mt-2 text-sm font-semibold text-slate">
            {project.category}
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-6 text-slate">{project.summary}</p>
        {/* Khoảng cách nằm ở wrapper, KHÔNG ở chính nút: `pt-*` trên thẻ <span>
            có viền sẽ nở cao độ nút thay vì tạo khoảng hở. `mt-auto` ghim CTA
            xuống đáy thẻ trong carousel (các thẻ cao bằng nhau); bố cục featured
            canh giữa theo chiều dọc nên giữ khoảng cách cố định như cũ. */}
        <div className={featured ? "mt-6" : "mt-auto pt-6"}>
          <span className="link-arrow inline-flex h-10 w-fit items-center border border-black/15 px-4 text-sm font-semibold group-hover:border-brand group-hover:text-brand">
            {viewDetailLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
