"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "./CartContext";

const easeOut = [0.2, 0.8, 0.2, 1];
const checkoutIdleFrame = "/Animation/checkout_start_end.png";
const checkoutVideo = "/Animation/checkoutAnim.mp4";
const sampleShippingForm = {
  fullName: "Apex Test User",
  address: "14 Demo Street",
  city: "Dhaka",
  zip: "1212",
  email: "test@apex11.com",
  phone: "+8801712345678",
};

const samplePaymentForm = {
  method: "", // 'card' | 'mobile' | 'cod'
  cardName: "Apex Test User",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/28",
  cardCvv: "123",
  mobileProvider: "bKash",
  mobileNumber: "01712345678",
  mobileTxn: "TXN-123456",
};

function formatMoney(value) {
  return `$${value.toFixed(0)}`;
}

export default function CartSheet() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    shipping,
    total,
    removeItem,
    updateQuantity,
    markItemCheckedOut,
    markAllItemsCheckedOut,
  } = useCart();
  const [draggingItemKey, setDraggingItemKey] = useState(null);
  const [checkoutState, setCheckoutState] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [shippingForm, setShippingForm] = useState(sampleShippingForm);
  const [paymentForm, setPaymentForm] = useState(samplePaymentForm);
  const paymentInputSectionRef = useRef(null);
  const checkoutItem = checkoutState?.mode === "item" ? items.find((item) => item.key === checkoutState.itemKey) ?? null : null;
  const isBulkCheckout = checkoutState?.mode === "bulk";
  const hasCheckedOutItems = items.some((item) => item.checkedOut);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutState(null);
      setCheckoutStep("cart");
      setShippingForm(sampleShippingForm);
      setPaymentForm(samplePaymentForm);
      return;
    }

    if (checkoutState?.mode === "item" && !items.some((item) => item.key === checkoutState.itemKey)) {
      setCheckoutState(null);
    }
  }, [checkoutState, isOpen, items]);

  useEffect(() => {
    if (checkoutStep !== "payment" || paymentForm.method === "cod") {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      paymentInputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [checkoutStep, paymentForm.method]);

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
      markAllItemsCheckedOut();
    } else if (checkoutState?.mode === "item") {
      markItemCheckedOut(checkoutState.itemKey);
    }

    setCheckoutState(null);
    setCheckoutStep("cart");
    setShippingForm(sampleShippingForm);
    setPaymentForm(samplePaymentForm);
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
      : paymentForm.method === "mobile"
        ? paymentForm.mobileProvider.trim().length > 0 && paymentForm.mobileNumber.trim().length >= 6
        : paymentForm.cardName.trim().length > 0 &&
          paymentForm.cardNumber.replace(/\s/g, "").length >= 12 &&
          paymentForm.cardExpiry.trim().length >= 4 &&
          paymentForm.cardCvv.trim().length >= 3;

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
                                  {item.checkedOut ? <span className="cart-status-tag">Checked Out</span> : null}
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
                                  disabled={Boolean(checkoutState) || item.checkedOut}
                                  aria-label={`Checkout ${item.name}`}
                                >
                                  {item.checkedOut
                                    ? "Checked Out"
                                    : checkoutState?.mode === "item" && checkoutItem?.key === item.key
                                      ? "Loading truck"
                                      : "Checkout"}
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
                        <div className="checkout-payment-kicker">Order Summary</div>
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

                        <div className="checkout-address-card">
                          <div className="checkout-payment-kicker" style={{ marginBottom: "8px" }}>Shipping To</div>
                          <div className="checkout-address-name">{shippingForm.fullName}</div>
                          <div className="checkout-address-grid">
                            <div className="checkout-address-item">{shippingForm.address}</div>
                            <div className="checkout-address-item">{shippingForm.city} · {shippingForm.zip}</div>
                            <div className="checkout-address-item">{shippingForm.email}</div>
                            <div className="checkout-address-item">{shippingForm.phone}</div>
                          </div>
                        </div>
                      </div>

                      <div className="checkout-payment-panel">
                        <div className="checkout-payment-kicker">Payment</div>

                        <div className="payment-methods">
                          <label className={paymentForm.method === "card" ? "payment-method is-active" : "payment-method"}>
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentForm.method === "card"}
                              onChange={() => setPaymentForm((cur) => ({ ...cur, method: "card" }))}
                            />
                            <div className="payment-method-copy">
                              <strong>Card</strong>
                              <span>Visa, Mastercard or local debit card.</span>
                            </div>
                          </label>

                          <label className={paymentForm.method === "mobile" ? "payment-method is-active" : "payment-method"}>
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentForm.method === "mobile"}
                              onChange={() => setPaymentForm((cur) => ({ ...cur, method: "mobile" }))}
                            />
                            <div className="payment-method-copy">
                              <strong>Mobile Banking</strong>
                              <span>bKash, Nagad, Rocket or similar.</span>
                            </div>
                          </label>

                          <label className={paymentForm.method === "cod" ? "payment-method is-active" : "payment-method"}>
                            <input
                              type="radio"
                              name="payment-method"
                              checked={paymentForm.method === "cod"}
                              onChange={() => setPaymentForm((cur) => ({ ...cur, method: "cod" }))}
                            />
                            <div className="payment-method-copy">
                              <strong>Cash on Delivery</strong>
                              <span>Pay when your order reaches you.</span>
                            </div>
                          </label>
                        </div>

                        {paymentForm.method === "card" ? (
                          <div className="payment-context-panel" ref={paymentInputSectionRef}>
                            <div className="payment-context-head">
                              <div className="checkout-payment-kicker">Card details</div>
                              <span className="payment-context-badge">Secure</span>
                            </div>

                            <label className="checkout-field checkout-field-wide">
                              <input type="text" value={paymentForm.cardName} onChange={handlePaymentChange("cardName")} placeholder=" " />
                              <span>Name on card</span>
                            </label>

                            <label className="checkout-field checkout-field-wide">
                              <input type="text" value={paymentForm.cardNumber} onChange={handlePaymentChange("cardNumber")} placeholder=" " />
                              <span>Card number</span>
                            </label>

                            <div className="payment-split-row">
                              <label className="checkout-field">
                                <input type="text" value={paymentForm.cardExpiry} onChange={handlePaymentChange("cardExpiry")} placeholder=" " />
                                <span>Expiry</span>
                              </label>

                              <label className="checkout-field">
                                <input type="text" value={paymentForm.cardCvv} onChange={handlePaymentChange("cardCvv")} placeholder=" " />
                                <span>CVV</span>
                              </label>
                            </div>
                          </div>
                        ) : paymentForm.method === "mobile" ? (
                          <div className="payment-context-panel" ref={paymentInputSectionRef}>
                            <div className="payment-context-head">
                              <div className="checkout-payment-kicker">Mobile banking</div>
                              <span className="payment-context-badge">Fast</span>
                            </div>

                            <label className="checkout-field checkout-field-wide">
                              <input type="text" value={paymentForm.mobileProvider} onChange={handlePaymentChange("mobileProvider")} placeholder=" " />
                              <span>Provider</span>
                            </label>

                            <label className="checkout-field checkout-field-wide">
                              <input type="tel" value={paymentForm.mobileNumber} onChange={handlePaymentChange("mobileNumber")} placeholder=" " />
                              <span>Mobile number</span>
                            </label>

                            <label className="checkout-field checkout-field-wide">
                              <input type="text" value={paymentForm.mobileTxn} onChange={handlePaymentChange("mobileTxn")} placeholder=" " />
                              <span>Transaction ID (optional)</span>
                            </label>
                          </div>
                        ) : (
                          <div className="checkout-cod-note checkout-cod-note-hero">
                            Cash on Delivery selected. Your order will be paid at delivery.
                          </div>
                        )}

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
                <button
                  className="cart-cta"
                  type="button"
                  onClick={hasCheckedOutItems ? goToShipping : confirmDispatch}
                  disabled={Boolean(checkoutState) || items.length === 0}
                >
                  {hasCheckedOutItems ? "Confirm" : "Checkout All"}
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