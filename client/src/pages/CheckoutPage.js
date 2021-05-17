import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import LeftArrowIcon from "../components/LeftArrowIcon";
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
        requestInProgress,
    } = useContext(CartContext);
    const [checkoutStatus, setCheckoutState] = useState(CheckoutStatus.WAITING);
    const history = useHistory();
    // history.replace('/', {from: location})

    // const [disabled, setDisabled] = useState(false);
    // const maxNum = props.stock - props.quantityInCart;

    // useEffect(() => {
    //     if (maxNum === 0) {
    //         setDisabled(true);
    //     }
    // }, []);

    useEffect(() => {}, [cartItems]);

    const ItemTile = (props) => {
        let quantity = props.item.quantity;
        let stock = props.item.product.stock;
        let maxNumberToAdd = stock - quantity;
        let disabled = maxNumberToAdd <= 0;

        return (
            <>
                <Row className="checkout__tile">
                    <Col sm={2} className="checkout__product__brand">
                        {props.item.product.brand}
                    </Col>
                    <Col sm={5} className="checkout__product__title">
                        {props.item.product.title}
                    </Col>
                    <Col sm={2}>
                        <div className="checkout__product__quantity">
                            <Button
                                variant="outline-danger"
                                onClick={() => decrease(props.item.product)}
                                style={{ margin: ".5em" }}
                            >
                                -
                            </Button>
                            {props.item.quantity}
                            <Button
                                disabled={disabled}
                                variant={
                                    disabled ? "outline-dark" : "outline-info"
                                }
                                onClick={() => increase(props.item.product)}
                                style={{ margin: ".5em" }}
                            >
                                +{/* {requestInProgress && "Loading...."}+ */}
                            </Button>
                        </div>{" "}
                    </Col>
                    <Col sm={1} className="checkout__product__total">
                        $
                        {Number(props.item.product.price) *
                            Number(props.item.quantity)}
                    </Col>
                    <Col sm={2} className="checkout__product__remove">
                        <Button
                            variant="outline-danger"
                            onClick={() => removePhone(props.item.product)}
                            size="lg"
                            // style={{ justifySelf: "flex-end" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                class="bi bi-trash-fill"
                                viewBox="0 0 16 16"
                            >
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>{" "}
                            remove
                        </Button>
                    </Col>
                </Row>
            </>
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

            <div className="checkout__main" fluid>
                {requestInProgress && (
                    <div className="checkout__overlay">
                        <Spinner
                            animation="border"
                            className="checkout__spinner"
                            variant="info"
                            size="lg"
                        />
                    </div>
                )}
                <Row>
                    {/* to the from trick like in mainpagesection here to send back to the proper state */}
                    <Button
                        variant="outline-dark"
                        onClick={() => history.replace("/", { from: location })}
                    >
                        <LeftArrowIcon /> Back to shopping
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

                <Row className="checkout__total">
                    Total: ${cartTotal.toFixed(2)}
                </Row>
                <Row>
                    <Button variant="success" block onClick={() => checkout()}>
                        Confirm Order
                    </Button>
                </Row>
                {checkoutStatus === CheckoutStatus.ERROR && (
                    <div>Sorry, an error occured</div>
                )}
                {checkoutStatus === CheckoutStatus.SUCCESS && (
                    <div>Successful checkout</div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
