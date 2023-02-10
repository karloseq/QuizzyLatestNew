import React, { useRef } from "react";
import "./Login.scss";
import Cookies from 'universal-cookie';

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { get_user, SECURITY_COOKIE } from "../../network/communication";
import GoogleLogin from "react-google-login";
import { Helmet } from "react-helmet-async";


function Login() {
    const dispatch = useDispatch();
    const [shake, setShake] = useState(0);
    var loggedIn = false; 
    useEffect(() => {
      get_user(function(user) {
        if (user.success) { 
          loggedIn = true; 
        }
      })
    }, [])
    
    useEffect(() => {
      const preload = document.createElement("script")
      preload.src = "https://unpkg.com/typewriter-effect@latest/dist/core.js"
      document.body.appendChild(preload)
      setTimeout(() => {
        const script = document.createElement('script');
        script.src = "https://quizzynow.com/js/login-subtitles/login.js";
        document.body.appendChild(script);
      }, 500)
      
    }, []);

    const [infoText, setInfoText] = useState("Welcome back! Before we can get back to learning, we have to get you\nsigned in. Please log in to continue.");
    const [infoTextStyle, setInfoTextStyle] = useState({
        color: "#808080"
    })
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const rememberMe = useRef(null)

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("logging in")
        fetch("https://quizzynow.com/php/login.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, "password": password, "rememberme": rememberMe.current.value })
        }).then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
       //     console.log(response.text());
            response.json().then(function(data) {
                console.log(data);
                if (data['success'] == true) {
                  localStorage.setItem("session_token", data['userdata']['session_token']);
                  const now = new Date()

                  const cookies = new Cookies();
                  cookies.set(SECURITY_COOKIE, data['userdata']['session_token'], { path: '/' });
                  loggedIn = true; 
                  window.location.href = "/dashboard"
                } else {
                    setInfoTextStyle({
                        color: "#ff3333",
                        fontWeight: "bold"
                    })
                    setInfoText("Invalid username or password. Check your username or password and try again.");
                    setShake(1)
                    setTimeout(() => { 
                      setShake(0)
                    }, 700)
                }
            });
        })
    };


    
                    
    return (
        <div className="login" id="login" shake={shake}>
          <script src="https://unpkg.com/typewriter-effect@latest/dist/core.js"></script>
      {loggedIn && <Navigate to="/dashboard" />}
      <main className="login-main">
        <Helmet>
            <meta 
              name="description"
              content={"Login to Quizzy"}
            />;
            <meta
              property="og:description"
              content={"Login to Quizzy"}
            />
            <meta
              property="og:title"
              content={"Quizzy - Login"}
            />
            <title>{"Login - Quizzy"}</title>
            </Helmet>
        <aside>
          <h1>Quizzy</h1>
          <h3 id="quizzy-login-left-subtitle">Ready to claim that A?</h3>
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
          <h3>Log in to Quizzy</h3>
          <div className="line"></div>
          <p id="infotext" style={infoTextStyle}>
          {infoText} 
          </p>
          <form>
            <label for="username">Username or email</label>
            <input
              type="text"
              placeholder="Enter username or email address"
              id="username"
              name="username"
              onChange = {(e) => setUsername(e.target.value)}
            />
            <label for="password">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              id="password"
              name="password"
              onChange = {(e) => setPassword(e.target.value)}
            />
            <div className="options">
              <div className="left">
                <input type="checkbox" id="remember" name="remember" ref={rememberMe} />
                <label for="remember">Remember me</label>
              </div>
              <Link to="/forgot-password">Forgot password</Link>
            </div>
            <div className="submitbutton">
              <button className={(username.length > 0 && password.length > 0) ? "enabled-button" : "disabled-button"} onClick={handleLogin}>
                Login
              </button>
              <h6>or</h6>
              <Link className="sign-btn" to="/signup">I need to sign up</Link>
              
            </div>
            {/*<div className="google-login">
                <GoogleLogin
                  clientId={"67562674714-bdir40am3kp4t7mdkt2r4j8l8r2fpkf8.apps.googleusercontent.com"}
                  buttonText="Log in with Google"
                  cookiePolicy={'single_host_origin'}
                  onSuccess={(googleData) => {
                    console.log(googleData)
                  }}
                  onFailure={(err) => {
                    console.log(err)
                  }}
                ></GoogleLogin>
                </div>*/}
          </form>
        </section>
      </main>
    </div>
    );
}

export default Login;