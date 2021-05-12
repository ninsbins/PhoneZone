import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button, Figure } from "react-bootstrap";
import CartContextProvider, { CartContext } from "../contexts/CartContext";
import QuantityPopup from "./QuantityPopup";
import "../styles/SinglePhone.scss";
import axios from "axios";

const Reviews = (props) => {
    let reviews = props.reviews || null;
    let reviewerInfo = props.reviewerInfo || null;
    
    console.log(reviews);
    console.log(reviewerInfo);

    if (reviews != null && reviewerInfo != null) {
        return (
            reviews.map((review, index) => {
                <Card>
                    <Card.Body>
                        <Row key={review.reviewer}>
                            <Col>
                                <Card.Text>
                                    <div>{reviewerInfo[index].firstname}</div>
                                </Card.Text>
                            </Col>
                            <Col className="reviewInfo">
                                <p>Rating: {review.rating}</p>
                                <p>Comment: {review.comment}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            })
        );
    } else {
        return <div>This item has no reviews yet!</div>;
    }
}

export default Reviews;