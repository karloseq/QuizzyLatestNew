import React from "react";
import "./VerifyEmailSuccess.scss";

import { Link } from "react-router-dom";
import { style } from "@mui/system";

function VerifyEmailSuccess(props) {
  const user = props.user;
  
  return (
      <main className="verify-success">
          
          <div id="mail-div">
              <img id="mail-icon" src="/images/email.png"></img>
          </div>
          <h1 id="please-verify">Success!</h1>
          <div id="desc-div">
              <p id="desc">Thanks {user.name}!</p>
              <p id="desc">You've successfully verified your email address for Quizzy!</p>
              <p id="desc">You can close this tab now, and get to studying.</p>
          </div>
          
      </main>
  )
}
export default VerifyEmailSuccess