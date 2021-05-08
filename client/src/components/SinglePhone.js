import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import useAuth from "../services/useAuth";
import { Link } from "react-router-dom";
import ReviewList from "./ReviewList";

const IMAGEBASEURL = `http://localhost:9000/images/`;

const SinglePhone = (props) => {
    let phone = props.phone || null;

    const { addPhone, increase, cartItems, removePhone } = useContext(
        CartContext
    );
    const [isInCart, setIsInCart] = useState(false);
    const [numInCart, setNumInCart] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const auth = useAuth();

    // useEffect(() => {
    //     let res = cartItems.find((ph) => ph._id === phone._id);
    //     // if phone already in cart
    //     // then setIsIncart to true

    //     // console.log(cartItems);
    //     // console.log(res);
    // }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            let p = cartItems.find((ph) => ph._id === phone._id);
            if (p != undefined && "quantity" in p) {
                let q = cartItems.find((ph) => ph._id === phone._id).quantity;
                setNumInCart(q);
                if (q > 0) {
                    setIsInCart(true);
                }
            }
        } else {
            setNumInCart(0);
        }
    }, [cartItems]);

    const handleSaveModal = (num) => {
        if (cartItems.find((ph) => ph._id === phone._id)) {
            // is already in cart.
            console.log(`num passed to save: ${num}`);
            for (let i = 0; i < num; i++) {
                increase(phone);
            }
        } else {
            // not in cart
            console.log(`num passed to save: ${num}`);
            addPhone(phone);
            for (let i = 0; i < num - 1; i++) {
                increase(phone);
            }
        }

        handleCloseModal();
        // increase(phone)
    };

    if (phone != null) {
        return (
            <Container fluid>
                <QuantityPopup
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    handleShowModal={handleShowModal}
                    phoneTitle={phone.title}
                    handleSaveModal={handleSaveModal}
                />

                <Row>
                    <h2>{phone.title}</h2>
                </Row>
                <Row>
                    <Col>
                        <image src={IMAGEBASEURL + phone.image} />
                    </Col>
                    <Col>
                        <ul>
                            <li>Brand - {phone.brand}</li>
                            <li>Price - {phone.price}</li>
                            <li>Available Stock - {phone.stock}</li>
                            <li>Seller name: </li>
                        </ul>
                    </Col>
                    <Col style={{ borderLeft: "1px solid black" }}>
                        {" "}
                        <div>
                            <p>Num in cart: {numInCart}</p>
                            {/* <button onClick={increaseQuantity}>
                                    Add more to cart
                                </button> */}
                            {auth.user ? (
                                <Button onClick={handleShowModal}>
                                    Add to cart
                                </Button>
                            ) : (
                                <Button>
                                    <Link
                                        to="/login"
                                        style={{
                                            textDecoration: "none",
                                            color: "white",
                                        }}
                                    >
                                        Add to Cart
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>
                <hr />
                <Container fluid>
                    <Row>
                        <h3>Reviews</h3>
                    </Row>
                    <Row>
                        <ReviewList reviews={phone.reviews} />
                    </Row>
                </Container>
            </Container>
        );
    } else {
        return <div>Error....</div>;
    }
};

export default SinglePhone;
