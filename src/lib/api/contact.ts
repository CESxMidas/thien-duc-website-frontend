import { apiFetch, isApiEnabled } from "@/lib/api/client";

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

/**
 * Gửi form liên hệ về backend (`POST /contact`).
 * Khi chưa cấu hình `NEXT_PUBLIC_API_URL` (chế độ mock) thì giả lập gửi
 * thành công sau 600ms để UI phát triển được đầy đủ trạng thái.
 */
export async function submitContactForm(
  input: ContactSubmissionInput,
): Promise<ContactSubmissionDto> {
  if (!isApiEnabled) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      ...input,
      id: "mock",
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
  }

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
