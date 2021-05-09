import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";
import {
    Navbar,
    Button,
    Row,
    Col,
    Container,
    NavbarBrand,
    Nav,
    NavDropdown,
    Dropdown,
} from "react-bootstrap";
import "../styles/Header.scss";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import axios from "axios";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

const Header = (props) => {
    const auth = useAuth();
    const [brands, setBrands] = useState(null);
    const [value, setValue] = useState({ min: 0, max: 1000 });

    let history = useHistory();
    let [searchTerm, setSearchTerm] = useState("");
    let [selectedBrand, setSelectedBrand] = useState(null);
    let inSearchState = props.searchState || false;

    useEffect(() => {
        axios
            .get("http://localhost:9000/phones/brands")
            .then((result) => {
                setBrands(result.data.brands);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // just a helper whilst working in dev, get rid of this later
    function refreshPage() {
        history.push("/");
        // window.location.reload(false);
    }

    let handleSelect = async (eventKey) => {
        console.log(eventKey);
        props.filter(brands[eventKey], value.min, value.max);
        setSelectedBrand(brands[eventKey]);
    };

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
            <Navbar
                fluid
                className="header"
                bg="dark"
                variant="dark"
                expand="lg"
            >
                <NavbarBrand>PhoneZone</NavbarBrand>
                <Nav className="ml-auto mr-5">
                    <input
                        type="text"
                        className="mr-sm-2"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></input>
                    <Button
                        variant="outline-light"
                        onClick={() => props.search(searchTerm)}
                    >
                        Search
                    </Button>
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
                        <Col className="filterItem">
                            <InputRange
                                maxValue={1000}
                                minValue={0}
                                value={value}
                                onChange={(value) => {
                                    setValue(value);
                                    props.filter(
                                        selectedBrand,
                                        value.min,
                                        value.max
                                    );
                                }}
                            />
                        </Col>
                        <Col>
                            <Dropdown onSelect={handleSelect}>
                                <Dropdown.Toggle
                                    variant="secondary"
                                    id="dropdown-basic"
                                >
                                    {selectedBrand == null
                                        ? "Brands"
                                        : selectedBrand}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {brands == null ? (
                                        <Dropdown.ItemText>
                                            No brands to show
                                        </Dropdown.ItemText>
                                    ) : (
                                        brands.map((brand, index) => (
                                            <Dropdown.Item eventKey={index}>
                                                {brand}
                                            </Dropdown.Item>
                                        ))
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            {/* <Nav onClick={(key) => handleSelect(key)}>
                                <NavDropdown title={selectedBrand} id="basic-nav-dropdown">
                                    {(brands == null)
                                        ? (<NavDropdown.ItemText>No brands to show</NavDropdown.ItemText>)
                                        : (brands.map((brand, index) => (<NavDropdown.Item eventKey={index}>{brand}</NavDropdown.Item>)))}
                                </NavDropdown>
                            </Nav> */}
                        </Col>
                    </Row>
                ) : null}
            </div>
        </div>
    );
};

export default Header;
