import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import ProjectItemPage from "@/app/[locale]/du-an/[slug]/[hang-muc]/page";
import { getProjectBySlug, getProjectItem } from "@/lib/api/projects";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import vi from "@/lib/i18n/dictionaries/vi.json";
import en from "@/lib/i18n/dictionaries/en.json";
import { ProjectItemsCarousel } from "./project-items-carousel";

jest.mock("@/lib/api/projects", () => ({
  getProjectBySlug: jest.fn(),
  getProjectItem: jest.fn(),
}));
jest.mock("@/lib/i18n/get-dictionary", () => ({
  ...jest.requireActual("@/lib/i18n/get-dictionary"),
  getDictionary: jest.fn(),
}));
jest.mock("@/components/layout/site-shell", () => ({
  SiteShell: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
jest.mock("./project-items-carousel", () => ({
  ProjectItemsCarousel: jest.fn(() => <div data-testid="siblings-carousel" />),
}));

const current = { slug: "current", title: "Current item" };
const sibling = { slug: "other", title: "Other item" };
const project = {
  slug: "test-project",
  title: "Test project",
  summary: "Project summary",
  status: "da-ban-giao" as const,
  items: [current, sibling],
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getProjectBySlug).mockResolvedValue(project);
  jest.mocked(getProjectItem).mockResolvedValue(current);
});

it.each(["vi", "en"] as const)("passes only sibling items and localized labels to the carousel (%s)", async (locale) => {
  const dictionary = locale === "vi" ? vi : en;
  jest.mocked(getDictionary).mockResolvedValue(dictionary);
  render(await ProjectItemPage({
    params: Promise.resolve({ locale, slug: project.slug, "hang-muc": current.slug }),
    searchParams: Promise.resolve({}),
  }));
  expect(screen.getByTestId("siblings-carousel")).toBeInTheDocument();
  expect(jest.mocked(ProjectItemsCarousel).mock.calls[0][0]).toEqual(expect.objectContaining({
    items: [sibling],
    projectSlug: project.slug,
    projectStatus: project.status,
    locale,
    labels: dictionary.itemsCarousel,
  }));
});

it("omits the sibling section when the project has no other items", async () => {
  jest.mocked(getDictionary).mockResolvedValue(vi);
  jest.mocked(getProjectBySlug).mockResolvedValue({ ...project, items: [current] });
  render(await ProjectItemPage({
    params: Promise.resolve({ locale: "vi", slug: project.slug, "hang-muc": current.slug }),
    searchParams: Promise.resolve({}),
  }));
  expect(ProjectItemsCarousel).not.toHaveBeenCalled();
});
