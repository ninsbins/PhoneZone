import "../styles/Main.scss";
import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const Main = () => {
    return (
        <div className="Main">
            <Header />
            <p className="Main-randomExample">Main page for PhoneZone</p>
        </div>
    );
};

export default Main;
