import { createContext, useContext, useState, useEffect, useMemo, type FC, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, variant: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem('asopromas-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('asopromas-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      // Buscar item existente considerando tanto id como variant
      const existingItem = currentItems.find(item => 
        item.id === newItem.id && item.variant === newItem.variant
      );
      
      if (existingItem) {
        // Si el item ya existe (mismo producto y variante), incrementar cantidad
        return currentItems.map(item =>
          item.id === newItem.id && item.variant === newItem.variant
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Si es nuevo (diferente producto o variante), agregarlo con cantidad 1
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string, variant?: string) => {
    setItems(currentItems => 
      currentItems.filter(item => 
        !(item.id === id && item.variant === variant)
      )
    );
  };

  const updateQuantity = (id: string, variant: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, variant);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.variant === variant ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );
  
  const totalPrice = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
    [items]
  );

  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  }), [items, totalItems, totalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
