import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";
import { Navbar, Button, Row, Col, Container, NavbarBrand, Nav, NavDropdown } from "react-bootstrap";
import "../styles/Header.scss";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import axios from "axios";

const Header = (props) => {
    const auth = useAuth();
    const [brands, setBrands] = useState(null);
    const [value, setValue] = useState({min: 50, max: 500});

    let history = useHistory();
    let [searchTerm, setSearchTerm] = useState("");
    let inSearchState = props.searchState || false;

    useEffect(() => {
        axios.get("http://localhost:9000/phones/brands")
            .then((result) => {
                console.log(result.data.brands);
                setBrands(result.data.brands);
            }).catch((err) => {
                console.log(err);
            })
    }, []);
    
    // just a helper whilst working in dev, get rid of this later
    function refreshPage() {
        window.location.reload(false);
    }

    // return (
    //     <Container fluid className="header">
    //         <Row>
    //             <Col sm={2} onClick={refreshPage}>
    //                 PhoneZone
    //             </Col>
    //             <Col sm={6}>
    //                 <input
    //                     type="text"
    //                     onChange={(e) => setSearchTerm(e.target.value)}
    //                 ></input>

    //                 <button onClick={() => props.search(searchTerm)}>
    //                     Search
    //                 </button>
    //             </Col>

    return (
        <div>
            <Navbar fluid className="header" bg="dark" variant="dark" expand="lg">
                <NavbarBrand onClick={refreshPage}>PhoneZone</NavbarBrand>
                <Nav className="ml-auto mr-5">
                    <input type="text" className="mr-sm-2" onChange={(e) => setSearchTerm(e.target.value)} ></input>
                    <Button variant="outline-light" onClick={() => props.search(searchTerm)} >Search</Button>
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
            <div>
                {/* dropdown, and slider goes here */}
                {inSearchState ? (
                    <Row className="filters">
                        <Col className="sliderContainer">
                            <InputRange
                                maxValue={1000}
                                minValue={0}
                                value={value}
                                onChange={value => setValue(value)}
                                onChangeComplete={console.log(value)}/>
                        </Col>
                        <Col>
                            <NavDropdown title="Brand">
                                {(brands == null) ? (<NavDropdown.ItemText>No brands to show</NavDropdown.ItemText>) : (brands.map((brands) => (<NavDropdown.Item value={brands}>{brands}</NavDropdown.Item>)))}
                            </NavDropdown>
                        </Col>
                    </Row>
                ) : null}
            </div>
        </div>
    );
};

export default Header;
