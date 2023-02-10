import React, { useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams} from "react-router-dom";
import './search.css'
import "./Search.scss";
import { get_tag_color_index, search } from "../../network/communication";
import { TAG_SUGGESTIONS, evaluateTags, hasAndOr } from "../../constants/constants";
import Tags from "../../components/Tags/Tags";
import InputSlider from "../../components/InputSlider/InputSlider";
import { createTheme, Slider } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import "../../constants/constants.scss";
import StudySets from "../../components/StudySets/StudySets";

//import { get_set_data } from "../../network/communication";

function decodeQueryParam(p) {
    return decodeURIComponent(p.replace(/\+/g, ' '));
  }

  
const theme = createTheme({
    palette: {
      primary: {
        main: '#8358E8',
      },
    }
});

function Search(props) {
    
    const navigate = useNavigate();
    const {query} = useParams("");
    const location = useLocation();
    const advancedQuery = new URLSearchParams(location.search);

    const searchBar = useRef(null);
    const creatorNameSearch = useRef(null);

    const [advancedSearchSettings, setAdvancedSearchSettings] = useState({
        category: hasAndOr(advancedQuery.get("category"), "sets"),
        tags: hasAndOr(advancedQuery.getAll("tags[]"), []),
        masteryTime: 0,
    })
    const [search_results, setSearchResults] = useState({
        sets: [],
        users: [],
    })


    const [masterySliderStyle, setMasterySliderStyle] = useState('linear-gradient(90deg #8358E8 60% rgb(214, 214, 214) 60%)');

    const [masterySliderValue, setMasterySliderValue] = useState(hasAndOr(advancedQuery.get("mastery"), 0));
    const [viewsSliderValue, setViewsSliderValue] = useState(hasAndOr(advancedQuery.get("views"), 0));
    const [termsSliderValue, setTermsSliderValue] = useState(hasAndOr(advancedQuery.get("terms"), 0));
    const [creatorName, setCreatorName] = useState(hasAndOr(advancedQuery.get("creator_name"), ""))
const [setsets, setSetsets] = useState(false);
    const [masteryTimeLabel, setMasteryTimeLabel] = useState("More than 0 minutes");
    const [viewsLabel, setViewsLabel] = useState("0+ views");
    const [termsLabel, setTermsLabel] = useState("0+ terms");
   
    const setTags = function(t) {
        const a = {...advancedSearchSettings}
        a.tags = t;
        setAdvancedSearchSettings(a);
    }

    const setMasteryTime = function(t) {
        const a = {...advancedSearchSettings}
        a.masteryTime = t;
        setAdvancedSearchSettings(a);
    }

    const onMasteryTimeChanged = function(x) {
        setMasterySliderValue(x)
        if (x <= 0) {
            setMasteryTimeLabel("More than 0 minutes");
        }
        else if (x <= 10) {
            setMasteryTimeLabel("More than 10 minutes");
        }
        else if (x <= 25) {
            setMasteryTimeLabel("More than 1 hour");
        }
        else if (x <= 40) {
            setMasteryTimeLabel("More than 12 hours");
        }
        else if (x <= 50) {
            setMasteryTimeLabel("More than 1 day");
        }
        else if (x <= 60) {
            setMasteryTimeLabel("More than 3 days");
        }
        else if (x <= 70) {
            setMasteryTimeLabel("More than 1 week");
        }
        else if (x <= 80) {
            setMasteryTimeLabel("More than 3 weeks");
        }
        else if (x <= 90) {
            setMasteryTimeLabel("More than 1 month");
        }
        else if (x <= 95) {
            setMasteryTimeLabel("More than 3 months");
        }
        else if (x <= 100) {
            setMasteryTimeLabel("More than 1 year");
        }
    }

    const onViewsChanged = function(x) {
        setViewsSliderValue(x)
        if (x <= 5) {
            setViewsLabel("0+ views")
        }
        else if (x <= 10) {
            setViewsLabel("100+ views")
        }
        else if (x <= 25) {
            setViewsLabel("1,000+ views")
        }
        else if (x <= 40) {
            setViewsLabel("10,000+ views")
        }
        else if (x <= 50) {
            setViewsLabel("25,000+ views")
        }
        else if (x <= 60) {
            setViewsLabel("50,000+ views")
        }
        else if (x <= 70) {
            setViewsLabel("75,000+ views")
        }
        else if (x <= 75) {
            setViewsLabel("100,000+ views")
        }
        else if (x <= 80) {
            setViewsLabel("200,000+ views")
        }
        else if (x <= 85) {
            setViewsLabel("400,000+ views")
        }
        else if (x <= 90) {
            setViewsLabel("500,000+ views")
        }
        else if (x <= 95) {
            setViewsLabel("750,000+ views")
        }
        else if (x <= 100) {
            setViewsLabel("1,000,000+ views")
        }
    }

    const onTermsChanged = function(x) {
        setTermsSliderValue(x)
        if (x <= 5) {
            setTermsLabel("0+ terms")
        }
        else if (x <= 10) {
            setTermsLabel("3+ terms")
        }
        else if (x <= 25) {
            setTermsLabel("6+ terms")
        }
        else if (x <= 40) {
            setTermsLabel("10+ terms")
        }
        else if (x <= 50) {
            setTermsLabel("15+ terms")
        }
        else if (x <= 60) {
            setTermsLabel("25+ terms")
        }
        else if (x <= 70) {
            setTermsLabel("40+ terms")
        }
        else if (x <= 75) {
            setTermsLabel("55+ terms")
        }
        else if (x <= 80) {
            setTermsLabel("75+ terms")
        }
        else if (x <= 85) {
            setTermsLabel("100+ terms")
        }
        else if (x <= 90) {
            setTermsLabel("125+ terms")
        }
        else if (x <= 95) {
            setTermsLabel("150+ terms")
        }
        else if (x <= 100) {
            setTermsLabel("200+ terms")
        }
    }
    const [userdata, setuserData] = useState("data");
   
    
    useEffect(() => {
        let inputFi = document.getElementById("input-fi")
        console.log(userdata);
     setuserData(inputFi.value)
        onMasteryTimeChanged(masterySliderValue);
        onViewsChanged(viewsSliderValue);
        onTermsChanged(termsSliderValue);
        setTags(advancedSearchSettings.tags)
        setCreatorName(creatorName)
      
           search(decodeQueryParam(query), function (d) {
               if (advancedSearchSettings.category == "sets") {
                   setSearchResults({ sets: d })
               }
               else if (advancedSearchSettings.category == "users") {
                   setSearchResults({ users: d })
               }
           }, advancedQuery);
      
    }, [])
    const [advancesearch, setAdvancesearch] = useState(false);
    function toggleFilter  ()  {
        setAdvancesearch(true)
        console.log("testing");
    }
    let hideAdvance=()=>{
        setAdvancesearch(false)

    }
    let changeState =()=>{
        setSetsets(true)
    }
    setTimeout(() => {
        changeState()
    }, 3600);
    
    return (
          <>
            <div onClick={hideAdvance} className={advancesearch ? "  filter-overlay" : ""}></div>
            <main className="search-main">
                <div className={advancesearch ? " display-it main-sort " : "main-sort"}>
                    <div className="content">
                        <div onClick={hideAdvance} className="cross-it">X</div>
                        <div className="title">
                            <a>Advanced Search</a>
                            <a className="clear" onClick={function () {
                                setViewsSliderValue(0);
                                setViewsLabel("0+ views");
                                setTags([])
                                setMasterySliderValue(0);
                                setMasteryTimeLabel("More than 0 minutes");
                                setTermsSliderValue(0);
                                setTermsLabel("0+ terms");
                                setCreatorName("");
                                creatorNameSearch.current.value = "";
                            }}>Clear All</a>
                        </div>
                        <div className="horizontal-line"></div>
                        <div className="category">
                            <a className="category-title">Category</a>
                            <div className="categories">
                                <div className={"category-type study-sets " + (advancedSearchSettings.category == "sets" ? "active" : "")} onClick={function () {
                                    var as = { ...advancedSearchSettings }
                                    as.category = "sets";
                                    setAdvancedSearchSettings(as);
                                }}>
                                    <div className="category-cover">
                                        {/*<img className="icon" src={"../images/search/sets" + (advancedSearchSettings.category == "sets" ? "_active" : "") + ".svg"}></img>*/}
                                        <svg
                                            id="sticky_note_2_black_24dp"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 30 30"
                                        >
                                            <rect
                                                id="Rectangle_39"
                                                data-name="Rectangle 39"
                                                width="30"
                                                height="30"
                                                fill="none"
                                            />
                                            <path
                                                id="Path_19"
                                                data-name="Path 19"
                                                d="M24.333,5.678V17.727H17.667v6.694h-12V5.678H24.333m0-2.678H5.667A2.68,2.68,0,0,0,3,5.678V24.421A2.68,2.68,0,0,0,5.667,27.1H19l8-8.033V5.678A2.68,2.68,0,0,0,24.333,3ZM15,17.727H8.333V15.049H15Zm6.667-5.355H8.333V9.694H21.667Z"
                                                transform="translate(0 0)"
                                                fill={advancedSearchSettings.category == "sets" ? "#8358e8" : "#7b7b7b"}
                                            />
                                        </svg>
                                        <a>Study Sets</a>
                                    </div>
                                </div>
                                <div className={"category-type users " + (advancedSearchSettings.category == "users" ? "active" : "")} onClick={function () {
                                    var as = { ...advancedSearchSettings }
                                    as.category = "users";
                                    setAdvancedSearchSettings(as);
                                }}>
                                    <div className="category-cover">
                                        <svg
                                            id="people_black_24dp"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="30"
                                            height="30"
                                            viewBox="0 0 30 30"
                                        >
                                            <path
                                                id="Path_103"
                                                data-name="Path 103"
                                                d="M0,0H30V30H0Z"
                                                fill="none"
                                            />
                                            <path
                                                id="Path_104"
                                                data-name="Path 104"
                                                d="M11.1,17.5c-3.042,0-9.1,1.671-9.1,5V25H20.2V22.5C20.2,19.171,14.142,17.5,11.1,17.5ZM5.042,22.143A11.7,11.7,0,0,1,11.1,20.357a11.7,11.7,0,0,1,6.058,1.786ZM11.1,15a4.8,4.8,0,0,0,4.55-5A4.8,4.8,0,0,0,11.1,5a4.8,4.8,0,0,0-4.55,5A4.8,4.8,0,0,0,11.1,15Zm0-7.143A2.051,2.051,0,0,1,13.05,10a2.051,2.051,0,0,1-1.95,2.143A2.051,2.051,0,0,1,9.15,10,2.05,2.05,0,0,1,11.1,7.857Zm9.152,9.729A6.133,6.133,0,0,1,22.8,22.5V25H28V22.5C28,19.614,23.45,17.971,20.252,17.586ZM18.9,15a4.8,4.8,0,0,0,4.55-5A4.8,4.8,0,0,0,18.9,5a4.152,4.152,0,0,0-1.95.5,8.438,8.438,0,0,1,0,9A4.152,4.152,0,0,0,18.9,15Z"
                                                transform="translate(0 0)"
                                                fill={advancedSearchSettings.category == "users" ? "#8358e8" : "#7b7b7b"}
                                            />
                                        </svg>
                                        <a>Users</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {advancedSearchSettings.category == "sets" && (
                            <div className="sets-cover">
                                <div className="tags-cover">
                                    <div className="title">
                                        <a className="tags-title">Tags</a>
                                        <a className="clear" onClick={function () {
                                            setTags([])
                                        }}>Clear</a>
                                    </div>
                                    <div className="tags advanced-search-tags">
                                        <Tags tags={advancedSearchSettings.tags} setTags={setTags}></Tags>
                                    </div>
                                </div>
                                <div className="mastery-time-cover">
                                    <div className="title">
                                        <a className="mastery-time-title">Mastery Time</a>
                                        <a className="clear" onClick={function () {
                                            setMasterySliderValue(0);
                                            setMasteryTimeLabel("More than 0 minutes");
                                        }}>Clear</a>
                                    </div>
                                    <a className="mastery-time-label">{masteryTimeLabel}</a>
                                    <div className="slider">
                                        <ThemeProvider theme={theme}>
                                            <Slider color="primary" value={masterySliderValue} defaultValue={0} sx={{
                                                '& .MuiSlider-track': {
                                                    height: '10px'
                                                },
                                                '& .MuiSlider-rail': {
                                                    height: '10px',
                                                    background: '#C8C8C8',
                                                    opacity: 1,
                                                },
                                                '& .MuiSlider-thumbColorPrimary': {
                                                    background: "white",
                                                    filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 16%))',
                                                    width: "26px",
                                                    height: "26px",
                                                    boxShadow: "none",
                                                    '::before': {
                                                        boxShadow: "none",
                                                    }
                                                }
                                            }} onChange={function (e, x) {
                                                onMasteryTimeChanged(x);
                                            }} />
                                        </ThemeProvider>
                                    </div>

                                </div>
                                <div className="views-cover">
                                    <div className="title">
                                        <a className="views-title">Views</a>
                                        <a className="clear" onClick={function () {
                                            setViewsSliderValue(0);
                                            setViewsLabel("0+ views");
                                        }}>Clear</a>
                                    </div>
                                    <a className="views-label">{viewsLabel}</a>
                                    <div className="slider">
                                        <ThemeProvider theme={theme}>
                                            <Slider color="primary" value={viewsSliderValue} defaultValue={0} sx={{
                                                '& .MuiSlider-track': {
                                                    height: '10px'
                                                },
                                                '& .MuiSlider-rail': {
                                                    height: '10px',
                                                    background: '#C8C8C8',
                                                    opacity: 1,
                                                },
                                                '& .MuiSlider-thumbColorPrimary': {
                                                    background: "white",
                                                    filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 16%))',
                                                    width: "26px",
                                                    height: "26px",
                                                    boxShadow: "none",
                                                    '::before': {
                                                        boxShadow: "none",
                                                    }
                                                }
                                            }} onChange={function (e, x) {
                                                onViewsChanged(x);
                                            }} />
                                        </ThemeProvider>
                                    </div>

                                </div>
                                <div className="nterms-cover">
                                    <div className="title">
                                        <a className="nterms-title">Terms</a>
                                        <a className="clear" onClick={function () {
                                            setTermsSliderValue(0);
                                            setTermsLabel("0+ terms");
                                        }}>Clear</a>
                                    </div>
                                    <a className="nterms-label">{termsLabel}</a>
                                    <div className="slider">
                                        <ThemeProvider theme={theme}>
                                            <Slider color="primary" value={termsSliderValue} defaultValue={0} sx={{
                                                '& .MuiSlider-track': {
                                                    height: '10px'
                                                },
                                                '& .MuiSlider-rail': {
                                                    height: '10px',
                                                    background: '#C8C8C8',
                                                    opacity: 1,
                                                },
                                                '& .MuiSlider-thumbColorPrimary': {
                                                    background: "white",
                                                    filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 16%))',
                                                    width: "26px",
                                                    height: "26px",
                                                    boxShadow: "none",
                                                    '::before': {
                                                        boxShadow: "none",
                                                    }
                                                }
                                            }} onChange={function (e, x) {
                                                onTermsChanged(x);
                                            }} />
                                        </ThemeProvider>
                                    </div>
                                </div>
                                <div className="cname-cover">
                                    <div className="title">
                                        <a className="cname-title">Creator</a>
                                        <a className="clear" onClick={function () {
                                            setCreatorName("");
                                            creatorNameSearch.current.value = "";
                                        }}>Clear</a>
                                    </div>
                                    <input type="text" className="search-by-creator" ref={creatorNameSearch} defaultValue={creatorName} placeholder={"Search for sets by a creator"} onBlur={function () {
                                        setCreatorName(creatorNameSearch.current.value)
                                    }}></input>
                                </div>

                            </div>)}
                        <div className="filter-cover">
                            <div className="button" onClick={() => {
                                var tagBase = "&tags[]=";
                                var tagStr = "";
                                for (var key in advancedSearchSettings.tags) {
                                    tagStr += tagBase + advancedSearchSettings.tags[key]
                                }
                                var cat = advancedSearchSettings.category;

                                var queryArguments = ["?category=" + cat, "mastery=" + masterySliderValue, "views=" + viewsSliderValue, "terms=" + termsSliderValue, tagStr, "creator_name=" + creatorName]

                                if (creatorName == '') {
                                    queryArguments.pop()
                                }

                                var queryStr = queryArguments.join("&")

                                navigate("/search/" + encodeURIComponent(searchBar.current.value) + queryStr)
                                window.location.reload();
                            }}>
                                <a>Filter</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-search">
                    <svg onClick={toggleFilter} xmlns="http://www.w3.org/2000/svg" className="search-setting" width="30.03" height="30.03" viewBox="0 0 30.03 30.03">
                        <path id="settings_FILL1_wght400_GRAD0_opsz48" d="M15.561,34.03l-.751-4.73a10.058,10.058,0,0,1-1.5-.713,10.317,10.317,0,0,1-1.389-.938L7.491,29.675,4,23.519l4.054-2.965a4.463,4.463,0,0,1-.094-.77q-.019-.432-.019-.77t.019-.77a4.463,4.463,0,0,1,.094-.77L4,14.51,7.491,8.354l4.429,2.027a10.317,10.317,0,0,1,1.389-.938,7.768,7.768,0,0,1,1.5-.676L15.561,4h6.907l.751,4.73a12.17,12.17,0,0,1,1.52.694,6.461,6.461,0,0,1,1.37.957l4.429-2.027L34.03,14.51,29.976,17.4a5.29,5.29,0,0,1,.094.807q.019.432.019.807t-.019.788a5.227,5.227,0,0,1-.094.788l4.054,2.928-3.491,6.156-4.429-2.027a12.452,12.452,0,0,1-1.37.957,6.541,6.541,0,0,1-1.52.694l-.751,4.73Zm3.453-10.135a4.87,4.87,0,0,0,4.88-4.88,4.87,4.87,0,0,0-4.88-4.88,4.87,4.87,0,0,0-4.88,4.88,4.87,4.87,0,0,0,4.88,4.88Z" transform="translate(-4 -4)" fill="#7b7b7b" />
                    </svg>
                    <div className="sb-cover">
                        <div className="sb">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17.49"
                                height="17.49"
                                viewBox="0 0 17.49 17.49"
                            >
                                <path
                                    id="Path_43"
                                    data-name="Path 43"
                                    d="M15.5,14h-.79l-.28-.27a6.51,6.51,0,1,0-.7.7l.27.28v.79l5,4.99L20.49,19Zm-6,0A4.5,4.5,0,1,1,14,9.5,4.494,4.494,0,0,1,9.5,14Z"
                                    transform="translate(-3 -3)"
                                    fill="#afafaf"
                                />
                            </svg>
                            <form onSubmit={(e) => { 
                                e.preventDefault();
                                   var cat = advancedSearchSettings.category;
                                   if (cat == "sets") {
                                       navigate("/search/" + encodeURIComponent(searchBar.current.value) + "?category=" + cat + "&mastery=" + masterySliderValue + "&views=" + viewsSliderValue + "&terms=" + termsSliderValue);
                                    }
                                    else {
                                        navigate("/search/" + encodeURIComponent(searchBar.current.value) + "?category=" + cat)
                                    } 
                                    window.location.reload();

                            }}>
                                <input type="text" id="input-fi" ref={searchBar} className="search-bar" defaultValue={decodeQueryParam(query)} placeholder="Enter a search term.."></input>
                            </form>

                        </div>
                    </div>
                    <span className={setsets ? " ": " st-area"}>
                        <h1>{({ sets: search_results?.sets?.length, users: search_results?.users?.length })[advancedSearchSettings.category] + " " + ({ sets: "Study Sets", users: "Users" })[advancedSearchSettings.category] + " for " + "'" +userdata + "'"}</h1>
                        {advancedSearchSettings.category == "sets" &&
                            (<div className="search-result study-sets">
                                <div className="studyset-wrap">
                                    <StudySets sets={search_results.sets}></StudySets>
                                </div>
                            </div>)
                        }
                  </span>
                    {advancedSearchSettings.category == "users" && (
                        <div className="search-result users">
                            <div className="users-wrap">
                                {
                                    search_results.users != undefined && search_results.users.map((user) => (
                                        <div className="user">
                                            <div className="contents">
                                                <div className="user-icon">
                                                    <img className="icon" src={user.image}></img>
                                                </div>
                                                <div className="user-data">
                                                    {/*<h2 className="user-name">{user.name}</h2>*/}
                                                    <div className="user-info-cover">
                                                        <h2 className="user-name">{user.name}</h2>
                                                        {user.verified && <img id="verified" src="../images/user/check.svg"></img>}
                                                        {user.membership > 0 &&
                                                            <div className="plus-icon">
                                                                <p className="plus-icon" href="/quizzyplus">PLUS</p>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="username-div">
                                                        <a className="user-username">{'@' + user.username}</a>
                                                        {/*user.verified && <img src="../images/user/check.svg" className="verified" title="This user is verified."  alt="checkmark icon"/>*/}

                                                    </div>

                                                    <a className="user-desc">{user.description}</a>
                                                </div>
                                                <div className="options">
                                                    <div className="view-button button" onClick={() => {
                                                        navigate("../users/" + user.userid)
                                                    }}>
                                                        <img src="../images/search/view.svg"></img>
                                                        <a>View</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

            </main></>
    )
}

export default Search;