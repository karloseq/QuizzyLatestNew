import React, { useState, useEffect } from "react";
import { get_article_suggestions } from "../../network/communication";
import "./ArticleSearch.scss";

function ArticleSearch(props) {
  const [searchText, setSearchText] = useState("");
  const [articleSuggestions, setArticleSuggestions] = useState({});
  
  useEffect(() => {
    get_article_suggestions(searchText, (data) => {
      setArticleSuggestions(data.data);
    });
  }, [searchText]);

  return (
    <div className="article-search" style={props.containerStyle}>
      <div className="sb-cover" style={props.style}>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="text"
              placeholder="What do you need help with?"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            ></input>
          </form>
        </div>
        {searchText.length > 2 && (
          <div className="search-suggestions">
            {articleSuggestions.map((arr) => (
              <a
                href={
                  "support/sections/" +
                  arr[2] +
                  "/" +
                  arr[1] +
                  "/" +
                  arr[0].replace(/\s+/g, "-").toLowerCase()
                }
              >
                <div className="suggestion">
                  <a>{arr[0]}</a>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleSearch;
