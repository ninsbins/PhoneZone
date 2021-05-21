import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

const storage = localStorage.getItem("user")
    ? localStorage.getItem("user")
    : "";

function useProvideAuth() {
    const history = useHistory();
    const [user, setUser] = useState(storage || null);
    const [token, setToken] = useState(storage || null);

    const isJWTExpired = () => {
        if (token != null) {
            let decodedToken = jwt_decode(token);
            console.log("decoded: ", decodedToken);
            let currentDate = new Date();

            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                console.log("token expired");
                signout();
                return true;
            } else {
                console.log("valid token");
                return false;
            }
        }
    };

    const signin = (email, password, success, failure) => {
        // do sign in functionality and return user
        axios
            .post("/users/login", {
                username: email,
                password: password,
            })
            .then((result) => {
                console.log(result);
                localStorage.setItem("user", result.data.token);
                setUser(result.data.userId);
                setToken(result.data.token);
                success();
            })
            .catch((err) => {
                console.log(err);
                setUser(null);
                failure();
            });

        // return user;
        // return user deatils from server.
    };

    const signup = (firstName, lastName, email, password, cb) => {
        // set user to server
        axios
            .post("/users/signup", {
                firstName,
                lastName,
                email,
                password,
            })
            .then((result) => {
                console.log(result);
                setUser(result.data.userId);
                setToken(result.data.token);
                cb();
            })
            .catch((err) => {
                console.log(err);
                setUser(null);
            });
    };

    const signout = (cb) => {
        // setUser(false);
        setUser(null);
        localStorage.removeItem("user");
        if (cb) {
            cb();
        } else {
            window.location.href = "/";
        }
    };

    useEffect(() => {}, [token, user]);

    return { user, signin, signup, signout, token, isJWTExpired };
}

export default useAuth;
