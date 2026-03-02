import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export const SectionShell = ({ id, className, children }: SectionShellProps) => {
  return (
    <section id={id} className={cn("px-4 py-12 sm:px-6 lg:px-10", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
};
