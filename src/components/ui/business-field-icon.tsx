import type { LucideIcon } from "lucide-react";
import {
  Building2,
  HardHat,
  PencilRuler,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";

export const businessFieldIcons: LucideIcon[] = [
  Building2,
  HardHat,
  PencilRuler,
  Warehouse,
  Truck,
  Ship,
];

export function BusinessFieldIcon({
  index,
  className = "size-5",
}: {
  index: number;
  className?: string;
}) {
  const Icon = businessFieldIcons[index] ?? Building2;

  return <Icon className={className} aria-hidden="true" />;
}
