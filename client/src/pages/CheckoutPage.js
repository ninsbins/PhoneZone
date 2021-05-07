import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const Checkout = () => {
    const { cartItems } = useContext(CartContext);

    return (
        <div>
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
