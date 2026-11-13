"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Phone } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";
import { PipeTeardown3D } from "@/app/components/PipeTeardown3D";
import { SignaturePillButton } from "@/app/components/SignaturePillButton";

/**
 * Clean minimalist hero pairing tight display typography, rounded-full
 * signature CTAs, and an automatic 3D monochrome exploded manifold teardown.
 */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-item]", {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-black/[.06] py-12 dark:border-white/[.08] sm:py-16"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left column: display headline, concise copy & rounded-full actions */}
          <div className="flex flex-col items-start gap-7 lg:col-span-5">
            <div data-hero-item className="flex flex-col gap-5">
              <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-0.035em] text-black dark:text-zinc-50 sm:text-6xl lg:text-[3.75rem] xl:text-[4.25rem]">
                Fontanería,
                <br />
                ejecutada
                <br />
                con precisión.
              </h1>

              <p className="max-w-[40ch] text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Reparación de fugas, grifería, termos, desatascos y reforma de
                baño. Trato directo con{" "}
                <span className="font-medium text-foreground">
                  {CLIENT_INFO.name}
                </span>{" "}
                y acabado limpio de albañilería en cada obra.
              </p>
            </div>

            <div
              data-hero-item
              className="flex flex-wrap items-center gap-3 pt-1 text-sm font-medium"
            >
              <SignaturePillButton
                href={CLIENT_INFO.phoneHref}
                label={`Llamar · ${CLIENT_INFO.phoneDisplay}`}
                icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
              />

              <a
                href="#contacto"
                className="inline-flex h-12 items-center justify-center rounded-full border border-solid border-black/[.12] px-6 text-sm font-medium text-foreground transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.18] dark:hover:bg-[#1a1a1a]"
              >
                Pedir presupuesto
              </a>
            </div>
          </div>

          {/* Right column: automatic 3D monochrome mechanical teardown */}
          <div data-hero-item className="lg:col-span-7">
            <PipeTeardown3D />
          </div>
        </div>
      </div>

      {/* Bottom-right minimalist circular scroll button */}
      <a
        href="#servicios"
        aria-label="Explorar servicios"
        className="absolute bottom-6 right-6 z-20 hidden h-10 w-10 items-center justify-center rounded-full border border-black/[.1] bg-white/80 text-foreground backdrop-blur-sm transition-colors hover:bg-foreground hover:text-background dark:border-white/[.16] dark:bg-black/70 sm:inline-flex"
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
