"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { assetPath } from "@/app/lib/assets";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

/**
 * Full-bleed architectural photo CTA banner with centered tracked headline
 * and full-rounded pill action trigger.
 */
export function ProjectBannerCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-banner-item]", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Comienza tu proyecto"
      className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden border-b border-black/[.06] py-20 dark:border-white/[.08] sm:min-h-[500px]"
    >
      <Image
        src={assetPath("/images/project-ducha.jpg")}
        alt="Reforma minimalista de ducha y baño completada"
        fill
        sizes="100vw"
        className="scale-105 object-cover blur-md"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2
          data-banner-item
          className="text-4xl font-semibold uppercase leading-[1.08] tracking-[0.12em] text-white sm:text-5xl lg:text-6xl"
        >
          ¿Empezamos
          <br />
          tu
          <br />
          proyecto
          <br />
          hoy?
        </h2>

        <div
          data-banner-item
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contacto"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/80 bg-white/10 px-8 text-xs font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            ¡Contáctanos!
          </a>

          <a
            href={CLIENT_INFO.phoneHref}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-medium uppercase tracking-[0.12em] text-black transition-colors hover:bg-zinc-200"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{CLIENT_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
