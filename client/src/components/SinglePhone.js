import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button, Figure } from "react-bootstrap";
import CartContextProvider, { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import "../styles/SinglePhone.scss";
import Reviews from "../components/Reviews";
import axios from "axios";

const SinglePhone = (props) => {
    let phone = props.phone || null;

    const [reviewerInfo, setReviewerInfo] = useState(null);

    const { addPhone, increase, cartItems, removePhone } = useContext(
        CartContext
    );
    const [isInCart, setIsInCart] = useState(false);
    const [numInCart, setNumInCart] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    // useEffect(() => {
    //     let res = cartItems.find((ph) => ph._id === phone._id);
    //     // if phone already in cart
    //     // then setIsIncart to true

    //     // console.log(cartItems);
    //     // console.log(res);
    // }, []);

    useEffect(() => {
        if (phone.reviews != null) {
            let userInfo = [];
            phone.reviews.map((review) => {
                console.log(review);
                let id = review.reviewer;
                axios
                .get(`http://localhost:9000/users/${id}`)
                    .then((result) => {
                        console.log(result.user.data);
                        userInfo.push(result.data.user);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            });
            if (userInfo.length > 0) {
                setReviewerInfo(userInfo);
            }
        }
    }, []);

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
                    <Col>
                        <Figure>
                            <Figure.Image
                                src={phone.image}
                            />

                        </Figure>
                    </Col>
                    <Col>
                        <div>
                            <h1>{phone.title}</h1>
                            <h2>{phone.brand}</h2>
                            <h2>${phone.price.toFixed(2)}</h2>
                            In stock: {phone.stock}

                            {/* move this to checkout page as well? */}
                            <p>Num in cart: {numInCart}</p>
                        </div>
                        <div>
                            {/* <button onClick={increaseQuantity}>
                                    Add more to cart
                                </button> */}
                            <Button variant="primary" onClick={handleShowModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                </svg> Add to cart
                            </Button>

                            {/* move the remove from cart function to the checkout page? */}
                            <div>
                                <button onClick={() => removePhone(phone)}>
                                    Remove from cart
                            </button>
                                <button onClick={() => console.log(cartItems)}>
                                    Console log the cart
                            </button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <Reviews
                            reviews={phone.reviews}
                            reviewerInfo={reviewerInfo}
                        />
                    </Col>
                </Row>
            </Container>
            // <div>

            //     {props.phone.title} - {props.phone.price}
            //     and everything else for the phone
            // </div>
        );
    } else {
        return <div>Error....</div>;
    }
};

export default SinglePhone;
