type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {eyebrow ? (
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#9b7a34]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59646a]">
          {description}
        </p>
      ) : null}
    </section>
  );
}
