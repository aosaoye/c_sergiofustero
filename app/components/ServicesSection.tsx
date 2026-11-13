"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SERVICE_CATEGORIES,
  SERVICES,
  type ServiceCategory,
} from "@/app/data/plumbing-data";
import { ServiceIcon } from "@/app/components/ServiceIcon";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

/**
 * Filterable plumbing services catalog with GSAP scroll & filter animations.
 */
export function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("todos");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);

  const visibleServices =
    activeCategory === "todos"
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-service-header]", {
        y: 16,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-service-card]", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
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
    if (!hasInteractedRef.current || prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-service-card]",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }, gridRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [activeCategory]);

  function handleCategoryChange(category: ServiceCategory) {
    hasInteractedRef.current = true;
    setActiveCategory(category);
  }

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="border-b border-black/[.08] py-16 dark:border-white/[.145] sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div
          data-service-header
          className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              01 · Especialidades
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              Soluciones de fontanería para vivienda y reforma
            </h2>
            <p className="max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              Desde una fuga urgente hasta el cambio completo de bañera o
              renovación de tuberías, con materiales duraderos y remate limpio.
            </p>
          </div>

          {/* Filter pills - full rounded */}
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar servicios"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-medium transition-colors sm:text-sm ${
                    isActive
                      ? "bg-foreground text-background"
                      : "border border-solid border-black/[.08] text-zinc-600 hover:border-transparent hover:bg-black/[.04] hover:text-foreground dark:border-white/[.145] dark:text-zinc-400 dark:hover:bg-[#1a1a1a] dark:hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleServices.map((service) => (
            <article
              key={service.id}
              data-service-card
              className="group flex flex-col justify-between rounded-2xl border border-black/[.08] bg-white p-6 transition-colors hover:border-black/25 dark:border-white/[.145] dark:bg-black dark:hover:border-white/30"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] bg-zinc-50 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background dark:border-white/[.145] dark:bg-white/[.04]">
                      <ServiceIcon name={service.icon} className="h-4 w-4" />
                    </span>
                    <span className="rounded-full bg-black/[.06] px-2.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300">
                      {service.categoryLabel}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-zinc-400">
                    /{service.code}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
                  {service.title}
                </h3>

                <p className="mb-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {service.summary}
                </p>

                <ul className="mb-6 flex flex-col gap-2">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-xs leading-5 text-zinc-700 dark:text-zinc-300 sm:text-sm"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500 dark:text-zinc-400"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between border-t border-black/[.08] pt-4 dark:border-white/[.145]">
                <span className="font-mono text-xs text-zinc-500">
                  {service.scope}
                </span>

                <a
                  href="#contacto"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-solid border-black/[.08] px-4 text-xs font-medium text-foreground transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  <span>Solicitar</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
