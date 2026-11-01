'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItemType = 'product' | 'service' | 'plan';

export interface CartItem {
  id: number | string;
  name: string;
  price: number;
  type: CartItemType;
  quantity: number;
  imageUrl?: string;
  slug?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number | string, type: CartItemType) => void;
  updateQuantity: (id: number | string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('reluz-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from local storage', e);
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('reluz-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === newItem.id && item.type === newItem.type
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id && item.type === newItem.type
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prevItems, newItem];
    });
  };

  const removeItem = (id: number | string, type: CartItemType) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id: number | string, type: CartItemType, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
