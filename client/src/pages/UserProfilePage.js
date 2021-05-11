import React from "react";
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
                if(loading){
                    setUserDetails(result.data.user);
                    setLoading(false);
                    setError(false);
                }
            })
            .catch((error) => {
                console.log(error);
                if(!error){
                    setLoading(false);
                    setError(true);
                }
            });
    });

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user details....</div>;
    }

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Profile</Link>
                        </li>
                        <li>
                            <Link to="/edit">Edit Profile</Link>
                        </li>
                        <li>
                            <Link to="/listings">Manage Listings</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/edit">
                        <Edit userdetails={userDetails} />
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
    return (
        <div>
            <ul>
                <li>firstname: {userdetails.firstname}</li>
                <li>lastname: {userdetails.lastname}</li>
                <li>email: {userdetails.email}</li>
            </ul>
        </div>
    );
}
function Edit({userdetails,}) {
    return (
        <div>
        Put a form here
        </div>
    );
}
function ManageListings({userdetails,}) {
    return (
        <div>
        manage listings here
        </div>
    );
}

export default UserProfile;
