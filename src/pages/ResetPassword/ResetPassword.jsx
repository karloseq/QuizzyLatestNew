import React, { useRef } from "react";
import "./ResetPassword.scss";
import Cookies from 'universal-cookie';

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { useState, useEffect } from "react";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { get_user, reset_password, SECURITY_COOKIE } from "../../network/communication";



function Reset() {
    const location = useLocation()
    const searchQuery = (new URL(document.location)).searchParams;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var loggedIn = false; 
    
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
    
    const [isValid, setIsValid] = useState(false);
    const [infoText, setInfoText] = useState("Let's get that password reset, so we can worry about more important things -- like getting that A.");
    const [infoTextStyle, setInfoTextStyle] = useState({
        color: "#808080"
    })
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [retypedNewPassword, setRetypedNewPassword] = useState('')
    const [finished, setFinished] = useState(false);

    useEffect(() => {
      reset_password(searchQuery.get("session"), "", (data) => {
        if (!data.email) {
          navigate("/login")
        }
        setEmail(data.email)
      })
    }, [])

    useEffect(() => {
      updateValidity()
    })

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

    const updateValidity = () => {
      if (IsWeakPassword(newPassword)) {
        setIsValid(false)
        return 
      }
      if (newPassword != retypedNewPassword) {
        setIsValid(false)
        return
      }
      setIsValid(true)
    }

    document.title = "Reset Password - Quizzy"

    return (
        <div className="reset-password">
      {loggedIn && <Navigate to="/dashboard" />}
      <main>
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
          <h3>Reset Password</h3>
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
              disabled={true}
              defaultValue={email}
            />
            <label for="new-password">New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              id="new-password"
              name="new-password"
              disabled={finished}
              onChange = {function(e) { setNewPassword(e.target.value)}}
            />
            <label for="retyped-password">Retype new password</label>
            <input
              type="password"
              placeholder="Retype new password"
              id="retyped-password"
              name="retyped-password"
              disabled={finished}
              onChange = {function(e) { setRetypedNewPassword(e.target.value)}}
            />
            
            <div className="submitbutton">
              <button className={(isValid && !finished) ? "enabled-button" : "disabled-button"} onClick={function(e) {
                e.preventDefault()
                reset_password(searchQuery.get("session"), newPassword, (data) => {
                  if (data.success == true) {
                    setInfoTextStyle({color: "#8358E8"})
                    setInfoText("Success! Your password has been reset!")
                    setFinished(true)
                    setTimeout(function() {
                      navigate("/login")
                    }, 2000)
                  }
                  else {
                    setInfoText("An error occurred.")
                  }
                })
                
              }}>
                Reset
              </button>
              <h6>or</h6>
              <Link to="/login">I remember my old password</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
    );
}

export default Reset;