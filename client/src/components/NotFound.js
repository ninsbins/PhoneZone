import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/NotFound.scss";
// import LeftArrowIcon from "./LeftArrowIcon";
const NotFound = () => {
    return (
        <Container fluid className="notfound">
            <Row className="justify-content-center">
                <div className="notfound__title">404</div>
            </Row>
            <Row className="justify-content-center">
                <div className="notfound__text">
                    Oh no! We can't find the page that you're looking for :(
                </div>
            </Row>
            <Row className="justify-content-center pt-3">
                <div className="notfound__link">
                    <Link to="/" className="notfound__link__link">
                        <div className="nofound__link__text">Go to Main</div>
                    </Link>
                </div>
            </Row>
        </Container>
    );
};

export default NotFound;
