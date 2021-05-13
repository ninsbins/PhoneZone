import React from "react";
import {Container, Row, Col, Modal, Button, Form, InputGroup} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../services/useAuth";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const UserProfile = () => {
    // TODO add header
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

function Profile({userdetails}) {
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
function ChangePassword({userdetails}) {
    // TODO connect form to password change
    return (
        <div>
        Put a form here
        </div>
    );
}

function ManageListings({userdetails}) {
    let auth = useAuth();
    const [loading, setLoading] = useState(true);
    let [listings, setListings] = useState(null);
    const [error, setError] = useState(false);
    const [newListingAdded, setNewListingAdded] = useState(false);

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
        setNewListingAdded(false);
    },[newListingAdded]);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user listings....</div>;
    }

    let phones = listings.map(phone_data => 
        <Phone data={phone_data} setListingsChanged={setNewListingAdded}/>
    );

    return (
        <div>
            <AddListingForm 
                newListingAdded={newListingAdded} 
                setNewListingAdded={setNewListingAdded} 
            />
            <Container>
            {phones}
            </Container>
        </div>
    );
}

function Phone({data, setListingsChanged}){
    let auth = useAuth();

    let onDelete = () => {
        console.log("clicked onDelete");
        // send request
        axios.put(`/phones/delete`, 
            {phoneId: data._id}, 
            {headers: {"Authorization": "Bearer " + auth.token}})
        .then((result) => {
            console.log(result);
            setListingsChanged(true);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    let onDisable = (event) => {
        console.log(`sending request to toggle disable to ${event.target.checked}`);
        if(event.target.checked){
            axios.put(`/phones/disable`, 
                {phoneId: data._id}, 
                {headers: {"Authorization": "Bearer " + auth.token}})
            .then((result) => {
                console.log(result);
                setListingsChanged(true);
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            axios.put(`/phones/enable`, 
                {phoneId: data._id}, 
                {headers: {"Authorization": "Bearer " + auth.token}})
            .then((result) => {
                console.log(result);
                setListingsChanged(true);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

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
                <Form.Check 
                    type="checkbox" 
                    label="disabled" 
                    defaultChecked={'disabled' in data} 
                    onClick={onDisable}
                />
            </Col>
            <Col>
                <Link onClick={onDelete} >Delete</Link>
            </Col>
        </Row>
    );
}

function AddListingForm({newListingAdded, setNewListingAdded}){
    let auth = useAuth();

    const [brandList, setBrandList] = useState([]);
    const [title, setTitle] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:9000/phones/brands")
            .then((result) => {
                setBrandList(result.data.brands);
                setBrand(result.data.brands[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    let brandOptions = brandList.map(text=> <option>{text}</option>);

    const handleSubmit = (event) => {
        console.log(title, brand, stock, price);
        axios.post("http://localhost:9000/phones/createlisting", {
            title: title,
            brand: brand,
            image: brand+".jpg",
            stock: Math.floor(stock),
            price: price,
            disabled: disabled,
        }, {headers: {"Authorization": "Bearer " + auth.token}})
        .then((result)=> {
            setNewListingAdded(true);
            setSuccess(true);
            event.target.reset() // clear form
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }).catch((err) => {
            console.log(err);
            console.log("Invalid inputs");
            setInvalidInput(true);
            setTimeout(() => {
                setInvalidInput(false);
            }, 3000);
        });
        event.preventDefault();
    }

    return (
        <Form onSubmit={handleSubmit}> 
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" onChange={(e) => setTitle(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control as="select" onChange={(e) => setBrand(e.target.value)}>
                    {brandOptions}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control type="integer"  onChange={(e) => setStock(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control  onChange={(e) => setPrice(e.target.value)}/>
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Check label="disabled" onChange={(e) => setDisabled(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Button variant="primary" type="submit">Add Listing</Button>
            </Form.Group>
            {invalidInput ? (<div style={{ color: "red" }}>Invalid Listing Input</div>) : null}
            {success ? (<div style={{ color: "green" }}>New Listing Added!</div>) : null}
        </Form>
    )
}



export default UserProfile;
