"use client";

import Link from "next/link";

import { useMagnetic } from "./useMagnetic";

export default function MagneticLink({ className, href, children, ...props }) {
  const ref = useMagnetic();

  return (
    <Link ref={ref} className={className} href={href} {...props}>
      {children}
    </Link>
  );
}
