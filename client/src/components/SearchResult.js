import React from "react";
import { Container, CardDeck, Row } from "react-bootstrap";
import PhoneCard from "../components/PhoneCard";
import { Link } from "react-router-dom";

const SearchResult = (props) => {
    let searchResults = props.searchResults;
    console.log(props);
    console.log(props.searchResults);

    if (!searchResults || searchResults == null || searchResults.length == 0) {
        return (
            <Container fluid>
                <Row className="justify-content-center pt-4">
                    <h3>No items match your search term</h3>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row className="justify-content-center pt-5">
                <h2>Search Result </h2>
            </Row>

            {searchResults != null ? (
                <Container fluid className="py-4 px-4">
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
                </Container>
            ) : (
                <div>No items match your search</div>
            )}
        </Container>
    );
};

export default SearchResult;
