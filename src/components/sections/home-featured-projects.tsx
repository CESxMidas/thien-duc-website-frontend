import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/api/projects";
import { defaultLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { homeFeaturedProjectCopy } from "@/data/home";
import type { Project } from "@/types/content";

/**
 * Chọn **một** dự án nổi bật cho trang chủ — **không phụ thuộc slug cụ thể nào**.
 *
 * Bản trước lọc `slug === "khu-do-thi-hung-phu" || status === "dang-thi-cong"`.
 * Đổi tên slug đó (hoặc gỡ dự án) là section BIẾN MẤT im lặng, vì hiện không có
 * dự án nào đang thi công nên vế thứ hai không cứu được.
 *
 * Quy tắc, chỉ dùng dữ liệu `Project` đã có (không thêm cột CMS nào):
 *   1. Ưu tiên dự án ĐANG THI CÔNG đầu tiên — tin tức nhất với người xem.
 *   2. Không có dự án nào đang thi công → lấy dự án ĐẦU TIÊN theo đúng thứ tự
 *      API trả về (backend đã lọc PUBLISHED sẵn).
 *
 * Cố ý trả về **đúng một** dự án: dải trang chủ về mặt biên tập là chỗ giới
 * thiệu MỘT dự án nổi bật ở bố cục lớn hai cột. Nếu để fallback trả nhiều dự án
 * thì trang chủ tự đổi sang lưới ba thẻ chỉ vì dữ liệu tình cờ có nhiều mục —
 * đó là thay đổi biên tập, không phải hệ quả kỹ thuật mong muốn.
 *
 * Không sắp xếp lại: thứ tự API chính là thứ tự biên tập. Không xoay vòng ngẫu
 * nhiên — trang chủ phải ổn định giữa các lần build.
 *
 * `status` so sánh bằng giá trị kebab-case của frontend (`ProjectStatus`), là
 * thứ `mapProject` sinh ra từ enum `DANG_THI_CONG` của API — không phải nhãn
 * hiển thị đã dịch.
 */
export function selectPrimaryFeaturedProject(
  projects: Project[],
): Project | undefined {
  return (
    projects.find((project) => project.status === "dang-thi-cong") ??
    projects[0]
  );
}

export async function HomeFeaturedProjects({ locale }: { locale: Locale }) {
  const [projects, dictionary] = await Promise.all([
    getProjects(locale),
    getDictionary(locale),
  ]);
  const primaryProject = selectPrimaryFeaturedProject(projects);

  if (!primaryProject) {
    return null;
  }

  // Giữ dạng danh sách: nhánh lưới nhiều thẻ bên dưới vẫn còn nguyên và đã được
  // làm bền (h-full + clamp) cho trường hợp sau này muốn hiện nhiều dự án. Hiện
  // tại lựa chọn tự động luôn cho đúng một mục.
  const featuredProjects = [primaryProject];
  const singleProject = featuredProjects.length === 1;

  return (
    <section className="reveal-section bg-cream">
      <div className="mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {dictionary.home.featuredEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-semibold leading-[1.2] md:text-[2.5rem]">
              {dictionary.home.featuredTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.projects, locale)}
            className="button-polish inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-brand hover:text-brand md:self-auto"
          >
            {dictionary.common.viewAllProjects}
          </Link>
        </div>

        <div
          className={`stagger-list mt-8 grid gap-5 ${singleProject ? "md:grid-cols-1" : "md:grid-cols-3"}`}
        >
          {featuredProjects.map((project) => {
            const apiCopy = {
              title: project.title,
              location: project.location,
              summary: project.summary,
            };
            // Bản rút gọn viết tay chỉ có tiếng Việt — locale khác dùng thẳng
            // nội dung CMS thay vì hiển thị tiếng Việt trên trang tiếng Anh.
            const display =
              locale === defaultLocale
                ? (homeFeaturedProjectCopy[
                    project.slug as keyof typeof homeFeaturedProjectCopy
                  ] ?? apiCopy)
                : apiCopy;

            // Chỉ render những mẩu metadata thực sự có giá trị. Bản trước luôn
            // render dấu chấm vàng giữa hai `<span>`, nên dự án thiếu
            // `location` (trường optional) để lại một chấm mồ côi.
            const metaParts = [
              display.location,
              dictionary.projectStatus[project.status],
            ].filter((part): part is string => Boolean(part));

            return (
              <Link
                key={project.slug}
                href={localizePath(`${routes.projects}/${project.slug}`, locale)}
                className={`hover-card group overflow-hidden border border-brand/10 bg-white shadow-[0_10px_28px_rgba(25,25,25,0.05)] hover:border-brand ${
                  singleProject
                    ? // THẺ giữ chiều cao tối thiểu (không phải ảnh). Trước đây
                      // `md:min-h-80` nằm trên ảnh kèm `md:aspect-auto`: ảnh mất
                      // chiều cao nội tại, sàn 320px của nó quyết định chiều cao
                      // hàng, rồi `items-stretch` kéo cột chữ ngắn lên bằng →
                      // thừa ~155px trắng dồn xuống đáy.
                      "md:grid md:min-h-80 md:grid-cols-[1.1fr_0.9fr]"
                    : // Nhiều thẻ: theo đúng quy ước thẻ của ProjectsCarousel —
                      // `h-full` + cột dọc để mọi thẻ cùng hàng cao bằng nhau.
                      "flex h-full flex-col"
                }`}
              >
                <div
                  className={`image-reveal relative overflow-hidden bg-surface ${
                    singleProject
                      ? "aspect-16/10 md:aspect-auto md:h-full"
                      : "aspect-4/3"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={display.title}
                      fill
                      // Ảnh chiếm ~55% bề ngang khi 1 dự án (1.1fr/2fr), ~33%
                      // khi 3 cột. Bản trước dùng 33vw cho cả hai → ở chế độ 1
                      // dự án Next chọn nguồn nhỏ hơn thực tế, ảnh bị mờ.
                      sizes={
                        singleProject
                          ? "(min-width: 768px) 55vw, 100vw"
                          : "(min-width: 768px) 33vw, 100vw"
                      }
                      className="object-cover"
                    />
                  ) : null}
                </div>
                {/* Desktop 1 dự án: căn giữa dọc để phần dư thành lề đối xứng,
                    đọc ra như chủ ý thay vì mảng chết ở đáy. Mobile giữ căn
                    trên. Nhiều thẻ: `flex-1` để nội dung lấp phần còn lại. */}
                <div
                  className={`flex flex-col p-5 ${
                    singleProject ? "md:justify-center" : "flex-1"
                  }`}
                >
                  {metaParts.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                      {metaParts.map((part, index) => (
                        <Fragment key={part}>
                          {index > 0 ? (
                            <span className="h-1 w-1 rounded-full bg-gold" />
                          ) : null}
                          <span>{part}</span>
                        </Fragment>
                      ))}
                    </div>
                  ) : null}
                  {/* Clamp giữ chiều cao thẻ trong biên khi nội dung CMS dài
                      ngắn khác nhau (EN thường dài hơn VI 20–40%). Chỉ giới hạn
                      lúc HIỂN THỊ — không cắt dữ liệu nguồn. */}
                  <h3 className="mt-3 line-clamp-3 text-xl font-semibold md:line-clamp-2">
                    {display.title}
                  </h3>
                  {display.summary ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate lg:line-clamp-4">
                      {display.summary}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
