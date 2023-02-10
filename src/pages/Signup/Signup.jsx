import React from "react";
import "./Signup.scss";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { FastfoodOutlined } from "@mui/icons-material";
import { get_user } from "../../network/communication";
import { Helmet } from "react-helmet-async";

const userData = {
    name: "Script_ing",
    image: "pfplarge.svg",
    description: "Hi, I'm just a 17 year old high school kid who wants to change the world. This is my description, where I can say whatever I want.",
    role: "Student",
    friends: [{
            img: "images/user/friends/1.svg",
            online: true,
        },
        {
            img: "images/user/friends/2.svg",
            online: true,
        },
        {
            img: "images/user/friends/3.svg",
            online: false,
        },
    ],
    schedule: [{
            name: "Accounting Flashcards",
            type: "Recal Session",
            time: "Today",
        },
        {
            name: "Physics Flashcards",
            type: "Recal Session",
            time: "Tommorow",
        },
        {
            name: "AP Physics Unit 1 Test",
            type: "Test",
            time: "Tommorow",
        },
    ],
    verified: true,
};

function Signup() {
    const dispatch = useDispatch();
    var loggedIn = false;

    useEffect(() => { 
        get_user(function(user) {
            if (user.success) { 
              loggedIn = true; 
            }
        })
    })

    useEffect(() => {
        const preload = document.createElement("script")
        preload.src = "https://unpkg.com/typewriter-effect@latest/dist/core.js"
        document.body.appendChild(preload)
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = "https://quizzynow.com/js/login-subtitles/signup.js";
          document.body.appendChild(script);
        }, 500)
      }, []);
 
    const DEFAULT_INFO_TEXT = "Welcome to Quizzy! Before you can get started with learning, you\nneed to sign up. Fill out the form below, and let's get learning!";

    const [infoText, setInfoText] = useState(DEFAULT_INFO_TEXT);
    const [infoTextStyle, setInfoTextStyle] = useState({
        color: "#808080"
    })

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [retypedPassword, setRetypedPassword] = useState('')
    const [email, setEmail] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const [weakPassword, setWeakPassword] = useState(false)

    const [usernameAlreadyExists, setUsernameAlreadyExists] = useState(false);
    const [usernameContainsInvalidCharacters, setUsernameContainsInvalidCharacters] = useState(false);

    const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

    const [signupDisabled, setSignupDisabled] = useState(false);
    const handleSignup = (event) => {
        event.preventDefault();
        if (signupDisabled) {
            return false;
        }
        fetch("https://quizzynow.com/php/signup.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'desiredUsername': username,
                "desiredPassword": password,
                'desiredEmail': email
            })
        }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            response.json().then(function(data) {
                console.log(data);
                if (data.error) {
                    setInfoTextStyle({
                        color: "#ff3333",
                        fontWeight: "bold"
                    })
                    if (data.error == "usernameAlreadyExists") {
                        setUsernameAlreadyExists(true);
                    }
                    else {
                        setInfoText(data.error)
                    }
                } else if (data.success && data.userdata) {
                    localStorage.setItem("session_token", data.userdata.session_token)
                    loggedIn = true; 
                    window.location.href = "/dashboard"
                }
            })
        })
    };

    const updateSignupButton = function() {
        if (usernameAlreadyExists || passwordsDontMatch || invalidEmail || String(password).length < 6 || String(retypedPassword).length < 6 || String(email).length < 1 || String(username).length < 1 || !agreedToTerms) {
            setSignupDisabled(true)
        } else {
            setSignupDisabled(false)
        }
    }

    var existingUsernames = {}

    const verifyUsername = function() {
        if (username.length < 1) {setUsernameAlreadyExists(false); return false; }
        if (existingUsernames[username] != undefined) {
            setUsernameAlreadyExists(true)
            return;
        }
        fetch("https://quizzynow.com/php/check_username.php?username=" + username, {
            method: 'GET',
        }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            response.json().then(function(data) {
                console.log(data)
                setUsernameAlreadyExists(data['exists'])
                if (data['exists'] == true) {
                    existingUsernames[username] = true;
                }
            })
        })
    }
    const verifyRetypedPassword = function() {
        if (String(password).length < 1 || String(retypedPassword).length < 1) {
            setPasswordsDontMatch(false);
            updateSignupButton();
            return false;
        }
        if (retypedPassword != password) {
            setPasswordsDontMatch(true)
        } else {
            setPasswordsDontMatch(false)
        }
        updateSignupButton();
    }

    const verifyEmailAddress = function() {
        if (String(email).length < 1) {
            setInvalidEmail(false);
            updateSignupButton()
            return false; 
        }
        const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const match = String(email).toLowerCase().match(EMAIL)
        if (!match) {
            setInvalidEmail(true)
        } else {
            setInvalidEmail(false)
        }
        updateSignupButton()
    }

    const SetUsername = function(str) {
        setUsername(str)
    }

    const IsWeakPassword = function(str) { //TODO: add complexity 
        if (str.length < 6) {
            return true; 
        }
        if (str == "abcdef") { 
            return true; 
        }
        else if (str == "123456") {
            return true; 
        }
        else if (str == "654321") {
            return true; 
        }
        return false;
    }

    const SetPassword = function(str) {
        setPassword(str);
        if (str.length < 1) {
            setWeakPassword(false)
            return false;
        }
        
        if (IsWeakPassword(str)) {
            setWeakPassword(true);
            return false; 
        }
        else {
            setWeakPassword(false)
        }
       
    }

    useEffect(() => {
        verifyUsername();
        verifyEmailAddress();
        verifyRetypedPassword();
    })


    return (
        <div className="signup">
      {loggedIn && <Navigate to="/dashboard" />}
      <main className="signup-main">
      <Helmet> 
            <meta 
              name="description"
              content={"Signup and create your new Quizzy account now!"}
            />;
            <meta
              property="og:description"
              content={"Signup and create your new Quizzy account now!"}
            />
            <meta
              property="og:title"
              content={"Quizzy - Signup"}
            />
            <title>{"Signup - Quizzy"}</title>
            </Helmet>
        <aside>
          <h1>Quizzy</h1>
          <h3 id="quizzy-login-left-subtitle">
            That sweet A is coming, but we have to get you signed up before you
            can claim it.
          </h3>
        </aside>
        <section>
          <div className="backtosite">
            <Link to="/">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
              </svg>
              <h6>Back to website</h6>
            </Link>
          </div>
          <h3>Sign Up</h3>
          <div className="line"></div>
          <p id="infotext" style={infoTextStyle}>
          {infoText} 
          </p>
          <form>
            <label for="username">Username</label>
            <input
              type="text"
              placeholder="Enter desired username"
              id="username"
              name="username"
              maxLength="26"
              onChange = {(e) => {SetUsername(e.target.value)}}
              style = {usernameAlreadyExists && {border: "1px solid red"} || {}}
            />
            {usernameAlreadyExists && 
              <label id="error" style={{color: "red"}}> That username already exists!</label>
            }
            
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="Enter email address"
              id="email"
              name="email"
              onChange = {(e) => setEmail(e.target.value)}
              style = {invalidEmail && {border: "1px solid red"} || {}}
            />
            {invalidEmail && 
              <label id="error" style = {{color: "red"}}>Please type a valid email address.</label>
            }

            <label for="password">Password</label>
            <input
              type="password"
              placeholder="Enter desired password"
              id="password"
              name="password"
              maxLength="26"
              onChange = {(e) => SetPassword(e.target.value)}
              style = {weakPassword && {border: "1px solid red"} || {}}
            />
            {weakPassword && 
              <label id="error" style = {{color: "red"}}>Your password is too weak!</label>
            }
            <label for="retype-password">Retype password</label>
            <input
              type="password"
              placeholder="Retype your password"
              id="retype-password"
              name="retype-password"
              maxLength="26"
              onChange = {(e) => setRetypedPassword(e.target.value)}
              style = {passwordsDontMatch && {border: "1px solid red"} || {}}
            />
            {passwordsDontMatch && 
              <label id="error" style={{color: "red"}}>Your passwords don't match!</label>
            }
            <div className="options">
              <div className="left">
                <input type="checkbox" id="tos" name="tos" onChange = {function(e) { 
                    console.log(e.target.value);
                    setAgreedToTerms(e.target.checked); 
                    updateSignupButton() 
                }} />
                <label for="tos">I agree to the Terms & Conditions </label>
              </div>
            </div>
            <div className="submitbutton">
              <button type="submit" class={signupDisabled && "disabled-button" || "enabled-button"} onClick={handleSignup}>
                Sign Up
              </button>
              <h6>or</h6>
              <Link to="/login">I already have an account</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
    );
}

export default Signup;