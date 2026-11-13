"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

/**
 * Full-bleed 50/50 checkerboard editorial section right after the hero,
 * alternating clean typographic cells with architectural project photography.
 */
export function EditorialSplitShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-split-cell]", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
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
      aria-label="Resumen de fontanería y reformas"
      className="w-full border-b border-black/[.06] dark:border-white/[.08]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Row 1 Left */}
        <div
          data-split-cell
          className="flex min-h-[320px] flex-col justify-center bg-background px-6 py-14 sm:min-h-[380px] sm:px-14 lg:px-20"
        >
          <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Excelencia en fontanería
          </span>
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Instalaciones que
            <br />
            <span className="text-sky-600 dark:text-cyan-400">perduran</span>
          </h2>
        </div>

        {/* Row 1 Right */}
        <div
          data-split-cell
          className="flex min-h-[260px] flex-col justify-end border-t border-black/[.06] bg-background px-6 py-14 dark:border-white/[.08] sm:min-h-[380px] sm:px-14 md:border-l md:border-t-0 lg:px-20"
        >
          <p className="max-w-sm text-sm leading-6 text-zinc-700 dark:text-zinc-300 sm:text-base">
            # Resolvemos cada avería e instalación de agua con tu tranquilidad
            como prioridad, a tu medida.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-6 bg-zinc-400 dark:bg-zinc-600" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {CLIENT_INFO.rating} ★ · {CLIENT_INFO.reviewCount} reseñas
            </span>
          </div>
        </div>

        {/* Row 2 Left */}
        <div
          data-split-cell
          className="flex min-h-[340px] flex-col justify-center border-t border-black/[.06] bg-zinc-50/90 px-6 py-14 dark:border-white/[.08] dark:bg-zinc-950 sm:min-h-[440px] sm:px-14 lg:px-20"
        >
          <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Nuestros servicios
          </span>
          <p className="max-w-md text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
            # En {CLIENT_INFO.name} ofrecemos soluciones hidráulicas y de
            reforma adaptadas a cada necesidad, garantizando siempre limpieza y
            excelencia en los acabados.
          </p>
          <div className="mt-7">
            <a
              href="#servicios"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[.1] bg-white px-5 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/[.15] dark:bg-black dark:hover:bg-foreground dark:hover:text-background"
            >
              <span>Ver especialidades</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Row 2 Right: photo with bold overlaid typography */}
        <div
          data-split-cell
          className="relative flex min-h-[380px] items-center overflow-hidden border-t border-black/[.06] dark:border-white/[.08] sm:min-h-[440px]"
        >
          <Image
            src="/images/project-griferia.jpg"
            alt="Instalación limpia de grifería y fregadero en cocina moderna"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/45 to-black/25"
          />
          <div className="relative z-10 px-8 py-12 sm:px-12 lg:px-16">
            <p className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Expertos
              <br />
              <span className="text-cyan-400">transformando</span>
              <br />
              Hogares
            </p>
          </div>
        </div>

        {/* Row 3 Left: full-bleed bathroom photo */}
        <div
          data-split-cell
          className="relative min-h-[360px] overflow-hidden border-t border-black/[.06] dark:border-white/[.08] sm:min-h-[440px]"
        >
          <Image
            src="/images/project-bano.jpg"
            alt="Lavabo suspendido con grifería mural empotrada tras reforma de baño"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Row 3 Right: centered bold title */}
        <div
          data-split-cell
          className="flex min-h-[320px] flex-col items-center justify-center border-t border-black/[.06] bg-background px-6 py-14 text-center dark:border-white/[.08] sm:min-h-[440px] sm:px-14 lg:px-20"
        >
          <h3 className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            Fontanería y Reformas
            <br />
            <span className="text-sky-600 dark:text-cyan-400">
              de Viviendas
            </span>
          </h3>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Fontanería técnica y albañilería coordinada para baños y cocinas
            sin contratiempos.
          </p>
          <div className="mt-6">
            <a
              href="#proyectos"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-xs font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              <span>Explorar galería</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
