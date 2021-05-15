import axios from "axios";

const BASE_URL = "http://localhost:9000";

export const CartReducer = async (state, action) => {
    switch (action.type) {
        case "ADD_PHONE":
            console.log("adding");
            // return {...state, cartItems}
            console.log(action.payload);

            // TODO
            try {
                const newCart = await axios
                    .put("/cart/addToCart", {
                        userId: action.user,
                        phoneId: action.payload.phone._id,
                        quantity: action.payload.num,
                    })
                    .then((response) => {
                        return response.data.cart;
                    });
                console.log(`new cart`);
                console.log(newCart);
                return { ...state, cartItems: newCart };
            } catch (error) {
                console.log(error);
                return { ...state };
            }

        // case "INCREASE":
        //     console.log("increasing");
        //     state.cartItems[
        //         state.cartItems.findIndex((ph) => ph._id === action.payload._id)
        //     ].quantity++;

        //     return { ...state, cartItems: [...state.cartItems] };

        case "REMOVE_PHONE":
            console.log("removing phone");
            return { ...state };
        // return {
        //     ...state,
        //     cartItems: [
        //         ...state.cartItems.filter(
        //             (ph) => ph._id !== action.payload._id
        //         ),
        //     ],
        // };
        case "LOAD_CART":
            console.log("loading cart");

            return { ...state, somethingElse: "Is it something else" };
            // console.log(state.cartItems);
            // state.cartItems.push("testing");
            // console.log(action.payload.items);
            // state.cartItems.push(...action.payload.items);

            return { ...state, cartItems: ["hei", "there"] };

        // // TODO

        // case "CLEAR":
        // // TODO
        // case "CHECKOUT":
        // TODO
        default:
            return state;
    }
};
