import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      const updated = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    } else {
      const updated = [...cartItems, { ...product, quantity: 1 }];
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    }
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      const updated = cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartItems(updated);
      localStorage.setItem('cartItems', JSON.stringify(updated));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price?.replace(/[^\d]/g, '') || 0);
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
