import React, { useState, useEffect } from "react";
import { Row, Container } from "react-bootstrap";

const Review = (props) => {
    const [fullView, setFullView] = useState(false);

    useEffect(() => {
        if (props.review.comment.length < 200) {
            setFullView(true);
        }
    }, []);

    const limitComment = (comment) => {
        return comment.slice(0, 200);
    };

    return (
        <Container fluid>
            <Row>
                <p>Rating: {props.review.rating}</p>
            </Row>
            <Row>
                {fullView ? (
                    <p>Comment: {props.review.comment}</p>
                ) : (
                    <div>
                        {limitComment(props.review.comment)} ...
                        <button onClick={() => setFullView(true)}>
                            View more
                        </button>
                    </div>
                )}
            </Row>
        </Container>
    );
};

export default Review;
