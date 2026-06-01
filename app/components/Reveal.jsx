"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.2, 0.8, 0.2, 1];

export default function Reveal({ as = "div", className, delay = 0, children, ...props }) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 14, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: easeOut, delay }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
