// components/cart-context.tsx

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  size: string;
  color: string;
  height?: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size: string, color: string, height?: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number, height?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  
  const STORAGE_KEY = "lizza-cart-items";

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch (error) {
      console.error("Failed to load cart from storage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to storage", error);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">, quantityToAdd: number = 1): void => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color &&
          item.height === newItem.height
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color &&
          item.height === newItem.height
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prevItems, { ...newItem, quantity: quantityToAdd }];
    });
  };

  const removeItem = (id: string, size: string, color: string, height?: string): void => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color && item.height === height)
      )
    );
  };

  const updateQuantity = (
    id: string,
    size: string,
    color: string,
    quantity: number,
    height?: string
  ): void => {
    if (quantity <= 0) {
      removeItem(id, size, color, height);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size && item.color === color && item.height === height
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.priceNaira * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
