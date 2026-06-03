export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type ProjectStatus =
  | "da-ban-giao"
  | "dang-thi-cong"
  | "chuan-bi-khoi-cong";

export type Project = {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  location?: string;
  image?: string;
};

export type NewsPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  image?: string;
};
