import React from "react";
import Review from "./Review";

const ReviewList = (props) => {
    let reviews = props.reviews || [];

    if (reviews.length > 0) {
        return reviews.map((review) => {
            return <Review review={review} />;
        });
    } else {
        return <div>No reviews yet...</div>;
    }
};

export default ReviewList;
