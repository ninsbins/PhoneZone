import "../styles/Main.scss";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import MainPageStatus from "../services/constants";
import MainPageSection from "../components/MainPageSection";

const MainPage = () => {
    const [searchState, setSearchState] = useState(false);
    const [soldOutSoon, setSoldOutSoon] = useState(null);
    const [bestSellers, setBestSellers] = useState(null);
    const [pageState, setPageState] = useState(MainPageStatus.LOADING);
    const [searchResults, setSearchResults] = useState(null);

    // This search function is passed to the header, it will use this function.
    const search = async (term) => {
        // do search
        console.log(`searching for ${term}`);
        // send search term to backend and get results

        setPageState(MainPageStatus.LOADING);
        await axios
            .get(`http://localhost:9000/phones/search?search_term=${term}`)
            .then((result) => {
                console.log(result);
                setSearchResults(result.data);
                setPageState(MainPageStatus.SEARCH);
                setSearchState(true);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
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
                searchResults={searchResults}
            />
        </div>
    );
};

export default MainPage;
