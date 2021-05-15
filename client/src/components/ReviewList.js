import React from "react";
import Review from "./Review";

const ReviewList = (props) => {
    let reviews = props.reviews || [];
    let showAll = props.showAll || false;

    // todo show first 3 comments only
    if (reviews.length > 0) {
        return reviews.map((review, index) => {
            if (index > 2 && !showAll) {
                return <Review
                    review={review}
                    class="hidden" />;
            }
            return <Review
                review={review}
                class="show" />;

        });
    } else {
        return <div>No reviews yet...</div>;
    }
};

export default ReviewList;
