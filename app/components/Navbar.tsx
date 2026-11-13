"use client";

import { useState } from "react";
import { Droplets, Menu, Moon, Sun, X } from "lucide-react";
import { CLIENT_INFO } from "@/app/data/plumbing-data";
import { SignaturePillButton } from "@/app/components/SignaturePillButton";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#faq", label: "Dudas" },
  { href: "#contacto", label: "Contacto" },
];

/**
 * Minimalist studio header matching the reference video proportions,
 * theme switcher (dark/light), and signature pill CTA.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleToggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("sf-theme", isDark ? "dark" : "light");
    } catch {
      // Storage may be unavailable in restricted contexts.
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[.06] bg-white/80 backdrop-blur-md dark:border-white/[.08] dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <a
          href="#"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/[.1] bg-zinc-50 transition-colors group-hover:bg-foreground group-hover:text-background dark:border-white/[.14] dark:bg-white/[.06]">
            <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="uppercase tracking-[0.04em]">{CLIENT_INFO.name}</span>
        </a>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Cambiar tema claro u oscuro"
            title="Cambiar tema (claro / oscuro)"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] text-foreground transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
            <Moon className="block h-4 w-4 dark:hidden" aria-hidden="true" />
          </button>

          <a
            href={CLIENT_INFO.phoneHref}
            className="hidden rounded-full px-3 py-2 font-mono text-xs font-medium text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-300 dark:hover:text-white lg:inline-flex"
          >
            {CLIENT_INFO.phoneDisplay}
          </a>

          <SignaturePillButton
            href={CLIENT_INFO.phoneHref}
            label="Llamar"
            size="sm"
          />

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navegación móvil"
          className="border-t border-black/[.08] bg-white px-6 py-4 dark:border-white/[.145] dark:bg-black md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 items-center rounded-full border border-black/[.08] px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-[#1a1a1a]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
