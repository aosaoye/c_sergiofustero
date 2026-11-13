"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/app/data/plumbing-data";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";

/**
 * Minimalist FAQ accordion with full-rounded toggles and GSAP scroll reveal.
 */
export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-faq-item]", {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 84%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!openId || prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-faq-answer]",
        { y: -4, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [openId]);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="border-b border-black/[.08] py-16 dark:border-white/[.145] sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            03 · Preguntas frecuentes
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Respuestas claras antes de llamar
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-black/[.08] border-y border-black/[.08] dark:divide-white/[.145] dark:border-white/[.145]">
        {FAQS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} data-faq-item className="py-4 sm:py-5">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium text-black dark:text-zinc-50 sm:text-base">
                  {item.question}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/[.08] transition-colors dark:border-white/[.145] ${
                    isOpen
                      ? "bg-foreground text-background"
                      : "bg-transparent text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen && (
                <p
                  data-faq-answer
                  className="mt-3 max-w-2xl pr-12 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                >
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
