"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, X } from "lucide-react";
import { submitJobApplication } from "@/lib/api/careers";
import { ApiError } from "@/lib/api/client";
import type { Locale } from "@/lib/i18n/config";

const labels = {
  vi: {
    title: "Ứng tuyển",
    intro: "Điền thông tin và gửi CV cho vị trí bạn quan tâm.",
    name: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    cv: "File CV",
    link: "Link CV",
    message: "Giới thiệu bản thân",
    cancel: "Hủy",
    close: "Đóng",
    submit: "Gửi hồ sơ",
    sending: "Đang gửi hồ sơ...",
    cvHint:
      "Tải file PDF tối đa 5 MB hoặc dán link CV dùng HTTPS. Nếu dùng link, hãy bật quyền xem cho người nhận.",
    privacy:
      "Thông tin và CV chỉ được dùng để tiếp nhận và xử lý hồ sơ tuyển dụng.",
    success: "Đã gửi hồ sơ ứng tuyển",
    successBody:
      "Thiên Đức đã tiếp nhận hồ sơ của bạn. Bộ phận phụ trách sẽ liên hệ qua thông tin bạn cung cấp.",
    nameError: "Nhập họ tên từ 2 đến 120 ký tự.",
    phoneError: "Nhập số điện thoại Việt Nam hợp lệ.",
    emailError: "Nhập email hợp lệ.",
    cvError: "Cần tải file PDF tối đa 5 MB hoặc dán link CV.",
    linkError: "Link CV phải dùng HTTPS và không chứa thông tin đăng nhập.",
    network:
      "Chưa gửi được hồ sơ. Vui lòng thử lại, thông tin bạn nhập vẫn được giữ.",
    limit: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
    closed: "Vị trí này đã ngừng nhận hồ sơ. Vui lòng chọn vị trí khác.",
  },
  en: {
    title: "Apply for",
    intro: "Share your details and CV for this position.",
    name: "Full name",
    phone: "Phone number",
    email: "Email",
    cv: "CV file",
    link: "CV link",
    message: "About you",
    cancel: "Cancel",
    close: "Close",
    submit: "Submit application",
    sending: "Submitting...",
    cvHint:
      "Upload a PDF up to 5 MB or paste an HTTPS CV link. Enable viewing access when sharing a link.",
    privacy:
      "Your details and CV are used only to receive and process your job application.",
    success: "Application received",
    successBody:
      "Thien Duc has received your application. Our team will contact you using the details provided.",
    nameError: "Enter your full name using 2 to 120 characters.",
    phoneError: "Enter a valid Vietnamese phone number.",
    emailError: "Enter a valid email address.",
    cvError: "Upload a PDF up to 5 MB or provide a CV link.",
    linkError: "Use an HTTPS CV link without embedded credentials.",
    network:
      "Your application could not be sent. Please try again. Your information has been kept.",
    limit: "Too many requests. Please try again later.",
    closed:
      "This position is no longer accepting applications. Please select another position.",
  },
};
const controlClass =
  "min-h-12 w-full rounded-lg border border-divider bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-ivory sm:text-sm";

export function CareersApplyButton({
  position,
  locale,
  label,
}: {
  position: { id: string; title: string };
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    window.requestAnimationFrame(() => trigger.current?.focus());
  }
  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className="button-polish mt-6 inline-flex min-h-11 items-center bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
        aria-haspopup="dialog"
      >
        {label}
        <span className="sr-only">: {position.title}</span>
      </button>
      {open && (
        <ApplicationDialog
          position={position}
          locale={locale}
          onClose={close}
        />
      )}
    </>
  );
}

