import React from "react";
import {Container, Row, Col, Modal, Button, Form, InputGroup} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../services/useAuth";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const UserProfile = () => {
    let auth = useAuth();
    const [loading, setLoading] = useState(true);
    let [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:9000/users/${auth.user}`)
            .then((result) => {
                console.log(result);
                    setUserDetails(result.data.user);
                    setLoading(false);
                    setError(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setError(true);
            });
    },[]);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user details....</div>;
    }

    return (
        <Router basename="userProfile">
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Edit Profile</Link>
                        </li>
                        <li>
                            <Link to="/password">Change Password</Link>
                        </li>
                        <li>
                            <Link to="/listings">Manage Listings</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/password">
                        <ChangePassword userdetails={userDetails} />
                    </Route>
                    <Route path="/listings">
                        <ManageListings userdetails={userDetails} />
                    </Route>
                    <Route path="/">
                        <Profile userdetails={userDetails} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

function Profile({userdetails,}) {
    // TODO Add form and add modal to confirm password before submitting changes
    // May need to add to backend api thing to confirm password
    // Should remove password hash being sent to user
    return (
        <div>
            <ul>
                <li>firstname: {userdetails.firstname}</li>
                <li>lastname: {userdetails.lastname}</li>
                <li>email: {userdetails.email}</li>
                <li><pre>{JSON.stringify(userdetails,null,2)}</pre></li>
            </ul>
        </div>
    );
}
function ChangePassword({userdetails,}) {
    // TODO connect form to password change
    return (
        <div>
        Put a form here
        </div>
    );
}
function ManageListings({userdetails,}) {
    // TODO connect up to backend to submit disabled and enabled and delete operations
    let auth = useAuth();
    const [loading, setLoading] = useState(true);
    let [listings, setListings] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:9000/users/get_phones_sold_by/${auth.user}`)
            .then((result) => {
                console.log(result);
                setListings(result.data);
                setError(false);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                setError(true);
            });
    },[]);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user listings....</div>;
    }

    let phones = listings.map(phone_data => 
        <Phone data={phone_data} />
    );

    return (
        <div>
            <AddListingForm />
            <Container>
            {phones}
            </Container>
        </div>
    );
}

function Phone({data}){
    return (
        <Row>
            <Col>
                {data.title}
            </Col>
            <Col>
                {data.brand}
            </Col>
            <Col>
                {data.stock}
            </Col>
            <Col>
                {data.price}
            </Col>
            <Col>
                <Form.Check type="checkbox" label="disabled"/>
            </Col>
            <Col>
                Delete
            </Col>
        </Row>
    );
}

function AddListingForm(){
    //TODO connect up to backend
    return (
        <Form> 
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control as="select">
                    <option>Brand1</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control type="integer" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Button variant="primary" type="submit">Add Listing</Button>
            </Form.Group>
        </Form>
    )
}



export default UserProfile;
