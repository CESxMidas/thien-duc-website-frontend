import { apiFetch } from "@/lib/api/client";

export type ContactSubmissionInput = {
  name: string;
  phone: string;
  email?: string;
  inquiryType?: string;
  message: string;
};

export type ContactSubmissionDto = ContactSubmissionInput & {
  id: string;
  status: string;
  createdAt: string;
};

/** Gửi form liên hệ về backend (`POST /contact`). */
export async function submitContactForm(
  input: ContactSubmissionInput,
): Promise<ContactSubmissionDto> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    return await apiFetch<ContactSubmissionDto>("/contact", {
      method: "POST",
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}
