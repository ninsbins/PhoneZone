import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const SinglePhone = (props) => {
    let phone = props.phone || null;
    if (phone != null) {
        return (
            <Container fluid>
                <Row>
                    <ul>
                        <li>Title - {phone.title}</li>
                        <li>Brand - {phone.brand}</li>
                        <li>Image - {phone.image}</li>
                        <li>Stock - {phone.stock}</li>
                        <li>Price - {phone.price}</li>
                    </ul>
                </Row>

                <Row>
                    <Col>
                        {phone.reviews != null
                            ? phone.reviews.map((review) => {
                                  return (
                                      <Row>
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
