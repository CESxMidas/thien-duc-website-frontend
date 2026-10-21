type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  bare?: boolean;
  tone?: "default" | "espresso";
  titleClassName?: string;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  bare = false,
  tone = "espresso",
  titleClassName,
}: PageHeadingProps) {
  const isEspresso = tone === "espresso";
  const sectionClassName = bare
    ? isEspresso
      ? "border-t-[0.4rem] border-espresso pt-6 sm:pt-8"
      : ""
    : isEspresso
      ? "page-container border-t-[0.4rem] border-espresso py-10 sm:py-14"
      : "page-container py-10 sm:py-14";

  return (
    <section className={sectionClassName}>
      {eyebrow ? (
        <p
          className={`text-eyebrow mb-4 ${
            isEspresso ? "text-espresso/78" : "text-earth"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={
          titleClassName ??
          `max-w-4xl text-[2.25rem] font-medium leading-[1.05] sm:text-[3.5rem] md:text-[4.25rem] ${
            isEspresso ? "text-espresso" : "text-charcoal"
          }`
        }
      >
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
