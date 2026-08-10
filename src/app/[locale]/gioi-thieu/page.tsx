import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Handshake, ShieldCheck, Target } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BusinessFieldsCarousel } from "@/components/sections/business-fields-carousel";
import { ContentSidebar } from "@/components/sections/content-sidebar";
import { getNewsPage } from "@/lib/api/news";
import { getProjects } from "@/lib/api/projects";
import { BrandMotto } from "@/components/ui/brand-motto";
import { PageHeading } from "@/components/ui/page-heading";
import { getPageBySlug } from "@/lib/api/pages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo";

const PAGE_SLUG = "gioi-thieu";

/**
 * Số mục trong rail phải. Đây cũng là **cần gạt để cân chiều cao hai cột**:
 * rail cao xấp xỉ cột trái thì khoảng dư mà `justify-between` phải nuốt càng
 * nhỏ, hai bên nhìn càng đều. Tăng/giảm ở đây trước khi nghĩ tới việc độn thêm
 * khối nội dung vào rail.
 *
 * Con số hiện tại tính cho cột trái chỉ còn **tiêu đề + tổng quan + số liệu**
 * (chặng đường phát triển và giá trị nền tảng đã tách ra chiếm hết bề ngang).
 * Đưa thêm khối nào vào lưới hai cột thì phải nâng hai số này lên theo.
 */
const SIDEBAR_NEWS_COUNT = 4;
const SIDEBAR_PROJECT_COUNT = 2;

const metaCopy: Record<Locale, { title: string; description: string }> = {
  vi: {
    title: "Giới thiệu Công ty Thiên Đức | Đầu tư, xây dựng & bất động sản",
    description:
      "Tổng quan về Công ty TNHH Đầu tư - Xây dựng - Thương mại Thiên Đức, doanh nghiệp hoạt động trong lĩnh vực đầu tư, xây dựng, thương mại và phát triển bất động sản từ năm 2010.",
  },
  en: {
    title: "About Thien Duc | Investment, construction & real estate",
    description:
      "An overview of Thien Duc Investment - Construction - Trading Co., Ltd, active in investment, construction, trading, and real estate development since 2010.",
  },
};

const principleIcons = [Target, Handshake, ShieldCheck];

/**
 * Số cột bám theo số phần tử THẬT của dictionary. Trước đây lưới hardcode
 * `lg:grid-cols-4` / `md:grid-cols-3`: bỏ bớt một mốc thời gian hay một số liệu
 * (ví dụ khi gỡ nội dung CapitaLand khỏi `vi.json`) là lòi ra một cột trống,
 * và VI/EN lệch số phần tử thì mỗi ngôn ngữ vỡ một kiểu.
 *
 * Chuỗi class phải viết NGUYÊN VĂN trong file — Tailwind quét mã nguồn theo
 * chữ, class ghép động lúc chạy sẽ không được sinh ra.
 */
// Mốc `xl` chứ không phải `lg`: từ `lg` khối số liệu nằm trong CỘT TRÁI hẹp
// (đã trừ rail phải 19rem), 3–4 cột ở đó chỉ còn ~150px mỗi ô.
const statsColumns = [
  "",
  "",
  "sm:grid-cols-2",
  "sm:grid-cols-2 xl:grid-cols-3",
];
const timelineColumns = ["", "", "md:grid-cols-2"];

