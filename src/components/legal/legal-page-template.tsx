import type { LegalPageContent } from "@/content/legal-pages";

import { PublicLayout } from "@/components/public/public-layout";
import { SectionHeading } from "@/components/public/section-heading";
import { SectionShell } from "@/components/public/section-shell";

type LegalPageTemplateProps = {
  content: LegalPageContent;
};

export const LegalPageTemplate = ({ content }: LegalPageTemplateProps) => {
  return (
    <PublicLayout>
      <SectionShell className="bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-100 pt-16 sm:pt-24">
        <SectionHeading
          eyebrow="Paginas legais"
          title={content.title}
          description={content.description}
        />
      </SectionShell>

      <SectionShell className="bg-zinc-100 pb-16">
        <div className="space-y-5">
          {content.sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{section.heading}</h2>
              <div className="mt-3 space-y-2">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-zinc-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <p className="text-xs text-zinc-500">Ultima atualizacao: {content.updatedAt}</p>
        </div>
      </SectionShell>
    </PublicLayout>
  );
};
