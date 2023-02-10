import React, { useRef } from "react";
import "./Study.scss";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";

import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { data, ScatterChart } from "../../components/ScatterChart/ScatterChart";
import { VerticalBarChart } from "../../components/VerticalBarChart/VerticalBarChart";
import { HorizontalBarChart } from "../../components/HorizontalBarChart/HorizontalBarChart";
import { SteppedLineChart } from "../../components/SteppedLineChart/SteppedLineChart";
import LineChart from "../../components/LineChart/LineChart";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import TestProgress from "../../components/TestProgress/TestProgress";
import RecallProgress from "../../components/RecallProgress/RecallProgress";
import StudyCalendar from "../../components/StudyCalendar/StudyCalendar";
import FlipCard from "../../components/FlipCard/FlipCard";
import Tags from "../../components/Tags/Tags";

import * as configs from "../../DATA/chart_configs/study.js";
import { studyData } from "../../DATA/page_data/study.js";
import {
  get_set_data,
  get_user,
  on_set_closed,
  get_session_token,
  update_set,
  get_tag_color_index,
} from "../../network/communication";
import { Helmet } from "react-helmet-async";
import MDEditor from "@uiw/react-md-editor";
import { useSpeechSynthesis } from "react-speech-kit";
import Popup from "../../components/Popup/Popup";
import AddTask from "../../components/AddTask/AddTask";


