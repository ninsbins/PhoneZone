import React from "react";
import {
    Container,
    Row,
    Col,
    Modal,
    Button,
    Form,
    InputGroup,
    Navbar,
    Nav,
    NavbarBrand,
    Image,
    Tab,
    Tabs,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../services/useAuth";
import SignOutButton from "../components/SignOutButton";
import axiosConfig from "../services/axiosConfig";
import { Link, useHistory } from "react-router-dom";

const UserProfile = () => {
    let auth = useAuth();
    const [loading, setLoading] = useState(true);
    let [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(`/users/${auth.token}`, {
                headers: { Authorization: "Bearer " + auth.token },
            })
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
    }, []);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user details....</div>;
    }

    return (
        <>
            <Header />
            <Tabs defaultActiveKey="profile">
                <Tab eventKey="profile" title="Profile">
                    <Profile userdetails={userDetails} />
                </Tab>
                <Tab eventKey="password" title="Change Password">
                    <ChangePassword userdetails={userDetails} />
                </Tab>
                <Tab eventKey="listings" title="Manage Listings">
                    <ManageListings userdetails={userDetails} />
                </Tab>
            </Tabs>
        </>
    );
};

function Header() {
    let history = useHistory();

    function backToMain() {
        history.push("../");
    }

    return (
        <Navbar bg="light">
            <Link to="../">
                <NavbarBrand>
                    <Image src={"/images/3.png"} width="50px" />
                    PhoneZone
                </NavbarBrand>
            </Link>
            <Nav className="ml-auto">
                <SignOutButton callback={backToMain} />
            </Nav>
        </Navbar>
    );
}

