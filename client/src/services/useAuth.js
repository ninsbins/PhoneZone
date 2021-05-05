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

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const signin = (email, password, cb) => {
        // do sign in functionality and return user
        axios
            .post("http://localhost:9000/users/login", {
                username: email,
                password: password,
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

        // return user;
        // return user deatils from server.
    };

    const signup = (firstName, lastName, email, password, cb) => {
        // set user to server
        axios
            .post("http://localhost:9000/users/signup", {
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
        cb();
    };

    useEffect(() => {}, [user]);

    return { user, signin, signup, signout, token };
}

export default useAuth;
