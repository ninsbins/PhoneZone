import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
    UserProfilePage,
    MainPage,
    CheckoutPage,
    LoginPage,
    SignUpPage,
} from "./pages/index";
import PrivateRoute from "./components/PrivateRoute";
import { ProvideAuth } from "./services/useAuth";
import "bootstrap/dist/css/bootstrap.css";
import CartContextProvider from "./contexts/CartContext";

function App() {
    return (
        <ProvideAuth>
            <Router>
                <CartContextProvider>
                    <Switch>
                        {/* Protected Routes */}
                        <PrivateRoute path="/userProfile">
                            <UserProfilePage />
                        </PrivateRoute>
                        <PrivateRoute path="/checkout">
                            <CheckoutPage />
                        </PrivateRoute>

                        {/* Public */}
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <Route path="/signup">
                            <SignUpPage />
                        </Route>

                        <Route path="/">
                            <MainPage />
                        </Route>

                        {/* <Route path="/phones/:id" /> */}
                    </Switch>
                </CartContextProvider>
            </Router>
        </ProvideAuth>
    );
}

export default App;
