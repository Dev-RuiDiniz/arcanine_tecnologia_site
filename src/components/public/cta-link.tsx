"use client";

import Link from "next/link";

import { trackAnalyticsEvent, type AnalyticsEventName } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  analyticsEvent?: AnalyticsEventName;
  analyticsLabel?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export const CtaLink = ({
  href,
  children,
  variant = "primary",
  className,
  analyticsEvent,
  analyticsLabel,
  target,
  rel,
}: CtaLinkProps) => {
  return (
    <Link
      href={href}
      onClick={() => {
        if (!analyticsEvent) {
          return;
        }
        trackAnalyticsEvent({
          name: analyticsEvent,
          category: "engagement",
          label: analyticsLabel,
          metadata: {
            href,
          },
        });
      }}
      target={target}
      rel={rel}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
        variant === "primary" && "bg-zinc-900 text-white hover:bg-zinc-700",
        variant === "secondary" &&
          "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100",
        className,
      )}
    >
      {children}
    </Link>
  );
};
