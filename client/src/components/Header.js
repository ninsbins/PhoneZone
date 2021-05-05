import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";
import { Row, Col, Container } from "react-bootstrap";
import "../styles/Header.scss";

const Header = (props) => {
    const auth = useAuth();
    let history = useHistory();
    let [searchTerm, setSearchTerm] = useState("");
    let inSearchState = props.searchState || false;

    return (
        <Container fluid className="header">
            <Row>
                <Col sm={2}>PhoneZone</Col>
                <Col sm={6}>
                    <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></input>

                    <button onClick={() => props.search(searchTerm)}>
                        Search
                    </button>
                </Col>

                {auth.user ? (
                    <>
                        <Col>
                            <Link to="/checkout">Checkout</Link>
                        </Col>
                        <Col>
                            <Link to="/userProfile">Profile</Link>
                        </Col>
                        <Col>
                            {" "}
                            <button
                                onClick={() => {
                                    auth.signout(() => history.push("/"));
                                }}
                            >
                                sign-out
                            </button>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col>
                            <Link to="/login">sign-in</Link>
                        </Col>
                        <Col>
                            <Link to="/checkout">Checkout</Link>
                        </Col>
                    </>
                )}
            </Row>
            <Row>
                {inSearchState ? (
                    <Col>dropdown, and slider goes here</Col>
                ) : null}
            </Row>
        </Container>
    );
};

export default Header;
