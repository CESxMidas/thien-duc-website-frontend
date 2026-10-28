import { ContentEmphasis } from "./content-emphasis";

type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  bare?: boolean;
  tone?: "default" | "espresso" | "gold";
  titleClassName?: string;
  emphasizeDescription?: boolean;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  bare = false,
  tone = "espresso",
  titleClassName,
  emphasizeDescription = false,
}: PageHeadingProps) {
  const isEspresso = tone === "espresso";
  const accentBorder = tone === "default" ? "" : "page-heading-rule";
  const sectionClassName = bare
    ? `page-heading ${accentBorder} pt-6 sm:pt-8`
    : `page-heading page-container ${accentBorder} py-10 sm:py-14`;

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
        <p className="section-subtitle mt-5 max-w-3xl text-base leading-8 text-charcoal/72 sm:text-lg">
          {emphasizeDescription ? <ContentEmphasis text={description} /> : description}
        </p>
      ) : null}
    </section>
  );
}
