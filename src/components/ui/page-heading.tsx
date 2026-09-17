type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
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
       
        <p className="mt-5 max-w-3xl text-base leading-8 text-charcoal/72 sm:text-lg">
          {description}
        </p>
      ) : null}
    </section>
  );
}
