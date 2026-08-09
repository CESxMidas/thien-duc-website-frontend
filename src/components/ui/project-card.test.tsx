import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/ui/project-card";
import type { Project } from "@/types/content";

const project: Project = {
  title: "Khu đô thị Hưng Phú",
  slug: "khu-do-thi-hung-phu",
  summary: "Khu đô thị phức hợp tại TP. Bến Tre.",
  status: "da-ban-giao",
  location: "Bến Tre",
  category: "Khu đô thị",
  image: "/images/projects/hung-phu/master-plan/hung-phu-master-plan-aerial-01.jpg",
};

function renderCard(overrides: Partial<Parameters<typeof ProjectCard>[0]> = {}) {
  return render(
    <ProjectCard
      project={project}
      href="/du-an/khu-do-thi-hung-phu"
      statusLabel="Đã bàn giao"
      viewDetailLabel="Xem chi tiết"
      {...overrides}
    />,
  );
}

describe("ProjectCard", () => {
  it("giữ nguyên nội dung thẻ: tiêu đề, địa điểm, trạng thái, hạng mục, mô tả, CTA", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    expect(screen.getByText("Bến Tre")).toBeInTheDocument();
    expect(screen.getByText("Đã bàn giao")).toBeInTheDocument();
    expect(screen.getByText("Khu đô thị")).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
    expect(screen.getByText("Xem chi tiết")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/du-an/khu-do-thi-hung-phu",
    );
  });

  it("ảnh giữ alt là tên dự án", () => {
    renderCard();
    expect(screen.getByAltText(project.title)).toBeInTheDocument();
  });

  it("không có ảnh thì không render <img> (giữ fallback sẵn có)", () => {
    renderCard({ project: { ...project, image: undefined } });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
  });

  it("chế độ thẻ (carousel) cao bằng nhau: h-full + CTA ghim đáy bằng mt-auto", () => {
    renderCard();
    expect(screen.getByRole("link").className).toContain("h-full");
    expect(screen.getByText("Xem chi tiết").parentElement?.className).toContain(
      "mt-auto",
    );
  });

  it("chế độ featured giữ bố cục ngang sẵn có, không ghim CTA xuống đáy", () => {
    renderCard({ featured: true });
    expect(screen.getByRole("link").className).toContain("md:grid-cols-");
    expect(
      screen.getByText("Xem chi tiết").parentElement?.className,
    ).not.toContain("mt-auto");
  });
});
