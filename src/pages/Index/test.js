import React, { useEffect, useRef } from "react";

import "./Index.scss";
import { Helmet, HelmetProvider } from "react-helmet-async";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import { animated, useSpring } from "react-spring";
import { useState } from "react";
import Typewriter from "typewriter-effect";
import { SteppedLineChart } from "../../components/SteppedLineChart/SteppedLineChart";
import { useNavigate } from "react-router-dom";

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

function Index(props) {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const bubbleRef1 = useRef(null);
  const bubbleRef2 = useRef(null);
  const bubbleRef3 = useRef(null);
  const bubbleRef4 = useRef(null);
  const bubbleRef5 = useRef(null);
  const bubbleRef6 = useRef(null);
  const navigate = useNavigate();

  const COLORS = [
    "#E85871",
    "#8358E8",
    "#58AEE8",
    "#58E8D4",
    "#58E866",
    "#E8E858",
    "#E88458",
    "#5883E8",
    "#58E8E3",
    "#58E8A5",
    "#4D4D4D",
    "#86A8E7",
  ];
  const [bottomFlashcardShown, showBottomFlashCard] = useState(false);

  const STUDENT_REFERENCES = [
    [
      "ayus",
      "https://quizzynow.com/uploads/avatars/phpLb4XCA.jpeg",
      "I wish I had quizz when I took German",
      "Studying AP Biology",
    ],
    [
      "David",
      "https://quizzynow.com/uploads/avatars/default.png",
      "I just took a practice test and got a 40 haha. I guess it's time to hit the Recall Sessions.",
      "Studying at Cornell University",
    ],
    [
      "joshNathan07",
      "https://quizzynow.com/uploads/avatars/php033gRp.jpg",
      "Quizzy is a fantastic teaching and learning tool. It's very innovative and and I enjoy how there many various ways to use Quizzy's tools. The tools can be used in a variety of ways to help memorize information for an exam. It's a very useful tool for studying.",
      "Studying Computer Science",
    ],
    [
      "cool_beans",
      "https://quizzynow.com/uploads/avatars/phpT1wnR8.jpg",
      "Quizzy is awesome! It gradually increased my test scores!",
      "Studying Music",
    ],
  ];
  useEffect(() => {
    showBottomFlashCard(true);
  }, []);

  const EMOJIS = [
    //"/images/recall/extremely_dissatisfied.svg",
    "/images/recall/very_dissatisfied.svg",
    "/images/recall/neutral.svg",
    "/images/recall/satisfied.svg",
    "/images/recall/very_satisfied.svg",
  ];
  var masteryProg = {
    labels: ["Mastery Progress", "NaN"],
    data: [50, 50],
    bgColor: ["#8358E8", "#363636"],
    textInside: "",
    rotate: -45,
    mastery: true,
    divider: 2.6,
    minFontSize: 40,
    maxFontSize: 45,
  };

  var studyTimeDistrib = {
    labels: ["Recall Sessions", "Flashcards"],
    data: [50, 50],
    bgColor: ["#E85871", "#8358E8"],
    textInside: "",
    rotate: -45,
    divider: 2.6,
    minFontSize: 40,
    maxFontSize: 45,
  };

  const recallIntervals = [
    "Again (<10m)",
    "Hard (1d)",
    "Good (1w)",
    "Perfect! (> 1w)",
  ];

  const animateBottomFlashcard = useSpring({
    from: {
      opacity: bottomFlashcardShown ? 0 : 1,
      marginTop: bottomFlashcardShown ? -300 : 0,
    },
    to: {
      opacity: bottomFlashcardShown ? 1 : 0,
      marginTop: bottomFlashcardShown ? 0 : -300,
    },
    delay: bottomFlashcardShown ? 1000 : 0,
  });

  function pop(ref) {
    ref.current.style.animation = "explode 2s forwards";
  }

  var recallProg = {
    dashTitle: "Quizzy's Smart Projection",
    dashData: [NaN, 25, 38, 50, 57, 62, 75, 100],
    fillTitle: "Your Learning",
    fillData: [0, 25],
    labels: ["", "11/18", "11/19", "11/20", "11/21", "11/22", "11/23", "11/24"],
  };

  return (
    <main className="index-main">
      <Helmet>
        <meta
          name="description"
          property="description"
          content="Quizzy is the next-generation flashcard app that is designed to help you get A's on all your tests and to build your long-term memory. It's time to stop cramming for all of your tests. Let's get that A."
        />
        ;
        <meta
          name="og:title"
          property="og:title"
          content="Quizzy - Let's get that A."
        />
        ;
        <meta
          name="og:description"
          property="og:description"
          content="Quizzy is the next-generation flashcard app that is designed to help you get A's on all your tests and to build your long-term memory. It's time to stop cramming for all of your tests. Let's get that A."
        />
        ;
        <meta name="theme-color" content="#8358E8" />;
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="b#8358E8"
        ></meta>
      </Helmet>
      <div className="background-container">
        <img
          className="mockup"
          src={
            windowSize.innerWidth <= 420
              ? "/images/mockup_mobile.jpg"
              : "/images/mockup_1.png"
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
              <h2 className="intro">YOUR LONG DAYS OF CRAMMING ARE OVER</h2>
              <h1 className="meetquizzy">Meet Quizzy</h1>
              <p className="desc">
                Quizzy is the new AI powered flashcard app to help you achieve
                better test results.
              </p>
              <div className="buttons">
                <button
                  className="get-started"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Get Started
                </button>
                <button
                  className="learn-more"
                  onClick={() => {
                    navigate("/about-us");
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sneak-peek-container">
        <div className="sneak-peek-images">
          <div className="sneak-peek-dashboard">
            <img
              className="dashboard-desktop"
              src="/images/dashboard.png"
              alt=""
            />
            <img
              className="dashboard-mobile"
              src="/images/mobile_dashboard.png"
              alt=""
            />
          </div>
          <div className="dashboard-parts">
            <img src="/images/add_task.png" alt="" />
            <img src="/images/schedule.png" alt="" />
          </div>
        </div>
      </div>
      <div className="sections">
        <section className="learning-at-glance" id="learning">
          <div className="info">
            <div className="purple-line"></div>
            <h1>See your learning at a glance</h1>
            <p>
              We know, you have lots of other priorities besides studying and
              homework. It can be very confusing to know how well-prepared you
              are for your tests.
              <br></br>
              <br></br>
              With Quizzy's Study Time Distribution and Mastery Progress charts,
              you'll easily be able to determine if you're prepared or not.
            </p>
            <button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Get Started
            </button>
          </div>
          <div className="graphic">
            <div className="std card">
              <h5>Study Time Distribution</h5>
              <DoughnutChart config={studyTimeDistrib}></DoughnutChart>
            </div>
            <div className="mastery card">
              <h5>Mastery Progress</h5>
              <DoughnutChart config={masteryProg}></DoughnutChart>
            </div>
          </div>
        </section>

        <section className="meet-recall-sessions">
          <div className="graphic recall-sessions">
            <div className="recall-flashcard-cover">
              <div className="front">
                <animated.h1>Accounting Cycle</animated.h1>
                <animated.h2>Accounting Terms - 1/10</animated.h2>
              </div>
              <animated.div style={animateBottomFlashcard} className="back">
                <animated.div
                  className="textarea"
                  placeholder="Write as much as you know about the term 'Accounting Cycle' here.."
                >
                  <Typewriter
                    options={{
                      strings: [
                        "It has something to do with accounting.",
                        "It's a cycle that represents the main sequence of accounting",
                        "The accounting cycle is a holistic process that records a business's transactions from start to finish, helping businesses stay organized and efficient. The cycle incorporates all the company's accounts, including T-accounts, credits, debits, journal entries, financial statements and book closing.",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 40,
                      deleteSpeed: 40,
                    }}
                  />
                </animated.div>
              </animated.div>
            </div>
            <div className="emojis-cover">
              <div className="emojis-box">
                <h3>How well do you know this term?</h3>
                <div className="smileys">
                  <div className="smiley-cover">
                    <div className="smiley-button">
                      <img src={EMOJIS[0]} alt=""></img>
                    </div>
                    <p>{recallIntervals[0]}</p>
                  </div>
                  <div className="smiley-cover">
                    <div className="smiley-button">
                      <img src={EMOJIS[1]} alt=""></img>
                    </div>
                    <p>{recallIntervals[1]}</p>
                  </div>
                  <div className="smiley-cover">
                    <div className="smiley-button">
                      <img src={EMOJIS[2]} alt=""></img>
                    </div>
                    <p>{recallIntervals[2]}</p>
                  </div>
                  <div className="smiley-cover">
                    <div className="smiley-button">
                      <img src={EMOJIS[3]} alt=""></img>
                    </div>
                    <p>{recallIntervals[3]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="info">
            <div className="purple-line"></div>
            <h1>Meet Recall Sessions</h1>
            <p>
              It can be difficult to determine when exactly you should be
              studying. So, we developed Recall Sessions, a spaced-repetition
              and active-recall based system where Quizzy will automatically
              determine when you should study individual terms.
              <br></br>
              <br></br>
              Quizzy will give you a term, and ask you to define it. From there,
              just click a smiley face representing how well you know the term,
              and Quizzy will figure out the rest.
            </p>
            <button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Get Started
            </button>
          </div>
        </section>
        <section className="watch-your-grades">
          <div className="info prob">
            <div className="purple-line"></div>
            <h1>Watch your grades grow</h1>
            <p>
              With Quizzy's dynamic scheduling system, all you have to do is
              enter the date of your test, and Quizzy will automatically notify
              you when you need to study.
              <br></br>
              <br></br>
              Recall Sessions typically don't take longer than 5 minutes.
              Getting that A is as simple as telling Quizzy your test date, and
              attending the automatically scheduled Recall Sessions.
            </p>
            <button
              onClick={() => {
                navigate("/signup");
              }}
            >
              Get Started
            </button>
          </div>
          <div className="graphic graphic-recall-prog">
            <div className="recall_progress_chart card">
              <h5>Recall Progress Chart</h5>
              <SteppedLineChart config={recallProg} />
            </div>
          </div>
        </section>
        <section className="trusted-by-students">
          <div className="graphic uper">
            <div className="slideshow">
              <img alt="" src="/images/mockup_2.png"></img>
              <div className="caption">
                <p>{'"' + STUDENT_REFERENCES[1][2] + '"'}</p>
              </div>
            </div>
          </div>
          <div className="info">
            <div className="purple-line"></div>
            <h1>Trusted by students</h1>
            <div className="students">
              {STUDENT_REFERENCES.map((student) => (
                <div className="student">
                  <div className="info-flex">
                    <img className="avatar" alt="" src={student[1]}></img>
                    <div className="student-header">
                      <h2 className="student-name">{student[0]}</h2>
                      <p className="student-info">{student[3]}</p>
                    </div>
                  </div>
                  <p className="student-desc">{student[2]}</p>
                  <div className="purple-line"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Index;
