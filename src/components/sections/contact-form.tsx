"use client";

import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";
import { contactFormCopy, inquiryTypes } from "@/data/contact";
import { ApiError } from "@/lib/api/client";
import { submitContactForm } from "@/lib/api/contact";

const inputClassName =
  "h-11 w-full border bg-white px-4 text-sm text-[#191919] outline-none transition placeholder:text-[#59646a] focus:border-[#B06613] focus:ring-2 focus:ring-[#fdcd04]/40";

const labelClassName = "mb-2 block text-sm font-semibold text-[#1d2428]";

type FieldName = "name" | "phone" | "email" | "inquiry" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "submitting" | "success";

const PHONE_PATTERN = /^(0|\+84)\d{9,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: FieldName, value: string): string | undefined {
  switch (field) {
    case "name":
      return value.trim().length >= 2
        ? undefined
        : "Vui lòng nhập họ tên (tối thiểu 2 ký tự).";
    case "phone":
      return PHONE_PATTERN.test(value.replace(/[\s.-]/g, ""))
        ? undefined
        : "Số điện thoại chưa đúng định dạng (ví dụ: 0901234567).";
    case "email":
      if (!value.trim()) return undefined;
      return EMAIL_PATTERN.test(value.trim())
        ? undefined
        : "Email chưa đúng định dạng.";
    case "inquiry":
      return value ? undefined : "Vui lòng chọn nội dung cần trao đổi.";
    case "message":
      return value.trim().length >= 10
        ? undefined
        : "Vui lòng mô tả nội dung yêu cầu (tối thiểu 10 ký tự).";
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#9b2c2c]"
    >
      <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<{
    kind: "network" | "rate-limit";
    message: string;
  } | null>(null);

  function fieldProps(field: FieldName) {
    const error = fieldErrors[field];

    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${field}-error` : undefined,
      className: `${inputClassName} ${
        error ? "border-[#9b2c2c]" : "border-black/15"
      }`,
      onBlur: (event: { currentTarget: { value: string } }) => {
        setFieldErrors((current) => ({
          ...current,
          [field]: validateField(field, event.currentTarget.value),
        }));
      },
      onChange: (event: { currentTarget: { value: string } }) => {
        // Chỉ re-validate on-change khi field đã có lỗi (tránh báo lỗi khi đang gõ)
        setFieldErrors((current) =>
          current[field]
            ? {
                ...current,
                [field]: validateField(field, event.currentTarget.value),
              }
            : current,
        );
      },
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      inquiry: String(formData.get("inquiry") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const errors: FieldErrors = {};
    for (const field of Object.keys(values) as FieldName[]) {
      const error = validateField(field, values[field]);
      if (error) errors[field] = error;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Honeypot: bot điền field ẩn → giả lập thành công, không gọi API
    if (String(formData.get("company") ?? "").length > 0) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      await submitContactForm({
        name: values.name,
        phone: values.phone.replace(/[\s.-]/g, ""),
        email: values.email || undefined,
        inquiryType: values.inquiry,
        message: values.message,
      });
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      if (error instanceof ApiError && error.code === "TOO_MANY_REQUESTS") {
        setSubmitError({
          kind: "rate-limit",
          message: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ hoặc gọi ${siteConfig.phone}.`,
        });
      } else {
        setSubmitError({
          kind: "network",
          message:
            "Không gửi được yêu cầu. Vui lòng kiểm tra kết nối và thử lại — dữ liệu bạn nhập vẫn được giữ nguyên.",
        });
      }
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-[#166534]/25 bg-[#166534]/10 p-8 text-center"
      >
        <CheckCircle2
          className="mx-auto size-10 text-[#166534]"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-semibold text-[#14532d]">
          Đã gửi yêu cầu thành công
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#1d2428]">
          Cảm ơn bạn đã liên hệ. Thiên Đức sẽ phản hồi trong vòng 24 giờ làm
          việc qua số điện thoại hoặc email bạn cung cấp.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFieldErrors({});
            setSubmitError(null);
          }}
          className="button-polish mt-6 inline-flex h-11 items-center border border-[#B06613]/40 bg-white px-5 text-sm font-semibold text-[#7f4b0d] transition hover:border-[#B06613] hover:bg-[#fff8ea]"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={submitting}
      noValidate
      className="grid gap-5"
    >
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
            {...fieldProps("name")}
          />
          <FieldError id="contact-name-error" message={fieldErrors.name} />
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
            {...fieldProps("phone")}
          />
          <FieldError id="contact-phone-error" message={fieldErrors.phone} />
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
          {...fieldProps("email")}
        />
        <FieldError id="contact-email-error" message={fieldErrors.email} />
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
          {...fieldProps("inquiry")}
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
        <FieldError id="contact-inquiry-error" message={fieldErrors.inquiry} />
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
          {...fieldProps("message")}
          className={`${fieldProps("message").className} min-h-35 resize-y py-3`}
        />
        <FieldError id="contact-message-error" message={fieldErrors.message} />
      </div>

      {/* Honeypot chống spam bot — người dùng thật không thấy field này */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Công ty</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {submitError ? (
        <p
          role="alert"
          className={`border px-4 py-3 text-sm font-medium ${
            submitError.kind === "rate-limit"
              ? "border-[#b45309]/30 bg-[#fef3c7] text-[#92400e]"
              : "border-[#9b2c2c]/30 bg-[#9b2c2c]/8 text-[#9b2c2c]"
          }`}
        >
          {submitError.message}
        </p>
      ) : null}

      <p className="text-sm leading-6 text-[#59646a]">{contactFormCopy.note}</p>

      <button
        type="submit"
        disabled={submitting}
        className="button-polish inline-flex h-11 w-full min-w-44 items-center justify-center gap-2 bg-[#B06613] px-5 text-sm font-semibold text-white transition hover:bg-[#7f4b0d] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#B06613] sm:w-auto"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Đang gửi...
          </>
        ) : (
          contactFormCopy.submitLabel
        )}
      </button>
    </form>
  );
}
