"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "./CartContext";

export default function SiteNav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const downAccum = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY || 0;
        const dy = y - lastY.current;
        lastY.current = y;

        if (dy > 0) downAccum.current += dy;
        else downAccum.current = 0;

        const hideAfter = 240;
        const nearTop = 40;
        const dirThreshold = 6;
        const hideDistance = 90;

        if (y <= nearTop) {
          setHidden(false);
          downAccum.current = 0;
        } else if (dy > dirThreshold && y > hideAfter && downAccum.current > hideDistance) {
          setHidden(true);
        } else if (dy < 0) {
          setHidden(false);
          downAccum.current = 0;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className={`top-nav${hidden ? " is-hidden" : ""}`}>
      <div className="nav-pill">
        <Link className="brand" href="/" aria-label="APEX11 home">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
              <path
                d="M24 12l6 5-2 7h-8l-2-7 6-5zm-8 12l-6 4 4 8 7-2 2-8m14-2l6 4-4 8-7-2-2-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand-text">APEX11</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <Link href="/shop" aria-current={pathname === "/shop" ? "page" : undefined}>
            Shop
          </Link>
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Collections</a>
          <a href="#">About</a>
        </nav>

        <div className="nav-icons">
          <button className="icon-button" aria-label="Search" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M16.5 16.5L21 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="icon-button" aria-label="Account" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 21c1.6-4 5.2-6 8-6s6.4 2 8 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="icon-button bag" aria-label="Cart" type="button" onClick={openCart}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 8h12l-1 12H7L6 8zm2 0a4 4 0 018 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 ? <span className="badge">{count}</span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}
