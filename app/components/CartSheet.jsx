"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "./CartContext";

const easeOut = [0.2, 0.8, 0.2, 1];
const checkoutIdleFrame = "/Animation/checkout_start_end.png";
const checkoutVideo = "/Animation/checkoutAnim.mp4";

function formatMoney(value) {
  return `$${value.toFixed(0)}`;
}

export default function CartSheet() {
  const { items, isOpen, closeCart, subtotal, shipping, total, removeItem, updateQuantity, clearCart } = useCart();
  const [draggingItemKey, setDraggingItemKey] = useState(null);
  const [checkoutState, setCheckoutState] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    address: "",
    city: "",
    zip: "",
    email: "",
    phone: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    method: "mobile", // 'mobile' | 'cod'
    mobileProvider: "",
    mobileNumber: "",
    mobileTxn: "",
  });
  const checkoutItem = checkoutState?.mode === "item" ? items.find((item) => item.key === checkoutState.itemKey) ?? null : null;
  const isBulkCheckout = checkoutState?.mode === "bulk";

  useEffect(() => {
    if (!isOpen) {
      setCheckoutState(null);
      setCheckoutStep("cart");
      setShippingForm({ fullName: "", address: "", city: "", zip: "", email: "", phone: "" });
      return;
    }

    if (checkoutState?.mode === "item" && !items.some((item) => item.key === checkoutState.itemKey)) {
      setCheckoutState(null);
    }
  }, [checkoutState, isOpen, items]);

  const handleItemCheckout = (item) => {
    if (checkoutState) {
      return;
    }

    setCheckoutState({ mode: "item", itemKey: item.key });
  };

  const goToShipping = () => {
    if (items.length === 0 || checkoutState) {
      return;
    }

    setCheckoutStep("shipping");
  };

  const goBackToCart = () => {
    setCheckoutStep("cart");
  };

  const goToPayment = () => {
    setCheckoutStep("payment");
  };

  const handleShippingChange = (field) => (event) => {
    const value = event.target.value;

    setShippingForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const confirmDispatch = () => {
    if (checkoutState || items.length === 0) {
      return;
    }

    setCheckoutState({ mode: "bulk" });
  };

  const finishCheckout = () => {
    if (checkoutState?.mode === "bulk") {
      clearCart();
    } else if (checkoutState?.mode === "item") {
      removeItem(checkoutState.itemKey);
    }

    setCheckoutState(null);
    setCheckoutStep("cart");
    setShippingForm({ fullName: "", address: "", city: "", zip: "", email: "", phone: "" });
  };

  const animationKicker = checkoutState
    ? isBulkCheckout
      ? "Dispatch locked"
      : "Loading truck"
    : checkoutStep === "shipping"
      ? "Routing..."
      : checkoutStep === "payment"
        ? "Payment handshake"
        : "Ready for dispatch";

  const animationTitle = checkoutState
    ? "Loading Bay 04"
    : checkoutStep === "shipping"
      ? "Routing..."
      : checkoutStep === "payment"
        ? "Confirm Channel"
        : "Dispatch Status";

  const animationText = checkoutState
    ? isBulkCheckout
      ? "Mega toss engaged. Securing final cargo for outbound dispatch."
      : `Securing ${checkoutItem?.name ?? "selected item"} for outbound dispatch.`
    : checkoutStep === "shipping"
      ? "Enter delivery coordinates to begin the loading sequence."
      : checkoutStep === "payment"
        ? "Final approval required before the truck departs."
        : "Awaiting final confirmation. Checkout items to begin loading sequence.";

  const isFormFilled =
    shippingForm.fullName.trim().length > 0 &&
    shippingForm.address.trim().length > 0 &&
    shippingForm.city.trim().length > 0 &&
    shippingForm.zip.trim().length > 0 &&
    shippingForm.email.trim().length > 0 &&
    shippingForm.phone.trim().length > 0;

  const isPaymentFilled =
    paymentForm.method === "cod"
      ? true
      : paymentForm.mobileNumber.trim().length >= 6;

  const handlePaymentChange = (field) => (e) => {
    const value = e.target.value;
    setPaymentForm((cur) => ({ ...cur, [field]: value }));
  };

  const handleConfirmPayment = () => {
    if (!isFormFilled || !isPaymentFilled || checkoutState || items.length === 0) return;

    setCheckoutState({ mode: "bulk" });
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.aside
            className="cart-animation-stage"
            aria-label="Dispatch status"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <div className="cart-animation-card">
              <div className="cart-animation-copy">
                <div className="cart-animation-kicker">{animationKicker}</div>
                <h3 className="cart-animation-title">{animationTitle}</h3>
                <p className="cart-animation-text">{animationText}</p>
              </div>

              <div className="cart-animation-media-wrap">
                <img
                  className="cart-animation-media cart-animation-idle"
                  src={checkoutIdleFrame}
                  alt=""
                  aria-hidden="true"
                />

                <AnimatePresence initial={false}>
                  {(checkoutItem || isBulkCheckout) ? (
                    <motion.video
                      key={isBulkCheckout ? "bulk-checkout" : checkoutItem.key}
                      className="cart-animation-media cart-animation-video"
                      src={checkoutVideo}
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      poster={checkoutIdleFrame}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: easeOut }}
                      onEnded={finishCheckout}
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>

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
              <div className="cart-sheet-head-left">
                {checkoutStep === "cart" ? null : (
                  <button className="cart-back" type="button" onClick={goBackToCart} aria-label="Back to cart">
                    ←
                  </button>
                )}

                <div>
                  <div className="cart-kicker">Bag</div>
                  <AnimatePresence mode="wait" initial={false}>
                    {checkoutStep === "cart" ? (
                      <motion.h2
                        key="cart-title"
                        className="cart-title"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                      >
                        Your items
                      </motion.h2>
                    ) : checkoutStep === "shipping" ? (
                      <motion.h2
                        key="shipping-title"
                        className="cart-title"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                      >
                        Shipping details
                      </motion.h2>
                    ) : (
                      <motion.h2
                        key="payment-title"
                        className="cart-title"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.22, ease: easeOut }}
                      >
                        Confirm dispatch
                      </motion.h2>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button className="cart-close" type="button" onClick={closeCart} aria-label="Close cart drawer">
                ×
              </button>
            </div>

            <div className="cart-sheet-body">
              <AnimatePresence mode="wait" initial={false}>
                {checkoutStep === "cart" ? (
                  <motion.div
                    key="cart-view"
                    className="cart-view-shell"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
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
                              <div className="cart-media-wrap">
                                <img className="cart-media" src={item.image} alt={item.name} />
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
                                <div className="cart-right-top">
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

                                <button
                                  type="button"
                                  className="cart-checkout-button"
                                  onClick={() => handleItemCheckout(item)}
                                  disabled={Boolean(checkoutState)}
                                  aria-label={`Checkout ${item.name}`}
                                >
                                  {checkoutState?.mode === "item" && checkoutItem?.key === item.key ? "Loading truck" : "Checkout"}
                                </button>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : checkoutStep === "shipping" ? (
                  <motion.div
                    key="shipping-view"
                    className="checkout-step-shell"
                    initial={{ x: 50, opacity: 0, filter: "blur(4px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="checkout-form-grid">
                      <label className="checkout-field">
                        <input
                          type="text"
                          value={shippingForm.fullName}
                          onChange={handleShippingChange("fullName")}
                          placeholder=" "
                        />
                        <span>Full Name</span>
                      </label>

                      <label className="checkout-field checkout-field-wide">
                        <input
                          type="text"
                          value={shippingForm.address}
                          onChange={handleShippingChange("address")}
                          placeholder=" "
                        />
                        <span>Delivery Address</span>
                      </label>

                      <label className="checkout-field">
                        <input
                          type="text"
                          value={shippingForm.city}
                          onChange={handleShippingChange("city")}
                          placeholder=" "
                        />
                        <span>City</span>
                      </label>

                      <label className="checkout-field">
                        <input
                          type="text"
                          value={shippingForm.zip}
                          onChange={handleShippingChange("zip")}
                          placeholder=" "
                        />
                        <span>ZIP / Postal Code</span>
                      </label>

                      <label className="checkout-field">
                        <input
                          type="email"
                          value={shippingForm.email}
                          onChange={handleShippingChange("email")}
                          placeholder=" "
                        />
                        <span>Email</span>
                      </label>

                      <label className="checkout-field">
                        <input
                          type="tel"
                          value={shippingForm.phone}
                          onChange={handleShippingChange("phone")}
                          placeholder=" "
                        />
                        <span>Phone</span>
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment-view"
                    className="checkout-step-shell"
                    initial={{ x: 50, opacity: 0, filter: "blur(4px)" }}
                    animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="checkout-payment-grid">
                      <div className="checkout-review">
                        <div className="checkout-payment-kicker">Review order</div>
                        <div className="checkout-payment-list">
                          {items.map((it) => (
                              <div key={it.key} className="checkout-review-row">
                                <div className="checkout-review-meta">
                                  <div className="checkout-review-name">{it.name}</div>
                                  <div className="checkout-review-qty">Qty {it.quantity}</div>
                                </div>
                                <div className="checkout-review-price">{formatMoney(it.price * it.quantity)}</div>
                              </div>
                            ))}
                        </div>

                        <div className="checkout-address">
                          <div className="checkout-payment-kicker">Ship to</div>
                          <div>
                            <strong>{shippingForm.fullName}</strong>
                            <div>{shippingForm.address}</div>
                            <div>
                              {shippingForm.city} · {shippingForm.zip}
                            </div>
                            <div>{shippingForm.email} · {shippingForm.phone}</div>
                          </div>
                        </div>
                      </div>

                      <div className="checkout-payment-panel">
                        <div className="checkout-payment-kicker">Payment</div>

                        <div className="payment-methods">
                          <label className="payment-method">
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentForm.method === "mobile"}
                              onChange={() => setPaymentForm((cur) => ({ ...cur, method: "mobile" }))}
                            />
                            <span>Mobile Banking</span>
                          </label>

                          <label className="payment-method">
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentForm.method === "cod"}
                              onChange={() => setPaymentForm((cur) => ({ ...cur, method: "cod" }))}
                            />
                            <span>Cash on Delivery</span>
                          </label>
                        </div>

                        {paymentForm.method === "mobile" ? (
                          <>
                            <label className="checkout-field">
                              <input type="text" value={paymentForm.mobileProvider} onChange={handlePaymentChange("mobileProvider")} placeholder=" " />
                              <span>Provider (e.g., MTN MobileMoney)</span>
                            </label>

                            <label className="checkout-field">
                              <input type="tel" value={paymentForm.mobileNumber} onChange={handlePaymentChange("mobileNumber")} placeholder=" " />
                              <span>Mobile number</span>
                            </label>

                            <label className="checkout-field">
                              <input type="text" value={paymentForm.mobileTxn} onChange={handlePaymentChange("mobileTxn")} placeholder=" " />
                              <span>Transaction ID (optional)</span>
                            </label>
                          </>
                        ) : (
                          <div className="checkout-cod-note">Cash on Delivery selected — pay at delivery. Small fee may apply.</div>
                        )}

                        <div className="checkout-payment-actions">
                          <button type="button" className="cart-cta" onClick={handleConfirmPayment} disabled={!isFormFilled || !isPaymentFilled || Boolean(checkoutState) || items.length === 0}>
                            Confirm dispatch
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="cart-sheet-footer">
              <div className="cart-breakdown">
                <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
                <div><span>Shipping</span><strong>{shipping ? formatMoney(shipping) : "Free"}</strong></div>
                <div className="cart-total"><span>TOTAL</span><strong>{formatMoney(total)}</strong></div>
              </div>

              {checkoutStep === "cart" ? (
                <button className="cart-cta" type="button" onClick={goToShipping} disabled={Boolean(checkoutState) || items.length === 0}>
                  Proceed to checkout
                </button>
              ) : checkoutStep === "shipping" ? (
                <button className="cart-cta" type="button" onClick={goToPayment} disabled={!isFormFilled || Boolean(checkoutState)}>
                  Continue to payment
                </button>
              ) : (
                <button className="cart-cta" type="button" onClick={handleConfirmPayment} disabled={!isFormFilled || !isPaymentFilled || Boolean(checkoutState) || items.length === 0}>
                  Confirm dispatch
                </button>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}