type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
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
