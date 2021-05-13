import React, { useState, useEffect } from "react";
import { Row, Container, Card } from "react-bootstrap";

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
            <Card>
                <Card.Body>
                    <Row>
                        {/* add in user first and last name */}
                        <p>Rating: {props.review.rating}</p>
                    </Row>
                    <Row>
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
                    </Row>
                </Card.Body>
            </Card>
            <Row>
                
            </Row>
            
        </Container>
    );
};

export default Review;
