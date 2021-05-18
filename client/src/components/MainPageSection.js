// NOT IN USE ANYMORE, LEAVING HERE FOR REFERENCE

// import React, { useState } from "react";
// import { Container, CardDeck, Button } from "react-bootstrap";
// import MainPageStatus from "../services/constants";
// import PhoneCard from "./PhoneCard";
// import SinglePhone from "./SinglePhone";
// import { Route, Link, useHistory, useLocation } from "react-router-dom";
// import "../styles/Main.scss";

// const MainPageSection = (props) => {
//     let pageState = props.pageState || MainPageStatus.LOADING;
//     let soldOutSoon = props.soldOutSoon || null;
//     let bestSellers = props.bestSellers || null;
//     const [selectedPhone, setSelectedPhone] = useState(null);
//     let searchResults = props.searchResults || null;
//     const [prevStatus, setPrevStatus] = useState("");

//     const history = useHistory();
//     const location = useLocation();

//     const selectPhone = (phone) => {
//         props.setPageState(MainPageStatus.ITEM);

//         setSelectedPhone(phone);
//     };

//     if (pageState === MainPageStatus.ERROR) {
//         return (
//             <div>
//                 <p>Oops, something went wrong</p>
//             </div>
//         );
//     }

//     if (pageState === MainPageStatus.LOADING) {
//         return (
//             <div>
//                 <p>Loading....</p>
//             </div>
//         );
//     }

//     if (pageState === MainPageStatus.SUCCESS) {
//         return (
//             <Container fluid>
//                 <br></br>
//                 <h2 className="sectionTitle">Sold out soon</h2>
//                 <p className="sectionSubtitle">
//                     Get in quick before they're gone!
//                 </p>
//                 {/* Map through soldOutSoon phones for display */}
//                 {soldOutSoon != null ? (
//                     <CardDeck>
//                         {soldOutSoon.map((phone) => {
//                             return (
//                                 <Link
//                                     to={{
//                                         pathname: `/phone/${phone._id}`,
//                                         state: { fromSuccess: true },
//                                     }}
//                                     onClick={() => selectPhone(phone)}
//                                 >
//                                     <PhoneCard phone={phone}></PhoneCard>
//                                 </Link>
//                             );
//                         })}
//                     </CardDeck>
//                 ) : (
//                     <div>No items to show</div>
//                 )}
//                 <br></br>
//                 {/* Map through bestSeller phones for display */}
//                 <h2 className="sectionTitle">Best Sellers</h2>
//                 <p className="sectionSubtitle">Check out our best sellers!</p>
//                 {bestSellers != null ? (
//                     <CardDeck>
//                         {bestSellers.map((phone) => {
//                             return (
//                                 <Link
//                                     to={{
//                                         pathname: `/phone/${phone._id}`,
//                                         state: { fromSuccess: true },
//                                     }}
//                                     onClick={() => selectPhone(phone)}
//                                 >
//                                     <PhoneCard phone={phone}></PhoneCard>
//                                 </Link>
//                             );
//                         })}{" "}
//                     </CardDeck>
//                 ) : (
//                     <div>No items to show</div>
//                 )}
//             </Container>
//         );
//     }

//     if (pageState === MainPageStatus.SEARCH) {
//         return (
//             <Container fluid>
//                 <h2>Search Result </h2>
//                 {searchResults != null ? (
//                     <CardDeck>
//                         {searchResults.map((phone) => {
//                             return (
//                                 <Link
//                                     to={{
//                                         pathname: `/phone/${phone._id}`,
//                                         state: { fromSearch: true },
//                                     }}
//                                     onClick={() => selectPhone(phone)}
//                                 >
//                                     <PhoneCard phone={phone}></PhoneCard>
//                                 </Link>
//                             );
//                         })}
//                     </CardDeck>
//                 ) : (
//                     <div>No items match your search</div>
//                 )}
//             </Container>
//         );
//     }

//     const handleGoBack = (loc) => {
//         const s = loc.state;
//         if (s.hasOwnProperty("fromError")) {
//             history.push("/");
//             props.setPageState(MainPageStatus.ERROR);
//         } else if (s.hasOwnProperty("fromSuccess")) {
//             history.push("/");
//             props.setPageState(MainPageStatus.SUCCESS);
//         } else if (s.hasOwnProperty("fromSearch")) {
//             history.push("/");
//             props.setPageState(MainPageStatus.SEARCH);
//         }
//     };

//     if (pageState === MainPageStatus.ITEM) {
//         return (
//             <div>
//                 <Button onClick={() => handleGoBack(location)}>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         fill="currentColor"
//                         class="bi bi-chevron-left"
//                         viewBox="0 0 16 16"
//                     >
//                         <path
//                             fill-rule="evenodd"
//                             d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
//                         />
//                     </svg>{" "}
//                     Back
//                 </Button>
//                 {/* <Route path="/phone/:id">
//                     <SinglePhone phone={selectedPhone} />
//                 </Route> */}
//             </div>
//         );
//     }
// };

// export default MainPageSection;
