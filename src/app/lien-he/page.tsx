import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHeading } from "@/components/ui/page-heading";

export const metadata: Metadata = {
  title: "Liên hệ Thiên Đức | Tư vấn dự án và hợp tác",
  description:
    "Thông tin liên hệ Công ty Thiên Đức, hỗ trợ trao đổi về dự án, hợp tác phát triển và nhu cầu tư vấn bất động sản.",
};

const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;
const emailHref = `mailto:${siteConfig.email}`;
const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
  siteConfig.address,
)}`;
const formMailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
  "Yêu cầu liên hệ từ website Thiên Đức",
)}`;

const contactItems = [
  {
    label: "Điện thoại",
    value: siteConfig.phone,
    href: phoneHref,
    action: "Gọi ngay",
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: emailHref,
    action: "Gửi email",
  },
  {
    label: "Địa chỉ",
    value: siteConfig.address,
    href: mapsHref,
    action: "Xem bản đồ",
  },
];

const inquiryTypes = [
  {
    title: "Tư vấn dự án",
    description:
      "Trao đổi thông tin tổng quan về dự án, nhu cầu tư vấn hoặc lịch hẹn làm việc.",
  },
  {
    title: "Hợp tác phát triển",
    description:
      "Kết nối với Thiên Đức về định hướng hợp tác, phát triển dự án hoặc đối tác triển khai.",
  },
  {
    title: "Thông tin doanh nghiệp",
    description:
      "Gửi yêu cầu liên quan đến hoạt động công ty, hồ sơ năng lực hoặc thông tin truyền thông.",
  },
];

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeading
        eyebrow="Liên hệ"
        title="Kết nối với Thiên Đức"
        description="Thiên Đức tiếp nhận thông tin từ khách hàng, đối tác và các bên quan tâm đến dự án, hợp tác hoặc hoạt động doanh nghiệp."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-5">
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === "Địa chỉ" ? "_blank" : undefined}
              rel={item.label === "Địa chỉ" ? "noreferrer" : undefined}
              className="group border border-black/10 bg-white p-6 transition hover:border-[#B06613]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B06613]">
                {item.label}
              </p>
              <p className="mt-3 text-xl font-semibold leading-tight text-[#191919]">
                {item.value}
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[#59646a] transition group-hover:text-[#B06613]">
                {item.action}
              </span>
            </a>
          ))}
        </div>

        <div className="border border-black/10 bg-white p-6 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#B06613]">
            Gửi yêu cầu
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            Chọn nội dung cần trao đổi
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#59646a]">
            Bạn có thể liên hệ Thiên Đức để trao đổi về thông tin dự án, nhu cầu
            tư vấn, hợp tác phát triển hoặc các nội dung liên quan đến doanh
            nghiệp. Thông tin sẽ được chuyển đến bộ phận phụ trách phù hợp.
          </p>

          <div className="mt-8 grid gap-4">
            {inquiryTypes.map((item) => (
              <div key={item.title} className="border-l-4 border-[#fdcd04] bg-[#f6f3ee] p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#59646a]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={formMailtoHref}
              className="inline-flex h-11 items-center justify-center bg-[#B06613] px-5 text-sm font-semibold text-white transition hover:bg-[#7f4b0d]"
            >
              Gửi yêu cầu qua email
            </a>
            <a
              href={phoneHref}
              className="inline-flex h-11 items-center justify-center border border-black/15 px-5 text-sm font-semibold transition hover:border-[#B06613] hover:text-[#B06613]"
            >
              Gọi Thiên Đức
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 bg-[#c99248] p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#fdcd04]">
              Văn phòng Thiên Đức
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              Làm việc trực tiếp với đội ngũ phụ trách
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
              Vui lòng liên hệ trước qua điện thoại hoặc email để Thiên Đức sắp
              xếp bộ phận phù hợp tiếp nhận nội dung trao đổi.
            </p>
          </div>
          <Link
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center bg-[#fdcd04] px-5 text-sm font-semibold text-[#191919] transition hover:bg-white"
          >
            Xem vị trí
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
