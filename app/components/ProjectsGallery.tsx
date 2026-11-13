"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { PROJECTS, type ProjectItem } from "@/app/data/plumbing-data";
import { assetPath } from "@/app/lib/assets";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

/**
 * Full-bleed 50/50 split project gallery matching the editorial checkerboard
 * intro and alternating full-bleed photography layout, with lightbox viewer.
 */
export function ProjectsGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const visibleProjects: ProjectItem[] = PROJECTS;

  const activeLightboxProject =
    lightboxIndex !== null ? visibleProjects[lightboxIndex] ?? null : null;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-gallery-intro]", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-gallery-cell]", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 84%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    if (!prefersReducedMotion() && lightboxRef.current) {
      const gsap = getGsap();
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleProjects.length
        );
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleProjects.length) % visibleProjects.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, visibleProjects.length]);

  function handlePrev() {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + visibleProjects.length) % visibleProjects.length
    );
  }

  function handleNext() {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % visibleProjects.length
    );
  }

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="w-full border-b border-black/[.06] dark:border-white/[.08]"
    >
      {/* 50/50 editorial header row matching the top split section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div
          data-gallery-intro
          className="flex min-h-[320px] flex-col justify-center bg-background px-6 py-14 sm:min-h-[380px] sm:px-14 lg:px-20"
        >
          <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            02 · Galería de proyectos
          </span>
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Instalaciones que
            <br />
            <span className="text-sky-600 dark:text-cyan-400">
              lucen en obra
            </span>
          </h2>
        </div>

        <div
          data-gallery-intro
          className="flex min-h-[260px] flex-col justify-end border-t border-black/[.06] bg-background px-6 py-14 dark:border-white/[.08] sm:min-h-[380px] sm:px-14 md:border-l md:border-t-0 lg:px-20"
        >
          <p className="max-w-sm text-sm leading-6 text-zinc-700 dark:text-zinc-300 sm:text-base">
            # Selección de trabajos en baños, cocinas y acometidas técnicas con
            remate limpio de albañilería.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-6 bg-zinc-400 dark:bg-zinc-600" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              {visibleProjects.length} proyectos · Acabados reales
            </span>
          </div>
        </div>
      </div>

      {/* Edge-to-edge 50/50 split checkerboard project grid */}
      <div ref={gridRef} className="w-full">
        {visibleProjects.map((project, index) => {
          const isOddRow = index % 2 === 1;

          const textCell = isOddRow ? (
            <div
              data-gallery-cell
              className="flex min-h-[340px] flex-col items-center justify-center border-t border-black/[.06] bg-background px-6 py-14 text-center dark:border-white/[.08] sm:min-h-[440px] sm:px-14 lg:min-h-[480px] lg:px-20"
            >
              <span className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {project.code} · {project.locationLabel}
              </span>

              <h3 className="text-3xl font-semibold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
                {project.titleLead}
                <br />
                <span className="text-sky-600 dark:text-cyan-400">
                  {project.titleAccent}
                </span>
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {project.summary}
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-xs font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  <span>Ampliar trabajo</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div
              data-gallery-cell
              className="flex min-h-[340px] flex-col justify-center border-t border-black/[.06] bg-[#f4f5fc] px-6 py-14 dark:border-white/[.08] dark:bg-zinc-950 sm:min-h-[440px] sm:px-14 lg:min-h-[480px] lg:px-20"
            >
              <span className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {project.code} · {project.locationLabel}
              </span>

              <p className="max-w-md text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
                # {project.summary}
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-black/[.1] bg-white px-5 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/[.15] dark:bg-black dark:hover:bg-foreground dark:hover:text-background"
                >
                  <span>Ver detalle</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );

          const photoCell = (
            <div
              data-gallery-cell
              className="group relative min-h-[360px] overflow-hidden border-t border-black/[.06] dark:border-white/[.08] sm:min-h-[440px] lg:min-h-[480px]"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Ampliar imagen: ${project.title}`}
                className="relative block h-full min-h-[360px] w-full cursor-zoom-in text-left sm:min-h-[440px] lg:min-h-[480px]"
              >
                <Image
                  src={assetPath(project.imageSrc)}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {!isOddRow ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/35 to-black/15 transition-opacity duration-500 group-hover:opacity-90"
                    />
                    <div className="relative z-10 flex h-full min-h-[360px] flex-col justify-center px-8 py-12 sm:min-h-[440px] sm:px-12 lg:min-h-[480px] lg:px-16">
                      <h3 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                        {project.titleLead}
                        <br />
                        <span className="text-cyan-400">
                          {project.titleAccent}
                        </span>
                      </h3>
                    </div>
                  </>
                ) : (
                  <span className="absolute bottom-5 right-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </button>
            </div>
          );

          return (
            <article
              key={project.id}
              className="grid grid-cols-1 md:grid-cols-2"
            >
              {isOddRow ? (
                <>
                  <div className="order-2 md:order-1">{photoCell}</div>
                  <div className="order-1 md:order-2">{textCell}</div>
                </>
              ) : (
                <>
                  {textCell}
                  {photoCell}
                </>
              )}
            </article>
          );
        })}
      </div>

      {/* Minimalist Lightbox Modal */}
      {activeLightboxProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxProject.title}
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        >
          <div
            ref={lightboxRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-black/[.12] bg-white shadow-2xl dark:border-white/[.18] dark:bg-black"
          >
            <div className="flex items-center justify-between border-b border-black/[.08] px-5 py-4 dark:border-white/[.145]">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-black/[.06] px-2.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300">
                  {activeLightboxProject.code}
                </span>
                <span className="text-sm font-medium text-black dark:text-zinc-50">
                  {activeLightboxProject.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Cerrar vista ampliada"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={assetPath(activeLightboxProject.imageSrc)}
                alt={activeLightboxProject.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center">
              <p className="max-w-xl text-xs leading-5 text-zinc-600 dark:text-zinc-400 sm:text-sm">
                {activeLightboxProject.summary}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Proyecto anterior"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente proyecto"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
