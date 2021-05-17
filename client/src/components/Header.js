import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import SignOutButton from "./SignOutButton";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";
import {
    Navbar,
    Button,
    Row,
    Col,
    NavbarBrand,
    Nav,
    Dropdown,
    Image,
} from "react-bootstrap";
import "../styles/Header.scss";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import axios from "axios";

const IMAGEBASEURL = `/images/`;

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
            .get("phones/brands")
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

    return (
        <div>
            <Navbar
                fluid
                className="header"
                bg="dark"
                variant="dark"
                expand="lg"
            >
                <NavbarBrand>
                    <Image src={IMAGEBASEURL + "3.png"} width="50px" />
                    PhoneZone
                </NavbarBrand>
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
                            <Link to="/userProfile">
                                <Button variant="light" className="navLinks">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-person"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                    </svg>{" "}
                                    Profile
                                </Button>
                            </Link>
                            <Link to="/checkout">
                                <Button
                                    variant="outline-light"
                                    className="navLinks"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-cart"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>{" "}
                                    Checkout
                                </Button>
                            </Link>
                            <SignOutButton callback={refreshPage} />
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="light" className="navLinks">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/checkout">
                                <Button
                                    variant="outline-light"
                                    className="navLinks"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-cart"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>{" "}
                                    Checkout
                                </Button>
                            </Link>
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
                        </Col>
                    </Row>
                ) : null}
            </div>
        </div>
    );
};

export default Header;
