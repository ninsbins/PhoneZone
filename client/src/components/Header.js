import React from "react";
import { Link, useHistory } from "react-router-dom";
// import AuthButton from "./AuthButton";
import useAuth from "../services/useAuth";

const Header = () => {
    const auth = useAuth();
    let history = useHistory();

    return (
        <div>
            This is the header component
            {auth.user ? (
                <ul>
                    <li>
                        <Link to="/checkout">Checkout</Link>
                    </li>
                    <li>
                        <Link to="/userProfile">Profile</Link>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                auth.signout(() => history.push("/"));
                            }}
                        >
                            sign-out
                        </button>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <Link to="/login">sign-in</Link>
                    </li>
                    <li>
                        <Link to="/checkout">Checkout</Link>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Header;
