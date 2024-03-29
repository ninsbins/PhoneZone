import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../services/useAuth";

const PrivateRoute = ({ children, ...rest }) => {
    let auth = useAuth();
    console.log(auth);
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    />
                )
            }
        ></Route>
    );
};

export default PrivateRoute;
