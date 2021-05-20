import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Image, Spinner } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import "../styles/SinglePhone.scss";
import ReviewList from "../components/ReviewList";
import axios from "axios";
import useAuth from "../services/useAuth";
import { Link, useParams, useHistory } from "react-router-dom";
import CartIcon from "./CartIcon";
import Stars from "./Stars";
import "../styles/SpinnerOverlay.scss";
import NotFound from "./NotFound";
import LeftArrowIcon from "./LeftArrowIcon";

const IMAGEBASEURL = `/images/`;

const pageStatus = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
};

const SinglePhone = (props) => {
    // let phone = props.phone || null;

    const { addPhone, cartItems, removePhone, requestInProgress } =
        useContext(CartContext);
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
    const history = useHistory();

    useEffect(() => {
        setStatus(pageStatus.LOADING);

        axios
            .get(`/phones/${id}`)
            .then((result) => {
                setPhone(result.data.phone);
                setStatus(pageStatus.SUCCESS);
                setQuantity();
            })
            .catch((err) => {
                console.log(err);
                setStatus(pageStatus.ERROR);
            });
    }, [id]);

    useEffect(() => {
        console.log("cart changed...");

        if (status === pageStatus.SUCCESS) {
            setQuantity();
        }
    }, [cartItems, cartItems.items, status]);

    const setQuantity = () => {
        if (cartItems != null && cartItems.length > 0) {
            let pIndex = cartItems.findIndex((item) => item.product._id === id);
            if (pIndex > -1) {
                let q = cartItems[pIndex].quantity;
                setNumInCart(q);
                if (q > 0) {
                    setIsInCart(true);
                }
            } else {
                setNumInCart(0);
            }
        } else {
            setNumInCart(0);
            setIsInCart(false);
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
        // return <div>Error loading phone...</div>;
        return <NotFound />;
    }

    if (status === pageStatus.SUCCESS) {
        console.log(phone);
        return (
            <Container fluid>
                {requestInProgress && (
                    <div className="spinner__overlay">
                        <Spinner
                            animation="border"
                            className="spinner__spinner"
                            variant="info"
                        />
                    </div>
                )}
                <QuantityPopup
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    handleShowModal={handleShowModal}
                    phoneTitle={phone.title}
                    handleSaveModal={handleSaveModal}
                    stock={phone.stock}
                    quantityInCart={numInCart}
                />

                <Row>
                    <Col xs={3}>
                        <Image src={IMAGEBASEURL + phone.image} fluid />
                    </Col>
                    <Col>
                        {" "}
                        <div>
                            <h2>{phone.brand}</h2>
                            <h3>{phone.title}</h3>
                            <h3>${phone.price.toFixed(2)}</h3>
                            <h3>
                                <Stars num={phone.RatingAverage} />
                            </h3>
                            <Button
                                className="tags"
                                variant="outline-secondary"
                                disabled="true"
                            >
                                In stock: {phone.stock}
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
                            <Row>
                                <Col sm={2}>
                                    {auth.user ? (
                                        <Button
                                            block
                                            variant="primary"
                                            onClick={handleShowModal}
                                        >
                                            <CartIcon /> Add to cart
                                        </Button>
                                    ) : (
                                        <Link to="/login">
                                            <Button variant="primary">
                                                <CartIcon /> Add to cart
                                            </Button>
                                        </Link>
                                    )}
                                </Col>
                                <Col sm={2}>
                                    {isInCart && (
                                        <div>
                                            <Button
                                                block
                                                variant="danger"
                                                onClick={() =>
                                                    removePhone(phone)
                                                }
                                            >
                                                <CartIcon /> Remove from cart
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
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
