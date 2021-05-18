import React from "react";
import { Container, CardDeck } from "react-bootstrap";
import PhoneCard from "../components/PhoneCard";
import { Link } from "react-router-dom";

const SearchResult = (props) => {
    let searchResults = props.searchResults;

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
};

export default SearchResult;
