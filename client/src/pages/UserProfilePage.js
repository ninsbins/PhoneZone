import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../services/useAuth";
import axios from "axios";

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
    }, []);

    if (loading) {
        return <div>Loading....</div>;
    }

    if (!loading && error) {
        return <div>Error getting user details....</div>;
    }

    return (
        <div>
            <ul>
                <li>firstName: {userDetails.firstname}</li>
                <li>lastName: {userDetails.lastname}</li>
                <li>email: {userDetails.email}</li>
            </ul>
        </div>
    );
};

export default UserProfile;
