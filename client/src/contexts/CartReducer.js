import axios from "axios";

const BASE_URL = "http://localhost:9000";

export const CartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_PHONE":
            console.log("adding");
            // return {...state, cartItems}
            console.log(action.payload);

            // TODO

            axios
                .put("/cart/addToCart", {
                    userId: action.user,
                    phoneId: action.payload.phone._id,
                    quantity: action.payload.num,
                })
                .then((response) => {
                    return { ...state, cartItems: response.data.cart.items };
                })
                .catch((err) => {
                    console.log(err);
                    return { ...state };
                });

        case "REMOVE_PHONE":
            console.log("removing phone");
            return { ...state };

        case "SET_CART":
            console.log("setting cart");
            console.log(state.cartItems);
            console.log(action.payload);
            return {
                ...state,
                cartItems: action.payload,
                requestInProgress: false,
            };

        case "SET_CART_ID":
            console.log("setting cart id");
            console.log(action.payload);

            return { ...state, cartId: action.payload };

        case "SET_CART_TOTAL":
            return { ...state, cartTotal: action.payload };

        case "FETCH_CART":
            return { ...state, requestInProgress: true };

        case "START_CHECKOUT":
            return { ...state, requestInProgress: true };
        case "CHECKOUT_SUCCESS":
            return { ...state, requestInProgress: false, checkedOut: true };
        case "CHECKOUT_FAIL":
            return { ...state, requestInProgress: false };

        case "CLEAR":
            return { ...state, cartId: "", cartItems: [] };
        // // TODO

        // case "CLEAR":
        // // TODO
        // case "CHECKOUT":
        // TODO
        default:
            return state;
    }
};
