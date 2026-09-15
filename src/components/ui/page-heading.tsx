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
      className={bare ? "" : "mx-auto max-w-site px-4 py-10 sm:px-6 sm:py-14"}
    >
      {eyebrow ? (
        <p className="text-eyebrow mb-4 text-earth">{eyebrow}</p>
      ) : null}
      <h1 className="max-w-4xl text-[2.5rem] font-medium leading-[1.05] text-charcoal sm:text-[3.5rem] md:text-[4.25rem]">
        {title}
      </h1>
      {description ? (
        // Cố ý KHÔNG `text-justified`: đây là copy dẫn dắt 1–3 dòng dưới tiêu
        // đề, đúng loại mà chính comment của `.text-justified` trong
        // `globals.css` đã loại trừ. Đoạn hai dòng khi justify chỉ có DÒNG ĐẦU
        // bị kéo giãn, nhìn lệch chứ không "cân". Canh trái, giới hạn bề rộng.
        <p className="mt-5 max-w-3xl text-base leading-8 text-charcoal/72 sm:text-lg">
          {description}
        </p>
      ) : null}
    </section>
  );
}
