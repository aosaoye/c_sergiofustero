import { ArrowUpRight } from "lucide-react";

interface SignaturePillButtonProps {
  href: string;
  label: string;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

/**
 * Full-rounded primary pill CTA with embedded circular badge and liquid
 * iridescent hover shimmer inspired by modern studio interactions.
 */
export function SignaturePillButton({
  href,
  label,
  size = "md",
  icon,
}: SignaturePillButtonProps) {
  const outerSize =
    size === "sm" ? "h-10 pl-4 pr-1.5 text-xs sm:text-sm" : "h-12 pl-6 pr-2 text-sm";
  const circleSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconNode = icon ?? (
    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
  );

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 rounded-full bg-foreground font-medium text-background transition-all duration-300 hover:bg-[#383838] dark:hover:bg-[#e5e5e5] ${outerSize}`}
    >
      <span>{label}</span>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-foreground transition-transform duration-300 group-hover:scale-105 ${circleSize}`}
      >
        {/* Iridescent liquid sheen on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#22d3ee_0%,#0ea5e9_42%,#6366f1_78%,#020617_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-90"
        />
        <span className="relative z-10 flex items-center justify-center transition-all duration-300 group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:text-white">
          {iconNode}
        </span>
        <span
          aria-hidden="true"
          className="absolute z-10 flex -translate-x-5 translate-y-5 items-center justify-center text-white transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"
        >
          {iconNode}
        </span>
      </span>
    </a>
  );
}
