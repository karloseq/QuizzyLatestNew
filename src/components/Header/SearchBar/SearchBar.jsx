import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.scss";

function SearchBar() {
  const navigate = useNavigate();
  const bar = useRef(null);
  const [currentText, setCurrentText] = useState("")

  const POTENTIAL_SUGGESTIONS = [
    ["Study Sets", "sets", "../images/search/suggestion-sets.svg"],
    ["Users", "users", "../images/search/suggestion-users.svg"],
  ]

  return (
    <div className="searchbar-cover">
      
      <div className="search-icon-cover">
        <div className="search-icon" id="search-icon-header" onClick={() => {
          document.getElementById("searchBar").style.display = "flex";
          document.getElementById("header-user-info").style.display = "none";
          document.getElementById("nav-icon-header").style.display = "none";
          document.getElementById("search-icon-header").style.display = "none";
          document.getElementById("header").style.gap = "0px";
          document.getElementById("header").style.paddingInline = "0";
          document.getElementById("right").style.marginLeft = "1rem";
          document.getElementById("right").style.gap = "20px";
          document.getElementsByClassName("svg-back")[0].style.display = "block";
        }}>
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
        </div>
      </div>
      
      <form className="searchBar" id="searchBar" onSubmit={(ev) => {
        ev.preventDefault();
        navigate("/search/" + bar.current.value);
      }}>
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
        <input type="text" placeholder="Search for study sets, users, ..." ref={bar} onChange={function() {
          setCurrentText(bar.current.value)
        }}></input>
      </form>
      {currentText.length > 0 && 
        <div className="search-suggestions">
          {POTENTIAL_SUGGESTIONS.map((arr) => (
            <div className="suggestion" onClick={function() {
              if (arr[1] == "sets") {
                navigate("/search/" + currentText + "?category=sets")
              }
              else if (arr[1] == "users") {
                navigate("/search/" + currentText + "?category=users")
              }
              window.location.reload();
            }}>
                <img src={arr[2]}></img>
              <a className="search-ref"><span style={{ fontWeight: "bold" }} className="text-hide">{currentText}</span>{" "} in {" "} <span className="text-sec" style={{fontWeight: "bold"}}>{arr[0]}</span></a>
            </div>
          ))}
        </div>
      }
    </div> 
     

  );
}

export default SearchBar;
