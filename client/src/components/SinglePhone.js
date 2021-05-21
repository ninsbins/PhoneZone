import React, { useContext, useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Image,
    Spinner,
    Badge,
} from "react-bootstrap";
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

        console.log(status);

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
                setIsInCart(false);
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

                <Row className="singlephone">
                    <Col xs={3}>
                        <Image
                            src={IMAGEBASEURL + phone.image}
                            fluid
                            className="singlephone__image"
                        />
                    </Col>
                    <Col className="singlephone__info">
                        <Row>
                            <div className="singlephone__title">
                                {phone.title}
                            </div>
                            <div className="singlephone__brand">
                                {phone.brand}
                            </div>
                        </Row>
                        <Row>
                            <Col>
                                <Row>
                                    <div className="singlephone__rating">
                                        <Stars num={phone.RatingAverage} />
                                    </div>
                                </Row>
                                <Row>
                                    <div className="singlephone__price">
                                        {phone.price.toFixed(2)} AUD
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <div className="singlephone__seller">
                                <span className="singlephone__info__label">
                                    Seller:
                                </span>{" "}
                                <span className="singlephone__info__value">
                                    {phone.seller.firstname}{" "}
                                    {phone.seller.lastname}
                                </span>
                            </div>
                        </Row>{" "}
                        <div></div>
                    </Col>

                    <Col xs={3} className="singlephone__cart">
                        <Container>
                            <Row className="pb-3">
                                <Col>
                                    <div className="singlephone__stock">
                                        <span
                                            className="singlephone__cart__label"
                                            style={{
                                                color: "black",
                                            }}
                                        >
                                            In Stock:
                                        </span>{" "}
                                        <span className="singlephone__cart__value">
                                            {phone.stock}
                                        </span>
                                        {/* <span className="singlephone__stock__box">
                                        In Stock{" "}
                                        <Badge variant="light">
                                            {" "}
                                            {phone.stock}
                                        </Badge>
                                    </span> */}
                                    </div>
                                </Col>
                                <Col>
                                    {" "}
                                    <div className="singlephone__cartquantity">
                                        <span className="singlephone__cart__label">
                                            Quantity in cart:
                                        </span>{" "}
                                        <span className="singlephone__cart__value">
                                            {numInCart}
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="py-2">
                                {auth.user ? (
                                    isInCart ? (
                                        <Button
                                            block
                                            variant="info"
                                            onClick={handleShowModal}
                                        >
                                            <CartIcon /> Add more to cart
                                        </Button>
                                    ) : (
                                        <Button
                                            block
                                            variant="info"
                                            onClick={handleShowModal}
                                        >
                                            <CartIcon /> Add to cart
                                        </Button>
                                    )
                                ) : (
                                    // <Link to="/login">
                                    <Button
                                        block
                                        variant="info"
                                        onClick={() => history.push("/login")}
                                    >
                                        <CartIcon /> Add to cart
                                    </Button>
                                    // </Link>
                                )}
                            </Row>
                            <Row>
                                {isInCart && (
                                    <Button
                                        block
                                        variant="danger"
                                        onClick={() => removePhone(phone)}
                                    >
                                        <CartIcon /> Remove from cart
                                    </Button>
                                )}
                            </Row>
                        </Container>
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
