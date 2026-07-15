import { getCooperationProjects } from "@/lib/api/cooperation";
import type { Locale } from "@/lib/i18n/config";
import { CooperationSlider } from "@/components/sections/cooperation-slider";

/**
 * Section "Dự án hợp tác" trang chủ. Server component: lấy dữ liệu từ API
 * `/cooperation` rồi truyền cho slider client. Không có dữ liệu thì ẩn hẳn
 * khối, tránh để tiêu đề trơ trọi.
 */
export async function HomeCooperation({ locale }: { locale: Locale }) {
  const projects = await getCooperationProjects(locale);

  if (projects.length === 0) {
    return null;
  }

  return <CooperationSlider projects={projects} />;
}
