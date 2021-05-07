// EXAMPLE CART CONTEXT, NOT IN USE YET!

import React, { createContext, useReducer } from "react";
import { CartReducer } from "./CartReducer";

export const CartContext = createContext();

// get from localStorage if possible
const storage = localStorage.getItem("cart")
    ? localStorage.getItem("cart")
    : [];

const initialState = { cartItems: storage, checkout: false };

const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);

    const addPhone = (payload) => {
        dispatch({ type: "ADD_PHONE", payload });
    };

    const increase = (payload) => {
        dispatch({ type: "INCREASE", payload });
    };

    const removePhone = (payload) => {
        dispatch({ type: "REMOVE_PHONE", payload });
    };

    // const clearCart = () => {
    //     dispatch({ type: "CLEAR" });
    // };

    // const handleCheckout = () => {
    //     dispatch({ type: "CHECKOUT" });
    // };

    const contextValues = {
        addPhone,
        increase,
        removePhone,
        // clearCart,
        // handleCheckout,
        ...state,
    };

    return (
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;
