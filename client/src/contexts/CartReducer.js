export const CartReducer = (state, action) => {
    console.log(action);
    console.log(state);

    switch (action.type) {
        case "ADD_PHONE":
            console.log("adding");
            // TODO
            if (!state.cartItems.find((ph) => ph._id === action.payload._id)) {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }

            return { ...state, cartItems: [...state.cartItems] };

        case "INCREASE":
            console.log("increasing");
            state.cartItems[
                state.cartItems.findIndex((ph) => ph._id === action.payload._id)
            ].quantity++;

            return { ...state, cartItems: [...state.cartItems] };

        case "REMOVE_PHONE":
            console.log("removing phone");
            return {
                ...state,
                cartItems: [
                    ...state.cartItems.filter(
                        (ph) => ph._id !== action.payload._id
                    ),
                ],
            };

        // // TODO

        // case "CLEAR":
        // // TODO
        // case "CHECKOUT":
        // TODO
        default:
            return state;
    }
};
