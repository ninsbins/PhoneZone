import "../styles/Main.scss";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import MainPageStatus from "../services/constants";
import MainPageSection from "../components/MainPageSection";

const Main = () => {
    const [searchState, setSearchState] = useState(false);
    const [soldOutSoon, setSoldOutSoon] = useState(null);
    const [bestSellers, setBestSellers] = useState(null);
    const [pageState, setPageState] = useState(MainPageStatus.LOADING);

    // This search function is passed to the header, it will use this function.
    const search = (term) => {
        // do search
        console.log(`searching for ${term}`);
        // send search term to backend and get results
        setPageState(MainPageStatus.SEARCH);
        setSearchState(true);
    };

    useEffect(() => {
        setPageState(MainPageStatus.LOADING);
        // get sold out soon
        axios
            .get("http://localhost:9000/phones/soldoutsoon")
            .then((result) => {
                console.log(result);
                setSoldOutSoon(result.data);
                setPageState(MainPageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
        // get best sellers
    }, []);

    useEffect(() => {
        setPageState(MainPageStatus.LOADING);
        axios
            .get("http://localhost:9000/phones/bestsellers")
            .then((result) => {
                setBestSellers(result.data);
                setPageState(MainPageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
    }, []);

    return (
        <div className="Main">
            <Header search={search} searchState={searchState} />
            <MainPageSection
                pageState={pageState}
                setPageState={setPageState}
                bestSellers={bestSellers}
                soldOutSoon={soldOutSoon}
            />
        </div>
    );
};

export default Main;
