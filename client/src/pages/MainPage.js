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
    const [filteredState, setFilteredState] = useState(false);
    const [filteredResults, setFilteredResult] = useState(null);
    
    // This search function is passed to the header, it will use this function.
    const search = async (term) => {
        // do search
        setFilteredState(false);

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

    const filter = (brand, min, max) => {
        var filteredResults = [];
        console.log(brand, min, max);
        // console.log(searchResults);
        setPageState(MainPageStatus.LOADING);
        searchResults.map(phone => {
            if (brand != null) {
                if (brand == phone.brand && phone.price <= max && phone.price >= min) {
                    filteredResults.push(phone);
                }
            } else {
                if (phone.price <= max && phone.price >= min) {
                    filteredResults.push(phone);
                }
            }
        });
        setFilteredResult(filteredResults);
        setFilteredState(true);
        setPageState(MainPageStatus.SEARCH);
        setSearchState(true);
    };

    useEffect(() => {
        setPageState(MainPageStatus.LOADING);
        // get sold out soon
        axios
            .get("http://localhost:9000/phones/soldoutsoon")
            .then((result) => {
                console.log(result.data);
                setSoldOutSoon(result.data);
                setPageState(MainPageStatus.SUCCESS);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
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
            <Header search={search} filter={filter} searchState={searchState} />
            <MainPageSection
                pageState={pageState}
                setPageState={setPageState}
                bestSellers={bestSellers}
                soldOutSoon={soldOutSoon}
                searchResults={filteredState ? filteredResults : searchResults}
            />
        </div>
    );
};

export default MainPage;
