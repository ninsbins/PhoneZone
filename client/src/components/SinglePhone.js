import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";

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
                    <Col>
                        <ul>
                            <li>Title - {phone.title}</li>
                            <li>Brand - {phone.brand}</li>
                            <li>Image - {phone.image}</li>
                            <li>Stock - {phone.stock}</li>
                            <li>Price - {phone.price}</li>
                        </ul>
                    </Col>
                    <Col>
                        <div>
                            <p>Num in cart: {numInCart}</p>
                            {/* <button onClick={increaseQuantity}>
                                    Add more to cart
                                </button> */}
                            <button onClick={handleShowModal}>
                                Add to cart
                            </button>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <button onClick={() => removePhone(phone)}>
                                Remove from cart
                            </button>
                            <button onClick={() => console.log(cartItems)}>
                                Console log the cart
                            </button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {phone.reviews != null
                            ? phone.reviews.map((review) => {
                                  return (
                                      <Row key={review.reviewer}>
                                          <p>Rating: {review.rating}</p>
                                          <p>Comment: {review.comment}</p>
                                      </Row>
                                  );
                              })
                            : null}
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
