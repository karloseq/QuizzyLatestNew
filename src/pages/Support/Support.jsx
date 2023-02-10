import React, { useEffect, useRef } from "react";

import "./Support.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  get_article_suggestions,
  publish_article,
} from "../../network/communication";
import ArticleSearch from "../../components/ArticleSearch/ArticleSearch";

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

function Support(props) {
  const bubbleRef1 = useRef(null);
  const bubbleRef2 = useRef(null);
  const bubbleRef3 = useRef(null);
  const bubbleRef4 = useRef(null);
  const bubbleRef5 = useRef(null);
  const bubbleRef6 = useRef(null);
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [searchText, setSearchText] = useState("");
  const [articleSuggestions, setArticleSuggestions] = useState({});

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function pop(ref) {
    ref.current.style.animation = "explode 2s forwards";
  }

  useEffect(() => {
    get_article_suggestions(searchText, (data) => {
      setArticleSuggestions(data.data);
    });
  }, [searchText]);
  return (
    <main className="support-main">
      <div className="background-container">
        <img
          className="mockup"
          src={
            windowSize.innerWidth <= 420
              ? "/images/mockup_mobile.jpg"
              : "/images/mockup_3.png"
          }
          alt="mockup"
        />
        <div className="background-gradient">
          <div className="decor">
            <div className="left-container">
              <div className="dotsquares">
                <img className="dotsquares" src="/images/dotsquare.png"></img>
              </div>
              <div className="bubbles">
                <div
                  className="bubble"
                  ref={bubbleRef1}
                  onClick={() => {
                    pop(bubbleRef1);
                  }}
                ></div>
                <div
                  className="bubble"
                  ref={bubbleRef2}
                  onClick={() => {
                    pop(bubbleRef2);
                  }}
                ></div>
                <div
                  className="bubble"
                  ref={bubbleRef3}
                  onClick={() => {
                    pop(bubbleRef3);
                  }}
                ></div>
                <div
                  className="bubble"
                  ref={bubbleRef4}
                  onClick={() => {
                    pop(bubbleRef4);
                  }}
                ></div>
                <div
                  className="bubble"
                  ref={bubbleRef5}
                  onClick={() => {
                    pop(bubbleRef5);
                  }}
                ></div>
                <div
                  className="bubble"
                  ref={bubbleRef6}
                  onClick={() => {
                    pop(bubbleRef6);
                  }}
                ></div>
              </div>
            </div>
            <div className="right-container">
              <div className="rounded-rectangles">
                <img src="/images/rounded_rect.svg"></img>
                <img src="/images/rounded_rect.svg"></img>
                <img src="/images/rounded_rect.svg"></img>
                <img src="/images/rounded_rect.svg"></img>
                <img src="/images/rounded_rect.svg"></img>
              </div>
            </div>
          </div>
          <div className="background-content">
            <div className="center-text">
              <h1 className="meetquizzy">How can we help you?</h1>
              <p className="desc">
                Watch tutorials. Browse articles. Contact Us.
              </p>
              <ArticleSearch containerStyle={{"width": "100%"}} style={{marginTop: "30px"}}></ArticleSearch>
            </div>
          </div>
        </div>
      </div>
      <section className="section-here-to-help">
        <div className="info here-to-help">
          <h1>We're here to help.</h1>
          <p>
            From navigating Quizzy to understanding Recall Sessions, find help
            for everything you need right at your fingertips.
          </p>
        </div>
      </section>
      <section>
        <div className="info info-support-cards">
          <div className="support-cards">
            <a href="/support/sections/getting-started">
              <div className="support-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="9"
                    viewBox="0 0 40 9"
                  >
                    <path
                      id="line_start_FILL0_wght400_GRAD0_opsz48"
                      d="M8.5,28.5A4.44,4.44,0,0,1,4,24a4.44,4.44,0,0,1,4.5-4.5,4.538,4.538,0,0,1,4.25,3H44v3H12.75a4.538,4.538,0,0,1-4.25,3Z"
                      transform="translate(-4 -19.5)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h1>Getting Started</h1>
                <p>
                  Ready to take your studying to the next level? Get a Quizzy
                  101 right here.
                </p>
              </div>
            </a>
            <a href="/support/sections/the-interface">
              <div className="support-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="44.152"
                    height="29.435"
                    viewBox="0 0 44.152 29.435"
                  >
                    <path
                      id="menu_FILL0_wght400_GRAD0_opsz48"
                      d="M6,41.435V37.756H50.152v3.679ZM6,28.557V24.878H50.152v3.679ZM6,15.679V12H50.152v3.679Z"
                      transform="translate(-6 -12)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h1>The Interface</h1>
                <p>
                  Confused about what certain buttons do? We'll make you an
                  expert.
                </p>
              </div>
            </a>
            <a href="/support/sections/quizzy-plus">
              <div className="support-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="54.465"
                    height="70"
                    viewBox="0 0 54.465 70"
                  >
                    <g
                      id="Group_2025"
                      data-name="Group 2025"
                      transform="translate(-1457 -1428)"
                    >
                      <path
                        id="add_FILL0_wght400_GRAD0_opsz48_1_"
                        data-name="add_FILL0_wght400_GRAD0_opsz48 (1)"
                        d="M19.583,31.465V21.882H10v-2.3h9.583V10h2.3v9.583h9.583v2.3H21.882v9.583Z"
                        transform="translate(1480 1442.268)"
                        fill="#fff"
                      />
                      <text
                        id="Q"
                        transform="translate(1457 1475)"
                        fill="#fff"
                        font-size="42"
                        font-family="Dubai-Bold, Dubai"
                        font-weight="700"
                      >
                        <tspan x="0" y="0">
                          Q
                        </tspan>
                      </text>
                    </g>
                  </svg>
                </div>
                <h1>Quizzy+</h1>
                <p>Learn more about our Quizzy+ program and more here.</p>
              </div>
            </a>
            <a href="/support/sections/flashcards">
              <div className="support-card">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50.953"
                    height="50.953"
                    viewBox="0 0 50.953 50.953"
                  >
                    <path
                      id="sticky_note_2_FILL0_wght400_GRAD0_opsz48"
                      d="M10.246,52.707H38.553V38.553H52.707V10.246H10.246Zm0,4.246A4.228,4.228,0,0,1,6,52.707V10.246A4.228,4.228,0,0,1,10.246,6H52.707a4.228,4.228,0,0,1,4.246,4.246V39.969L39.969,56.953Zm8.492-21.23V31.477H30.769v4.246Zm0-11.323V20.154H44.215V24.4ZM10.246,52.707v0Z"
                      transform="translate(-6 -6)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h1>Flashcards</h1>
                <p>
                  Need help with making Study Sets? Learn about how they work
                  here.
                </p>
              </div>
            </a>
            <a href="/support/sections/recall-sessions">
              <div className="support-card">
                <div className="icon">
                  <svg
                    id="notifications_active_black_24dp"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64.132"
                    height="64.132"
                    viewBox="0 0 64.132 64.132"
                  >
                    <path
                      id="Path_63"
                      data-name="Path 63"
                      d="M0,0H64.132V64.132H0Z"
                      fill="none"
                    />
                    <path
                      id="Path_64"
                      data-name="Path 64"
                      d="M26.724,50.29a4.942,4.942,0,0,0,4.954-4.9H21.77A4.942,4.942,0,0,0,26.724,50.29Zm14.861-14.7V23.332c0-7.524-4.037-13.822-11.146-15.489V6.176a3.715,3.715,0,0,0-7.43,0V7.843c-7.084,1.667-11.146,7.94-11.146,15.489V35.585l-4.954,4.9v2.451H46.538V40.487Zm-4.954,2.451H16.817v-14.7c0-6.078,3.74-11.028,9.907-11.028s9.907,4.951,9.907,11.028ZM15.776,6.372l-3.542-3.5A25.471,25.471,0,0,0,2.03,22.106H6.984A20.647,20.647,0,0,1,15.776,6.372ZM46.464,22.106h4.954a25.627,25.627,0,0,0-10.2-19.239L37.7,6.372A20.768,20.768,0,0,1,46.464,22.106Z"
                      transform="translate(5.342 6.579)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h1>Recall Sessions</h1>
                <p>
                  We admit it -- Recall Sessions can be confusing. Learn about
                  them here.
                </p>
              </div>
            </a>
            <a href="/support/sections/quizzes">
              <div
                className="support-card"
                onClick={() => {
                  window.location.href = "support/sections/quizzes";
                }}
              >
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="43.447"
                    height="48.275"
                    viewBox="0 0 43.447 48.275"
                  >
                    <path
                      id="assignment_FILL0_wght400_GRAD0_opsz48"
                      d="M9.621,50.275A3.606,3.606,0,0,1,6,46.654V10.448A3.606,3.606,0,0,1,9.621,6.827h12.37a5.354,5.354,0,0,1,1.931-3.47,6,6,0,0,1,7.6,0,5.354,5.354,0,0,1,1.931,3.47h12.37a3.606,3.606,0,0,1,3.621,3.621V46.654a3.606,3.606,0,0,1-3.621,3.621Zm0-3.621H45.827V10.448H9.621Zm6.034-6.034H32.129V37H15.655Zm0-10.258H39.792V26.741H15.655Zm0-10.258H39.792V16.482H15.655ZM27.724,9.422A2.026,2.026,0,0,0,29.2,8.789a2.042,2.042,0,0,0,0-2.957,2.042,2.042,0,0,0-2.957,0,2.042,2.042,0,0,0,0,2.957A2.026,2.026,0,0,0,27.724,9.422ZM9.621,46.654v0Z"
                      transform="translate(-6 -2)"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <h1>Quizzes</h1>
                <p>
                  Put the Quiz in Quizzy here and learn about Quizzy's
                  comprehensive Quiz feature.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section>
        <div className="info here-to-help">
          <h1>Other ways to help</h1>
          <div className="support-cards">
            <div className="support-card support-card-red">
              <div className="icon icon-red">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38.063"
                  height="42.688"
                  viewBox="0 0 38.063 42.688"
                >
                  <path
                    id="bug_report_FILL0_wght400_GRAD0_opsz48"
                    d="M26.982,48.688a14.574,14.574,0,0,1-7.174-1.838,11.374,11.374,0,0,1-4.921-5.277H8.009V38.016h5.455a11.924,11.924,0,0,1-.415-3.113V31.731H7.95V28.174h5.1q0-1.719.03-3.409a12.974,12.974,0,0,1,.5-3.35H8.009V17.858h7.115a9.887,9.887,0,0,1,2.194-2.905,13.251,13.251,0,0,1,3.024-2.075L15.776,8.372,18.148,6l5.573,5.573a9.76,9.76,0,0,1,6.7,0L35.994,6l2.372,2.372-4.506,4.506a11.2,11.2,0,0,1,2.935,2.1,14.5,14.5,0,0,1,2.223,2.876h7v3.557H40.381a10.29,10.29,0,0,1,.5,3.35q-.03,1.69-.03,3.409h5.158v3.557H40.855q0,1.6.03,3.172a11.11,11.11,0,0,1-.385,3.113h5.514v3.557H39.136a10.832,10.832,0,0,1-4.891,5.306A15.049,15.049,0,0,1,26.982,48.688Zm0-3.557a9.988,9.988,0,0,0,7.293-2.994A9.841,9.841,0,0,0,37.3,34.874v-9.9a9.841,9.841,0,0,0-3.024-7.263,9.988,9.988,0,0,0-7.293-2.994,9.988,9.988,0,0,0-7.293,2.994,9.841,9.841,0,0,0-3.024,7.263v9.9a9.841,9.841,0,0,0,3.024,7.263A9.988,9.988,0,0,0,26.982,45.131Zm-4.743-8.3h9.486V33.273H22.239Zm0-10.257h9.486V23.016H22.239Zm4.743,3.379h0Z"
                    transform="translate(-7.95 -6)"
                    fill="#fff"
                  />
                </svg>
              </div>
              <h1>Submit a Bug</h1>
              <p>Aagh, not another pesky bug! I'm trying to study!</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="info here-to-help">
          <h1>Didn't find what you were looking for?</h1>
          <div className="support-cards">
            <div className="support-card support-card-green">
              <div className="icon icon-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                >
                  <path
                    id="mail_FILL0_wght400_GRAD0_opsz48"
                    d="M7,40a2.878,2.878,0,0,1-2.1-.9A2.878,2.878,0,0,1,4,37V11a2.878,2.878,0,0,1,.9-2.1A2.878,2.878,0,0,1,7,8H41a2.878,2.878,0,0,1,2.1.9A2.878,2.878,0,0,1,44,11V37a3.076,3.076,0,0,1-3,3ZM24,24.9,7,13.75V37H41V13.75Zm0-3L40.8,11H7.25ZM7,13.75v0Z"
                    transform="translate(-4 -8)"
                    fill="#fff"
                  />
                </svg>
              </div>
              <h1>Email Us</h1>
              <p>
                Reach out to us at support@quizzynow.com with your questions,
                and our dedicated support team will assist you.{" "}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              publish_article(
                "My First Article",
                "content goes here",
                "getting_started",
                "Quizzy 101",
                (data) => {
                  console.log(data);
                }
              );
            }}
          >
            Publish Test
          </button>
        </div>
      </section>
    </main>
  );
}

export default Support;
