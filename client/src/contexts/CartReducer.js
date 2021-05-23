export const CartReducer = (state, action) => {
    switch (action.type) {
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

        case "SET_CART_FAIL":
            return {
                ...state,
                requestInProgress: false,
                errors: [...state.errors, "unable to get cart"],
            };

        // requestInProgress: false,
        // checkedOut: false,
        // errors: [],
        // checkingOutInProgress: false,
        // checkoutSuccessful: false,

        case "START_CHECKOUT":
            return { ...state, requestInProgress: true };

        case "CHECKOUT_SUCCESS":
            return {
                ...state,
                requestInProgress: false,
                checkedOut: true,
                errors: [],
            };
        case "CHECKOUT_FAIL":
            return {
                ...state,
                requestInProgress: false,
                errors: ["bad vibes from this order"],
            };

        case "SET_NUM_TOTAL_ITEMS":
            return { ...state, totalNumItems: action.payload };

        case "CLEAR":
            return { ...state, cartId: "", cartItems: [] };

        default:
            return state;
    }
};
