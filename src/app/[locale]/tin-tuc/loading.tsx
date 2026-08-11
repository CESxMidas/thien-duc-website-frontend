/**
 * Khung chờ của route `/tin-tuc` (kể cả nhánh tìm kiếm `?q=`).
 *
 * Vì sao cần: form tìm kiếm ở header là form GET thuần → mỗi lượt tìm là một
 * lần tải tài liệu mới. Backend đang chạy Render gói Free (**ngủ sau 15 phút**),
 * nên lần tìm đầu tiên sau một quãng im lặng có thể mất vài giây mà màn hình
 * không đổi gì cả — người dùng tưởng nút không ăn và bấm lại. Khung chờ này
 * được stream ra ngay, trước khi dữ liệu về.
 *
 * KHÔNG CÓ CHỮ, và có chủ đích: `loading.tsx` của Next không nhận `params` nên
 * không biết locale, mà nhúng chuỗi song ngữ cứng trong component thì vi phạm
 * quy ước i18n của dự án. Khung xám thuần hình đã tự nói lên "đang tải", nên
 * toàn khối để `aria-hidden` — trình đọc màn hình sẽ đọc nội dung thật khi nó
 * về, thay vì đọc một mớ ô trống.
 *
 * Không phần trăm giả, không spinner quay vô hạn — chỉ đúng hình dạng của nội
 * dung sắp hiện ra.
 */
export default function NewsLoading() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-site px-4 sm:px-6">
      {/* Khối tiêu đề trang */}
      <div className="py-10 sm:py-14">
        <div className="h-3 w-28 animate-pulse bg-brand/15" />
        <div className="mt-5 h-9 w-2/3 max-w-xl animate-pulse bg-brand/10" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse bg-black/5" />
      </div>

      {/* Lưới thẻ tin — phải khớp ĐÚNG bậc cột của lưới thật
          (`sm:grid-cols-2 lg:grid-cols-3`, xem `tin-tuc/page.tsx`) để nội dung
          về không làm giật bố cục. Lệch một bậc là có CLS ở dải 640–1023px. */}
      <div className="grid gap-5 pb-8 sm:grid-cols-2 sm:pb-14 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="border border-black/10 bg-white">
            <div className="aspect-video animate-pulse bg-surface" />
            <div className="p-5">
              <div className="h-3 w-24 animate-pulse bg-black/5" />
              <div className="mt-3 h-5 w-full animate-pulse bg-black/10" />
              <div className="mt-2 h-5 w-4/5 animate-pulse bg-black/10" />
              <div className="mt-5 h-3 w-20 animate-pulse bg-brand/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
