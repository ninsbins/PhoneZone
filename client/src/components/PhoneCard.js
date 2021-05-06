import React from "react";

const PhoneCard = (props) => {
    return (
        <div onClick={() => {}}>
            {props.phone.title} - {props.phone.price} -{" "}
            {props.phone.RatingAverage}
        </div>
    );
};

export default PhoneCard;
