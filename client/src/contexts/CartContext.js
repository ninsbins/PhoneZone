// EXAMPLE CART CONTEXT, NOT IN USE YET!

import React, { createContext, useReducer, useEffect } from "react";
import { CartReducer } from "./CartReducer";
import useAuth from "../services/useAuth";
import axios from "axios";

export const CartContext = createContext();

// get from localStorage if possible
const storage = localStorage.getItem("cart")
    ? localStorage.getItem("cart")
    : [];

const initialState = {
    cartItems: storage,
    cartId: "",
    cartTotal: 0,
    requestInProgress: false,
    checkedOut: false,
    errors: [],
};

const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);
    const auth = useAuth();

    const addPhone = (payload) => {
        dispatch({ type: "FETCH_CART" });
        axios
            .put("/cart/addToCart", {
                userId: auth.user,
                phoneId: payload.phone._id,
                quantity: payload.num,
                cartId: state.cartId,
            })
            .then((response) => {
                // console.log(response);
                setCart();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const increase = (payload) => {
        dispatch({ type: "FETCH_CART" });
        axios
            .put("/cart/increaseQuantity", {
                cartId: state.cartId,
                productId: payload._id,
            })
            .then((response) => {
                // console.log(response);
                setCart();
            })
            .catch((err) => {
                console.log(err);
            });

        // dispatch({ type: "INCREASE", payload });
    };

    const decrease = (payload) => {
        dispatch({ type: "FETCH_CART" });
        axios
            .put("/cart/decreaseQuantity", {
                cartId: state.cartId,
                productId: payload._id,
            })
            .then((response) => {
                console.log(response);
                setCart();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const removePhone = (payload) => {
        // sent cart id and the id of the phone to remove
        // product id, cart id.
        dispatch({ type: "FETCH_CART" });
        axios
            .put("/cart/removeFromCart", {
                cartId: state.cartId,
                productId: payload._id,
            })
            .then((response) => {
                // console.log(response);
                setCart();
            })
            .catch((err) => {
                console.log(err);
            });

        // dispatch({ type: "REMOVE_PHONE", payload });
    };

    const setCart = () => {
        axios
            .get("/cart", {
                params: { userId: auth.user },
            })
            .then((response) => {
                // console.log(response);
                if (response.data.cart) {
                    dispatch({
                        type: "SET_CART",
                        payload: response.data.cart.items,
                    });

                    dispatch({
                        type: "SET_CART_ID",
                        payload: response.data.cart._id,
                    });

                    dispatch({
                        type: "SET_CART_TOTAL",
                        payload: response.data.cart.order_total,
                    });
                } else {
                    // console.log("no current cart for user");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // const clearCart = () => {
    //     dispatch({ type: "CLEAR" });
    // };

    const handleCheckout = () => {
        // send axios request to handle checkout
        dispatch({ type: "START_CHECKOUT" });
        axios
            .post("/cart/checkout", {
                cartId: state.cartId,
                userId: auth.user,
            })
            .then((response) => {
                console.log(response);
                dispatch({ type: "CHECKOUT_SUCCESS" });
                dispatch({ type: "CLEAR" });
            })
            .catch((err) => {
                console.log(err);
                dispatch({ type: "CHECKOUT_FAIL" });
            });
    };

    // const handleCheckout = () => {
    //     dispatch({ type: "CHECKOUT" });
    // };
    useEffect(() => {
        if (!auth.user) return;
        // console.log(auth);
        console.log("triggered log in");
        setCart();
    }, [auth.user]);

    const contextValues = {
        addPhone,
        increase,
        decrease,
        removePhone,
        setCart,
        // clearCart,
        handleCheckout,
        ...state,
    };

    return (
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;
