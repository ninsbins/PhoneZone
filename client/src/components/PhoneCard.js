import React from "react";
import "../styles/PhoneCard.scss";

const PhoneCard = (props) => {
    return (
        <div className="phonecard">
            {props.phone.title} - {props.phone.price} -{" "}
            {props.phone.RatingAverage}
        </div>
    );
};

export default PhoneCard;
