import { homeCapabilities } from "@/data/home";

export function HomeCapabilities() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
          Lĩnh vực hoạt động
        </p>
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
          Tập trung vào chuỗi giá trị bất động sản và đầu tư xây dựng
        </h2>
        <p className="mt-5 text-lg leading-8 text-[#59646a]">
          Thiên Đức phát triển năng lực theo hướng thực thi dự án, hợp tác đầu tư
          và kết nối sản phẩm đến khách hàng, đối tác phù hợp.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {homeCapabilities.map((item) => (
          <article key={item.title} className="border border-black/10 bg-white p-5">
            <div className="mb-5 h-1 w-12 bg-[#fdcd04]" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#59646a]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
