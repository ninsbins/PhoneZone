import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button, Figure, Image } from "react-bootstrap";
import CartContextProvider, { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import "../styles/SinglePhone.scss";
import ReviewList from "../components/ReviewList";
import axios from "axios";
import useAuth from "../services/useAuth";
import { Link, useParams } from "react-router-dom";

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
        setStatus(pageStatus.LOADING);

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
        if (cartItems.length > 0) {
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
                    <Col>
                        <Image src={IMAGEBASEURL + phone.image} fluid />
                    </Col>
                    <Col>
                        <Figure>
                            <Figure.Image
                                src={phone.image}
                            />

                        </Figure>
                    </Col>
                    <Col style={{ borderLeft: "1px solid black" }}>
                        {" "}
                        <div>
                            <h1>{phone.title}</h1>
                            <h2>{phone.brand}</h2>
                            <h2>${phone.price.toFixed(2)}</h2>
                            <p>In stock: {phone.stock}</p>
                            <p>Seller: {phone.seller.firstname} {phone.seller.lastname}</p>

                            <p>Quantity in cart: {numInCart}</p>
                        </div>
                        <div>
                            {/* this bit feels a bit messy */}
                            {/* <button onClick={increaseQuantity}>
                                    Add more to cart
                                </button> */} 
                            {
                                auth.user ? (
                                    <Button variant="primary" onClick={handleShowModal}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                            <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg> Add to cart
                                    </Button>

                                ) : (

                                    <Button variant="primary" onClick={<Link to="/login" />}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                            <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                        </svg> Add to cart
                                    </Button>
                                )
                            }

                            <div>
                                <Button variant="danger" onClick={() => removePhone(phone)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-x" viewBox="0 0 16 16">
                                        <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z" />
                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg> Remove from cart </Button>
                                <Button onClick={() => console.log(cartItems)}>
                                    Console log the cart </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <ReviewList
                            reviews={phone.reviews} />
                    </Col>
                </Row>
            </Container>

        );
    }
};

export default SinglePhone;