const gridColumns = (map: string[], count: number, fallback: string) =>
  map[count] ?? fallback;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/gioi-thieu">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return buildPageMetadata({
    ...metaCopy[locale],
    path: routes.about,
    locale,
  });
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/gioi-thieu">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Phần chữ do CMS quản lý (`GET /pages/gioi-thieu`): đoạn đầu là mô tả dưới
  // tiêu đề, các đoạn sau là nội dung khối "Định hướng phát triển". Các khối có
  // bố cục riêng (giá trị cốt lõi, ngành nghề) vẫn là UI tĩnh.
  //
  // Tin tức + dự án nạp cho rail phải. Gọi song song để rail không nối thêm độ
  // trễ vào thời gian hiện nội dung chính.
  const [page, dictionary, newsPage, projects] = await Promise.all([
    getPageBySlug(PAGE_SLUG, locale),
    getDictionary(locale),
    getNewsPage(locale, { page: 1, limit: SIDEBAR_NEWS_COUNT }),
    getProjects(locale),
  ]);
  const about = dictionary.about;
  const [heroDescription, ...overviewParagraphs] = page?.paragraphs ?? [];

  const heading = {
    title: page?.title ?? about.heroTitle,
    description: heroDescription ?? about.heroDescription,
  };
  const paragraphs =
    overviewParagraphs.length > 0
      ? overviewParagraphs
      : about.overviewParagraphs;

  return (
    <SiteShell locale={locale}>
      {/* Bố cục hai cột: nội dung bên trái, rail tin tức + dự án bên phải.
          Tách ở `lg` — dưới ngưỡng đó rail xuống dưới nội dung, đúng thứ tự đọc
          (giới thiệu trước, gợi ý sau). Rail rộng cố định 19rem để cột chữ bên
          trái không co giãn thất thường giữa các breakpoint.

          Tiêu đề trang nằm TRONG cột trái (`bare`) chứ không đứng trên lưới:
          để nó ở ngoài thì rail bắt đầu thấp hơn tiêu đề một đoạn, chừa một
          mảng trắng lớn ở góc trên bên phải. */}
      <div className="mx-auto grid max-w-site gap-8 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        {/* `content-between` là bản đối xứng của `justify-between` bên rail:
            cột nào NGẮN hơn thì tự dàn phần dư vào khoảng cách giữa các khối
            của chính nó, nên đáy hai cột luôn trùng nhau — bất kể bên nào dài
            hơn. Trước đây cột này `content-start` nên khi rail dài hơn thì khối
            số liệu dừng lửng ở giữa, lệch hẳn so với widget dự án bên cạnh. */}
        <div className="grid content-between gap-8 sm:gap-10">
          <PageHeading
            bare
            eyebrow={about.eyebrow}
            title={heading.title}
            description={heading.description}
          />

          {/* Tỉ lệ nghiêng về cột chữ (1.15 : 0.85 thay vì 1 : 0.9): cột chữ
              rộng thêm ~30px là bớt được vài dòng gãy, mà ảnh toà tháp vốn
              đứng nên hẹp lại không sao. Cả khối vì thế thấp xuống. */}
          <section className="reveal-section grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-eyebrow mb-3 text-brand">
                {about.overviewEyebrow}
              </p>
              <h2 className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                {about.overviewTitle}
              </h2>
              <div className="prose-content mt-5 grid gap-3 text-base leading-7 text-slate">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <BrandMotto
                motto={about.motto}
                label={about.mottoLabel}
                className="mt-6"
              />
            </div>

            {/* Thẻ ảnh cao BẰNG cột chữ bên cạnh: bỏ `items-start`, cho thẻ
                thành flex dọc rồi để ảnh `flex-1` ăn hết phần dư. Trước đây cột
                chữ dài hơn hẳn nên dưới thẻ ảnh hở một mảng trắng lớn. Ảnh là
                toà tháp đứng nên khung dọc lại hợp hơn khung 4:3.
                Dưới `xl` (một cột) giữ nguyên tỉ lệ 4:3 như cũ. */}
            <div className="hover-card flex flex-col overflow-hidden border border-black/10 bg-white shadow-sm">
              <div className="image-reveal relative aspect-4/3 xl:aspect-auto xl:min-h-72 xl:flex-1">
                <Image
                  src="/images/projects/hung-phu/fancy-tower/fancy-tower-exterior-day-01.jpg"
                  alt={about.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 32vw, (min-width: 1024px) 55vw, 100vw"
                />
              </div>
              <div className="grid gap-3 p-5 text-sm leading-6 text-slate sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    {about.foundedLabel}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-ink">
                    {about.foundedValue}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                    {about.areaLabel}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-ink">
                    {about.areaValue}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="reveal-section">
            <dl
              className={`stagger-list grid gap-4 border border-black/10 bg-white p-5 lg:p-6 ${gridColumns(
                statsColumns,
                about.stats.length,
                "sm:grid-cols-2 xl:grid-cols-4",
              )}`}
            >
              {about.stats.map((stat) => (
                <div key={stat.label} className="border-l-4 border-gold pl-4">
                  <dt className="font-display text-4xl font-semibold leading-none text-brand">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 font-semibold text-ink">{stat.label}</dd>
                  <dd className="mt-1 text-sm leading-6 text-slate">
                    {stat.note}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <ContentSidebar
          news={newsPage.items}
          projects={projects.slice(0, SIDEBAR_PROJECT_COUNT)}
          locale={locale}
          labels={dictionary.contentSidebar}
          common={dictionary.common}
          statusLabels={dictionary.projectStatus}
        />
      </div>

      {/* Từ đây trở xuống nằm NGOÀI lưới hai cột, chiếm hết bề ngang.
          Chặng đường phát triển + Giá trị nền tảng là lưới 2–3 thẻ ngang hàng —
          nhét vào cột trái đã trừ rail thì mỗi thẻ chỉ còn ~200px, chữ vỡ vụn.
          Slider ngành nghề còn một lý do nữa: nó tính số thẻ theo bề rộng cửa
          sổ (`window.innerWidth`) chứ không theo bề rộng khối chứa. */}
      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.timelineEyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.timelineTitle}
          </h2>
        </div>

        <ol
          className={`stagger-list mt-8 grid gap-4 ${gridColumns(
            timelineColumns,
            about.timeline.length,
            "md:grid-cols-3",
          )}`}
        >
          {about.timeline.map((milestone) => (
            <li
              key={milestone.period}
              className="hover-card border border-black/10 bg-white p-5 hover:border-brand/35"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                {milestone.period}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{milestone.title}</h3>
              <p className="text-justified mt-4 text-sm leading-6 text-slate">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">
            {about.principlesEyebrow}
          </p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.principlesTitle}
          </h2>
        </div>

        <div className="stagger-list mt-8 grid gap-4 md:grid-cols-3">
          {about.principles.map((item, index) => {
            const Icon = principleIcons[index];

            return (
              <article
                key={item.title}
                className="hover-card group border border-black/10 bg-white p-5 hover:border-brand/35"
              >
                <Icon
                  className="icon-badge mb-5 size-8 text-brand transition group-hover:scale-110"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-justified mt-4 text-sm leading-6 text-slate">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-4 text-brand">{about.fieldsEyebrow}</p>
          <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
            {about.fieldsTitle}
          </h2>
          <p className="text-justified mt-5 text-base leading-7 text-slate">
            {about.fieldsDescription}
          </p>
        </div>

        <BusinessFieldsCarousel
          fields={about.fields}
          codeLabel={about.fieldCodeLabel}
          labels={about.fieldsCarousel}
        />
      </section>

      <section className="reveal-section mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="rounded-sm bg-brand p-5 text-white shadow-[0_8px_28px_rgba(176,102,19,0.18)] md:p-10">
          <p className="text-eyebrow mb-4 text-gold-soft">{about.ctaEyebrow}</p>
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">
            {about.ctaTitle}
          </h2>
          <p className="text-justified mt-5 max-w-2xl text-base leading-7 text-white">
            {about.ctaDescription}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={localizePath(routes.projects, locale)}
              className="button-polish inline-flex h-11 items-center bg-gold px-5 text-sm font-semibold text-ink hover:bg-white"
            >
              {about.ctaPrimary}
            </Link>
            <Link
              href={localizePath(routes.contact, locale)}
              className="button-polish inline-flex h-11 items-center border border-white/50 px-5 text-sm font-semibold text-white hover:bg-white hover:text-ink"
            >
              {about.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
