
export default function NewsLoading() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-site px-4 sm:px-6">
      <div className="py-10 sm:py-14">
        <div className="h-3 w-28 animate-pulse bg-brand/15" />
        <div className="mt-5 h-9 w-2/3 max-w-xl animate-pulse bg-brand/10" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse bg-black/5" />
      </div>
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
