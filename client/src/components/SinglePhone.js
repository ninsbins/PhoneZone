import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button, Image } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import useAuth from "../services/useAuth";
import { Link, useParams } from "react-router-dom";
import ReviewList from "./ReviewList";
import axios from "axios";

const IMAGEBASEURL = `http://localhost:9000/images/`;

const pageStatus = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
};

const SinglePhone = (props) => {
    // let phone = props.phone || null;

    const { addPhone, increase, cartItems, removePhone } = useContext(
        CartContext
    );
    const [phone, setPhone] = useState(null);
    const [status, setStatus] = useState(pageStatus.LOADING);
    const [isInCart, setIsInCart] = useState(false);
    const [numInCart, setNumInCart] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const auth = useAuth();
    const { id } = useParams();

    useEffect(() => {
        console.log(id);

        axios
            .get(`http://localhost:9000/phones/${id}`)
            .then((result) => {
                console.log(result);
                console.log(result.data);
                console.log(result.data.phone);

                setPhone(result.data.phone);

                setStatus(pageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setStatus(pageStatus.ERROR);
            });
    }, []);

    // useEffect(() => {
    //     let res = cartItems.find((ph) => ph._id === phone._id);
    //     // if phone already in cart
    //     // then setIsIncart to true

    //     // console.log(cartItems);
    //     // console.log(res);
    // }, []);

    useEffect(() => {
        if (cartItems != null && cartItems.length > 0) {
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

    if (status === pageStatus.LOADING) {
        return <div>Loading...</div>;
    }

    if (status === pageStatus.ERROR) {
        return <div>Error loading phone...</div>;
    }

    if (status === pageStatus.SUCCESS) {
        console.log(phone);
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
                        <Image src={IMAGEBASEURL + phone.image} fluid />
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
                        <ReviewList reviews={phone.reviews || []} />
                    </Row>
                </Container>
            </Container>
        );
    }
};

export default SinglePhone;
