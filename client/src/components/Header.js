import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";
import { Navbar, Form, Button, Row, Col, Container, NavbarBrand, Nav, NavDropdown } from "react-bootstrap";
import "../styles/Header.scss";
import RangeSlider from 'react-bootstrap-range-slider';

const Header = (props) => {
    const auth = useAuth();
    let history = useHistory();
    let [searchTerm, setSearchTerm] = useState("");
    let inSearchState = props.searchState || false;
    let [value, setValue] = useState(0);

    return (
        <div>
            <Navbar fluid className="header" bg="dark" variant="dark" expand="lg">
                <NavbarBrand href="#home">PhoneZone</NavbarBrand>
                <Nav className="ml-auto mr-5">
                    <input type="text" className="mr-sm-2" onChange={(e) => setSearchTerm(e.target.value)} ></input>
                    <Button variant="outline-primary" onClick={() => props.search(searchTerm)} >Search</Button>
                </Nav>
                <Nav>
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
                                <Link to="/login">Sign in</Link>
                            </Col>
                            <Col>
                                <Link to="/checkout">Checkout</Link>
                            </Col>
                        </>
                    )}
                </Nav>
            </Navbar>
            <div className="filters">
                {/* dropdown, and slider goes here */}
                {inSearchState ? (
                    <Row>
                        <RangeSlider
                            value={value}
                            onChange={changeEvent => setValue(changeEvent.target.value)} />
                        <NavDropdown title="Brand">
                            <NavDropdown.Item></NavDropdown.Item>
                        </NavDropdown>
                    </Row>
                ) : null}
            </div>
        </div>
    );
};

export default Header;
