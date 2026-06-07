"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";
import { contactFormCopy, inquiryTypes } from "@/data/contact";

const inputClassName =
  "h-11 w-full border border-black/15 bg-white px-4 text-sm text-[#191919] outline-none transition placeholder:text-[#59646a] focus:border-[#B06613]";

const labelClassName =
  "mb-2 block text-sm font-semibold text-[#1d2428]";

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const inquiry = String(formData.get("inquiry") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !phone || !inquiry || !message) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const inquiryLabel =
      inquiryTypes.find((item) => item.id === inquiry)?.title ?? inquiry;

    const body = [
      "Yêu cầu liên hệ từ website Thiên Đức",
      "",
      `Họ và tên: ${name}`,
      `Số điện thoại: ${phone}`,
      email ? `Email: ${email}` : null,
      `Nội dung trao đổi: ${inquiryLabel}`,
      "",
      "Nội dung yêu cầu:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Liên hệ website — ${inquiryLabel}`,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoHref;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            {contactFormCopy.fields.name}
            <span className="text-[#B06613]"> *</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            {contactFormCopy.fields.phone}
            <span className="text-[#B06613]"> *</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="090x xxx xxx"
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          {contactFormCopy.fields.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="contact-inquiry" className={labelClassName}>
          {contactFormCopy.fields.inquiry}
          <span className="text-[#B06613]"> *</span>
        </label>
        <select
          id="contact-inquiry"
          name="inquiry"
          required
          defaultValue=""
          className={inputClassName}
        >
          <option value="" disabled>
            Chọn nội dung cần trao đổi
          </option>
          {inquiryTypes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          {contactFormCopy.fields.message}
          <span className="text-[#B06613]"> *</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Mô tả ngắn nhu cầu tư vấn, dự án quan tâm hoặc nội dung cần trao đổi."
          className={`${inputClassName} min-h-[140px] resize-y py-3`}
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-[#9b2c2c]" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-sm leading-6 text-[#59646a]">{contactFormCopy.note}</p>

      <button
        type="submit"
        className="button-polish inline-flex h-11 w-full items-center justify-center bg-[#B06613] px-5 text-sm font-semibold text-white hover:bg-[#7f4b0d] sm:w-auto"
      >
        {contactFormCopy.submitLabel}
      </button>
    </form>
  );
}
