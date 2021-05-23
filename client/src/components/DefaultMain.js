import "../styles/Main.scss";
import React, { useState, useEffect } from "react";
import axiosConfig from "../services/axiosConfig";
import MainPageStatus from "../services/constants";
import { Link } from "react-router-dom";
import { Container, CardDeck, Spinner } from "react-bootstrap";
import PhoneCard from "../components/PhoneCard";

const DefaultMain = () => {
    const [soldOutSoon, setSoldOutSoon] = useState(null);
    const [bestSellers, setBestSellers] = useState(null);
    const [pageState, setPageState] = useState(MainPageStatus.LOADING);

    useEffect(() => {
        setPageState(MainPageStatus.LOADING);
        // get sold out soon
        axiosConfig
            .get("phones/soldoutsoon")
            .then((result) => {
                setSoldOutSoon(result.data);
                setPageState(MainPageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
        setPageState(MainPageStatus.LOADING);
        axiosConfig
            .get("phones/bestsellers")
            .then((result) => {
                setBestSellers(result.data);
                setPageState(MainPageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
        // }
    }, []);

    if (pageState === MainPageStatus.ERROR) {
        return (
            <div>
                <p>Oops, something went wrong</p>
            </div>
        );
    }

    return (
        <Container fluid>
            <br></br>
            <h2 className="sectionTitle">Sold out soon</h2>
            <p className="sectionSubtitle">Get in quick before they're gone!</p>

            {/* Map through soldOutSoon phones for display */}
            {pageState === MainPageStatus.LOADING && (
                <Spinner animation="border" />
            )}
            {soldOutSoon != null ? (
                <CardDeck className="justify-content-center">
                    {soldOutSoon.map((phone) => {
                        return (
                            <Link
                                to={{
                                    pathname: `/phone/${phone._id}`,
                                    state: { fromSuccess: true },
                                }}
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
            {pageState === MainPageStatus.LOADING && (
                <Spinner animation="border" />
            )}
            {bestSellers != null ? (
                <CardDeck className="justify-content-center">
                    {bestSellers.map((phone) => {
                        return (
                            <Link
                                to={{
                                    pathname: `/phone/${phone._id}`,
                                    state: { fromSuccess: true },
                                }}
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
};

export default DefaultMain;
