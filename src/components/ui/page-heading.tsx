type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /**
   * Bỏ container riêng (`max-w-site` + padding) để tiêu đề nằm gọn trong một
   * cột do trang bên ngoài dựng sẵn — dùng cho bố cục hai cột có rail bên phải.
   *
   * Không có tuỳ chọn này thì tiêu đề buộc phải đứng trên lưới, và rail bắt đầu
   * thấp hơn nó một đoạn → chừa một mảng trống lớn ở góc trên bên phải.
   */
  bare?: boolean;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  bare = false,
}: PageHeadingProps) {
  return (
    <section
      className={bare ? "" : "mx-auto max-w-site px-4 py-6 sm:px-6 sm:py-8"}
    >
      {eyebrow ? (
        <p className="text-eyebrow mb-3 text-brand sm:mb-4">{eyebrow}</p>
      ) : null}
      <h1 className="max-w-4xl text-2xl font-semibold leading-[1.15] sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {description ? (
        // Cố ý KHÔNG `text-justified`: đây là copy dẫn dắt 1–3 dòng dưới tiêu
        // đề, đúng loại mà chính comment của `.text-justified` trong
        // `globals.css` đã loại trừ. Đoạn hai dòng khi justify chỉ có DÒNG ĐẦU
        // bị kéo giãn, nhìn lệch chứ không "cân". Canh trái, giới hạn bề rộng.
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </section>
  );
}
