import { homeCapabilities } from "@/data/home";
import { BusinessFieldCard } from "@/components/ui/business-field-card";

export function HomeCapabilities() {
  return (
    <section className="reveal-section mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
          Lĩnh vực hoạt động
        </p>
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
          Ngành nghề kinh doanh đã đăng ký
        </h2>
        <p className="mt-5 text-lg leading-8 text-[#59646a]">
          Các lĩnh vực dưới đây được trình bày theo nhóm ngành nghề trong mục tiêu
          hoạt động và ngành nghề kinh doanh của Công ty Thiên Đức.
        </p>
      </div>

      <div className="stagger-list mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {homeCapabilities.map((item, index) => (
          <BusinessFieldCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
