import {
  Droplets,
  Flame,
  Gauge,
  Hammer,
  ShowerHead,
  Wrench,
  type LucideProps,
} from "lucide-react";
import type { ServiceIconKey } from "@/app/data/plumbing-data";

const ICON_MAP: Record<ServiceIconKey, React.ComponentType<LucideProps>> = {
  droplets: Droplets,
  wrench: Wrench,
  shower: ShowerHead,
  flame: Flame,
  gauge: Gauge,
  hammer: Hammer,
};

interface ServiceIconProps extends LucideProps {
  name: ServiceIconKey;
}

/**
 * Renders the matching Lucide icon for a plumbing service key.
 */
export function ServiceIcon({ name, ...props }: ServiceIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon aria-hidden="true" {...props} />;
}
