import React from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/PhoneCard.scss";

const IMAGEBASEURL = `/images/`;

const PhoneCard = (props) => {
    return (
        <Card className="phonecard">
            <Card.Body>
                <Card.Title className="limit">{props.phone.title}</Card.Title>
                <Card.Subtitle>{props.phone.brand}</Card.Subtitle>
                <Card.Img src={IMAGEBASEURL + props.phone.image} />
            </Card.Body>
            <Card.Footer>
                <Button
                    className="tags"
                    variant="outline-success"
                    disabled="true"
                >
                    ${props.phone.price.toFixed(2)}
                </Button>
                {props.phone.RatingAverage == null ? null : (
                    <Button variant="outline-secondary" disabled="true">
                        {props.phone.RatingAverage.toFixed(1)}{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="dark-yellow"
                            class="bi bi-star-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    </Button>
                )}
                <Button variant="outline-secondary" disabled="true">
                    In stock: {props.phone.stock}
                </Button>
            </Card.Footer>
        </Card>

        // <div className="phonecard">
        //     {props.phone.title} - {props.phone.price} -{" "}
        //     {props.phone.RatingAverage}
        // </div>
    );
};

export default PhoneCard;
