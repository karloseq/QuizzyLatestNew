import React, { useRef } from "react";
import "./ForgotPassword.scss";
import Cookies from 'universal-cookie';

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { useState, useEffect } from "react";

import { Navigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { forgot_password, get_user, SECURITY_COOKIE } from "../../network/communication";



function Forgot() {
    const dispatch = useDispatch();
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
        script.src = "https://quizzynow.com/js/login-subtitles/signup.js";
        document.body.appendChild(script);
      }, 500)
    }, []);
    const [isValidEmail, setValidEmail] = useState(false);
    const [infoText, setInfoText] = useState("Forgot your password? No problem. Enter your details below and we'll send you a password reset link.");
    const [infoTextStyle, setInfoTextStyle] = useState({
        color: "#808080"
    })
    const [email, setEmail] = useState('')
    const [finished, setFinished] = useState(false);

    useEffect(() => {
      const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const match = String(email).toLowerCase().match(EMAIL)
      setValidEmail(match)
    }, [email])
    
    const handleLogin = (event) => {
        event.preventDefault();
        fetch("https://quizzynow.com/php/forgot-password.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email })
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
                }
            });
        })
    };


    document.title = "Forgot Password - Quizzy"

    return (
        <div className="forgot-password">
          <script src="https://unpkg.com/typewriter-effect@latest/dist/core.js"></script>
      {loggedIn && <Navigate to="/dashboard" />}
      <main className="forgot-password-main">
        <aside>
          <h1>Quizzy</h1>
          {/*<TypeWriterEffect multiText={["I want to learn Algebra I", "I want to learn Computer Science" 
        ]} textStyle={{width: "100%", fontFamily: "Open Sans", color: "white", fontWeight: "400", fontSize: "0.75em", textAlign: "center"}} typeSpeed={30} cursorColor="white"> 
          
      </TypeWriterEffect>*/}
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
          <h3>Forgot Password</h3>
          <div className="line"></div>
          <p id="infotext" style={infoTextStyle}>
          {infoText} 
          </p>
          <form>
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="Enter email address"
              id="email"
              name="email"
              disabled={finished}
              onChange = {function(e) { setEmail(e.target.value)}}
            />
            
            <div className="submitbutton">
              <button className={(isValidEmail && !finished) ? "enabled-button" : "disabled-button"} onClick={function(e) {
                e.preventDefault()
                forgot_password(email, function(data) {
                  if (data['success'] == true) {
                    setInfoTextStyle({color: "#8358E8"})
                    setInfoText("Success! We've sent you an email with a password reset link.")
                    setFinished(true)
                  }
                  else {
                    setInfoTextStyle({color: "red"})
                    setInfoText("Error: Invalid email. Please try again.")
                  }
                })
                
               
              }}>
                Send
              </button>
              <h6>or</h6>
              <Link to="/login">I know my password</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
    );
}

export default Forgot;