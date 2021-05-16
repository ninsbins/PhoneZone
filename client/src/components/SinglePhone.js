import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import "../styles/SinglePhone.scss";
import ReviewList from "../components/ReviewList";
import axios from "axios";
import useAuth from "../services/useAuth";
import { Link, useParams } from "react-router-dom";
import CartIcon from "./CartIcon";

const IMAGEBASEURL = `http://localhost:9000/images/`;

const pageStatus = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
};

const SinglePhone = (props) => {
    // let phone = props.phone || null;

    const { addPhone, cartItems, removePhone } = useContext(CartContext);
    const cont = useContext(CartContext);
    const [phone, setPhone] = useState(null);
    const [status, setStatus] = useState(pageStatus.LOADING);
    const [isInCart, setIsInCart] = useState(false);
    const [numInCart, setNumInCart] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const auth = useAuth();
    const { id } = useParams();

    useEffect(() => {
        setStatus(pageStatus.LOADING);

        axios
            .get(`http://localhost:9000/phones/${id}`)
            .then((result) => {
                setPhone(result.data.phone);
                setStatus(pageStatus.SUCCESS);
                setQuantity();
            })
            .catch((err) => {
                console.log(err);
                setStatus(pageStatus.ERROR);
            });
    }, []);

    useEffect(() => {
        console.log("cart changed...");
        if (status === pageStatus.SUCCESS) {
            setQuantity();
        }
    }, [cartItems]);

    const setQuantity = () => {
        if (cartItems != null && cartItems.length > 0) {
            let pIndex = cartItems.findIndex((item) => item.product._id === id);
            if (pIndex > -1) {
                let q = cartItems[pIndex].quantity;
                setNumInCart(q);
                if (q > 0) {
                    setIsInCart(true);
                }
            }
        }
    };

    const handleLogCart = () => {
        console.log(cont);
        console.log(cartItems);
    };

    const handleSaveModal = (num) => {
        addPhone({ phone, num });

        handleCloseModal();
        // increase(phone)
    };

    function showMoreReviews() {
        setShowAllReviews(!showAllReviews);
    }

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
                    <Col xs={3}>
                        <Image src={IMAGEBASEURL + phone.image} fluid />
                    </Col>
                    <Col style={{ borderLeft: "1px solid grey" }}>
                        {" "}
                        <div>
                            <h2>{phone.title}</h2>
                            <h3>{phone.brand}</h3>
                            <h3>${phone.price.toFixed(2)}</h3>
                            <Button
                                className="tags"
                                variant="outline-secondary"
                                disabled="true"
                            >
                                In stock: {props.phone.stock}
                            </Button>
                            <Button
                                className="tags"
                                variant="outline-secondary"
                                disabled="true"
                            >
                                Seller: {phone.seller.firstname}{" "}
                                {phone.seller.lastname}
                            </Button>

                            <p>Quantity in cart: {numInCart}</p>
                        </div>
                        <div>
                            {/* this bit feels a bit messy */}
                            {/* Matt: moved the svg cart icon to it's own component for reuse (CartIcon.js) */}
                            {auth.user ? (
                                <Button
                                    variant="primary"
                                    onClick={handleShowModal}
                                >
                                    <CartIcon />
                                    Add to cart
                                </Button>
                            ) : (
                                <Link to="/login">
                                    <Button variant="primary">
                                        <CartIcon />
                                        Add to cart
                                    </Button>
                                </Link>
                            )}

                            <div>
                                <Button
                                    variant="danger"
                                    onClick={() => removePhone(phone)}
                                >
                                    <CartIcon />
                                    Remove from cart{" "}
                                </Button>
                                {/* <Button onClick={handleLogCart}>
                                    Console log the cart{" "}
                                </Button> */}
                            </div>
                        </div>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <h3>Reviews</h3>
                        <ReviewList
                            reviews={phone.reviews}
                            showAll={showAllReviews}
                        />
                        <div className="center">
                            {phone.reviews.length > 3 ? (
                                //if all shown, show collapse button
                                <Button
                                    variant="primary"
                                    onClick={showMoreReviews}
                                >
                                    {showAllReviews ? "Show less" : "Show more"}
                                </Button>
                            ) : null}
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default SinglePhone;
