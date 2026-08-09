type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /**
   * `"stacked"` (mặc định) — eyebrow / h1 / mô tả xếp dọc, mỗi phần tự giới hạn
   * bằng `max-w-*`. Đây là hành vi cũ và là hành vi của **11 trang còn lại**.
   *
   * `"split"` — từ `lg` trở lên tách hai cột: eyebrow + h1 bên trái, mô tả bên
   * phải. Dùng khi khoảng trống bên phải (do `max-w-3xl` của mô tả chỉ chiếm
   * 768/1072px, dư ~28%) đọc ra như một khối nội dung bị thiếu — rõ nhất ở
   * `/gioi-thieu`, nơi ngay bên dưới là section có ảnh lớn ở đúng dải bên phải
   * đó, khiến vùng trống trông như ảnh tải lỗi.
   */
  layout?: "stacked" | "split";
};

export function PageHeading({
  eyebrow,
  title,
  description,
  layout = "stacked",
}: PageHeadingProps) {
  // Nhánh mặc định trả về CHÍNH XÁC markup cũ (không thêm wrapper, không đổi
  // class) — `PageHeading` phục vụ 12 trang nên `split` phải là opt-in tuyệt đối.
  if (layout === "stacked") {
    return (
      <section className="mx-auto max-w-site px-4 py-6 sm:px-6 sm:py-8">
        {eyebrow ? (
          <p className="text-eyebrow mb-3 text-brand sm:mb-4">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-4xl text-3xl font-semibold leading-[1.12] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate sm:text-lg sm:leading-8">
            {description}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-site px-4 py-6 sm:px-6 sm:py-8">
      {/* Hai cột chỉ bật từ `lg`: ở 768–1023px cột phải sẽ chỉ còn ~264px
          (~29 ký tự/dòng), tức chữa desktop bằng cách phá tablet. Dưới `lg`
          giữ nguyên thứ tự xếp dọc như nhánh stacked; `gap-4` khớp đúng `mt-4`
          cũ nên không có thay đổi khoảng cách ở mobile. */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div>
          {eyebrow ? (
            <p className="text-eyebrow mb-3 text-brand sm:mb-4">{eyebrow}</p>
          ) : null}
          {/* Bỏ `max-w-4xl`: ở nhánh này bề rộng do cột grid kiểm soát. */}
          <h1 className="text-3xl font-semibold leading-[1.12] sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {/* Gạch vàng thuần trang trí — cùng ngôn ngữ với HomeIntroStrip. */}
          <div aria-hidden="true" className="mt-5 h-1 w-16 bg-gold" />
        </div>

        {description ? (
          // `max-w-[72ch]` chỉ là chốt chặn: ở bề ngang container hiện tại cột
          // này vốn đã ~68ch nên nó không cắt gì, chỉ có tác dụng nếu sau này
          // `--container-site` được nới rộng. Cố ý KHÔNG dùng `max-w-3xl` — đó
          // chính là class tạo ra vùng trống bên phải.
          <p className="max-w-[72ch] text-base leading-7 text-slate sm:text-lg sm:leading-8">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
