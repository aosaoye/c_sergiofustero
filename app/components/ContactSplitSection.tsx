"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Clock, MessageCircle, Phone, Star } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { assetPath } from "@/app/lib/assets";
import { getGsap, prefersReducedMotion } from "@/app/lib/gsap-setup";
import { SignaturePillButton } from "@/app/components/SignaturePillButton";

/**
 * 50/50 split brand & direct contact section with verified phone, schedule,
 * Google rating, and full-rounded action pills.
 */
export function ContactSplitSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = getGsap();

    const ctx = gsap.context(() => {
      gsap.from("[data-contact-panel]", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const whatsappHref = `https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent(
    "Hola Sergio, te escribo desde tu web para consultar un trabajo de fontanería."
  )}`;

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="w-full border-b border-black/[.06] dark:border-white/[.08]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left 50%: Soft architectural brand presentation panel */}
        <div
          data-contact-panel
          className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden border-b border-black/[.06] px-8 py-16 text-center dark:border-white/[.08] md:min-h-[440px] md:border-b-0 md:border-r"
        >
          <Image
            src={assetPath("/images/project-colector.jpg")}
            alt="Instalación técnica de fontanería con colector y tuberías de cobre"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-20 dark:opacity-15"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background/90"
          />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-3xl font-light tracking-tight text-zinc-600 dark:text-zinc-300 sm:text-4xl">
              Fontanería
            </span>
            <span className="text-4xl font-semibold uppercase tracking-[0.06em] text-sky-600 dark:text-cyan-400 sm:text-5xl">
              {CLIENT_INFO.name}
            </span>
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Instalaciones · Fugas · Reformas
            </span>
          </div>
        </div>

        {/* Right 50%: Minimal direct contact info */}
        <div
          data-contact-panel
          className="flex flex-col justify-center bg-background px-6 py-14 sm:px-14 lg:px-20"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h2>

          <div className="mt-8 flex flex-col gap-6">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                Teléfono
              </span>
              <a
                href={CLIENT_INFO.phoneHref}
                className="mt-1 block font-mono text-xl font-medium text-foreground transition-colors hover:text-sky-600 dark:hover:text-cyan-400"
              >
                +34 {CLIENT_INFO.phoneDisplay}
              </a>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                Horario de atención
              </span>
              <p className="mt-1 flex items-center gap-2 text-base text-foreground">
                <Clock className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                <span>{CLIENT_INFO.scheduleLabel}</span>
              </p>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                Reputación en Google
              </span>
              <p className="mt-1 flex items-center gap-2 text-base text-foreground">
                <Star
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span>
                  {CLIENT_INFO.rating} · {CLIENT_INFO.reviewCount} reseñas
                  verificadas
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <SignaturePillButton
              href={CLIENT_INFO.phoneHref}
              label="Llamar ahora"
              icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
            />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-solid border-black/[.12] px-6 text-sm font-medium text-foreground transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.18] dark:hover:bg-[#1a1a1a]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
