import React from "react";
import "./VerifyEmail.scss";

import { Link } from "react-router-dom";
import { style } from "@mui/system";
import { useState, useEffect } from "react";
import { get_user, network, post_to_server } from "../../network/communication.js";
import { Navigate } from "react-router-dom";

function VerifyEmail(props) {
  const [user, setUser] = useState({name: ""}); 
  /*useEffect(() => {
    get_user(function(user) {
      setUser(user)
      console.log(user)
    })
  }, [])
  */
  
  useEffect(() => {
    const interval = setInterval(() => {
      post_to_server("get-account", null, function(data) {
        setUser(data)
      })
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
      <main className="verify-email-main">
          {user.email_verified && <Navigate to="/dashboard" />}
          <div id="mail-div">
              <img id="mail-icon" src="/images/email.png"></img>
          </div>
          <h1 id="please-verify">Please verify your email address</h1>
          <div id="desc-div">
              <p id="desc">Before you can begin studying, we need you to verify your email address.</p>
              <p id="desc">We've sent you an email at <span style={{color: "#8358E8", cursor: "pointer"}}>{user.email}</span>. </p>
              <p id="desc">Open the email, click the link, and refresh this page to finish your verification.</p>
          </div>
          
      </main>
  )
}
export default VerifyEmail