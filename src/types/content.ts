export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type ProjectStatus =
  | "da-ban-giao"
  | "dang-thi-cong"
  | "chuan-bi-khoi-cong"
  | "dang-cap-nhat";

export type Project = {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  location?: string;
  image?: string;
  gallery?: string[];
  category?: string;
  description?: string;
  highlights?: string[];
};

export type NewsPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  image?: string;
};
