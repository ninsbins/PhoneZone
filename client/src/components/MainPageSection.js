import React from "react";
import { Container } from "react-bootstrap";
import MainPageStatus from "../services/constants";

const MainPageSection = (props) => {
    let pageState = props.pageState || MainPageStatus.LOADING;
    let soldOutSoon = props.soldOutSoon || [];
    let bestSellers = props.bestSellers || [];

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
                              <div onClick={() => console.log(phone)}>
                                  {phone.title}
                              </div>
                          );
                      })
                    : null}
                {/* Map through bestSeller phones for display */}
                <h2>Best Sellers</h2>
                {bestSellers != null
                    ? bestSellers.map((phone) => {
                          return (
                              <div
                                  onClick={() =>
                                      props.setPageState(MainPageStatus.ITEM)
                                  }
                              >
                                  {phone.title}
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
                <button onClick={() => props.setPageState(MainPageStatus.ITEM)}>
                    Item view
                </button>
            </Container>
        );
    }

    if (pageState == MainPageStatus.ITEM) {
        return <p>Item view</p>;
    }
};

export default MainPageSection;
