import React, { useEffect, useRef } from "react";

import "./SupportArticle.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { fetch_article} from "../../network/communication";
import MDEditor from "@uiw/react-md-editor";
import ArticleSearch from "../../components/ArticleSearch/ArticleSearch";

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

function SupportArticle(props) {
  const { section, id, article} = useParams("");
  const [thisArticle, setThisArticle] = useState(null);
  const [facebookIconHovered, setFacebookIconHovered] = useState(false);
  const [twitterIconHovered, setTwitterIconHovered] = useState(false); 
  const [linkedinIconHovered, setLinkedInIconHovered] = useState(false);
  const [otherArticles, setOtherArticles] = useState([]);
  useEffect(() => {
    fetch_article(section, id, (data) => {
      setThisArticle(data.data);
      setOtherArticles(data.other_articles);
    })
  }, []) 

  return (
    <main className="support-article">
      {thisArticle && (
        <>
      <div className="path-search-container">
        <div className="path-name" style={{display: "flex", flexDirection: "row", alignItems:"center", gap: "10px"}}>
          <a href="../../../">Quizzy Support</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="19.413" height="19.413" viewBox="0 0 19.413 19.413">
  <path id="arrow_forward_FILL0_wght400_GRAD0_opsz48_1_" data-name="arrow_forward_FILL0_wght400_GRAD0_opsz48 (1)" d="M17.707,27.413l-1.274-1.3,7.492-7.492H8V16.8H23.925L16.433,9.3,17.707,8l9.707,9.707Z" transform="translate(-8 -8)"/>
</svg>

          <a href="../">{thisArticle.section}</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="19.413" height="19.413" viewBox="0 0 19.413 19.413">
  <path id="arrow_forward_FILL0_wght400_GRAD0_opsz48_1_" data-name="arrow_forward_FILL0_wght400_GRAD0_opsz48 (1)" d="M17.707,27.413l-1.274-1.3,7.492-7.492H8V16.8H23.925L16.433,9.3,17.707,8l9.707,9.707Z" transform="translate(-8 -8)"/>
</svg>

          <a>{thisArticle.title}</a>
        </div>
        
        <ArticleSearch style={{"width": "418px"}} ></ArticleSearch>
      </div>
      <div className="content-container">
          <div className="other-articles-container">
            <h1>Other Articles</h1>
            {otherArticles.map(articleData => (
              <a href={"../../" + section + "/" + articleData[1] + "/" + articleData[0].replace(/\s+/g, "-").toLowerCase()}>{articleData[0]}</a>
            ))}
           
          </div>
          <div className="article-content-container"> 
            <h1>{thisArticle?.title}</h1>
            <div className="creator" onClick={() => {
              window.location.href = "/users/" + thisArticle?.creator?.userid + "/"
            }}>
                <img src={thisArticle?.creator?.image}></img>
                <div className="creator-info">
                  <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "2px"
                  }}>
                    <p className="creator-username">{thisArticle?.creator?.username}</p>
                    {thisArticle?.creator?.verified && (
                        <img
                          src="/images/user/check.svg"
                          className="checkmark"
                          title="This user is verified."
                          alt="checkmark icon"
                        />
                      )}
                  </div>
                  <p className="created">{thisArticle?.date_created}</p>
                </div>
            </div>
            <div data-color-mode="light" className="description">
              <MDEditor.Markdown
                source={thisArticle?.content}
              ></MDEditor.Markdown>
              <div className="socials">
                <a href={"https://twitter.com/intent/tweet?via=Quizzynow&text=" + thisArticle?.title + "&hashtags=quizzy%2Cquizzynow%2Cquizzysupport&url=" + encodeURI(window.location.href)} target="_blank"><img src={twitterIconHovered ? "/images/footer/hovered/icons8-twitter.svg" : "/images/footer/icons8-twitter.svg"} alt="Twitter" onMouseEnter={() => {
                        setTwitterIconHovered(true);
                    }} onMouseLeave={() => {
                        setTwitterIconHovered(false);
                    }}></img></a>
                    <a href={"http://www.facebook.com/share.php?u=" + encodeURI(window.location.href)}><img src={facebookIconHovered ? "/images/footer/hovered/icons8-facebook.svg" : "/images/footer/icons8-facebook.svg"} alt="Facebook" onMouseEnter={() => {
                        setFacebookIconHovered(true);
                    }} onMouseLeave={() => {
                        setFacebookIconHovered(false);
                    }}></img></a>
                  
                    <a href="https://linkedin.com"><img src={linkedinIconHovered ? "/images/footer/hovered/icons8-linkedin-circled.svg" : "/images/footer/icons8-linkedin-circled.svg"} alt="LinkedIn" onMouseEnter={() => {
                        setLinkedInIconHovered(true);
                    }} onMouseLeave={() => {
                        setLinkedInIconHovered(false);
                    }}></img></a>
              </div>
              <hr />
              <p>Have more questions? <a style={{color: "#8358E8", cursor: "pointer"}} href={"../../getting-started/2/ask-us-a-question"}>Submit a request</a></p>
              <hr/>
              <h1>Related Articles</h1>
              <div className="related-articles">
                  {otherArticles.map(articleData => (
                  <a href={"../../" + section + "/" + articleData[1] + "/" + articleData[0].replace(/\s+/g, "-").toLowerCase()}>{articleData[0]}</a>
                ))}
                
              </div>
            </div> 
           
            </div>
        
      </div>
      </> )}
    </main>
  );
}

export default SupportArticle;
