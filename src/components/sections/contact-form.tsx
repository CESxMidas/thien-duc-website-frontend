"use client";

import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { siteConfig } from "@/config/site";
import { inquiryTypeIds } from "@/data/contact";
import { ApiError } from "@/lib/api/client";
import { submitContactForm } from "@/lib/api/contact";
import { interpolate, type Dictionary } from "@/lib/i18n/get-dictionary";

const inputClassName =
  "h-12 w-full border bg-white px-4 text-base text-ink outline-none transition placeholder:text-slate focus:border-brand focus:ring-2 focus:ring-gold/40 sm:h-11 sm:text-sm";

const labelClassName = "mb-2 block text-sm font-semibold text-ink-soft";

type FieldName = "name" | "phone" | "email" | "inquiry" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "submitting" | "success";
type ContactFormCopy = Dictionary["contactForm"];

const PHONE_PATTERN = /^(0|\+84)\d{9,10}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(
  field: FieldName,
  value: string,
  messages: ContactFormCopy["errors"],
): string | undefined {
  switch (field) {
    case "name":
      return value.trim().length >= 2 ? undefined : messages.name;
    case "phone":
      return PHONE_PATTERN.test(value.replace(/[\s.-]/g, ""))
        ? undefined
        : messages.phone;
    case "email":
      if (!value.trim()) return undefined;
      return EMAIL_PATTERN.test(value.trim()) ? undefined : messages.email;
    case "inquiry":
      return value ? undefined : messages.inquiry;
    case "message":
      return value.trim().length >= 10 ? undefined : messages.message;
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-danger"
    >
      <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
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
        error ? "border-danger" : "border-black/15"
      }`,
      onBlur: (event: { currentTarget: { value: string } }) => {
        const value = event.currentTarget.value;
        setFieldErrors((current) => ({
          ...current,
          [field]: validateField(field, value, copy.errors),
        }));
      },
      onChange: (event: { currentTarget: { value: string } }) => {
        // Chỉ re-validate on-change khi field đã có lỗi (tránh báo lỗi khi đang gõ)
        const value = event.currentTarget.value;
        setFieldErrors((current) =>
          current[field]
            ? {
                ...current,
                [field]: validateField(field, value, copy.errors),
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
      const error = validateField(field, values[field], copy.errors);
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
          message: interpolate(copy.errors.rateLimit, {
            phone: siteConfig.phone,
          }),
        });
      } else {
        setSubmitError({
          kind: "network",
          message: copy.errors.network,
        });
      }
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-success/25 bg-success/10 p-8 text-center"
      >
        <CheckCircle2
          className="mx-auto size-10 text-success"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-xl font-semibold text-success-strong">
          {copy.successTitle}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
          {copy.successBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setFieldErrors({});
            setSubmitError(null);
          }}
          className="button-polish mt-6 inline-flex h-11 items-center border border-brand/40 bg-white px-5 text-sm font-semibold text-brand-dark transition hover:border-brand hover:bg-cream"
        >
          {copy.successAgain}
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
            {copy.fields.name}
            <span className="text-brand"> *</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            // Khớp trần backend (CreateContactSubmissionDto) — đổi đồng bộ 2 nơi.
            maxLength={120}
            autoComplete="name"
            placeholder={copy.placeholders.name}
            {...fieldProps("name")}
          />
          <FieldError id="contact-name-error" message={fieldErrors.name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            {copy.fields.phone}
            <span className="text-brand"> *</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            autoComplete="tel"
            placeholder={copy.placeholders.phone}
            {...fieldProps("phone")}
          />
          <FieldError id="contact-phone-error" message={fieldErrors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClassName}>
          {copy.fields.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          maxLength={200}
          autoComplete="email"
          placeholder={copy.placeholders.email}
          {...fieldProps("email")}
        />
        <FieldError id="contact-email-error" message={fieldErrors.email} />
      </div>

      <div>
        <label htmlFor="contact-inquiry" className={labelClassName}>
          {copy.fields.inquiry}
          <span className="text-brand"> *</span>
        </label>
        <select
          id="contact-inquiry"
          name="inquiry"
          required
          defaultValue=""
          {...fieldProps("inquiry")}
        >
          <option value="" disabled>
            {copy.inquiryPlaceholder}
          </option>
          {inquiryTypeIds.map((id) => (
            <option key={id} value={id}>
              {copy.inquiryOptions[id]}
            </option>
          ))}
        </select>
        <FieldError id="contact-inquiry-error" message={fieldErrors.inquiry} />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          {copy.fields.message}
          <span className="text-brand"> *</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder={copy.placeholders.message}
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
              ? "border-warning/30 bg-warning-soft text-warning"
              : "border-danger/30 bg-danger/8 text-danger"
          }`}
        >
          {submitError.message}
        </p>
      ) : null}

      <p className="text-sm leading-6 text-slate">{copy.note}</p>

      <button
        type="submit"
        disabled={submitting}
        className="button-polish inline-flex h-11 w-full min-w-44 items-center justify-center gap-2 bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand sm:w-auto"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            {copy.submitting}
          </>
        ) : (
          copy.submitLabel
        )}
      </button>
    </form>
  );
}
