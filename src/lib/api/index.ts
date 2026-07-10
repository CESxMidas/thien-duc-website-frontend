export { API_BASE_URL, ApiError, apiFetch, isApiEnabled } from "@/lib/api/client";
export * from "@/lib/api/types";
export {
  getProjects,
  getProjectBySlug,
  getProjectItem,
} from "@/lib/api/projects";
export { getNewsPosts, getNewsPostBySlug } from "@/lib/api/news";
export { getBanners } from "@/lib/api/banners";
export { getPageBySlug, type StaticPageContent } from "@/lib/api/pages";
export {
  search,
  MIN_SEARCH_LENGTH,
  type SearchResults,
  type SearchScope,
} from "@/lib/api/search";
