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

const initialState = { cartItems: storage };

const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);
    const auth = useAuth();

    const addPhone = (payload) => {
        axios
            .put("/cart/addToCart", {
                userId: auth.user,
                phoneId: payload.phone._id,
                quantity: payload.num,
            })
            .then((response) => {
                console.log(response);
                setCart();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const increase = (payload) => {
        dispatch({ type: "INCREASE", payload });
    };

    const removePhone = (payload) => {
        dispatch({ type: "REMOVE_PHONE", payload });
    };

    // const fetchCartFromApi = () => {
    //     return (dispatch) => {
    //         return axios
    //             .get("http://localhost:9000/cart", {
    //                 params: { userId: auth.user },
    //             })
    //             .then((response) => {
    //                 dispatch({
    //                     type: "LOAD_CART",
    //                     payload: response.data.cart,
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     };
    // };

    const setCartDummy = () => {
        dispatch({
            type: "SET_CART",
            payload: [{ something: "something" }, { another: "another" }],
        });
    };

    const setCart = () => {
        axios
            .get("http://localhost:9000/cart", {
                params: { userId: auth.user },
            })
            .then((response) => {
                dispatch({
                    type: "SET_CART",
                    payload: response.data.cart.items,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // const clearCart = () => {
    //     dispatch({ type: "CLEAR" });
    // };

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
        // increase,
        // removePhone,
        // getCart,
        setCart,

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
