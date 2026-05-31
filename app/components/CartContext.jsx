"use client";

import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (currentItem) =>
          currentItem.id === item.id &&
          currentItem.size === item.size &&
          currentItem.colorway === item.colorway,
      );

      if (existingIndex === -1) {
        return [...currentItems, { ...item, quantity: 1 }];
      }

      return currentItems.map((currentItem, index) =>
        index === existingIndex
          ? { ...currentItem, quantity: currentItem.quantity + 1 }
          : currentItem,
      );
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.key === itemKey ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter(Boolean),
    );
  };

  const removeItem = (itemKey) => {
    setItems((currentItems) => currentItems.filter((item) => item.key !== itemKey));
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = count > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      shipping,
      total,
      isOpen,
      setIsOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, count, subtotal, shipping, total, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}