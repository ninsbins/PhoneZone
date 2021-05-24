import "../styles/Main.scss";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axiosConfig from "../services/axiosConfig";
import MainPageStatus from "../services/constants";
import { useHistory, useRouteMatch, Switch, Route } from "react-router-dom";
import SinglePhone from "../components/SinglePhone";
import SearchResult from "../components/SearchResult";
import DefaultMain from "../components/DefaultMain";
import NotFound from "../components/NotFound";

const MainPage = () => {
    const [searchState, setSearchState] = useState(false);
    const [pageState, setPageState] = useState(MainPageStatus.LOADING);
    const [searchResults, setSearchResults] = useState(null);
    const [filteredState, setFilteredState] = useState(false);
    const [filteredResults, setFilteredResult] = useState(null);
    let { path, url } = useRouteMatch();
    let history = useHistory();

    // This search function is passed to the header, it will use this function.
    const search = async (term) => {
        // do search
        setFilteredState(false);
        console.log(`searching for ${term}`);
        // send search term to backend and get results
        console.log(`path: ${path} url: ${url}`);
        console.log(history.location);
        console.log(axiosConfig);

        setPageState(MainPageStatus.LOADING);
        await axiosConfig
            .get(`/phones/search?search_term=${term}`)
            .then((result) => {
                setSearchResults(result.data);
                setPageState(MainPageStatus.SEARCH);
                setSearchState(true);
                console.log(result);
                history.push(`/search?term=${term}`);
            })
            .catch((err) => {
                console.log(err);
                setPageState(MainPageStatus.ERROR);
            });
    };

    const filter = (brand, min, max) => {
        var filteredResults = [];

        setPageState(MainPageStatus.LOADING);
        searchResults.map((phone) => {
            if (brand != null) {
                if (
                    brand === phone.brand &&
                    phone.price <= max &&
                    phone.price >= min
                ) {
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
        return history.listen((location) => {
            console.log(location.pathname);
            if (!(location.pathname).includes("search")) {
                setSearchState(false);
            } else {
                setSearchState(true);
            }
        })
    }, [history])

    return (
        <div className="Main">
            <Header
                search={search}
                filter={filter}
                searchState={searchState}
                mainState={pageState}
            />
            <Switch>
                <Route path={`/search`}>
                    <SearchResult
                        searchResults={
                            filteredState ? filteredResults : searchResults
                        }
                    />
                </Route>
                <Route path={`/phone/:id`}>
                    <SinglePhone />
                </Route>
                <Route exact path={path}>
                    <DefaultMain />
                </Route>

                <Route component={NotFound} />
            </Switch>
        </div>
    );
};

export default MainPage;
