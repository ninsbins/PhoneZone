import React, { createContext, useReducer, useEffect } from "react";
import { CartReducer } from "./CartReducer";
import useAuth from "../services/useAuth";
import axiosConfig from "../services/axiosConfig";

export const CartContext = createContext();

// get from localStorage if possible
const storage = localStorage.getItem("cart")
    ? localStorage.getItem("cart")
    : [];

const initialState = {
    cartItems: storage,
    cartId: "",
    cartTotal: 0,
    totalNumItems: 0,
    requestInProgress: false,
    checkedOut: false,
    errors: [],
    checkingOutInProgress: false,
    checkoutSuccessful: false,
};

const CartContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);
    const auth = useAuth();

    const addPhone = (payload) => {
        let expired = auth.isJWTExpired();
        console.log(`expired? ${expired}`);

        if (!expired) {
            dispatch({ type: "FETCH_CART" });
            axiosConfig
                .put(
                    "/cart/addToCart",
                    {
                        phoneId: payload.phone._id,
                        quantity: payload.num,
                        cartId: state.cartId,
                    },
                    {
                        headers: { Authorization: "Bearer " + auth.token },
                    }
                )
                .then((response) => {
                    // console.log(response);
                    setCart();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            auth.signout();
        }
    };

    const increase = (payload) => {
        let expired = auth.isJWTExpired();
        console.log(`expired? ${expired}`);
        if (!expired) {
            dispatch({ type: "FETCH_CART" });
            axiosConfig
                .put(
                    "/cart/increaseQuantity",
                    {
                        cartId: state.cartId,
                        productId: payload._id,
                    },
                    {
                        headers: { Authorization: "Bearer " + auth.token },
                    }
                )
                .then((response) => {
                    // console.log(response);
                    setCart();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            auth.signout();
        }

        // dispatch({ type: "INCREASE", payload });
    };

    const decrease = (payload) => {
        let expired = auth.isJWTExpired();
        if (!expired) {
            dispatch({ type: "FETCH_CART" });
            axiosConfig
                .put(
                    "/cart/decreaseQuantity",
                    {
                        cartId: state.cartId,
                        productId: payload._id,
                    },
                    {
                        headers: { Authorization: "Bearer " + auth.token },
                    }
                )
                .then((response) => {
                    console.log(response);
                    setCart();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            auth.signout();
        }
    };

    const removePhone = (payload) => {
        // sent cart id and the id of the phone to remove
        // product id, cart id.
        let expired = auth.isJWTExpired();
        if (!expired) {
            dispatch({ type: "FETCH_CART" });
            axiosConfig
                .put(
                    "/cart/removeFromCart",
                    {
                        cartId: state.cartId,
                        productId: payload._id,
                    },
                    {
                        headers: { Authorization: "Bearer " + auth.token },
                    }
                )
                .then((response) => {
                    // console.log(response);
                    setCart();
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            auth.signout();
        }

        // dispatch({ type: "REMOVE_PHONE", payload });
    };

    // axios.put(`/phones/delete`,
    // {phoneId: data._id},
    // {headers: {"Authorization": "Bearer " + auth.token}})
    // .then((result) => {

    const setCart = () => {
        if (auth.token) console.log(`token being sent ${auth.token}`);

        let expired = auth.isJWTExpired();
        if (!expired) {
            axiosConfig
                .get("/cart", {
                    headers: { Authorization: "Bearer " + auth.token },
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
        }
    };

    // const clearCart = () => {
    //     dispatch({ type: "CLEAR" });
    // };

    const handleCheckout = async () => {
        // send axios request to handle checkout

        let expired = auth.isJWTExpired();
        if (!expired) {
            dispatch({ type: "START_CHECKOUT" });

            return new Promise((resolve, reject) => {
                axiosConfig
                    .post(
                        "/cart/checkout",
                        {
                            cartId: state.cartId,
                        },
                        {
                            headers: { Authorization: "Bearer " + auth.token },
                        }
                    )
                    .then((response) => {
                        console.log(response);
                        resolve("success on checkout");
                        dispatch({ type: "CHECKOUT_SUCCESS" });
                        dispatch({ type: "CLEAR" });
                    })
                    .catch((err) => {
                        reject("unsuccessful checkout");
                        console.log(err);
                        dispatch({ type: "CHECKOUT_FAIL" });
                    });
            });
        } else {
            auth.signout();
        }

        // return res;
    };

    // const handleCheckout = () => {
    //     dispatch({ type: "CHECKOUT" });
    // };
    useEffect(() => {
        if (!auth.user) return;
        // console.log(auth);
        console.log("triggered log in");
        let expired = auth.isJWTExpired();
        if (!expired && auth.user) {
            setCart();
        }
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
