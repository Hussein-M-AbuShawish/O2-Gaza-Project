"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";

const CART_STORAGE_KEY = "o2-restaurant-cart";

interface CartItem {
    key: string;
    name: string;
    price: number;
    unitPrice: number;
    qty: number;
    weight: number | null;
    isByWeight: boolean;
}

interface CartContextType {
    cart: CartItem[];
    cartTotal: number;
    addToCart: (item: CartItem) => void;
    updateQty: (index: number, change: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // تحميل السلة من localStorage عند بدء التشغيل
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (error) {
                console.error("Error parsing cart from localStorage:", error);
            }
        }
        setIsLoaded(true);
    }, []);

    // حفظ السلة في localStorage عند كل تغيير
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    const cartTotal = useMemo(
        () => cart.reduce((acc, item) => acc + item.qty, 0),
        [cart]
    );

    const addToCart = useCallback((newItem: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.key === newItem.key);
            if (existing) {
                return prev.map((i) =>
                    i.key === newItem.key ? { ...i, qty: i.qty + newItem.qty } : i
                );
            }
            return [...prev, newItem];
        });
    }, []);

    const updateQty = useCallback((index: number, change: number) => {
        setCart((prev) => {
            const newCart = [...prev];
            newCart[index].qty += change;
            if (newCart[index].qty <= 0) {
                newCart.splice(index, 1);
            }
            return newCart;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartTotal,
                addToCart,
                updateQty,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}