import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) => {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-zinc-600">{description}</p> : null}
    </div>
  );
};
