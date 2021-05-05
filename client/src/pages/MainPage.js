import "../styles/Main.scss";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Row, Container } from "react-bootstrap";
import axios from "axios";

const Main = () => {
    // search State yes => search results.
    // search State no =>  => sold out soon and best sellers
    const [searchState, setSearchState] = useState(false);
    const [result, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [soldOutSoon, setSoldOutSoon] = useState(null);
    const [bestSellers, setBestSellers] = useState(null);

    // This search function is passed to the header, it will use this function.
    const search = (term) => {
        // do search
        console.log(`searching for ${term}`);

        // send search term to backend and get results

        setSearchState(true);
    };

    useEffect(() => {
        setLoading(true);
        // get sold out soon
        axios
            .get("http://localhost:9000/phones/soldoutsoon")
            .then((result) => {
                console.log(result);
                setSoldOutSoon(result.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
        // get best sellers
    }, []);

    if (loading) {
        return (
            <div className="Main">
                <Header search={search} searchState={searchState} />
                <div>Loading...</div>
            </div>
        );
    }

    if (soldOutSoon == null) {
        return (
            <div className="Main">
                <Header search={search} searchState={searchState} />
                <div>Error on requesting data...</div>
            </div>
        );
    }

    return (
        <div className="Main">
            <Header search={search} searchState={searchState} />
            {/* Item view or non Item view */}
            {searchState ? (
                // Go map through search results and display phones
                <Container fluid>
                    <p>Main page in search state...</p>
                    <h2>Results</h2>
                </Container>
            ) : (
                <Container fluid>
                    <p>Main page not in search state...</p>
                    <h2>Sold out soon</h2>
                    {/* Map through soldOutSoon phones for display */}
                    {soldOutSoon.map((phone) => {
                        return (
                            <div onClick={() => console.log(phone)}>
                                {phone.title}
                            </div>
                        );
                    })}
                    {/* Map through bestSeller phones for display */}
                    <h2>Best Sellers</h2>
                </Container>
            )}
        </div>
    );
};

export default Main;
