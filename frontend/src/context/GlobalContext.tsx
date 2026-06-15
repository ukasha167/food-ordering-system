import React, { createContext, useState, useContext } from 'react';

type CartItem = { id: number; name: string; price: number; quantity: number };
type User = { id: number; email: string; token: string } | null;

interface GlobalContextType {
  cart: CartItem[];
  addToCart: (item: { id: number; name: string; price: number }) => void;
  clearCart: () => void;
  user: User;
  setUser: (user: User) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>(null);

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <GlobalContext.Provider value={{ cart, addToCart, clearCart, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within GlobalProvider');
  return context;
};