function ApplicationDialog({
  position,
  locale,
  onClose,
}: {
  position: { id: string; title: string };
  locale: Locale;
  onClose: () => void;
}) {
  const copy = labels[locale];
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/[\s.-]/g, "");
    const email = String(data.get("email") ?? "").trim();
    const cvLink = String(data.get("cvLink") ?? "").trim();
    const cv = data.get("cv");
    const file = cv instanceof File && cv.size > 0 ? cv : undefined;
    const next: Record<string, string> = {};
    if (name.length < 2 || name.length > 120) next.name = copy.nameError;
    if (!/^(0|\+84)\d{9,10}$/.test(phone)) next.phone = copy.phoneError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
      next.email = copy.emailError;
    if (!file && !cvLink) next.cv = copy.cvError;
    if (file && (file.size > 5 * 1024 * 1024 || !/\.pdf$/i.test(file.name)))
      next.cv = copy.cvError;
    if (cvLink) {
      try {
        const url = new URL(cvLink);
        if (
          url.protocol !== "https:" ||
          url.username ||
          url.password ||
          !url.hostname.includes(".") ||
          cvLink.length > 2000
        )
          next.cvLink = copy.linkError;
      } catch {
        next.cvLink = copy.linkError;
      }
    }
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    if (!file) data.delete("cv");
    if (!cvLink) data.delete("cvLink");
    else data.set("cvLink", cvLink);
    data.set("name", name);
    data.set("phone", phone);
    data.set("email", email);
    data.set("locale", locale);
    inFlight.current = true;
    setPending(true);
    try {
      await submitJobApplication(position.id, data);
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.status === 429
            ? copy.limit
            : error.status === 404
              ? copy.closed
              : error.status === 400 || error.status === 413
                ? locale === "vi"
                  ? error.message
                  : copy.cvError
                : copy.network
          : copy.network,
      );
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }
  function field(name: string) {
    return {
      id: `${id}-${name}`,
      name,
      className: controlClass,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
      onChange: () =>
        setErrors((current) => {
          const next = { ...current };
          delete next[name];
          if (name === "cvLink") delete next.cv;
          return next;
        }),
    };
  }
  const errorText = (name: string) =>
    errors[name] && (
      <p id={`${id}-${name}-error`} className="mt-1 text-sm text-danger">
        {errors[name]}
      </p>
    );
  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-intro`}
      onCancel={(event) => {
        event.preventDefault();
        if (!inFlight.current) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl border border-divider bg-ivory p-0 text-ink shadow-2xl backdrop:bg-black/50"
    >
      <header className="relative border-b border-divider px-5 py-5 pr-16 sm:px-7 sm:pr-16">
        <h2 id={`${id}-title`} className="text-xl font-semibold leading-7">
          {copy.title}: {position.title}
        </h2>
        <p id={`${id}-intro`} className="mt-2 text-sm leading-6 text-slate">
          {copy.intro}
        </p>
        <button
          type="button"
          aria-label={copy.close}
          onClick={onClose}
          disabled={pending}
          className="absolute right-3 top-3 grid size-11 place-items-center rounded-lg hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>
      {success ? (
        <div className="px-7 py-8" role="status">
          <CheckCircle2
            className="mb-4 size-10 text-success"
            aria-hidden="true"
          />
          <h3 className="text-xl font-semibold">{copy.success}</h3>
          <p className="mt-3 text-sm leading-6 text-slate">
            {copy.successBody}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 min-h-11 bg-brand px-5 text-sm font-semibold text-white"
          >
            {copy.close}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <fieldset
            disabled={pending}
            className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7"
          >
            <div className="sm:col-span-2">
              <label
                htmlFor={`${id}-name`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.name} *
              </label>
              <input
                {...field("name")}
                autoComplete="name"
                maxLength={120}
                required
              />
              {errorText("name")}
            </div>
            <div>
              <label
                htmlFor={`${id}-phone`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.phone} *
              </label>
              <input
                {...field("phone")}
                type="tel"
                autoComplete="tel"
                maxLength={30}
                required
              />
              {errorText("phone")}
            </div>
            <div>
              <label
                htmlFor={`${id}-email`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.email} *
              </label>
              <input
                {...field("email")}
                type="email"
                autoComplete="email"
                maxLength={200}
                required
              />
              {errorText("email")}
            </div>
            <div className="sm:col-span-2">
              <p
                id={`${id}-cv-hint`}
                className="mb-3 text-sm leading-6 text-slate"
              >
                {copy.cvHint}
              </p>
              <label
                htmlFor={`${id}-cv`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.cv}
              </label>
              <input
                {...field("cv")}
                type="file"
                accept=".pdf,application/pdf"
                aria-describedby={`${id}-cv-hint${errors.cv ? ` ${id}-cv-error` : ""}`}
                className={`${controlClass} file:mr-3 file:rounded file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:font-medium file:text-brand-dark`}
              />
              {errorText("cv")}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${id}-cvLink`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.link}
              </label>
              <input
                {...field("cvLink")}
                type="url"
                maxLength={2000}
                placeholder="https://"
              />
              {errorText("cvLink")}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor={`${id}-message`}
                className="mb-2 block text-sm font-semibold"
              >
                {copy.message}
              </label>
              <textarea {...field("message")} rows={3} maxLength={4000} />
            </div>
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor={`${id}-company`}>Company</label>
              <input
                id={`${id}-company`}
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <p className="text-xs leading-5 text-slate sm:col-span-2">
              {copy.privacy}
            </p>
            {submitError && (
              <p
                role="alert"
                className="text-sm leading-6 text-danger sm:col-span-2"
              >
                {submitError}
              </p>
            )}
          </fieldset>
          <footer className="flex flex-wrap justify-end gap-3 border-t border-divider px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="min-h-11 rounded-lg border border-divider px-5 text-sm font-semibold disabled:opacity-50"
            >
              {copy.cancel}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {pending && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              {pending ? copy.sending : copy.submit}
            </button>
          </footer>
        </form>
      )}
    </dialog>
  );
}
