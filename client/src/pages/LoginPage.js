import React from "react";
import { useHistory, useLocation } from "react-router";
import useAuth from "../services/useAuth";
import AuthButton from "../components/AuthButton";

const LoginPage = () => {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        auth.signin(() => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>Welcome to the Log in page</p>
            <p>
                You need to log in first to view the page at {from.pathname} or
                do whatever you were trying to do.
            </p>
            <button onClick={login}> Log in</button>
            <AuthButton />
        </div>
    );
};

export default LoginPage;
