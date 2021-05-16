import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../styles/Checkout.scss";

const Checkout = ({ location }) => {
    const { cartItems, removePhone } = useContext(CartContext);
    const history = useHistory();
    // history.replace('/', {from: location})

    const ItemTile = (props) => {
        return (
            <Row className="checkout__tile">
                <Col sm={4}>{props.item.product.title}</Col>
                <Col sm={3}> - {props.item.quantity} +</Col>
                <Col sm={3}>
                    {Number(props.item.product.price) * Number(props.quantity)}
                </Col>
                <Col sm={2}>
                    <Button onclick={() => removePhone(props.item.product)}>
                        Delete item
                    </Button>
                </Col>
            </Row>
        );
    };

    const ItemList = (props) => {
        return props.items.map((item) => {
            return <ItemTile item={item} />;
        });
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
                <Row>
                    <h2>Shopping Cart</h2>
                </Row>

                {cartItems != null ? (
                    <ItemList items={cartItems} />
                ) : (
                    <div>No items in the cart</div>
                )}

                <Row>Total: $0000.0</Row>
                <Row>Confirm order button</Row>
            </Container>
        </div>
    );
};

export default Checkout;
