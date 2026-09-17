export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  group?: string;
  overviewLabel?: string;
};

export type ProjectStatus =
  | "da-ban-giao"
  | "dang-thi-cong"
  | "chuan-bi-khoi-cong"


export type ProjectMapLabelKind = "place" | "area" | "road" | "direction";

export type ProjectMapLabel = {
  text: string;
  left: number;
  top: number;
  kind?: ProjectMapLabelKind;
};

export type ProjectMapLocation = {
  image: string;
  googleMapsUrl: string;
  heading?: string;
  description?: string;
  address?: string;
  markerLeft: number;
  markerTop: number;
  labels?: ProjectMapLabel[];
};

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectGallerySection = {
  title: string;
  description?: string;
  images: string[];
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  location?: string;
  image?: string;
  gallery?: string[];
  gallerySections?: ProjectGallerySection[];
  category?: string;
  description?: string;
  highlights?: string[];
  quickFacts?: ProjectFact[];
  mapLocation?: ProjectMapLocation;
  items?: ProjectItem[];
};

export type ProjectItem = {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  status?: ProjectStatus;
  image?: string;
  highlights?: string[];
  quickFacts?: ProjectFact[];
  gallerySections?: ProjectGallerySection[];
  gallery?: string[];
};

export type NewsCategoryRef = {
  slug: string;
  name: string;
};

export type NewsCategory = NewsCategoryRef & {

  publishedCount: number;
};

export type NewsPost = {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  eventDate?: string;
  category?: NewsCategoryRef;
  content?: string[];
  author?: string;
  image?: string;
};
