import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context (The Box)
const CartContext = createContext();

// 2. Create the Provider (The Wrapper that gives access to the Box)
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add item to cart
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Check if item is already in cart
            const existingItem = prevItems.find((item) => item.id === product.id);
            
            if (existingItem) {
                // If yes, just increase quantity
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If no, add new item with quantity 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        
        // alert(`${product.name} added to cart!`);
       
    };

    // Function to remove item
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // ✅ NEW: Function to update quantity (+ or -) from Cart Page
    const updateQuantity = (productId, amount) => {
        setCartItems((prevItems) => 
            prevItems.map((item) => {
                if (item.id === productId) {
                    const newQty = item.quantity + amount;
                    // Prevent quantity from going below 1
                    return { ...item, quantity: newQty > 0 ? newQty : 1 };
                }
                return item;
            })
        );
    };

    // Function to clear cart (after checkout)
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            clearCart,
            updateQuantity // <--- Added this so CartPage can use it
        }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Custom Hook to use the Cart easily
export const useCart = () => useContext(CartContext);