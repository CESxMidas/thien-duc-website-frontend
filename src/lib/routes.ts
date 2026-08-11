export const routes = {
  home: "/",
  about: "/gioi-thieu",
  projects: "/du-an",
  news: "/tin-tuc",
  /** Trang đích chuyên mục tin — path chứ không phải query param, để mỗi
   *  chuyên mục là một URL ổn định, index được và liên kết nội bộ được. */
  newsCategory: "/tin-tuc/danh-muc",
  members: "/cong-ty-thanh-vien",
  careers: "/tuyen-dung",
  contact: "/lien-he",
  /** Tìm kiếm hợp nhất (dự án + tin tức). Trang riêng chứ không nhờ trang tin:
   *  chính sách `noindex` gom về một chỗ, còn `/tin-tuc` giữ đúng vai trò danh
   *  mục có phân trang và lọc chuyên mục. */
  search: "/tim-kiem",
};
