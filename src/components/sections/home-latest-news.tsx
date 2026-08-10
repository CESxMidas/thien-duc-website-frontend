import Link from "next/link";
import { NewsSlider } from "@/components/sections/news-slider";
import { getNewsPosts } from "@/lib/api/news";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { routes } from "@/lib/routes";

export async function HomeLatestNews({ locale }: { locale: Locale }) {
  // Nạp TOÀN BỘ bài đã đăng để slider trang chủ trượt hết kho tin (yêu cầu sản
  // phẩm 2026-07-30, thay cho mốc 8 bài trước đó).
  //
  // Không sắp lại ở đây: backend đã trả đúng thứ tự `publishedAt desc, id desc`.
  // Endpoint phẳng `/news` cố ý được dùng thay cho bản phân trang vì `limit` của
  // API bị chặn trần 50 — muốn "hết" thì phải đi đường này.
  const [latestNews, dictionary] = await Promise.all([
    getNewsPosts(locale),
    getDictionary(locale),
  ]);

  if (latestNews.length === 0) {
    return null;
  }

  return (
    <section className="reveal-section bg-cream">
      <div className="mx-auto max-w-site px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-eyebrow mb-4 text-brand">
              {dictionary.home.latestEyebrow}
            </p>
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
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
          posts={latestNews}
          locale={locale}
          labels={dictionary.newsSlider}
          detailLabel={dictionary.home.postDetail}
        />
      </div>
    </section>
  );
}
