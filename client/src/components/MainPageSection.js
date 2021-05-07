import React, { useState } from "react";
import { Container, CardDeck, Card } from "react-bootstrap";
import MainPageStatus from "../services/constants";
import PhoneCard from "./PhoneCard";
import SinglePhone from "./SinglePhone";

const dummy_phone = {
    _id: "60847ab6f71df6d112cc629a",
    title: "Sam Galaxy J7(2016) Dual J7108 4G 16GB Gold",
    brand: "Samsung",
    image: "Samsung.jpeg",
    stock: 3,
    seller: "5f5237a4c1beb1523fa3db4d",
    price: 231,
    reviews: [
        {
            reviewer: "5f5237a4c1beb1523fa3daec",
            rating: 5,
            comment: "It works excellent for my needs",
        },
        {
            reviewer: "5f5237a4c1beb1523fa3da44",
            rating: 5,
            comment:
                "This phone is nothing but #AWESOME. The picture quality alongside with the initial device itself is great. To be honest, it's worth the price and even my friends like the phone.",
        },
        {
            reviewer: "5f5237a4c1beb1523fa3db74",
            rating: 5,
            comment:
                "Excellent!! Phone from Samsung. worth of money. As this is the latest 2016 edition which come's with almost new features.",
        },
    ],
    RatingAverage: 5,
};

const MainPageSection = (props) => {
    let pageState = props.pageState || MainPageStatus.LOADING;
    let soldOutSoon = props.soldOutSoon || null;
    let bestSellers = props.bestSellers || null;
    const [selectedPhone, setSelectedPhone] = useState(null);
    let searchResults = props.searchResults || null;

    const selectPhone = (phone) => {
        props.setPageState(MainPageStatus.ITEM);
        setSelectedPhone(phone);
    };

    const goBackToMain = () => {
        props.setPageState(MainPageStatus.SUCCESS);
    };

    if (pageState == MainPageStatus.ERROR) {
        return (
            <div>
                <p>Oops, something went wrong</p>

                <div onClick={() => selectPhone(dummy_phone)}>
                    <PhoneCard phone={dummy_phone}></PhoneCard>
                </div>
            </div>
        );
    }

    if (pageState == MainPageStatus.LOADING) {
        return (
            <div>
                <p>Loading....</p>
            </div>
        );
    }

    if (pageState == MainPageStatus.SUCCESS) {
        return (
            <Container fluid>
                <h2>Sold out soon</h2>
                {/* Map through soldOutSoon phones for display */}
                {soldOutSoon != null ? (
                    <CardDeck>
                        {soldOutSoon.map((phone) => {
                            return (
                                <div onClick={() => selectPhone(phone)}>
                                    <PhoneCard phone={phone} />
                                </div>
                            );
                        })}
                    </CardDeck>
                ) : (
                    <div>No items to show</div>
                )}
                {/* Map through bestSeller phones for display */}
                <h2>Best Sellers</h2>
                {bestSellers != null ? (
                    <CardDeck>
                        {bestSellers.map((phone) => {
                            return (
                                <div onClick={() => selectPhone(phone)}>
                                    <PhoneCard phone={phone} />
                                </div>
                            );
                        })}{" "}
                    </CardDeck>
                ) : (
                    <div>No items to show</div>
                )}
            </Container>
        );
    }

    if (pageState == MainPageStatus.SEARCH) {
        return (
            <Container fluid>
                <h2>Search Result </h2>
                {searchResults != null ? (
                    <CardDeck>
                        {searchResults.map((phone) => {
                            return (
                                <div onClick={() => selectPhone(phone)}>
                                    <PhoneCard phone={phone} />
                                </div>
                            );
                        })}
                    </CardDeck>
                ) : (
                    <div>No items match your search</div>
                )}
            </Container>
        );
    }

    if (pageState == MainPageStatus.ITEM) {
        return (
            <div>
                <button onClick={goBackToMain}>
                    Go back to main (whilst retaining state)
                </button>
                {selectedPhone != null ? (
                    <SinglePhone phone={selectedPhone} />
                ) : (
                    <div>unable to get phone</div>
                )}
            </div>
        );
        // return <SinglePhone phone={selectedPhone} />;
    }
};

export default MainPageSection;
