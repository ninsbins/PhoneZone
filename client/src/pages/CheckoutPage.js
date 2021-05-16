import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Checkout.scss";

const CheckoutStatus = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
    WAITING: "waiting",
};

const Checkout = ({ location }) => {
    const {
        cartItems,
        removePhone,
        increase,
        decrease,
        cartTotal,
        handleCheckout,
    } = useContext(CartContext);
    const [checkoutStatus, setCheckoutState] = useState(CheckoutStatus.WAITING);
    const history = useHistory();
    // history.replace('/', {from: location})

    useEffect(() => {}, [cartItems]);

    const ItemTile = (props) => {
        return (
            <Row className="checkout__tile">
                <Col sm={4}>{props.item.product.title}</Col>
                <Col sm={3}>
                    {" "}
                    <button onClick={() => decrease(props.item.product)}>
                        -{" "}
                    </button>
                    {props.item.quantity}
                    <button onClick={() => increase(props.item.product)}>
                        +
                    </button>
                </Col>
                <Col sm={3}>
                    {Number(props.item.product.price) *
                        Number(props.item.quantity)}
                </Col>
                <Col sm={2}>
                    <Button
                        variant="danger"
                        onClick={() => removePhone(props.item.product)}
                    >
                        Delete item
                    </Button>
                </Col>
            </Row>
        );
    };

    const ItemList = (props) => {
        return props.items.map((item) => {
            return (
                <div className="checkout__list">
                    <ItemTile item={item} />
                </div>
            );
        });
    };

    const checkout = () => {
        // wait for checkout repsonse, on success show success, on error, show error.
        handleCheckout();
    };

    return (
        <div className="checkout">
            <Container className="checkout__header" fluid>
                <h1 className="checkout__header__brand">PhoneZone</h1>
            </Container>

            <Container className="checkout__main" fluid>
                <Row>
                    {/* to the from trick like in mainpagesection here to send back to the proper state */}
                    <Button
                        onClick={() => history.replace("/", { from: location })}
                    >
                        Back to shopping
                    </Button>
                </Row>
                <Row className="checkout__title">
                    <h2>Shopping Cart</h2>
                </Row>
                {/* {renderCartItems} */}

                {cartItems != null ? (
                    <ItemList items={cartItems} />
                ) : (
                    <div>No items in the cart</div>
                )}

                <Row className="checkout__total">Total: ${cartTotal}</Row>
                <Row>
                    <Button block onClick={() => checkout()}>
                        Confirm Order
                    </Button>
                </Row>
                {checkoutStatus === CheckoutStatus.ERROR && (
                    <div>Sorry, an error occured</div>
                )}
                {checkoutStatus === CheckoutStatus.SUCCESS && (
                    <div>Successful checkout</div>
                )}
            </Container>
        </div>
    );
};

export default Checkout;
