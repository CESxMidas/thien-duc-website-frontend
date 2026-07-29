import Link from "next/link";
import { NewsSlider } from "@/components/sections/news-slider";
import { getNewsPage, HOME_NEWS_LIMIT } from "@/lib/api/news";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export async function HomeLatestNews({ locale }: { locale: Locale }) {
  // Chỉ nạp một trang đầu (8 bài) thay vì cả kho tin, và để backend lo việc lọc
  // PUBLISHED + sắp mới nhất trước — trước đây trang chủ tải hết rồi tự sắp.
  const [latestNews, dictionary] = await Promise.all([
    getNewsPage(locale, { page: 1, limit: HOME_NEWS_LIMIT }),
    getDictionary(locale),
  ]);

  if (latestNews.items.length === 0) {
    return null;
  }

  return (
    <section className="reveal-section bg-cream">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {dictionary.home.latestEyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
              {dictionary.home.latestTitle}
            </h2>
          </div>
          <Link
            href={localizePath(routes.news, locale)}
            className="button-polish inline-flex h-11 items-center self-start border border-black/15 px-5 text-sm font-semibold transition hover:border-brand hover:text-brand md:self-auto"
          >
            {dictionary.home.allPosts}
          </Link>
        </div>

        <NewsSlider
          posts={latestNews.items}
          locale={locale}
          labels={dictionary.newsSlider}
          detailLabel={dictionary.home.postDetail}
        />
      </div>
    </section>
  );
}
