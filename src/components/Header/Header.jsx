import React, { useRef } from "react";
import "./Header.scss";
import "./header.css";
import SearchBar from "./SearchBar/SearchBar";
import { logout } from "../../actions/userActions";

import { useDispatch, useSelector } from "react-redux";
import Account from "./Account/Account";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { get_user } from "../../network/communication";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
function Header(props) {
  const location = useLocation();
  const user = props.user;
  const setUser = props.setUser;
  const [smallScreenNavbarEnabled, setSmallScreenNavbarEnabled] =
    useState(false);
  const [navmbl, setNavmbl] = useState(false);
  let navToggle = () => {
    if (navmbl == true) {
      setNavmbl(false);
    } else {
      setNavmbl(true);
    }
  };
  const navigate = useNavigate();
  const childRef = useRef();
  useEffect(() => {
    get_user(function (user) {
      setUser(user);
    });
  }, []);
  const [navLoading, setnavLoading] = useState(false);
  let navLoad = () => {
    setnavLoading(true);
  };
  setTimeout(() => {
    navLoad();
  }, 5500);
  const dispatch = useDispatch();
  const handleLogout = () => {

    dispatch(logout());
  };

  return (
    <>
      <div
        id="over-pop"
        onClick={() => childRef.current.clickBody()}
        className="overlay-drop"
      ></div>
      {![
        "/signup",
        "/login",
        "/404",
        "/forgot-password",
        "/reset-password",
      ].includes(location.pathname) &&
        location.pathname.indexOf("/support") == -1 && (
          <header
            className="header"
            id="header"
            style={
              location.pathname.includes("/quizzyplus") ||
              location.pathname.includes("/about-us") ||
              location.pathname.includes("/jobs") ||
              location.pathname === "/"
                ? { background: "transparent", position: "absolute" }
                : null
            }
          >
            <div className="nav-icon" id="nav-icon-header">
              <div className="hotdog-nav" onClick={navToggle}>
                <img src="/images/general/threelines.svg"></img>
              </div>
              <h1 className="pc-only">
                {"Quizzy" + (user.membership > 0 ? "+" : "")}{" "}
              </h1>
              <h1 className="mobile-only">
                {"Q" + (user.membership > 0 ? "+" : "")}
              </h1>
            </div>

            <div id="navigation">
              <Link onClick={() => childRef.current.clickBody()} to="/">
                <h2>
                  Home <div id="selection-dash"></div>
                </h2>
              </Link>
              {user.username !== undefined &&
                user.username !== null &&
                user.username !== "" && (
                  <Link
                    onClick={() => childRef.current.clickBody()}
                    to="/dashboard"
                  >
                    <h2>
                      Dashboard <div id="selection-dash"></div>
                    </h2>
                  </Link>
                )}

              <Link onClick={() => childRef.current.clickBody()} to="/about-us">
                <h2>
                  About Us <div id="selection-dash"></div>
                </h2>
              </Link>
              <Link onClick={() => childRef.current.clickBody()} to="/create">
                <h2>
                  Create <div id="selection-dash"></div>
                </h2>
              </Link>
              <Link
                onClick={() => childRef.current.clickBody()}
                to="/quizzyplus"
              >
                <h2>
                  Upgrade <div id="selection-dash"></div>
                </h2>
              </Link>
            </div>
          <div onClick={navToggle}
              className={navmbl ? "mbl-overlay " : "mbl-overlay hide-it"}
            ></div>
            <div className={navmbl ? "mobile-side  " : " hide-it"}>
              <div onClick={navToggle} className="cross">
                X
              </div>
              <div className="mbl-search">
                <SearchBar />
              </div>

              <ul className="mbl-ul">
              <NavLink to="/" onClick={navToggle}>
                <li className="yes">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23.556"
                    height="26.5"
                    viewBox="0 0 23.556 26.5"
                  >
                    <path className="path"
                      id="home_FILL0_wght400_GRAD0_opsz48"
                      d="M8,32.5V14.833L19.851,6l11.7,8.833V32.5H22.943V22.01H16.576V32.5Zm2.208-2.208h4.159V19.8H25.151v10.49h4.2V15.938l-9.5-7.177-9.643,7.177ZM19.778,19.508Z"
                      transform="translate(-8 -6)"
                      fill="#7b7b7b"
                    />
                  </svg>
                  Home
                </li>
                 </NavLink>
              <NavLink to="/dashboard" onClick={navToggle}>    
                <li className="yes">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24.893"
                    height="24.893" 
                    viewBox="0 0 24.893 24.893"
                  >
                    <path className="path"
                      id="dashboard_FILL0_wght400_GRAD0_opsz48"
                      d="M19.484,15.335V6H30.893v9.335ZM6,19.484V6H17.409V19.484ZM19.484,30.893V17.409H30.893V30.893ZM6,30.893V21.558H17.409v9.335ZM8.074,17.409h7.26V8.074H8.074ZM21.558,28.818h7.26V19.484h-7.26Zm0-15.558h7.26V8.074h-7.26ZM8.074,28.818h7.26V23.632H8.074ZM15.335,17.409ZM21.558,13.26ZM21.558,19.484ZM15.335,23.632Z"
                      transform="translate(-6 -6)"
                      fill="#7b7b7b"
                    />
                  </svg>
                  Dashboard
                </li>
                  </NavLink>
              <NavLink to="/about-us" onClick={navToggle}>
                <li className="yes">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path className="path"
                      id="person_pin_FILL0_wght400_GRAD0_opsz48"
                      d="M21,33.95l-5.042-4.316H8.5a2.608,2.608,0,0,1-1.75-.642,1.924,1.924,0,0,1-.75-1.5V6.09a1.906,1.906,0,0,1,.75-1.516A2.653,2.653,0,0,1,8.5,3.95h25a2.653,2.653,0,0,1,1.75.624A1.906,1.906,0,0,1,36,6.09v21.4a1.924,1.924,0,0,1-.75,1.5,2.608,2.608,0,0,1-1.75.642H26.042ZM8.5,26.138a22.048,22.048,0,0,1,5.667-3.193A18.7,18.7,0,0,1,21,21.715a18.7,18.7,0,0,1,6.833,1.231A22.048,22.048,0,0,1,33.5,26.138V6.09H8.5ZM21.083,18.9a6.062,6.062,0,0,0,4.083-1.427,4.5,4.5,0,0,0,0-6.992,6.062,6.062,0,0,0-4.083-1.427A6.062,6.062,0,0,0,17,10.478a4.5,4.5,0,0,0,0,6.992A6.062,6.062,0,0,0,21.083,18.9Zm0-2.14a3.407,3.407,0,0,1-2.292-.82,2.506,2.506,0,0,1,0-3.942,3.7,3.7,0,0,1,4.6,0,2.54,2.54,0,0,1,0,3.942A3.386,3.386,0,0,1,21.083,16.756ZM21,30.775l3.833-3.282h6.375v-.321a17.287,17.287,0,0,0-20.417,0v.321h6.375ZM21,16.114Z"
                      transform="translate(-6 -3.95)"
                      fill="#7b7b7b"
                    />
                  </svg>
                  About Us
                </li>
                </NavLink >
              <NavLink to="/create" onClick={navToggle}>
                <li className="yes">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                  >
                    <path className="path"
                      id="post_add_FILL0_wght400_GRAD0_opsz48"
                      d="M8.5,36a2.4,2.4,0,0,1-1.75-.75A2.4,2.4,0,0,1,6,33.5V8.5a2.4,2.4,0,0,1,.75-1.75A2.4,2.4,0,0,1,8.5,6H24.917V8.5H8.5v25h25V17.083H36V33.5A2.563,2.563,0,0,1,33.5,36Zm5.875-6.542v-2.5H27.667v2.5Zm0-5.292v-2.5H27.667v2.5Zm0-5.292v-2.5H27.667v2.5Zm15.458-3.042V12.167H26.167v-2.5h3.667V6h2.5V9.667H36v2.5H32.333v3.667Z"
                      transform="translate(-6 -6)"
                      fill="#7b7b7b"
                    />
                  </svg>
                  Create
                </li>
                </NavLink>

                <li className="plus">
                  <h4>
                    Upgrade to <strong>Quizzy+ </strong>for more features.
                  </h4>
                <a className="plusLink" onClick={navToggle} href="/quizzyplus"></a>
                </li>
                <br />
              <li  onClick={handleLogout}>
                  {" "}
                  <svg 
                    id="logout_black_24dp"
                    className="svg-log"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <g id="Group_10" data-name="Group 10">
                      <path
                        id="Path_32"
                        data-name="Path 32"
                        d="M0,0H24V24H0Z"
                        fill="none"
                      />
                    </g>
                    <g id="Group_11" data-name="Group 11">
                      <path
                        id="Path_33"
                        data-name="Path 33"
                        d="M17,8,15.59,9.41,17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4ZM5,5h7V3H5A2.006,2.006,0,0,0,3,5V19a2.006,2.006,0,0,0,2,2h7V19H5Z"
                        fill="#7b7b7b"
                      />
                    </g>
                  </svg>
                  Logout
                </li>
              </ul>
            </div>

            <div className={navLoading ? "right" : "hide-it"} id="right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="svg-back"
                className="svg-back"
                width="24.745"
                height="24.745"
                viewBox="0 0 24.745 24.745"
                onClick={() => {
                  document.getElementById("searchBar").style.display = "none";
                  document.getElementById("header-user-info").style.display =
                    "flex";
                  document.getElementById("nav-icon-header").style.display =
                    "flex";
                  document.getElementById("right").style.display = "flex";
                  document.getElementById("right").style.marginLeft = "auto";
                  document.getElementById("right").style.gap = "0px";
                  document.getElementById("search-icon-header").style.display =
                    "block";
                  document.getElementById("svg-back").style.display = "none";
                  document.getElementById("header").style.gap = "2rem";
                  document.getElementById("header").style.paddingInline =
                    "2rem";
                }}
              >
                <path
                  id="arrow_back_FILL0_wght400_GRAD0_opsz48_1_"
                  data-name="arrow_back_FILL0_wght400_GRAD0_opsz48 (1)"
                  d="M20.373,32.745,8,20.373,20.373,8,22,9.624l-9.589,9.589H32.745v2.32H12.408L22,31.121Z"
                  transform="translate(-8 -8)"
                  fill="#fff"
                />
              </svg>

              <SearchBar />
              <Account ref={childRef} user={user}></Account>
            </div>
          </header>
        )}

      {location.pathname.indexOf("/support") > -1 && (
        <header
          className="header"
          id="header"
          style={
            ["/support", "/support/"].includes(location.pathname)
              ? { background: "transparent", position: "absolute" }
              : { background: "#8358e8" }
          }
        >
          <Link onClick={() => childRef.current.clickBody()} to="/support">
            <div className="nav-icon" id="nav-icon-header">
              <div className="hotdog-nav">
                <img src="/images/general/threelines.svg"></img>
              </div>
              <a href="/support">
                <h1 className="pc-only">{"Quizzy Support"} </h1>
              </a>
            </div>
          </Link>
          <div id="navigation">
            <Link
              onClick={() => childRef.current.clickBody()}
              to="/support/sections/getting-started"
            >
              <h2>
                Getting Started <div id="selection-dash"></div>
              </h2>
            </Link>
            <Link
              onClick={() => childRef.current.clickBody()}
              to="/support/sections/getting-started"
            >
              <h2>
                Submit a Bug <div id="selection-dash"></div>
              </h2>
            </Link>
            <Link
              onClick={() => childRef.current.clickBody()}
              to="/support/sections/getting-started/2/submit-a-request"
            >
              <h2>
                Submit a Request <div id="selection-dash"></div>
              </h2>
            </Link>
          </div>
          <div className={navLoading ? "right" : "hide-it"} id="right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="svg-back"
              className="svg-back"
              width="24.745"
              height="24.745"
              viewBox="0 0 24.745 24.745"
              onClick={() => {
                document.getElementById("searchBar").style.display = "none";
                document.getElementById("header-user-info").style.display =
                  "flex";
                document.getElementById("nav-icon-header").style.display =
                  "flex";
                document.getElementById("right").style.display = "flex";
                document.getElementById("right").style.marginLeft = "auto";
                document.getElementById("right").style.gap = "0px";
                document.getElementById("search-icon-header").style.display =
                  "block";
                document.getElementById("svg-back").style.display = "none";
                document.getElementById("header").style.gap = "2rem";
                document.getElementById("header").style.paddingInline = "2rem";
              }}
            >
              <path
                id="arrow_back_FILL0_wght400_GRAD0_opsz48_1_"
                data-name="arrow_back_FILL0_wght400_GRAD0_opsz48 (1)"
                d="M20.373,32.745,8,20.373,20.373,8,22,9.624l-9.589,9.589H32.745v2.32H12.408L22,31.121Z"
                transform="translate(-8 -8)"
                fill="#fff"
              />
            </svg>

            <Account ref={childRef} user={user}></Account>
          </div>
        </header>
      )}
      {smallScreenNavbarEnabled && <div className="small-screen-navbar"></div>}
    </>
  );
}

export default Header;
