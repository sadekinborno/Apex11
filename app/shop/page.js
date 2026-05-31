"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Footer from "../components/Footer";
import MagneticButton from "../components/MagneticButton";
import { useCart } from "../components/CartContext";

const easeOut = [0.2, 0.8, 0.2, 1];
const sizes = ["6", "7", "8", "9", "10", "11"];
const colorways = [
  { id: "core-black", label: "Core Black", swatch: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.6))" },
  { id: "chalk", label: "Chalk", swatch: "linear-gradient(135deg, rgba(247,241,232,0.95), rgba(255,255,255,0.55))" },
  { id: "apex-orange", label: "Apex Orange", swatch: "linear-gradient(135deg, rgba(255,125,30,0.95), rgba(180,72,18,0.9))" },
  { id: "smoke", label: "Smoke", swatch: "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(0,0,0,0.6))" },
];

export default function ShopPage() {
  const reduced = useReducedMotion();
  const { addItem, openCart } = useCart();
  const bgImg = "/Images/Shop/S1Main.png";
  const price = "$299";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("8");
  const [selectedColorway, setSelectedColorway] = useState(colorways[0].id);
  const [addState, setAddState] = useState("idle");
  const addTimers = useRef([]);

  useEffect(() => {
    return () => {
      addTimers.current.forEach((timer) => clearTimeout(timer));
      addTimers.current = [];
    };
  }, []);

  const clearAddTimers = () => {
    addTimers.current.forEach((timer) => clearTimeout(timer));
    addTimers.current = [];
  };

  const openDrawer = () => {
    clearAddTimers();
    setAddState("idle");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    clearAddTimers();
    setAddState("idle");
    setDrawerOpen(false);
  };

  const handleAddToBag = () => {
    if (addState !== "idle") {
      return;
    }

    setAddState("loading");

    const successTimer = window.setTimeout(() => {
      addItem({
        key: `predator-elite-fg-${selectedSize}-${selectedColorway}`,
        id: "predator-elite-fg",
        name: "Predator Elite FG",
        price: 299,
        image: bgImg,
        size: selectedSize,
        colorway: colorways.find((c) => c.id === selectedColorway)?.label ?? "Core Black",
      });
      openCart();
      setAddState("success");
    }, 400);

    const closeTimer = window.setTimeout(() => {
      setDrawerOpen(false);
      setAddState("idle");
      clearAddTimers();
    }, 1500);

    addTimers.current = [successTimer, closeTimer];
  };

  return (
    <main>
      <section
        className="shop-hero"
        aria-label="Featured boots"
        style={{ "--shop-bg": `url("${bgImg}")` }}
      >
        <motion.div
          className="shop-bg"
          aria-hidden="true"
          initial={false}
          animate={
            drawerOpen
              ? { scale: 0.98, filter: "blur(6px)" }
              : { scale: 1, filter: "blur(0px)" }
          }
          transition={{ duration: 0.35, ease: easeOut }}
        />

        <div className="container shop-hero-inner">
          <div className="shop-copy">
            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.02 }}
            >
              <div className="shop-kicker">
                <span className="shop-kicker-line" aria-hidden="true" />
                <span>Featured</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.08 }}
            >
              <h1 className="shop-title">
                PREDATOR<br />ELITE FG
              </h1>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.14 }}
            >
              <p className="shop-subtitle">
                Engineered for control.<br />Built to win.
              </p>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.18 }}
            >
              <p className="shop-desc">
                Precision engineered for ultimate
                touch and explosive performance.
              </p>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.22, ease: easeOut }}
            >
              <div className="shop-buy-row" aria-label="Purchase options">
                <MagneticButton
                  className="shop-cta"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={drawerOpen}
                  onClick={openDrawer}
                >
                  Shop now <span className="arrow" aria-hidden="true">&rarr;</span>
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.28, ease: easeOut }}
            >
              <div className="shop-thumbs" aria-label="Colorway thumbnails">
                {colorways.map((c, idx) => (
                  <button
                    key={c.id}
                    className={idx === 0 ? "shop-thumb is-active" : "shop-thumb"}
                    type="button"
                    aria-pressed={idx === 0}
                    aria-label={c.label}
                    style={{ "--swatch": c.swatch }}
                  >
                    <span className="shop-swatch" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {drawerOpen ? (
            <>
              <motion.div
                className="shop-drawer-scrim"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: easeOut }}
                onClick={closeDrawer}
              />

              <motion.div
                className="shop-drawer"
                role="dialog"
                aria-label="Choose size and color"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.45, ease: easeOut }}
              >
                <div className="container shop-drawer-inner">
                  <div className="shop-drawer-row">
                    <div className="shop-drawer-price" aria-label="Price">
                      {price}
                    </div>

                    <div className="shop-drawer-sizes-wrap">
                      <div className="shop-drawer-label">SELECT SIZE (UK)</div>

                      <div className="shop-drawer-sizes" role="listbox" aria-label="Select size">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={selectedSize === s ? "shop-size is-active" : "shop-size"}
                            role="option"
                            aria-selected={selectedSize === s}
                            onClick={() => setSelectedSize(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="shop-drawer-colors" aria-label="Colorways">
                      {colorways.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className={selectedColorway === c.id ? "shop-thumb is-active" : "shop-thumb"}
                          aria-pressed={selectedColorway === c.id}
                          aria-label={c.label}
                          style={{ "--swatch": c.swatch }}
                          onClick={() => setSelectedColorway(c.id)}
                        >
                          <span className="shop-swatch" aria-hidden="true" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={addState === "idle" ? "shop-add-to-bag" : `shop-add-to-bag is-${addState}`}
                      onClick={handleAddToBag}
                      disabled={addState !== "idle"}
                      aria-live="polite"
                    >
                      <span className="shop-add-copy shop-add-copy-idle" aria-hidden="true">
                        ADD TO BAG
                      </span>

                      <span className="shop-add-copy shop-add-copy-loading" aria-hidden="true">
                        <span className="shop-add-spinner" />
                      </span>

                      <span className="shop-add-copy shop-add-copy-success" aria-hidden="true">
                        <span className="shop-add-check">✓</span>
                        <span>ADDED</span>
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </section>

      <Footer />
    </main>
  );
}
