"use client";

import { useMagnetic } from "./useMagnetic";

export default function MagneticButton({ className, children, ...props }) {
  const ref = useMagnetic();

  return (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  );
}
