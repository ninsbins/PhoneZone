import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
    const [user, setUser] = useState(storage || null);
    const [token, setToken] = useState(null);

    const signin = (email, password, success, failure) => {
        // do sign in functionality and return user
        axios
            .post("/users/login", {
                username: email,
                password: password,
            })
            .then((result) => {
                console.log(result);
                localStorage.setItem("user", result.data.userId);
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
        cb();
    };

    useEffect(() => {}, [user]);

    return { user, signin, signup, signout, token };
}

export default useAuth;