function Study(props) {
  var currentFlipCardRef = useRef();
  const [slideDirection, setSlideDirection] = useState(null);
  const navigate = useNavigate();
  const { speak, cancel, voices } = useSpeechSynthesis();
  const selectedVoiceIndex = 1;
  const [user, setUser] = useState({
    name: "",
    streak: 0,
    today: { pending: 0, completed: 0, streak_saved: 0 },
    streak_calendar: { this_month: [] },
    email_verified: true,
  });
  useEffect(() => {
    get_user(function (user) {
      setUser(user);
      console.log(user);
    });
  }, []);
  const setDateInput = useRef(null);
  const [slideleft, setSlideLeft] = useState(0);
  const [slideright, setSlideRight] = useState(0);

  const [appear, setAppear] = useState(0);
  const [addTestDateClicked, setAddTestDateClicked] = useState(false);
  const [editTestDateClicked, setEditTestDateClicked] = useState(false);
  const [mostDifficultTermData, setMostDifficultTermData] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const pen = useRef(null);
  const { setid, title } = useParams("");
  const [setdata, setSetData] = useState({
    title: "",
    terms: {},
    test: {},
    creator: {},
    tags: [],
    creation_date: null,
    psd: {
      study_history_by_activity: {},
      study_time_distribution: {},
      time_spent_on_learning: {},
      recall_progress: [[], []],
      mastery_progress: [[], []],
      most_difficult_terms: [],
    },
  });

  const [expectedTitle, setExpectedTitle] = useState(null);
  const [currentCard, setCurrentCard] = useState({
    front: "",
    back: "",
    front_img: null,
    back_img: null,
    front_equation: null,
    back_equation: null,
    num: -1,
  });
  const [genericQuizzyPlusPopupEnabled, setGenericQuizzyPlusPopupEnabled] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const token = get_session_token();
  const tags = setdata.tags;

  var urlTitle = "";
  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      on_set_closed(setid, "flashcards", token, () => { });
    });
  }, []);

  useEffect(() => {
    get_set_data(setid, token, function (data) {
      console.log(data);
      if (!data["title"] || data["success"] === false) {
        window.location.href = "https://quizzynow.com/404";
      }
      setSetData(data);
      setExpectedTitle(
        !data["title"]
          ? "ERROR"
          : data["title"].replace(/\s+/g, "-").toLowerCase()
      );
      var front_img = data.terms[0][2];
      var back_img = data.terms[0][3];
      var front_equation = data.terms[0][4];
      var back_equation = data.terms[0][5];
      setCurrentCard({
        front: data.terms[0][0],
        back: data.terms[0][1],
        num: 0,
        nterms: data.terms.length,
        front_img: front_img,
        back_img: back_img,
        front_equation: front_equation,
        back_equation: back_equation,
      });

      document.title = data["title"] + " - Quizzy";
    });
  }, []);

  urlTitle = "/study/" + setid + "/" + expectedTitle;
  console.log("SET DATA");
  console.log(setdata);

  var recallDates = [];
  if (setdata !== undefined && setdata?.psd?.recall_dates !== undefined) {
    setdata.psd.recall_dates.map((date, index) => {
      if (index <= 4) {
        recallDates.push(new Date(date));
      }
    });
  }
  

  function onLeftArrowClicked() {
    var n = currentCard.num;
    if (n == 0) {
      return;
    }
    setSlideDirection("right");
    setSlideRight(1);
  }

  function onRightArrowClicked() {
    var n = currentCard.num;
    if (n == setdata.terms.length - 1) {
      return;
    }
    setSlideDirection("left");
    setSlideLeft(1);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = new Date().toLocaleString("en-US", {
    month: "long",
  });

  var [todayISO] = new Date().toISOString().split("T");

  function randomHexColor() {
    return (
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
    );
  }

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

  var studyTimeDistrib = {
    labels: [],
    data: [],
    bgColor: COLORS,
    textInside: "0",
    rotate: -45,
    divider: 2.6,
  };

  var masteryProg = {
    labels: ["Mastery Progress", "NaN"],
    data: [0, 100],
    bgColor: ["#8358E8", "#363636"],
    textInside: "0%",
    rotate: -45,
    mastery: true,
    divider: 2.6,
  };

  var recallProg = {
    dashTitle: " Quizzy's Smart Projection",
    dashData: [],
    fillTitle: " Your Learning",
    fillData: [],
    labels: [],
  };

  console.log(setdata.psd.recall_progress);
  var my_recall_prog = setdata.psd.recall_progress[0];
  var quizzy_expected_recall = setdata.psd.recall_progress[1];

  for (var key in quizzy_expected_recall) {
    recallProg.labels.push(key);
    recallProg.dashData.push(quizzy_expected_recall[key]);
    if (my_recall_prog.hasOwnProperty(key)) {
      recallProg.fillData.push(my_recall_prog[key]);
    }
  }

  var mastery_prog = setdata.psd.mastery_progress;
  masteryProg.data = [mastery_prog, 1 - mastery_prog];

  masteryProg.textInside = Math.floor(mastery_prog * 100) + "%";

  for (var key in setdata.psd.study_time_distribution.std) {
    if (setdata.psd.study_time_distribution.std.hasOwnProperty(key)) {
      studyTimeDistrib.labels.push(key);
      studyTimeDistrib.data.push(setdata.psd.study_time_distribution.std[key]);
    }
  }

  var timeSpentOnLearning = {
    labels: [],
    datasets: [],
  };

  var time_spent_on_learning = setdata.psd.time_spent_on_learning;
  var increment = 0;

  for (var setName in time_spent_on_learning) {
    var data = [];
    for (var timeStamp in time_spent_on_learning[setName]) {
      if (!timeSpentOnLearning.labels.includes(timeStamp)) {
        timeSpentOnLearning.labels.push(timeStamp);
      }
    }
    timeSpentOnLearning.labels.sort(function (x, y) {
      //10:00 PM, 9:00 PM
      let pattern = /([\d]+):([\d]+) ([\w]+)/;
      let match1 = x.match(pattern);
      let hour1 = match1[1];
      let minute1 = match1[2];
      let str1 = match1[3];
      let match2 = y.match(pattern);
      let hour2 = match2[1];
      let minute2 = match2[2];
      let str2 = match2[3];
      /* Check AM/PM */
      if (str1 == "AM" && str2 == "PM") {
        // AM comes before PM.
        return -1;
      } else if (str1 == "PM" && str2 == "AM") {
        return 1;
      }
      /* Assuming both are one str, check hours */
      if (hour2 > hour1) {
        return -1;
      } else if (hour1 > hour2) {
        return 1;
      }
      /* Assuming both hours are the same, check minutes */
      if (minute2 > minute1) {
        return -1;
      } else if (minute1 > minute2) {
        return 1;
      }
      return 0; /* Both dates are exactly the same lol. Do nothing. */
    });
    for (var timeStamp in time_spent_on_learning[setName]) {
      var i = timeSpentOnLearning.labels.indexOf(timeStamp);
      data[i] = time_spent_on_learning[setName][timeStamp]

    }
    timeSpentOnLearning.datasets.push({
      label: setName,
      data: data,
      borderColor: COLORS[increment],
      backgroundColor: COLORS[increment],
      lineTension: 0,
      fill: false,
      stepped: true,
      pointRadius: 0,
    });
    increment++;
  }

  const tot = setdata.psd.study_time_distribution.total;

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " secs" : " secs") : "";

    if (mDisplay != "") {
      hDisplay = h + "hrs ";
      mDisplay = m + "m ";
      if (s > 0) {
        sDisplay = s + "s";
      }
    }
    return hDisplay + mDisplay + sDisplay;
  }

  studyTimeDistrib.textInside = tot > 0 ? secondsToHms(tot) : "0 hours";

  if (tot <= 0) {
    studyTimeDistrib.labels = ["Empty"];
    studyTimeDistrib.data = [24 * 60 * 60];
    studyTimeDistrib.bgColor = ["#363636"];
  }

  const addZero = (num) => (num >= 10 ? num : "0" + num);

  const stringifyDate = (rawDate, includeYear = false, monthString = false) => {
    const date = new Date(rawDate);

    const day = addZero(date.getDate() + 1);

    const month = addZero(date.getMonth() + 1);
    const year = date.getFullYear();

    if (monthString) {
      return months[parseInt(date.getMonth())] + " " + day;
    }

    return `${month}/${day}${includeYear ? `/${year.toString().substr(2)}` : ""
      }`;
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes + " " + ampm;
  };

  if (expectedTitle != null && title != expectedTitle) {
    return <Navigate to={urlTitle}></Navigate>;
  }
  if (expectedTitle == "ERROR") {
    return <Navigate to="/404"></Navigate>;
  }

  const creator_url = "/users/" + setdata.creator.userid; //+ "/" + setdata.creator.username

  return (<>
    {setdata.title.length > 0 && (
      <AddTask user={user} visible={addTaskVisible} setVisible={setAddTaskVisible} setsOverride={[{ title: setdata?.title, terms: setdata?.terms, id: setdata?.id, description: setdata?.description }]} taskOverride={1} stageOverride={2}></AddTask>
    )}

    <div className="study">
      <main>
        {/* Top Section */}
        <Helmet>
          <meta name="description" content={setdata.description} />;
          <meta property="og:description" content={setdata.description} />
          <meta property="og:title" content={setdata.title + " - Quizzy"} />
          <meta property="title" content={setdata.title + " - Quizzy"} />
          <title>{setdata.title + " - Quizzy"}</title>
          {user && user.membership == 0 && (
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7056673711339024"
              crossorigin="anonymous"
            ></script>
          )}
        </Helmet>

        <Popup
          enabled={genericQuizzyPlusPopupEnabled}
          setEnabled={setGenericQuizzyPlusPopupEnabled}
          variant="genericQuizzy+Popup"
          title="Upgrade to Quizzy+ for this feature!"
          subtitle={"This feature is only available to Quizzy+ users."}
        ></Popup>
        <section className="top">
          <div className="left">
            <p>Study</p>
            <button className="purple">
              <img src="/images/study/flashcards.svg" alt="flashcards icon" />
              <p>Flashcards</p>
            </button>
            <button
              className="purple"
              onClick={function () {
                window.location = window.location.href + "/recall";
              }}
            >
              <img src="/images/study/recall.svg" alt="recall icon" />
              <p>Recall</p>
            </button>
            <button className="purple" onClick={function () {
              navigate("quiz")

            }}>

              <img src="/images/study/quiz.svg" alt="quiz icon" />
              <p>Quiz</p>
            </button>
            {/*}
            <div className="coming_soon">
              <p>Coming Soon</p>
              <button>
                <img src="/images/study/quiz.svg" alt="quiz icon" />
                <p>Quiz</p>
              </button>
            </div>*/}
          </div>
          <div className="right">
            <div className="top_bar">
              {setdata.average_mastery_time && (
                <p className="avg_mastery">
                  Average Mastery Time: {setdata.avg_mastery_time} days
                </p>
              )}

              {setdata.psd.test && setdata.psd.test.test_date && (
                <div className="test_announcement">
                  <p>
                    Test on {stringifyDate(setdata.psd.test.test_date, true)}
                  </p>
                  <img
                    className="small_pen"
                    src="/images/study/pen.svg"
                    alt="pen icon"
                  />
                </div>
              )}

              <div className="title">
                {/*<form className="edit-title" onSubmit={
                  function(e) {
                    e.preventDefault();
                    var sd = setdata
                    sd.title = titleInput.current.value; 
                    update_set(setdata.id, get_session_token(), "title", titleInput.current.value);
                    setSetData(sd);
                  }
                } onChange = {function() {
                 // titleInput.current.size = titleInput.current.value.length * 0.9;
                }} onMouseOver = {function() {
                  if (pen && pen.current) {
                    pen.current.hidden = false; 
                  }
                  
                }} onMouseLeave = {function() {
                  if (pen && pen.current) {
                    pen.current.hidden = true; 
                  }
                  
                }} > 
                  <input ref={titleInput} defaultValue={setdata.title} width="100%" maxLength="25" type="text" id="stitle" name="fname" onBlur={function() {
                    var sd = setdata
                    sd.title = titleInput.current.value; 
                    update_set(setdata.id, get_session_token(), "title", titleInput.current.value);
                    setSetData(sd);
                  }}/>
                </form> */}
                <h1>{setdata.title}</h1>
                {setdata.editable && (
                  <img
                    className="big_pen"
                    src="/images/study/pen.svg"
                    alt="pen icon"
                    ref={pen}
                    onClick={() => {
                      navigate("./edit");
                    }}
                  />
                )}
              </div>
              <p>{Object.keys(setdata.terms).length} terms</p>
              {setdata.creator != undefined &&
                setdata.creator.avatar_url != undefined && (
                  <div className="user">
                    <img className="pfp" src={setdata.creator.avatar_url} />
                    <Link to={creator_url} className="username">
                      {setdata.creator.username}
                    </Link>
                    {setdata.creator.verified && (
                      <img
                        src="/images/user/check.svg"
                        title="This user is verified."
                        alt="checkmark icon"
                      />
                    )}
                  </div>
                )}
            </div>
            <div ref={currentFlipCardRef} className="content">
              <a
                className="arrow"
                onClick={onLeftArrowClicked}
                style={{ opacity: currentCard.num == 0 ? 0.3 : 1 }}
              >
                &lt;
              </a>
              <FlipCard
                onAnimationEnd={function (e) {
                  var animName = e.animationName;
                  var n = currentCard.num;
                  if (animName == "slideleft") {
                    setSlideLeft(0);
                    setCurrentCard({
                      front: setdata.terms[n + 1][0],
                      back: setdata.terms[n + 1][1],
                      front_img: setdata.terms[n + 1][2],
                      back_img: setdata.terms[n + 1][3],
                      front_equation: setdata.terms[n + 1][4],
                      back_equation: setdata.terms[n + 1][5],
                      num: n + 1,
                    });
                    setAppear(1);
                    if (soundEnabled) {
                      cancel();
                      speak({
                        text: setdata.terms[n + 1][0],
                        voice: voices[selectedVoiceIndex],
                      });
                    }
                  } else if (animName == "slideright") {
                    setSlideRight(0);
                    setCurrentCard({
                      front: setdata.terms[n - 1][0],
                      back: setdata.terms[n - 1][1],
                      front_img: setdata.terms[n - 1][2],
                      back_img: setdata.terms[n - 1][3],
                      front_equation: setdata.terms[n - 1][4],
                      back_equation: setdata.terms[n - 1][5],
                      num: n - 1,
                    });
                    setAppear(1);
                    if (soundEnabled) {
                      cancel();
                      speak({
                        text: setdata.terms[n - 1][0],
                        voice: voices[selectedVoiceIndex],
                      });
                    }
                  } else if (animName == "appear") {
                    setAppear(0);
                  }
                  setSlideDirection(null);
                }}
                slideleft={slideleft}
                slideright={slideright}
                appear={appear}
                currentCard={currentCard}
                nterms={setdata.terms.length}
                soundEnabled={soundEnabled}
                selectedVoiceIndex={selectedVoiceIndex}
              />
              <a
                className="arrow"
                onClick={onRightArrowClicked}
                style={{
                  opacity:
                    currentCard.num == setdata.terms.length - 1 ? 0.3 : 1,
                }}
              >
                &gt;
              </a>
            </div>
          </div>
        </section>

        <section className="info-section">
          <div className="set-info">
            <h1 className="title">{setdata.title}</h1>
            <div className="user">
              <img
                className="pfp"
                src={setdata.creator.avatar_url}
                alt="User icon"
              />
              <Link to={creator_url} className="username">
                {setdata.creator.username}
              </Link>
              {setdata.creator.verified && (
                <img
                  src="/images/user/check.svg"
                  title="This user is verified."
                  alt="checkmark icon"
                />
              )}
            </div>
            <div data-color-mode="light" className="description">
              <MDEditor.Markdown
                source={setdata.description}
              ></MDEditor.Markdown>
            </div>

            <Tags tags={tags} readonly={true}></Tags>
            <div className="actions-container">
              {/*<div className="button sound-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22.657" height="22.028" viewBox="0 0 22.657 22.028">
  <path id="volume_up_FILL0_wght400_GRAD0_opsz48" d="M19.846,28.478V26.527a9.473,9.473,0,0,0,4.988-3.383,9.038,9.038,0,0,0,1.935-5.68A9.38,9.38,0,0,0,19.846,8.4V6.45a11.209,11.209,0,0,1,8.811,11.014,11.209,11.209,0,0,1-8.811,11.014ZM6,21.271V13.719h5.035l6.294-6.294V27.565l-6.294-6.294Zm13.217,1.51v-10.6a5.079,5.079,0,0,1,2.753,2.014,5.677,5.677,0,0,1,1.023,3.3,5.568,5.568,0,0,1-1.038,3.273A5.157,5.157,0,0,1,19.217,22.782ZM15.44,12.209l-3.556,3.4h-4v3.776h4l3.556,3.43ZM12.482,17.5Z" transform="translate(-6 -6.45)" fill="#fff"/>
</svg>


                    </div>*/}
              {/* sound */}
              {/*
              {soundEnabled ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 34.31 34.31"
                  onClick={() => {
                    setSoundEnabled(false);
                  }}
                >
                  <path
                    id="volume_up_FILL0_wght400_GRAD0_opsz48"
                    d="M26.967,40.76V37.721A14.686,14.686,0,0,0,37.451,23.605a14.521,14.521,0,0,0-2.907-8.872,13.916,13.916,0,0,0-7.577-5.245V6.45A16.614,16.614,0,0,1,36.593,12.6a17.426,17.426,0,0,1,3.717,11,17.426,17.426,0,0,1-3.717,11A16.614,16.614,0,0,1,26.967,40.76ZM6,29.536V17.772h7.624l9.531-9.8V39.339l-9.531-9.8Zm20.014,2.353V15.371a7.709,7.709,0,0,1,4.17,3.137,9.02,9.02,0,0,1,1.549,5.147,8.844,8.844,0,0,1-1.573,5.1A7.829,7.829,0,0,1,26.014,31.888ZM20.3,15.42l-5.385,5.294H8.859v5.882h6.052L20.3,31.937ZM15.816,23.654Z"
                    transform="translate(-6 -6.45)"
                    fill="#b2b2b2"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 34.315 34.315"
                  onClick={() => {
                    setSoundEnabled(true);
                  }}
                >
                  <path
                    id="volume_off_FILL0_wght400_GRAD0_opsz48"
                    d="M34.937,39.165l-5.613-5.613a14.754,14.754,0,0,1-2.573,1.467,15.508,15.508,0,0,1-2.87.957V33.339q.978-.3,1.892-.659a7.61,7.61,0,0,0,1.722-.957l-7.016-7.059V34.743l-8.5-8.5h-6.8V16.033H11.8L2.45,6.678,4.278,4.85,36.765,37.294ZM33.406,29.3l-1.828-1.828a11.519,11.519,0,0,0,1.254-3.062,13.623,13.623,0,0,0,.4-3.317,12.9,12.9,0,0,0-2.551-7.845,11.151,11.151,0,0,0-6.8-4.4V6.211A15.146,15.146,0,0,1,35.787,21.093a15.4,15.4,0,0,1-.6,4.252A15.02,15.02,0,0,1,33.406,29.3Zm-5.7-5.7-3.827-3.827V14.247a7.06,7.06,0,0,1,3.125,2.806,7.767,7.767,0,0,1,1.127,4.082,7.369,7.369,0,0,1-.106,1.254A7.268,7.268,0,0,1,27.708,23.6Zm-7.229-7.229-4.422-4.422,4.422-4.422ZM17.928,28.535V22.156l-3.572-3.572H7.723v5.1H13.08ZM16.142,20.37Z"
                    transform="translate(-2.45 -4.85)"
                    fill="#b2b2b2"
                  />
                </svg>
                )}*/}
            </div>
          </div>
        </section>
        {/* Test Announcement Section */}

        <section className="test">
          {setdata.psd.test != undefined &&
            setdata.psd.test.test_date != undefined &&
            !editTestDateClicked ? (
            <div className="date-announcement">
              <h4>
                Test coming up{" "}
                {stringifyDate(setdata.psd.test.test_date, false, true)}
              </h4>
              <img
                src="/images/study/test/edit.svg"
                className="edit-icon"
                alt="edit icon"
                onClick={function () {
                  setEditTestDateClicked(true);
                }}
              />
            </div>
          ) : (
            <div className="date-announcement">
              <h4>
                {addTestDateClicked
                  ? "When's your test for this set?"
                  : "Have an upcoming test? Add the date to make sure you learn your terms in time."}
              </h4>
              {addTestDateClicked ? (
                <div className="date-picker">
                  <input ref={setDateInput} type="date" min={todayISO}></input>
                  <button
                    className="purple"
                    onClick={() => {
                      update_set(
                        setid,
                        get_session_token(),
                        "test-date",
                        setDateInput.current.value
                      ).then(function (response) {
                        window.location.reload();
                      });
                    }}
                  >
                    <p>Update</p>
                  </button>
                </div>
              ) : (
                <button
                  className="purple"
                  onClick={() => {
                    setAddTestDateClicked(true);
                  }}
                >
                  <p>Add Test Date</p>
                </button>
              )}
            </div>
          )}
          {setdata.psd &&
            setdata.psd.test &&
            setdata.psd.test.test_date &&
            setdata.psd.test.started_studying_date && (
              <TestProgress
                config={{
                  startDate: new Date(setdata.psd.test.started_studying_date),
                  startLabel: "Started studying",
                  endDate:
                    setdata.psd.test.test_date != undefined
                      ? new Date(setdata.psd.test.test_date)
                      : undefined,
                  endLabel: "Test Date",
                }}
              />
            )}

          {setdata.psd.recall_dates !== undefined && (
            <div className="card">
              <div className="calendar">
                <StudyCalendar recallDates={recallDates} psd={setdata.psd} />
                {setdata.psd.test != undefined &&
                  setdata.psd.test.test_date != undefined &&
                  
                  (
                    <p>
                      {setdata.psd.recall_dates.length} Recall Sessions before
                      your test!
                    </p>
                    

                   
                  )}
              </div>
              <div className="recall_sessions">
                <div className="title">
                  <h5>Recall Sessions</h5>
                  <button onClick={() => {
                    console.log("visible")
                    setAddTaskVisible(true);
                  }}>+ Add Session</button>
                </div>
                <div className="content">
                  <ul>
                    {/*<li>
                    <img
                      src="/images/study/calendar/start.svg"
                      alt="Icon of bell"
                    />
                    {stringifyDate(new Date(setdata.psd.test.started_studying_date), false, true)}
           </li>*/}
                    {recallDates.map((recallDate, i) => (
                      <li key={i}>
                        {" "}
                        <img
                          src={
                            new Date().toDateString() ===
                              recallDate.toDateString()
                              ? "/images/study/calendar/start.svg"
                              : "/images/study/calendar/recall.svg"
                          }
                          alt="Icon of bell"
                        />
                        {stringifyDate(recallDate, false, true)}
                      </li>
                    ))}
                    {recallDates.length > 4 && (
                      <li>
                        <img
                          src="/images/study/calendar/recall.svg"
                          alt="Icon of bell"
                        />
                        ...
                      </li>
                    )}
                    {setdata.psd.test != undefined &&
                      setdata.psd.test.test_date != undefined && (
                        <li className="test_list_item">
                          {" "}
                          <img
                            src="/images/study/calendar/test.svg"
                            alt="Icon of bell"
                          />
                          {stringifyDate(
                            new Date(setdata.psd.test.test_date),
                            false,
                            true
                          )}
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* My Learning Section */}
        <section className="my_learning">
          <h4>My Learning</h4>

          {/* Pie Chart Cards */}

          <div className="pie_charts">
            <div className="distribution card">
              <h5>Study Time Distribution</h5>
              <DoughnutChart config={studyTimeDistrib} />
            </div>
            <div className="mastery card">
              <h5>Mastery Progress</h5>
              <DoughnutChart config={masteryProg} />
            </div>
          </div>

          {/*Recall Progress Chart Card */}

          <div className="recall_progress_chart card">
            <h5>Recall Progress Chart</h5>
            <SteppedLineChart config={recallProg} />
          </div>

          {/* Study Time Cards */}

          <div className="study_times">
            <div className="card study_history">
              <h5>Study History by Activity</h5>
              <div className="top">
                <div className="left">
                  <img src="/images/study/learning/sun.svg" alt="sun icon" />
                  <p>Activity</p>
                </div>
                <div className="right">
                  <img src="/images/study/learning/hash.svg" alt="hash icon" />
                </div>
              </div>
              <div className="content">
                <div className="bar">
                  <div className="left">
                    <img
                      src="/images/study/learning/flashcards.svg"
                      alt="flashcards icon"
                    />
                    <p>Flashcards</p>
                  </div>
                  <div className="right">
                    <p>
                      {
                        setdata["psd"]["study_history_by_activity"][
                        "flashcards"
                        ]
                      }
                    </p>
                  </div>
                </div>
                <div className="bar">
                  <div className="left">
                    <img
                      src="/images/study/learning/recall.svg"
                      alt="recall icon"
                    />
                    <p>Recall</p>
                  </div>
                  <div className="right">
                    <p>
                      {setdata["psd"]["study_history_by_activity"]["recall"] ||
                        0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card learning_time">
              <h5>Time Spent On Learning Today</h5>
              <LineChart width={800} height={320} data={timeSpentOnLearning} />
            </div>
          </div>

          {/* Recall Progress Bar Card */}
          {setdata != undefined && setdata.psd != undefined && setdata.psd.recall_progress_smiley_chart != undefined && (
            <div className="recall_progress_bar card">
              <h5>Recall Progress</h5>
              <RecallProgress config={setdata?.psd?.recall_progress_smiley_chart} />
              <p>

                {(setdata?.psd?.recall_progress_smiley_chart["#6D4BBB"] == 0 && setdata?.psd?.recall_progress_smiley_chart["#4B3384"]) ?
                  "You've just started learning this set. Keep learning more terms!" : ""
                }
                {(setdata?.psd?.recall_progress_smiley_chart["#B9A2EE"] == 0 && setdata?.psd?.recall_progress_smiley_chart["#6D4BBB"] > 0 && setdata?.psd?.recall_progress_smiley_chart["#4B3384"] == 0) ?
                  "Awesome! You've learned " + setdata?.psd?.recall_progress_smiley_chart["#6D4BBB"] + "% of your terms for this set! Keep practicing to master all of them!" : ""
                }
                {(setdata?.psd?.recall_progress_smiley_chart["#B9A2EE"] == 0 && setdata?.psd?.recall_progress_smiley_chart["#6D4BBB"] == 0 && setdata?.psd?.recall_progress_smiley_chart["#4B3384"] > 0) ? "You've mastered all of the terms in this set! Amazing work!" : ""}
              </p>

            </div>)}

          {/* Most Difficult Card */}
          {/*
          <div className="most_difficult card">
            <h5>Most Difficult Terms</h5>
            <div className="upgrade">
              <p>
                Upgrade to <span>Quizzy+</span>
                <br />
                for more features.
              </p>
              <Link to="/quizzyplus">
                <button>Get Quizzy+</button>
              </Link>
            </div>
          </div>
           */}
          <div className="box">
            <h3>Most Difficult Terms</h3>
            {user.membership === 0 ? (
              <div className="plus">
                <h4>
                  Upgrade to <strong>Quizzy+ </strong>for more features.
                </h4>
                <Link to="/quizzyplus" className="plusLink">
                  Get Quizzy+
                </Link>
              </div>
            ) : (
              <div className="study_history">
                <div className="top">
                  <div className="left">
                    <p>Term</p>
                  </div>
                  <div className="right">
                    <p>Mistakes</p>
                  </div>
                </div>

                <div className="content">
                  <div className="bar">
                    {setdata.psd.most_difficult_terms.map((key) => (
                      <div className="sep">
                        <div className="left">
                          <p
                            onMouseEnter={() => {
                              var mdtd = [...mostDifficultTermData];
                              mdtd[key] = true;
                              setMostDifficultTermData(mdtd);
                            }}
                            onMouseLeave={() => {
                              var mdtd = [...mostDifficultTermData];
                              mdtd[key] = false;
                              setMostDifficultTermData(mdtd);
                            }}
                          >
                            {mostDifficultTermData[key]
                              ? setdata.terms[key][1]
                              : setdata.terms[key][0]}
                          </p>
                        </div>
                        <div className="right">
                          <p>{setdata.psd.most_difficult_terms[key]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* View History Card */}
          {/*<div className="view_history card">
            <h5>Set View History</h5>
            <ScatterChart />
                            </div>*/}
        </section>

        {/* Overall Stats Section */}
        {/*}
        <section className="overall_stats">
          <div className="title">
            <h4>Overall Stats</h4>
            <h5 className="plus">PLUS</h5>
          </div>

          <div className="study_method card">
            <h5>By Study Method</h5>
            <div className="chart">
              <div className="labels">
                <div className="label">
                  <img
                    src="/images/study/learning/flashcards.svg"
                    alt="icon of flashcards"
                  />
                  <h5>Flashcards</h5>
                </div>
                <div className="label">
                  <img
                    src="/images/study/learning/recall.svg"
                    alt="icon of recall"
                  />
                  <h5>Recall</h5>
                </div>
              </div>
              <div className="chart_canvas">
                <HorizontalBarChart />
              </div>
            </div>

            <p>
              Out of all the times this set has been studied, Flashcards has
              been the most popular method of studying.
            </p>
          </div>

          <div className="recall_progress card">
            <h5>By Recall Progress</h5>
            <SteppedLineChart config={configs.recallProgressDashedConfig} />
          </div>

          <div className="avg_views card">
            <h5>Average Set Views By Study Day</h5>
            <VerticalBarChart config={configs.verticalBarConfig} />
            <p>People tend to view this set on Mondays</p>
          </div>

          <h3>More features coming soon</h3>
          <p className="thanks_for_support">
            ❤️ Thanks for all of your support!
          </p>
                    </section>*/}
      </main>
      {/* Footer */}
      <footer className="footer">
        <p className="footer_title">Stats</p>
        <div className="stats">
          {setdata.views && (
            <div className="stat">
              <p>Total Set Views</p>
              <p>{setdata.views.toLocaleString("en-US")}</p>
            </div>
          )}
          {setdata.average_mastery_time && (
            <div className="stat">
              <p>Average Mastery Time</p>
              <p>{studyData.avgMasteryTime} days</p>
            </div>
          )}
          {setdata.creation_date != null && (
            <div className="stat">
              <p>Creation Date</p>
              <p>{setdata.creation_date}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  </>
  );
}

export default Study;
