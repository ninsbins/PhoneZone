import React, { useState } from "react";
import { Container, CardDeck, Button } from "react-bootstrap";
import MainPageStatus from "../services/constants";
import PhoneCard from "./PhoneCard";
import SinglePhone from "./SinglePhone";
import { Route, Link, useHistory, useLocation } from "react-router-dom";
import "../styles/Main.scss";

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
        {
            reviewer: "5f5237a4c1beb1523fa3db74",
            rating: 5,
            comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies ornare elit eu pharetra. Sed placerat urna eros, at eleifend lacus placerat in. Pellentesque in urna nec velit blandit fermentum non eget justo. Aliquam in nibh eget sem sagittis varius vitae eu risus. Praesent ex lorem, elementum a bibendum sit amet, rhoncus eget purus. In vitae nibh convallis, rutrum lorem eget, dictum dolor. Sed dignissim, massa nec molestie volutpat, mi urna gravida nisi, sit amet iaculis mauris tortor a eros. Donec laoreet scelerisque velit in commodo. Nullam non felis id nulla tristique tincidunt sed sit amet mauris.
                Fusce ac lectus vel est fringilla molestie. Donec gravida mi nulla, non blandit sapien dapibus facilisis. Sed tincidunt dui dolor, feugiat semper lacus sagittis eget. Phasellus semper purus semper fringilla sodales. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur vel metus vitae est dapibus suscipit. Etiam iaculis ante vitae quam finibus convallis. Maecenas vestibulum nibh nec lacus eleifend, id cursus lorem euismod.
                Proin imperdiet pellentesque lobortis. Pellentesque accumsan nisl dolor, molestie mattis enim interdum ut. Nullam pharetra ex eu tellus blandit luctus. In hac habitasse platea dictumst. Nunc mattis interdum quam. Nullam in nibh vel nulla suscipit dignissis`,
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
    const [prevStatus, setPrevStatus] = useState("");

    const history = useHistory();
    const location = useLocation();

    const selectPhone = (phone) => {
        props.setPageState(MainPageStatus.ITEM);

        setSelectedPhone(phone);
    };

    if (pageState === MainPageStatus.ERROR) {
        return (
            <div>
                <p>Oops, something went wrong</p>
                <Link
                    to={{
                        pathname: `/phone/${dummy_phone._id}`,
                        state: { fromError: true },
                    }}
                    onClick={() => selectPhone(dummy_phone)}
                >
                    <PhoneCard phone={dummy_phone}></PhoneCard>
                </Link>
            </div>
        );
    }

    if (pageState === MainPageStatus.LOADING) {
        return (
            <div>
                <p>Loading....</p>
            </div>
        );
    }

    if (pageState === MainPageStatus.SUCCESS) {
        return (
            <Container fluid>
                <br></br>
                <h2 className="sectionTitle">Sold out soon</h2>
                <p className="sectionSubtitle">Get in quick before they're gone!</p>
                {/* Map through soldOutSoon phones for display */}
                {soldOutSoon != null ? (
                    <CardDeck>
                        {soldOutSoon.map((phone) => {
                            return (
                                <Link
                                    to={{
                                        pathname: `/phone/${phone._id}`,
                                        state: { fromSuccess: true },
                                    }}
                                    onClick={() => selectPhone(phone)}
                                >
                                    <PhoneCard phone={phone}></PhoneCard>
                                </Link>
                            );
                        })}
                    </CardDeck>
                ) : (
                    <div>No items to show</div>
                )}
                <br></br>
                {/* Map through bestSeller phones for display */}
                <h2 className="sectionTitle">Best Sellers</h2>
                <p className="sectionSubtitle">Check out our best sellers!</p>
                {bestSellers != null ? (
                    <CardDeck>
                        {bestSellers.map((phone) => {
                            return (
                                <Link
                                    to={{
                                        pathname: `/phone/${phone._id}`,
                                        state: { fromSuccess: true },
                                    }}
                                    onClick={() => selectPhone(phone)}
                                >
                                    <PhoneCard phone={phone}></PhoneCard>
                                </Link>
                            );
                        })}{" "}
                    </CardDeck>
                ) : (
                    <div>No items to show</div>
                )}
            </Container>
        );
    }

    if (pageState === MainPageStatus.SEARCH) {
        return (
            <Container fluid>
                <h2>Search Result </h2>
                {searchResults != null ? (
                    <CardDeck>
                        {searchResults.map((phone) => {
                            return (
                                <Link
                                    to={{
                                        pathname: `/phone/${phone._id}`,
                                        state: { fromSearch: true },
                                    }}
                                    onClick={() => selectPhone(phone)}
                                >
                                    <PhoneCard phone={phone}></PhoneCard>
                                </Link>
                            );
                        })}
                    </CardDeck>
                ) : (
                    <div>No items match your search</div>
                )}
            </Container>
        );
    }

    const handleGoBack = (loc) => {
        const s = loc.state;
        if (s.hasOwnProperty("fromError")) {
            history.push("/");
            props.setPageState(MainPageStatus.ERROR);
        } else if (s.hasOwnProperty("fromSuccess")) {
            history.push("/");
            props.setPageState(MainPageStatus.SUCCESS);
        } else if (s.hasOwnProperty("fromSearch")) {
            history.push("/");
            props.setPageState(MainPageStatus.SEARCH);
        }
    };

    if (pageState === MainPageStatus.ITEM) {
        return (
            <div>
                <Button onClick={() => handleGoBack(location)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg> Back
                </Button>
                <Route path="/phone/:id">
                    <SinglePhone phone={selectedPhone} />
                </Route>
            </div>
        );
    }
};

export default MainPageSection;
