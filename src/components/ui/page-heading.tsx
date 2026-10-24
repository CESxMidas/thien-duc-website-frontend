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
  const accentBorder = tone === "espresso" ? "border-espresso" : "border-gold";
  const sectionClassName = bare
    ? isEspresso
      ? `border-t-[0.4rem] ${accentBorder} pt-6 sm:pt-8`
      : tone === "gold"
        ? `border-t-[0.4rem] ${accentBorder} pt-6 sm:pt-8`
      : ""
    : isEspresso
      ? `page-container border-t-[0.4rem] ${accentBorder} py-10 sm:py-14`
      : tone === "gold"
        ? `page-container border-t-[0.4rem] ${accentBorder} py-10 sm:py-14`
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
       
        <p className="content-paragraph mt-5 max-w-3xl text-base leading-8 text-charcoal/72 sm:text-lg">
          {emphasizeDescription ? <ContentEmphasis text={description} /> : description}
        </p>
      ) : null}
    </section>
  );
}
