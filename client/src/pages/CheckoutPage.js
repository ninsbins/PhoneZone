import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useHistory } from "react-router-dom";

const Checkout = ({ location }) => {
    const { cartItems } = useContext(CartContext);
    const history = useHistory();
    // history.replace('/', {from: location})

    return (
        <div>
            <button onClick={() => history.replace("/", { from: location })}>
                Back to shopping
            </button>
            <h2>Cart</h2>
            <ul>
                {cartItems != null ? (
                    cartItems.map((phone) => {
                        return (
                            <li>
                                name: {phone.title} quantity: {phone.quantity}
                            </li>
                        );
                    })
                ) : (
                    <div>No items in the cart</div>
                )}
            </ul>
        </div>
    );
};

export default Checkout;
