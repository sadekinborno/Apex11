"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import Footer from "./components/Footer";
import MagneticLink from "./components/MagneticLink";
import Reveal from "./components/Reveal";

const easeOut = [0.2, 0.8, 0.2, 1];

export default function HomePage() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollFactor = useTransform(scrollY, [0, 260], [0, 1], { clamp: true });

  return (
    <>
      <div className="hero">
        <motion.main
          className="hero-layer"
          style={{ "--s": reduced ? 0 : scrollFactor }}
        >
          <motion.h1
            className="hero-title"
            initial={
              reduced
                ? { clipPath: "inset(0% 0 0 0)" }
                : { clipPath: "inset(100% 0 0 0)" }
            }
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.86, delay: 0.12, ease: easeOut }}
          >
            <span>APEX11</span>
          </motion.h1>

          <div className="hero-left">
            <motion.p
              className="hero-tag"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.98, ease: easeOut }}
            >
              Gear up.<br />Play fearless.
            </motion.p>

            <motion.div
              className="tag-line"
              aria-hidden="true"
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 1.06, ease: easeOut }}
            />

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 1.14, ease: easeOut }}
            >
              <MagneticLink className="cta" href="/shop">
                Shop now <span className="arrow">&rarr;</span>
              </MagneticLink>
            </motion.div>
          </div>

          <div className="hero-boot" aria-hidden="true">
            <Image
              src="/Images/Hero_Apex11.png"
              alt=""
              width={1536}
              height={1024}
              priority
            />
          </div>
        </motion.main>
      </div>

      <main className="page">
        <section className="section" aria-label="New arrivals">
          <div className="container">
            <Reveal className="section-head">
              <h2 className="section-title">New arrivals</h2>
              <p className="section-subtitle">Fresh kits, made to move.</p>
            </Reveal>

            <div className="products-grid" role="list">
              <Reveal as="article" className="product-card" delay={0}>
                <div className="product-media" aria-hidden="true">
                  <Image
                    src="/Images/Products/ArgentinaHomeKit.png"
                    alt=""
                    width={1792}
                    height={2392}
                    loading="lazy"
                  />
                </div>
                <div className="product-meta">
                  <div className="product-kicker">Football • Jersey</div>
                  <h3 className="product-title">Argentina Home Kit</h3>
                  <div className="product-price">$89</div>
                </div>
              </Reveal>

              <Reveal as="article" className="product-card" delay={0.09}>
                <div className="product-media" aria-hidden="true">
                  <Image
                    src="/Images/Products/SpainHomeKit.png"
                    alt=""
                    width={1792}
                    height={2390}
                    loading="lazy"
                  />
                </div>
                <div className="product-meta">
                  <div className="product-kicker">Football • Jersey</div>
                  <h3 className="product-title">Spain Home Kit</h3>
                  <div className="product-price">$89</div>
                </div>
              </Reveal>

              <Reveal as="article" className="product-card" delay={0.18}>
                <div className="product-media" aria-hidden="true">
                  <Image
                    src="/Images/Products/BelgiumHomeKit.png"
                    alt=""
                    width={1952}
                    height={2204}
                    loading="lazy"
                  />
                </div>
                <div className="product-meta">
                  <div className="product-kicker">Football • Jersey</div>
                  <h3 className="product-title">Belgium Home Kit</h3>
                  <div className="product-price">$89</div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section section-tight" aria-label="Store benefits">
          <div className="container">
            <div className="trust" role="list">
              <Reveal as="div" className="trust-item" delay={0}>
                Free returns <span>30 days</span>
              </Reveal>
              <Reveal as="div" className="trust-item" delay={0.08}>
                Fast shipping <span>worldwide</span>
              </Reveal>
              <Reveal as="div" className="trust-item" delay={0.16}>
                Secure checkout <span>encrypted</span>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Categories" id="categories">
          <div className="container">
            <Reveal className="section-head">
              <h2 className="section-title">Categories</h2>
              <p className="section-subtitle">Football-first essentials—matchday to streetwear.</p>
            </Reveal>

            <Reveal className="category-explorer" delay={0.07}>
              <div className="category-list" aria-label="Category list">
                <button type="button" className="category-item is-active" aria-pressed="true">
                  <span className="category-top">
                    <span className="category-num">01</span>
                    <span className="category-name">Kits</span>
                  </span>
                  <span className="category-meta">Home • away • training</span>
                </button>

                <button type="button" className="category-item" aria-pressed="false">
                  <span className="category-top">
                    <span className="category-num">02</span>
                    <span className="category-name">Boots</span>
                  </span>
                  <span className="category-meta">Control • speed • grip</span>
                </button>

                <button type="button" className="category-item" aria-pressed="false">
                  <span className="category-top">
                    <span className="category-num">03</span>
                    <span className="category-name">Shorts</span>
                  </span>
                  <span className="category-meta">Lightweight movement</span>
                </button>

                <button type="button" className="category-item" aria-pressed="false">
                  <span className="category-top">
                    <span className="category-num">04</span>
                    <span className="category-name">Jackets</span>
                  </span>
                  <span className="category-meta">Warmups • rain layers</span>
                </button>

                <button type="button" className="category-item" aria-pressed="false">
                  <span className="category-top">
                    <span className="category-num">05</span>
                    <span className="category-name">Bags</span>
                  </span>
                  <span className="category-meta">Carry-on match kit</span>
                </button>

                <button type="button" className="category-item" aria-pressed="false">
                  <span className="category-top">
                    <span className="category-num">06</span>
                    <span className="category-name">Caps</span>
                  </span>
                  <span className="category-meta">Everyday finish</span>
                </button>
              </div>

              <div className="category-preview" aria-label="Category preview">
                <div className="category-preview-media" aria-hidden="true">
                  <Image
                    src="/Images/Products/ArgentinaHomeKit.png"
                    alt=""
                    width={1792}
                    height={2392}
                    loading="lazy"
                  />
                </div>

                <div className="category-preview-content">
                  <div className="category-preview-kicker">Featured</div>
                  <h3 className="category-preview-title">Match-ready kits.</h3>
                  <p className="category-preview-desc">
                    Clean fits, breathable feel, and details that pop under stadium lights.
                  </p>
                  <a className="category-link" href="#">Shop Kits</a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
