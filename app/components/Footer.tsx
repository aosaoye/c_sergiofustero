import { ArrowUp, Droplets, Phone, Star } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { SignaturePillButton } from "@/app/components/SignaturePillButton";

/**
 * Minimalist wide footer echoing Next.js starter aesthetics with signature pill buttons.
 */
export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-8 px-6 sm:flex-row sm:items-center sm:px-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-black dark:text-zinc-50">
            <Droplets className="h-4 w-4" aria-hidden="true" />
            <span>{CLIENT_INFO.name}</span>
            <span className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[11px] font-normal text-zinc-600 dark:bg-white/[.08] dark:text-zinc-400">
              {CLIENT_INFO.trade}
            </span>
          </div>

          <p className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <Star
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {CLIENT_INFO.rating} ({CLIENT_INFO.reviewCount} reseñas en Google)
            </span>
            <span>·</span>
            <span className="font-mono">{CLIENT_INFO.scheduleLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <SignaturePillButton
            href={CLIENT_INFO.phoneHref}
            label={CLIENT_INFO.phoneDisplay}
            icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
          />

          <a
            href="#"
            aria-label="Volver arriba"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-solid border-black/[.08] text-foreground transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
