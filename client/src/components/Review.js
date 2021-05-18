import React, { useState, useEffect } from "react";
import { Row, Container, Card, Col, Button } from "react-bootstrap";
import Stars from "./Stars.js";

import "../styles/Review.scss";

const Review = (props) => {
    const [fullView, setFullView] = useState(false);

    useEffect(() => {
        if (props.review.comment.length < 200) {
            setFullView(true);
        }
    }, [props.review.comment.length]);

    const limitComment = (comment) => {
        return comment.slice(0, 200);
    };

    return (
        <Container fluid className={props.class}>
            <Card>
                <Card.Body>
                    <Row>
                        <Col xs={2} className="center">
                            <Container>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="45"
                                    height="45"
                                    fill="currentColor"
                                    class="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    <path
                                        fill-rule="evenodd"
                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                    />
                                </svg>
                            </Container>
                            <p>
                                {props.review.reviewer.firstname}{" "}
                                {props.review.reviewer.lastname}
                            </p>
                        </Col>
                        <Col>
                            <div>
                                <p>
                                    <Stars num={props.review.rating} />
                                </p>
                            </div>
                            {fullView ? (
                                <p>{props.review.comment}</p>
                            ) : (
                                <div>
                                    {limitComment(props.review.comment)} ...
                                    <Button
                                        variant="link"
                                        className="link"
                                        onClick={() => setFullView(true)}
                                    >
                                        See more
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Review;
