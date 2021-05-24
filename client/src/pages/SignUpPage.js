import React from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../services/useAuth";
// import AuthButton from "../components/AuthButton";
import "../styles/Signup.scss";
import { Row, Container, Button, Col, Form } from "react-bootstrap";

const SignUpPage = () => {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    let { from } = location.state || { from: { pathname: "/" } };

    let signup = () => {
        console.log(`email: ${email} password: ${password}`);
        // going back two as we will always route to /login before /signup.

        auth.signup(firstName, lastName, email, password, () => {
            history.go(-2);
        });
    };

    return (
        <Container fluid className="signup">
            <Row>
                <Col lg={4} className="signup banner">
                    <h2>
                        <Link to="/" className="signup banner__title">
                            PhoneZone
                        </Link>
                    </h2>
                </Col>

                <Col className="signup form">
                    <h2>Sign up to PhoneZone</h2>
                    <p>
                        Already a member? <Link to="/login">Sign in now</Link>
                    </p>
                    <Form>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 3 }}>
                                <Form.Label className="signup form__label">
                                    First Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First name"
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </Col>
                            <Col sm={{ span: 3 }}>
                                <Form.Label className="signup form__label">
                                    Last Name
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last name"
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 6 }}>
                                <Form.Label className="signup form__label">
                                    Email
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    Your username will be this email address.
                                </Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 6 }}>
                                <Form.Label className="signup form__label">
                                    Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Col>
                        </Form.Group>

                        <Button onClick={signup}>Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>

        // <div>
        //     <p>Welcome to the Log in page</p>
        //     <p>
        //         You need to log in first to view the page at {from.pathname} or
        //         do whatever you were trying to do.
        //     </p>
        //     <button onClick={login}> Log in</button>
        //     <AuthButton />
        // </div>
    );
};

export default SignUpPage;
