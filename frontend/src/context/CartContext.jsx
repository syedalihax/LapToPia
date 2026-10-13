import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('laptopia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    try {
      localStorage.setItem('laptopia_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }, [cartItems]);

  const showToast = (message = 'Product added to your cart') => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2800);
  };

  const addToCart = (product, qty = 1, variant = null) => {
    setCartItems(prev => {
      const variantKey = variant ? variant.name || variant : 'Standard';
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.variant === variantKey
      );

      const price = variant && variant.pricePKR ? Number(variant.pricePKR) : Number(product.pricePKR);
      const img = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || '');

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            sku: product.sku || `SKU-${product.id}`,
            pricePKR: price,
            qty: qty,
            image: img,
            variant: variantKey
          }
        ];
      }
    });

    // Display clean popup toast
    showToast('Product added to your cart');
  };

  const removeFromCart = (productId, variant = 'Standard') => {
    setCartItems(prev => prev.filter(
      item => !(item.productId === productId && item.variant === variant)
    ));
  };

  const updateQty = (productId, variant = 'Standard', delta = 1) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId && item.variant === variant) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const grossTotalPKR = cartItems.reduce((acc, item) => acc + (item.pricePKR * item.qty), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        grossTotalPKR,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