function Profile({ userdetails }) {
    let auth = useAuth();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleSubmit = (event) => {
        handleShow();
        event.preventDefault();
    };

    const handleModalSubmit = (event) => {
        axiosConfig
            .post(
                "/users/update",
                {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password,
                },
                { headers: { Authorization: "Bearer " + auth.token } }
            )
            .then(
                (result) => {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                    setShowModal(false);
                },
                (error) => {
                    if (error.response.data.message === "invalid password") {
                        setPasswordError(true);
                        setTimeout(() => {
                            setPasswordError(false);
                        }, 3000);
                    } else {
                        setShowModal(false);
                        setError(true);
                        setTimeout(() => {
                            setError(false);
                        }, 3000);
                    }
                }
            )
            .catch((err) => {
                console.log("Invalid inputs");
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 3000);
                setShowModal(false);
            });
        event.preventDefault();
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={userdetails.firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={userdetails.lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={userdetails.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" type="submit">
                        Update your profile
                    </Button>
                </Form.Group>
                {error ? (
                    <span style={{ color: "red" }}>
                        Error: Couldn&#39;t update info
                    </span>
                ) : null}
                {success ? (
                    <span style={{ color: "green" }}>Updated profile</span>
                ) : null}
            </Form>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleModalSubmit}>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    {passwordError ? (
                        <div style={{ color: "red" }}>Invalid Password</div>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Update Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
function ChangePassword({ userdetails }) {
    let auth = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [nonMatching, setNonMatching] = useState(false);

    const handleSubmit = (event) => {
        if (newPassword1 === newPassword2) {
            axiosConfig
                .post(
                    "/users/change_password",
                    {
                        oldpassword: oldPassword,
                        newpassword: newPassword2,
                    },
                    { headers: { Authorization: "Bearer " + auth.token } }
                )
                .then((result) => {
                    setSuccess(true);
                    event.target.reset(); // clear form
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                })
                .catch((err) => {
                    console.log(err);
                    console.log("Invalid inputs");
                    setError(true);
                    setTimeout(() => {
                        setError(false);
                    }, 3000);
                });
        } else {
            setNonMatching(true);
            setTimeout(() => {
                setNonMatching(false);
            }, 3000);
        }
        event.preventDefault();
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setNewPassword1(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Repeat New Password</Form.Label>
                <Form.Control
                    type="password"
                    onChange={(e) => setNewPassword2(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Button variant="primary" type="submit">
                    Change Password
                </Button>
            </Form.Group>
            {error ? (
                <div style={{ color: "red" }}>
                    Error: Couldn&#39;t change password
                </div>
            ) : null}
            {nonMatching ? (
                <div style={{ color: "red" }}>Passwords don&#39;t match</div>
            ) : null}
            {success ? (
                <div style={{ color: "green" }}>Changed Password</div>
            ) : null}
        </Form>
    );
}

function ManageListings({ userdetails }) {
    let auth = useAuth();
    const [loading, setLoading] = useState(true);
    let [listings, setListings] = useState(null);
    const [error, setError] = useState(false);
    const [newListingAdded, setNewListingAdded] = useState(false);

    useEffect(() => {
        axiosConfig
            .get(`/users/get_phones_sold_by/${auth.user}`)
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
    }, [newListingAdded]);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user listings....</div>;
    }

    let phones = listings.map((phone_data) => (
        <Phone data={phone_data} setListingsChanged={setNewListingAdded} />
    ));

    return (
        <div>
            <AddListingForm
                newListingAdded={newListingAdded}
                setNewListingAdded={setNewListingAdded}
            />
            <Container>
                <Row>
                    <Col>
                        <b>Title</b>
                    </Col>
                    <Col>
                        <b>Brand</b>
                    </Col>
                    <Col>
                        <b>Stock</b>
                    </Col>
                    <Col>
                        <b>Price</b>
                    </Col>
                    <Col>
                        <b>Disabled</b>
                    </Col>
                    <Col></Col>
                </Row>
                {phones}
            </Container>
        </div>
    );
}

function Phone({ data, setListingsChanged }) {
    let auth = useAuth();

    let onDelete = () => {
        console.log("clicked onDelete");
        // send request
        axiosConfig
            .put(
                `/phones/delete`,
                { phoneId: data._id },
                { headers: { Authorization: "Bearer " + auth.token } }
            )
            .then((result) => {
                console.log(result);
                setListingsChanged(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    let onDisable = (event) => {
        console.log(
            `sending request to toggle disable to ${event.target.checked}`
        );
        if (event.target.checked) {
            axiosConfig
                .put(
                    `/phones/disable`,
                    { phoneId: data._id },
                    { headers: { Authorization: "Bearer " + auth.token } }
                )
                .then((result) => {
                    console.log(result);
                    setListingsChanged(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            axiosConfig
                .put(
                    `/phones/enable`,
                    { phoneId: data._id },
                    { headers: { Authorization: "Bearer " + auth.token } }
                )
                .then((result) => {
                    console.log(result);
                    setListingsChanged(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <Row>
            <Col>{data.title}</Col>
            <Col>{data.brand}</Col>
            <Col>{data.stock}</Col>
            <Col>${data.price}</Col>
            <Col>
                <Form.Check
                    type="checkbox"
                    defaultChecked={"disabled" in data}
                    onClick={onDisable}
                />
            </Col>
            <Col>
                <Link onClick={onDelete}>Delete</Link>
            </Col>
        </Row>
    );
}

function AddListingForm({ newListingAdded, setNewListingAdded }) {
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
        axiosConfig
            .get("/phones/brands")
            .then((result) => {
                setBrandList(result.data.brands);
                setBrand(result.data.brands[0]);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    let brandOptions = brandList.map((text) => <option>{text}</option>);

    const handleSubmit = (event) => {
        console.log(title, brand, stock, price);
        axiosConfig
            .post(
                "/phones/createlisting",
                {
                    title: title,
                    brand: brand,
                    image: brand + ".jpg",
                    stock: Math.floor(stock),
                    price: price,
                    disabled: disabled,
                },
                { headers: { Authorization: "Bearer " + auth.token } },
                (error) => {
                    console.log(error);
                    console.log("Invalid inputs");
                    setInvalidInput(true);
                    setTimeout(() => {
                        setInvalidInput(false);
                    }, 3000);
                }
            )
            .then((result) => {
                setNewListingAdded(true);
                setSuccess(true);
                event.target.reset(); // clear form
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                console.log("Invalid inputs");
                setInvalidInput(true);
                setTimeout(() => {
                    setInvalidInput(false);
                }, 3000);
            });
        event.preventDefault();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                    as="select"
                    onChange={(e) => setBrand(e.target.value)}
                >
                    {brandOptions}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="integer"
                    onChange={(e) => setStock(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Price</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control onChange={(e) => setPrice(e.target.value)} />
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Check
                    label="disabled"
                    onChange={(e) => setDisabled(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Button variant="primary" type="submit">
                    Add Listing
                </Button>
            </Form.Group>
            {invalidInput ? (
                <div style={{ color: "red" }}>Invalid Listing Input</div>
            ) : null}
            {success ? (
                <div style={{ color: "green" }}>New Listing Added!</div>
            ) : null}
        </Form>
    );
}

export default UserProfile;
