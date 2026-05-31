"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "./CartContext";

const easeOut = [0.2, 0.8, 0.2, 1];

function formatMoney(value) {
  return `$${value.toFixed(0)}`;
}

export default function CartSheet() {
  const { items, isOpen, closeCart, subtotal, shipping, total, removeItem, updateQuantity } = useCart();
  const [draggingItemKey, setDraggingItemKey] = useState(null);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            className="cart-scrim"
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: easeOut }}
            onClick={closeCart}
          />

          <motion.aside
            className="cart-sheet"
            aria-label="Cart drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: easeOut }}
          >
            <div className="cart-sheet-head">
              <div>
                <div className="cart-kicker">Bag</div>
                <h2 className="cart-title">Your items</h2>
              </div>
              <button className="cart-close" type="button" onClick={closeCart} aria-label="Close cart drawer">
                ×
              </button>
            </div>

            <div className="cart-sheet-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p>No items in your bag yet.</p>
                  <span>Products you add will appear here.</span>
                </div>
              ) : (
                <div className="cart-list">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className={draggingItemKey === item.key ? "cart-row-shell is-dragging" : "cart-row-shell"}
                    >
                      <div className="cart-row-reveal" aria-hidden="true">
                        <button
                          type="button"
                          className="cart-row-remove"
                          onClick={() => removeItem(item.key)}
                        >
                          Remove
                        </button>
                      </div>

                      <motion.div
                        className="cart-row"
                        drag="x"
                        dragConstraints={{ left: -120, right: 0 }}
                        dragElastic={0.08}
                        whileTap={{ scale: 0.995 }}
                        onDragStart={() => setDraggingItemKey(item.key)}
                        onDragEnd={(_, info) => {
                          setDraggingItemKey(null);

                          if (info.offset.x < -84) {
                            removeItem(item.key);
                          }
                        }}
                        animate={draggingItemKey === item.key ? { x: -18 } : { x: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      >
                        <div className="cart-thumb-wrap">
                          <img className="cart-thumb" src={item.image} alt="" />
                        </div>

                        <div className="cart-meta">
                          <div className="cart-name">{item.name}</div>
                          <div className="cart-variant">
                            UK {item.size} · {item.colorway}
                          </div>
                          <button type="button" className="cart-remove-link" onClick={() => removeItem(item.key)}>
                            Remove
                          </button>
                        </div>

                        <div className="cart-right">
                          <div className="cart-quantity" aria-label={`Quantity ${item.quantity}`}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-price">{formatMoney(item.price * item.quantity)}</div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="cart-sheet-footer">
              <div className="cart-breakdown">
                <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
                <div><span>Shipping</span><strong>{shipping ? formatMoney(shipping) : "Free"}</strong></div>
                <div className="cart-total"><span>TOTAL</span><strong>{formatMoney(total)}</strong></div>
              </div>

              <button className="cart-cta" type="button">
                Proceed to checkout
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}