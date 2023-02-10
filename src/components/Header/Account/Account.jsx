import React, { useState, Suspense, useEffect,forwardRef,useImperativeHandle } from "react";
import "./Account.scss";
import Headere from '../Header'
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/userActions";

import { Link, useHref, useNavigate } from "react-router-dom";

import { network, on_logout, post_to_server } from "../../../network/communication.js";
import { CHECKMARK_ICON } from "../../../constants/constants";

function Account(props,ref) {
  const dispatch = useDispatch();

  const user = props.user
  const loggedIn = user && user.success != false 
  
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false); // this was supposed to be for dropdown

  const handleMenu = () => {
    setMenu((menu) => !menu);
    if(menu==false){
      console.log("done");
      let pop = document.getElementById("over-pop")
      pop.style.display="block"
    }
  };
  useImperativeHandle(ref,()=>({
    clickBody
  }))
  function clickBody() {
    setMenu(false);
    let pop = document.getElementById("over-pop")
    pop.style.display = "none"

  } 

  const handleLogout = () => {
    console.log("Logging out");
    post_to_server("logout", null, function(data) { 
      if (data.success) {
        localStorage.setItem("session_token", null)
        on_logout()
        window.location.href = "/login"
      } //e
    })
    
  };

  return (
    <> 
  
    <div className="account">
    
      {loggedIn ? (
        
        <div className="user">
          {user.userid != undefined && 
          <div className="info" id="header-user-info" onClick={handleMenu}>
            
            <img
              src={user.image} 
              
              width={35}
              height={35}
            />
            <h3 className="pc-only">{user.username} </h3>

            {user.verified && <img id="verified" src={CHECKMARK_ICON}></img>}
            {user.membership > 0 && 
              <div className="plus-icon">
                <p className="plus-icon" >PLUS</p>
              </div>
            }
          </div>}

          {menu && (
            <div id="user-options">
              <a onClick={() => {
                  handleMenu();
                  navigate("/dashboard");
              }}>Dashboard</a>
              <a onClick={() => {
                  handleMenu();
                  navigate("/users/" + user.userid);
              }}>Profile</a>
              <a onClick={() => {
                  handleMenu();
                  navigate("/settings");
              }}>Settings</a>
              <a onClick={() => {
                  handleMenu();
                  navigate("/quizzyplus");
              }}>Upgrade</a>
              
              <div id="user-option-separator" class="separator"></div>
              <span id="option-logout" onClick={handleLogout}>
                <svg class="logout-icon" viewBox="3 3 18 18">
                  <path
                    id="logout-icon"
                    d="M 17 8 L 15.59000015258789 9.409999847412109 L 17.17000007629395 11 L 9 11 L 9 13 L 17.17000007629395 13 L 15.59000015258789 14.57999992370605 L 17 16 L 21 12 L 17 8 Z M 5 5 L 12 5 L 12 3 L 5 3 C 3.900000095367432 3 3 3.900000095367432 3 5 L 3 19 C 3 20.10000038146973 3.900000095367432 21 5 21 L 12 21 L 12 19 L 5 19 L 5 5 Z"
                  ></path>
                </svg>
                Logout
              </span>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to="/signup" className="button">
            <h4>Sign Up</h4>
          </Link>
          <Link to="/login" className="button">
            <h4>Login</h4>
          </Link>
        </>
      )}
    </div>
    </>
  );
}

export default forwardRef(Account);
