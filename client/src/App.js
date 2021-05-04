import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import UserProfilePage from "./pages/UserProfilePage";
import MainPage from "./pages/MainPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import ProvideAuth from "./services/ProvideAuth";

function App() {
    return (
        <ProvideAuth>
            <Router>
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
                    <Route path="/">
                        <MainPage />
                    </Route>
                </Switch>
            </Router>
        </ProvideAuth>
    );
}

export default App;
