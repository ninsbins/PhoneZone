import React from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../services/useAuth";
// import AuthButton from "../components/AuthButton";
import "../styles/Login.scss";
import { Row, Container, Button, Col, Form } from "react-bootstrap";

const LoginPage = () => {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [fail, setFail] = useState(false);

    let { from } = location.state || { from: { pathname: "/" } };

    const findErrors = () => {
        const errors = {};
        if (email === "") errors.email = "Username cannot be blank";
        else if (email.length < 3) errors.email = "Enter a valid username";
        if (password === "") errors.password = "Password cannot be blank";

        return errors;
    };

    let login = () => {
        console.log(`email: ${email} password: ${password}`);
        // validate here
        const newErrors = findErrors();
        if (Object.keys(newErrors).length > 0) {
            // we have errors
            setErrors(newErrors);
        } else {
            auth.signin(email, password, success, failure);
        }
    };

    const success = () => {
        history.goBack();
    };

    const failure = () => {
        setFail(true);
    };

    return (
        <Container fluid className="Login">
            <Row>
                <Col lg={4} className="Login banner">
                    <h2>
                        <Link to="/" className="Login banner__title">
                            PhoneZone
                        </Link>
                    </h2>
                </Col>

                <Col className="Login form">
                    <h2>Sign in to PhoneZone</h2>
                    <p>
                        Not a member? <Link to="/signup">Sign up now</Link>
                    </p>
                    <Form>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 5 }}>
                                <Form.Label className="Login form__label">
                                    Username
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                    Your username is your email address that you
                                    signed up with.
                                </Form.Text>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 5 }}>
                                <Form.Label className="Login form__label">
                                    Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Button onClick={login}>Submit</Button>
                    </Form>
                    {fail ? (
                        <div style={{ color: "red" }}>Failed to log in</div>
                    ) : null}
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
