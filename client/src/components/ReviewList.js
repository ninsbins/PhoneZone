import React from "react";
import Review from "./Review";

const ReviewList = (props) => {
    let reviews = props.reviews || [];

    // todo show first 3 comments only
    if (reviews.length > 0) {
        return reviews.map((review, index) => {
            return <Review 
                review={review} />;
        });
    } else {
        return <div>No reviews yet...</div>;
    }
};

export default ReviewList;
