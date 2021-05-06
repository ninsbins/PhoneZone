import React, { useState } from "react";
import { Container } from "react-bootstrap";
import MainPageStatus from "../services/constants";
import PhoneCard from "./PhoneCard";
import SinglePhone from "./SinglePhone";

const MainPageSection = (props) => {
    let pageState = props.pageState || MainPageStatus.LOADING;
    let soldOutSoon = props.soldOutSoon || [];
    let bestSellers = props.bestSellers || [];
    const [selectedPhone, setSelectedPhone] = useState(null);
    let searchResults = props.searchResults || [];

    const selectPhone = (phone) => {
        props.setPageState(MainPageStatus.ITEM);
        setSelectedPhone(phone);
    };

    if (pageState == MainPageStatus.ERROR) {
        return (
            <div>
                <p>Oops, something went wrong</p>
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
                {soldOutSoon != null
                    ? soldOutSoon.map((phone) => {
                          return (
                              <div onClick={() => selectPhone(phone)}>
                                  <PhoneCard phone={phone} />
                              </div>
                          );
                      })
                    : null}
                {/* Map through bestSeller phones for display */}
                <h2>Best Sellers</h2>
                {bestSellers != null
                    ? bestSellers.map((phone) => {
                          return (
                              <div onClick={() => selectPhone(phone)}>
                                  <PhoneCard phone={phone} />
                              </div>
                          );
                      })
                    : null}
            </Container>
        );
    }

    if (pageState == MainPageStatus.SEARCH) {
        return (
            <Container fluid>
                <h2>Search Result </h2>
                {searchResults != null
                    ? searchResults.map((phone) => {
                          return (
                              <div onClick={() => selectPhone(phone)}>
                                  <PhoneCard phone={phone} />
                              </div>
                          );
                      })
                    : null}
            </Container>
        );
    }

    if (pageState == MainPageStatus.ITEM) {
        return <SinglePhone phone={selectedPhone} />;
    }
};

export default MainPageSection;
