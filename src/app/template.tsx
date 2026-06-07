import type { ReactNode } from "react";
import { MotionRoot } from "@/components/motion/motion-root";

export default function Template({ children }: { children: ReactNode }) {
  return <MotionRoot>{children}</MotionRoot>;
}
