import React from "react";

const SinglePhone = (props) => {
    return (
        <div>
            {props.phone.title} - {props.phone.price}
            and everything else for the phone
        </div>
    );
};

export default SinglePhone;
