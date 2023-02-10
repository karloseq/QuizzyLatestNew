import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { CiStopwatch } from "react-icons/ci";
import { TbExclamationMark } from "react-icons/tb";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsCheck,
  BsExclamationCircle,
  BsInfoCircle,
} from "react-icons/bs";
import "./QuizExam.scss";
import {
  create_practice_exam,
  fetch_quiz_info,
  get_quiz_details,
  get_quiz_info,
  get_session_token,
  get_set_data,
  overwrite_quiz_answers,
  retake_quiz,
  submit_quiz,
  submit_quiz_answer,
  submit_quiz_question,
} from "../../network/communication";
import { useNavigate, useParams } from "react-router-dom";
import Xarrow, { Xwrapper } from "react-xarrows";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import EquationEditor from "equation-editor-react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiArrowRight } from "react-icons/fi";
import { useRef } from "react";
import Popup from "../../components/Popup/Popup";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import { SteppedLineChart } from "../../components/SteppedLineChart/SteppedLineChart";
import { HorizontalBarChart } from "../../components/HorizontalBarChart/HorizontalBarChart";

addStyles();

const QuizExam = () => {
  const [matchChoice1, setMatchChoice1] = useState(null);
  const COLORS = [
    "#E85871",
    "#8358E8",
    "#58AEE8",
    "#58E8D4",
    "#58E866",
    "#E8E858",
    "#E88458",
    "#5883E8",
    "#58E8E3 ",
  ];

  const [preparedAnswerForSubmission, setPreparedAnswerForSubmission] =
    useState(null);
  const [nQuestions, setNQuestions] = useState(null);

  const { setid, title, id } = useParams("");

  const [isOnMainViewingResultsPage, setIsOnMainViewingResultsPage] =
    useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);
  const [viewingResults, setViewingResults] = useState(id ? true : false);
  const [resultsInfo, setResultsInfo] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [optionsResponse, setOptionsResponse] = useState({});
  const [quizView, setquizView] = useState(false);
  const [quizQueue, setQuizQueue] = useState([]); /*useState([
    [ // Part I - Multiple Choice 
      {
        type: "mc",
        term: 0,
        answer: null,
        options: [0, 1, 2], // set indices
      },
      {
        type: "mc",
        term: 1,
        answer: null,
        options: [1, 4, 3] // set indices
      },
    ],
    [ // Part II - T/F 
      {
        type: "t/f",
        term: 2,
        answer: null,
        response: [1],
        options: [] // set indices
      },
    ],
    [ // Part III - Short Answer
      {
        type: "short-answer",
        term: 2,
        answer: null,
      },
    ],
    [ // Part IV - Matching
      {
        type: "matching",
        answer: [], //[0] -> 1, [1] -> 2, [2] -> 0
        options: [[0, 1, 2, 3, 4, 5, 6, 7], [2, 1, 0, 7, 6, 5, 4, 3]] // set indices
      },
      {
        type: "matching",
        answer: [], //[0] -> 1, [1] -> 2, [2] -> 0
        options: [[5, 3, 4], [3, 4, 5]] // set indices
      },
    ]
  ]);*/

  const dateWithTimeZone = (
    timeZone,
    year,
    month,
    day,
    hour,
    minute,
    second
  ) => {
    let date = new Date(Date.UTC(year, month, day, hour, minute, second));

    let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    let tzDate = new Date(date.toLocaleString("en-US", { timeZone: timeZone }));
    let offset = utcDate.getTime() - tzDate.getTime();

    date.setTime(date.getTime() + offset);

    return date;
  };

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const [lastAutosaveTime, setLastAutosaveTime] = useState(Date.now());

  const [lastAnswerChanged, setLastAnswerChanged] = useState(null);

  const [isTakingQuiz, setIsTakingQuiz] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [matchingAnswer, setMatchingAnswer] = useState("");
  const [setData, setSetData] = useState();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  const [submitQuizPopup, setSubmitQuizPopup] = useState(false);

  const [matches, setMatches] = useState({}); //matcha0, matcha2
  const [selectedMatchOption, setSelectedMatchOption] = useState(null);

  const [deadline, setDeadline] = useState(""); //"December, 5, 2022 21:00:00";

  const [settingsVisible, setSettingsVisible] = useState(false);

  const audioRadio = useRef(null);
  const answerWithRadio = useRef(null);
  const typesofQuestionsCheckboxes = useRef(null);
  const typesOfTermsRadio = useRef(null);
  const imagesRadio = useRef(null);
  const nQuestionsForm = useRef(null);
  const timeSelection = useRef(null);
  const emailForm = useRef(null);
  const navigate = useNavigate();

  var quizProgress = {
    dashTitle: " Quizzy's Smart Projection",
    dashData: [],
    fillTitle: " Your Quiz Progress",
    fillData: [],
    labels: [],
    dotColor: "#58E892",
    hideXTicks: true,
    yTicksCallback: function (v) {
      return v + "%";
    },
  };

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " secs" : " secs") : "";

    if (mDisplay != "") {
      hDisplay = h > 0 ? h + "hrs " : "";
      mDisplay = m > 0 ? m + "m " : "";
      if (s > 0) {
        sDisplay = s + "s";
      }
    }
    return hDisplay + mDisplay + sDisplay;
  }

  var timeProgress = {
    fillTitle: " Your Quiz Time",
    fillData: [],
    labels: [],
    dotColor: "#8358E8",
    hideXTicks: true,
    noPercent: true,
    yTicksCallback: function (v) {
      return secondsToHms(v);
    },
  };

  var mostMissedTerms = {
    data: {
      labels: [""],
      datasets: [],
    },
  };

  if (quizDetails != null) {
    var detailCount = 0;
    for (var key in quizDetails[0]) {
      detailCount++;
      quizProgress.labels.push("Attempt #" + detailCount);
      quizProgress.fillData.push(quizDetails[0][key][0]);
      quizProgress.dashData.push(quizDetails[0][key][0]);
    }
    for (var key in quizDetails[1]) {
      detailCount++;
      quizProgress.labels.push("Attempt #" + detailCount);
      quizProgress.dashData.push(quizDetails[1][key]);
    }
    quizProgress.dotColor = getGradeColor(
      quizDetails[0][quizDetails[0].length - 1][0]
    );
    // time prog
    var detailCount = 0;
    for (var key in quizDetails[3]) {
      timeProgress.labels.push("Attempt #" + detailCount);
      timeProgress.fillData.push(quizDetails[3][key]);
    }
    // most missed terms
    var index = 0;
    var total = Object.keys(quizDetails[2]).length;
    var totalReciprocal = 1 / total;
    for (var key in quizDetails[2]) {
      index += totalReciprocal;
      mostMissedTerms.data.datasets.push({
        label: setData.terms[key][0],
        data: [quizDetails[2][key]],
        borderColor: "rgba(0, 0, 0, 0)",
        backgroundColor: getMostMissedColor(index),
        hoverBackgroundColor: "#CF1938",
        borderRadius: 100,
        barPercentage: 0.7,
      });
    }
  }

  const parts = [
    "Part I - Multiple Choice",
    "Part II - True/False",
    "Part III - Short Answer Questions",
    "Part IV - Matching",
  ];

  const getPart = function () {
    var count = 0;
    var part = "";
    Object.keys(quizQueue).forEach((key) => {
      quizQueue[key].forEach((questionData, index) => {
        if (count == currentQuestion) {
          part = parts[key];
        }
        count++;
      });
    });
    return part;
  };

  const getColor = function (i) {
    return COLORS[i % (COLORS.length - 1)];
  };

  const getQuestionDataByIndex = function (i) {
    var qd = {
      type: "short-answer",
      options: [],
    };
    var questionCount = 0;
    Object.keys(quizQueue).forEach((key) => {
      quizQueue[key].forEach((questionData, index) => {
        if (questionCount == i) {
          qd = questionData;
        }
        questionCount++;
      });
    });

    return qd;
  };

  const getQuestionDataByIndex_Results = function (i) {
    var qd;
    var results = resultsInfo?.grade[3];
    var questionCount = 0;

    if (!results) {
      return {
        type: "short-answer",
        options: [],
      };
    }
    Object.keys(results).forEach((key) => {
      results[key].forEach((questionData, index) => {
        if (questionCount == i) {
          qd = questionData;
        }
        questionCount++;
      });
    });

    return qd;
  };

  const overrideCurrentQuestionAnswer = function (answer) {
    // deprecated; used when it was client sided
    var queue = [...quizQueue];
    var didSomething = false;
    var questionCount = 0;
    queue.forEach((data, k) => {
      data.forEach((questionData, index) => {
        if (questionCount == currentQuestion && !didSomething) {
          queue[k][index].answer = answer;
          didSomething = true;
          return;
        }
        questionCount++;
      });
    });
    setQuizQueue(queue);
    setLastAnswerChanged(new Date());
  };

  const getCurrentQuestionData = function () {
    return getQuestionDataByIndex(currentQuestion);
  };

  const updateMatchDataForCurrentQuestion = () => {
    var ans = getCurrentQuestionData().answer;

    if (getCurrentQuestionData().type == "matching") {
      var mat = {};
      Object.keys(getCurrentQuestionData()?.answer)?.forEach((k, index) => {
        //ans.forEach((v, index) => {
        var v = getCurrentQuestionData()?.answer[parseInt(k)];
        if (v != undefined) {
          mat["matcha" + k] = ["matchb" + v, v];
        }
      });
      setMatches(mat);
    } else {
      setMatches({});
      setMatchChoice1(null);
    }
  };

  const isValidMatchChoice = function (i, ans) {
    var valid = true;
    var arr = [];

    /*ans.map((v, index) => { 
      arr.push(v);
      if (getOccurrence(ans, v) > 1) {
        valid = false; 
      }
    })*/
    Object.keys(ans).map((k) => {
      var v = ans[k];
      arr.push(v);
      var nOccurrences = 0;
      Object.keys(ans).map((k) => {
        if (ans[k] == v) {
          nOccurrences++;
        }
      });
      if (nOccurrences > 1) {
        valid = false;
      }
    });
    return valid;
  };

  const getProgress = function () {
    var progress = 0;
    var questionCount = 0;
    Object.keys(quizQueue).forEach((key) => {
      if (key != 3) {
        // matching handled later
        quizQueue[key].forEach((questionData, index) => {
          if (questionData.answer !== null && questionData.answer !== "") {
            if (
              (Array.isArray(questionData.answer) ||
                typeof questionData.answer == "string") &&
              questionData.answer.length > 0
            ) {
              progress++;
            } else if (!Array.isArray(questionData.answer)) {
              progress++;
            }
          }
          questionCount++;
        });
      }
    });

    if (quizQueue[3] != undefined && quizQueue[3].length > 0) {
      // matching
      Object.keys(quizQueue[3][0].answer).forEach(() => {
        progress++;
      });
      Object.keys(quizQueue[3][0].options[0]).forEach((k) => {
        questionCount++;
      });
    }

    return [Math.ceil((progress / questionCount) * 100), questionCount];
  };

  const arrayOfQuestions = function () {
    var questionCount = 0;
    var questions = [];
    Object.keys(quizQueue).forEach((key, k) => {
      quizQueue[key].forEach((questionData, index) => {
        if (k != 3) {
          questions[questionCount] = questionCount;
          questionCount++;
        }
      });
    });

    return questions;
  };

  const getOriginalMatcher = function (v) {
    if (
      getCurrentQuestionData() == null ||
      getCurrentQuestionData()?.answer == null
    ) {
      return null;
    }
    var ind = null;
    //console.log(getCurrentQuestionData()?.answer)
    Object.keys(getCurrentQuestionData()?.answer)?.forEach((k, index) => {
      if (v == getCurrentQuestionData()?.answer[parseInt(k)]) {
        ind = k;
      }
    });

    return ind;
  };

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    if (time <= 0 && !viewingResults && isTakingQuiz) {
      // ran out of time buddy
      updateQuizDB((d) => {
        submit_quiz(setid, (data) => {
          if (data["success"]) {
            navigate("./" + d["id"] + "/results");
            window.location.reload();
          }
        });
      });
    }
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  const getTimerString = () => {
    if (viewingResults) {
      return "Finished Quiz";
    }
    var s = "";
    //(days < 10 ? "0" + days : days) + ":" + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds) + " remaining"
    if (days > 0) {
      if (days < 10) {
        s += "0" + days;
      } else {
        s += days;
      }
      s += ":";
    }

    if (hours > 0) {
      if (hours < 10) {
        s += "0" + hours;
      } else {
        s += hours;
      }
      s += ":";
    }

    if (minutes < 10) {
      s += "0" + minutes;
    } else {
      s += minutes;
    }
    s += ":";

    if (seconds < 10) {
      s += "0" + seconds;
    } else {
      s += seconds;
    }

    if (seconds < 0) {
      s = "Time's over!";
    } else {
      s += " remaining";
    }

    return s;
  };

  function checkIfAllMatchingIsCorrect() {
    var r = getQuestionDataByIndex_Results(arrayOfQuestions().length);
    if (!r) {
      return false;
    }
    var isCorrect = true;
    Object.keys(r).forEach((k) => {
      if (r[k] != "C") {
        isCorrect = false;
      }
    });
    return isCorrect;
  }

  function getNIncorrectMatching() {
    var r = getQuestionDataByIndex_Results(arrayOfQuestions().length);
    var isCorrect = true;
    var nIncorrect = 0;
    if (r != null) {
      Object.keys(r).forEach((k) => {
        if (r[k] != "C") {
          nIncorrect++;
        }
      });
    }

    return nIncorrect;
  }

  function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    if (Math.floor(seconds) < 5) {
      return "Just now";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  // extract numeric r, g, b values from `rgb(nn, nn, nn)` string
  function getRgb(color) {
    let [r, g, b] = color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map((str) => Number(str));
    return {
      r,
      g,
      b,
    };
  }

  function colorInterpolate(colorA, colorB, intval) {
    const rgbA = getRgb(colorA),
      rgbB = getRgb(colorB);
    const colorVal = (prop) =>
      Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);
    return {
      r: colorVal("r"),
      g: colorVal("g"),
      b: colorVal("b"),
    };
  }

  function getGradeColor(grade = null) {
    if (grade == null) {
      grade = resultsInfo?.grade[1];
    }
    if (grade <= 60) {
      return "rgb(216, 60, 60)";
    }
    var t = colorInterpolate(
      "rgb(216, 60, 60)",
      "rgb(88, 232, 146)",
      grade / 100
    );
    return "rgb(" + t["r"] + "," + t["g"] + "," + t["b"] + ")";
  }

  function getMostMissedColor(percent) {
    var t = colorInterpolate("rgb(216, 60, 60)", "rgb(232, 165, 88)", percent);
    return "rgb(" + t["r"] + "," + t["g"] + "," + t["b"] + ")";
  }

  const updateQuizDB = function (fn = function () {}) {
    overwrite_quiz_answers(setid, quizQueue, (data) => {
      if (fn) {
        fn(data);
      }
    });
  };

  const doughnutChartConfig = {
    labels: [
      resultsInfo?.grade[1] + "% correct",
      100 - resultsInfo?.grade[1] + "% incorrect",
    ],
    ignoreTraditionalLabelCallback: true,
    ignoreLegend: true,
    //label: resultsInfo?.grade[1] + "%",
    data: [resultsInfo?.grade[1], 100 - resultsInfo?.grade[1]],
    bgColor: [getGradeColor(), "#363636"],
    textColor: "#71EAA2",
    textInside: resultsInfo?.grade[2],
    rotate: 0,
    divider: 2.6,
  };

  useEffect(() => {
    if (isTakingQuiz) {
      const interval = setInterval(() => getTime(deadline), 1000);

      return () => clearInterval(interval);
    }
  }, [deadline]);

  useEffect(() => {
    get_set_data(
      setid,
      get_session_token(),
      (data) => {
        setSetData(data);
        setNQuestions(data.terms.length);
      },
      "quiz"
    );
    get_quiz_info(setid, (data) => {
      if (data.data.error) {
        setIsTakingQuiz(false);
        setSettingsVisible(true);
      } else {
        if (!data.submitted && !viewingResults) {
          setIsTakingQuiz(true);
          setQuizQueue(data.data);
          setDeadline(data.deadline);
          setQuizId(data.id);
          setOptionsResponse(data.options);
        } else {
          if (!viewingResults) {
            // takes you to most recent quiz answers
            navigate("./" + data.id + "/results");
            window.location.reload();
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isTakingQuiz) {
      setProgress(getProgress()[0]);
    }
  }, [quizQueue, isTakingQuiz]);

  useEffect(() => {
    if (isTakingQuiz || viewingResults) {
      updateMatchDataForCurrentQuestion();
    }
  }, [currentQuestion, isTakingQuiz, viewingResults, quizQueue]);

  useEffect(() => {
    if (id) {
      fetch_quiz_info(setid, id, (data) => {
        // get quiz info of a past test from session id param
        if (data.success) {
          setIsOnMainViewingResultsPage(true);
          setViewingResults(true);
          setIsTakingQuiz(false);
          setResultsInfo(data);
          setQuizQueue(data.data);
        } else {
          navigate("../");
        }
      });
    }
  }, [isTakingQuiz]);

  useEffect(() => {
    // Autosave answers
    if (lastAnswerChanged != null) {
      var dt = new Date() - lastAnswerChanged;
      if (dt >= 1000) {
        setLastAnswerChanged(null);
        updateQuizDB();
        setLastAutosaveTime(new Date());
      }
    }
  });
  let toggleQuiz = () => {
    setquizView(true);
  };
  let inactiveQuiz = () => {
    setquizView(false);
  };
  return (
    <div
      className={
        quizView ? "quiz-exam-container no-pad" : "quiz-exam-container"
      }
    >
      <Popup
        enabled={submitQuizPopup}
        setEnabled={setSubmitQuizPopup}
        variant="ctaPopupWithIcon"
        title="Submit this Quiz?"
        cta="Submit"
        color="green"
        ctaActivate={() => {
          updateQuizDB((d) => {
            submit_quiz(setid, (data) => {
              if (data["success"]) {
                navigate("./" + d["id"] + "/results");
                window.location.reload();
              }
            });
          });
        }}
        ctaIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23.915"
            height="17.266"
            viewBox="0 0 23.915 17.266"
          >
            <path
              id="done_FILL1_wght400_GRAD0_opsz48"
              d="M15.929,29.466,7.7,21.237l1.58-1.58,6.649,6.649L30.036,12.2l1.58,1.58Z"
              transform="translate(-7.7 -12.2)"
              fill="#fff"
            />
          </svg>
        }
        subtitle={
          "By clicking the Submit button, this Quiz will be submitted and graded."
        }
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="86.661"
            height="62.567"
            viewBox="0 0 86.661 62.567"
          >
            <path
              id="done_FILL1_wght400_GRAD0_opsz48"
              d="M37.519,74.767,7.7,44.948l5.724-5.724L37.519,63.318,88.637,12.2l5.724,5.724Z"
              transform="translate(-7.7 -12.2)"
              fill="#58e892"
            />
          </svg>
        }
      ></Popup>
      {settingsVisible && !isTakingQuiz && (
        <div className="recall-session-option">
          <div className="recall-session-option-bg">
            <div className="top-container">
              <div className="avatar"></div>
              <div>
                <div className="title"></div>
                <div className="sub-title"></div>
                <div className="sub-title-2"></div>
              </div>
            </div>
            <div className="bottom-container">
              <div className="top">
                <div className="title"></div>
                <div className="avatar-sm"></div>
              </div>
              <div className="center">
                <div className="title"></div>
                <div className="avatar-sm"></div>
              </div>
              <div className="bottom">
                <div className="title"></div>
                <div className="avatar-sm"></div>
              </div>
            </div>
          </div>
          <div className="recall-session-option-main">
            <div className="container">
              <div className="heading-cont">
                <div className="back" onClick={() => navigate(-1)}>
                  button
                </div>

                <h3 className="title">Create Practice Exam</h3>
                <p className="sub-title">
                  You can customize your practice exam here
                </p>
              </div>

              <div className="container-top">
                <div className="container-top-radio">
                  <p>Audio</p>
                  <div className="radio-container" ref={audioRadio}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input id="audio-on" type="radio" name="audio-enabled" />
                      <label for="audio-on">On</label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="audio-off"
                        type="radio"
                        name="audio-enabled"
                        defaultChecked={"false"}
                      />
                      <label for="audio-off">Off</label>
                    </div>
                  </div>
                </div>
                <div className="container-top-radio">
                  <p>Answer with</p>
                  <div className="radio-container" ref={answerWithRadio}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input id="term" type="radio" name="answer-with" />
                      <label for="term">Term</label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="def"
                        type="radio"
                        name="answer-with"
                        defaultChecked={"on"}
                      />
                      <label for="def">Definition</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-center">
                <div className="container-top-radio">
                  <p>Types of questions</p>
                  <div
                    className="radio-container"
                    ref={typesofQuestionsCheckboxes}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="tf"
                        type="checkbox"
                        name="types-of-questions"
                        disabled={nQuestions < 3}
                        checked={nQuestions < 3 ? false : true}
                        defaultChecked={nQuestions > 2}
                      />
                      <label for="tf">True/False</label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="mc"
                        type="checkbox"
                        name="types-of-questions"
                        disabled={nQuestions < 5}
                        checked={nQuestions < 5 ? false : true}
                        defaultChecked={nQuestions > 4}
                      />
                      <label for="mc">Multiple Choice</label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="matching"
                        type="checkbox"
                        name="types-of-questions"
                        defaultChecked={true}
                      />
                      <label for="matching">Matching</label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <input
                        id="short-answer"
                        type="checkbox"
                        name="types-of-questions"
                        defaultChecked={true}
                      />
                      <label for="short-answer">Short Answer</label>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  <div className="container-top-radio">
                    <p>Types of terms</p>
                    <div className="radio-container" ref={typesOfTermsRadio}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <input
                          id="all-terms"
                          type="radio"
                          name="types-of-terms"
                          defaultChecked={"checked"}
                        />
                        <label for="types-of-terms">All terms</label>{" "}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <input
                          id="audio-off"
                          type="radio"
                          name="types-of-terms"
                        />
                        <label for="types-of-terms">Most Difficult Terms</label>{" "}
                        <div className="create-plus-icon mew">
                          <p className="create-plus-icon">PLUS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="container-top-radio">
                    <p>Images</p>
                    <div className="radio-container" ref={imagesRadio}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <input
                          id="images-on"
                          type="radio"
                          name="images-options"
                          defaultChecked={"on"}
                        />
                        <label for="images-on">On</label>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "5px",
                        }}
                      >
                        <input
                          id="images-off"
                          type="radio"
                          name="images-options"
                        />
                        <label for="images-off">Off</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-center">
                <div className="radio-container" ref={nQuestionsForm}>
                  <p>Number of Questions</p>
                  <input
                    id="n-questions"
                    type="number"
                    defaultValue={setData?.terms?.length}
                    min={0}
                    max={setData?.terms?.length}
                    onChange={() => {
                      setNQuestions(nQuestionsForm.current.children[1].value);
                    }}
                  ></input>
                </div>
                <div className="radio-container" ref={timeSelection}>
                  <p>Time</p>
                  <select name="time" id="time" defaultValue={"30 min"}>
                    <option value="5 min">5 minutes</option>
                    <option value="10 min">10 minutes</option>
                    <option value="15 min">15 minutes</option>
                    <option value="20 min">20 minutes</option>
                    <option value="25 min">25 minutes</option>
                    <option value="30 min">30 minutes</option>
                    <option value="45 min">45 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="5 hours">5 hours</option>
                    <option value="7 hours">7 hours</option>
                    <option value="9 hours">9 hours</option>
                    <option value="12 hours">12 hours</option>
                    <option value="1 day">1 day</option>
                    <option value="2 days">2 days</option>
                    <option value="3 days">3 days</option>
                    <option value="4 days">4 days</option>
                    <option value="5 days">5 days</option>
                    <option value="6 days">6 days</option>
                    <option value="7 days">7 days</option>
                  </select>
                </div>
              </div>
              <div className="container-center">
                <div className="radio-container" ref={emailForm}>
                  <p>Email results</p>
                  <input
                    className="email-input"
                    placeholder="Enter email address.."
                    type="text"
                  ></input>
                </div>
              </div>
              <div className="create-btn-cont">
                <button
                  className={"create-btn"}
                  onClick={() => {
                    var answer_with_term = 0;
                    var audio = 0;
                    var types_of_questions = [];
                    var types_of_terms = "all";
                    var images = 0;
                    var n_questions = nQuestionsForm.current.children[1].value;
                    var time = timeSelection.current.children[1].value;
                    var email = emailForm.current.children[1].value;
                    if (
                      answerWithRadio.current.children[0].children[0].checked ==
                      true
                    ) {
                      answer_with_term = 1;
                    }
                    if (
                      audioRadio.current.children[0].children[0].checked == true
                    ) {
                      audio = 1;
                    }
                    if (
                      typesOfTermsRadio.current.children[0].children[0]
                        .checked == true
                    ) {
                      types_of_terms = "all";
                    } else {
                      types_of_terms = "most-difficult";
                    }
                    if (
                      imagesRadio.current.children[0].children[0].checked ==
                      true
                    ) {
                      images = 1;
                    }

                    var t_f_questions =
                      typesofQuestionsCheckboxes.current.children[0].children[0]
                        .checked == true
                        ? 1
                        : 0;
                    var mc_questions =
                      typesofQuestionsCheckboxes.current.children[1].children[0]
                        .checked == true
                        ? 1
                        : 0;
                    var matching =
                      typesofQuestionsCheckboxes.current.children[2].children[0]
                        .checked == true
                        ? 1
                        : 0;
                    var saq =
                      typesofQuestionsCheckboxes.current.children[3].children[0]
                        .checked == true
                        ? 1
                        : 0;

                    types_of_questions.push(t_f_questions);
                    types_of_questions.push(mc_questions);
                    types_of_questions.push(matching);
                    types_of_questions.push(saq);

                    create_practice_exam(
                      setid,
                      audio,
                      answer_with_term,
                      types_of_questions,
                      types_of_terms,
                      images,
                      n_questions,
                      time,
                      email,
                      (data) => {
                        setQuizQueue(data.data);
                        setIsTakingQuiz(true);
                        setSettingsVisible(false);
                        setDeadline(data.deadline);
                      }
                    );
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {((settingsVisible && !isTakingQuiz) ||
        (viewingResults && resultsInfo?.grade == undefined)) && ( //placeholders
        <div className="practice-exam-container">
          <div className="practice-exam-option">
            <div className="practice-exam-container">
              <div className="practice-exam-top">
                <div className="practice-exam-top-left">
                  <div className="title"></div>
                  <div className="sub-title"></div>
                </div>
              </div>
              <div className="practice-exam-center">
                <div className="practice-exam-center-left">
                  <div className="title"></div>
                  <div className="questions-container">
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                    <div className="question"></div>
                  </div>
                </div>
                <div className="practice-exam-center-right">
                  <div className="practice-exam-center-right-top">
                    <div className="sub-title"></div>
                    <div className="title-container">
                      <div className="title"></div>
                    </div>
                  </div>
                  <div className="practice-exam-center-right-bottom">
                    <div>
                      <div className="answer-cont"></div>
                      <div className="answer-cont"></div>
                      <div className="answer-cont"></div>
                      <div className="answer-cont"></div>
                    </div>

                    <div className="btn-container">
                      <button className="prev-btn"></button>
                      <button className="next-btn"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!settingsVisible && (
        <>
          {!isOnMainViewingResultsPage &&
            Object.keys(matches).map((index) => (
              <div className="arrow">
                <Xarrow
                  start={index}
                  end={matches[index][0]}
                  lineColor={
                    !viewingResults
                      ? getColor(getOriginalMatcher(matches[index][1]))
                      : resultsInfo?.grade[3][3][0][
                          getOriginalMatcher(matches[index][1])
                        ] == "C"
                      ? "#58E892"
                      : "#D83C3C"
                  } //"#8358e8"
                  showHead={false}
                />
              </div>
            ))}
          <div className="quiz-exam-top">
            <div className="navbars-left quiz-opt">
              <img
                onClick={toggleQuiz}
                className="hotdog-nav"
                src="/images/general/threelines.svg"
                alt=""
              />
            </div>
            <div className="quiz-exam-top-left none">
              <h3 className="title">
                <svg
                  style={{ marginRight: "10px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="19.732"
                  height="13.1"
                  viewBox="0 0 19.732 13.1"
                  onClick={() => {
                    window.location.href = "../../";
                  }}
                >
                  <path
                    id="keyboard_backspace_FILL0_wght400_GRAD0_opsz48"
                    d="M12.55,25.1,6,18.55,12.55,12l1.178,1.178L9.179,17.728H25.732v1.644H9.179l4.549,4.549Z"
                    transform="translate(-6 -12)"
                    fill="#2b2b2b"
                  />
                </svg>
                {setData?.title + " - Practice Quiz"}
              </h3>
              {viewingResults ? (
                <h5 className="sub-title">{"Finished Exam"}</h5>
              ) : (
                <h5 className="sub-title">{getPart()}</h5>
              )}
              {viewingResults ? (
                <h5 className="sub-title viewing-results-label">
                  {"Viewing Results"}
                </h5>
              ) : (
                <h5 className="sub-title">
                  {"Last saved: " + timeSince(lastAutosaveTime)}
                </h5>
              )}
            </div>
            {viewingResults ? (
              <div className="quiz-finished-top-center none">
                <div className="progress-cont">
                  <h3 className="score-title">Your score</h3>
                  <ProgressBar
                    borderRadius={50}
                    completed={
                      resultsInfo?.grade[1] == undefined
                        ? 0
                        : resultsInfo?.grade[1]
                    }
                    isLabelVisible={false}
                    bgColor={getGradeColor()}
                    height="15px"
                  />
                  <p
                    className="progress-percent"
                    style={{ color: getGradeColor() }}
                  >
                    {resultsInfo?.grade[1] + "% correct"}
                  </p>
                </div>
                <h3 className="grade" style={{ color: getGradeColor() }}>
                  {resultsInfo?.grade[2]}
                </h3>
              </div>
            ) : (
              <div className="quiz-exam-top-center none">
                <ProgressBar
                  completed={progress}
                  isLabelVisible={false}
                  bgColor="#8358E8"
                  height="15px"
                />
                <p className="progress-percent">{progress + "%"}</p>
              </div>
            )}
            <div className="quiz-exam-center mbl-view">
              {!isOnMainViewingResultsPage && (
                <div className="quiz-exam-center-left none">
                  <h4 className="title">Questions</h4>
                  <div className="questions-container">
                    {/* Question list on the left */}

                    {viewingResults
                      ? arrayOfQuestions().map((num) => (
                          <div
                            className={
                              (getQuestionDataByIndex_Results(num) == "C"
                                ? "viewing-results-correct"
                                : "viewing-results-incorrect") +
                              " question viewing-results " +
                              (currentQuestion == num
                                ? "viewing-results-current"
                                : "")
                            }
                            onClick={() => {
                              setCurrentQuestion(num);
                            }}
                          >
                            {num + 1}
                          </div>
                        ))
                      : arrayOfQuestions().map((num) => (
                          <div
                            className={
                              (currentQuestion == num
                                ? "question-current"
                                : (!Array.isArray(
                                    getQuestionDataByIndex(num)?.answer
                                  ) &&
                                    getQuestionDataByIndex(num)?.answer !==
                                      null &&
                                    getQuestionDataByIndex(num)?.answer !==
                                      "") ||
                                  getQuestionDataByIndex(num)?.answer?.length >
                                    0
                                ? "question-answered"
                                : "") + " question"
                            }
                            onClick={() => {
                              setCurrentQuestion(num);
                            }}
                          >
                            {num + 1}
                          </div>
                        ))}

                    {/* matching */}

                    {viewingResults &&
                    quizQueue[3] != undefined &&
                    quizQueue[3].length > 0 ? (
                      <div
                        className={
                          "viewing-results " +
                          (checkIfAllMatchingIsCorrect() == true
                            ? "viewing-results-correct"
                            : "viewing-results-incorrect") +
                          " question matching-question " +
                          (currentQuestion == arrayOfQuestions().length
                            ? "viewing-results-current"
                            : "")
                        }
                        onClick={() => {
                          setCurrentQuestion(arrayOfQuestions().length);
                        }}
                      >
                        {arrayOfQuestions().length + 1 + "-" + getProgress()[1]}
                      </div>
                    ) : (
                      quizQueue[3] != undefined &&
                      quizQueue[3].length > 0 && (
                        <div
                          className={
                            (currentQuestion == arrayOfQuestions().length
                              ? "question-current"
                              : "") +
                            (getProgress()[1] - arrayOfQuestions().length ===
                            Object.keys(quizQueue[3][0].answer).length
                              ? " question-answered"
                              : "") +
                            " question matching-question"
                          }
                          onClick={() => {
                            setCurrentQuestion(arrayOfQuestions().length);
                          }}
                        >
                          {arrayOfQuestions().length +
                            1 +
                            "-" +
                            getProgress()[1]}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={quizView ? "mobile-quiz" : "mobile-quiz hide-it"}>
              <div onClick={inactiveQuiz} className="exe">
                x
              </div>
              <div className="quiz-exam-top-left">
                <h3 className="title">
                  <svg
                    style={{ marginRight: "10px" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.732"
                    height="13.1"
                    viewBox="0 0 19.732 13.1"
                    onClick={() => {
                      window.location.href = "../../";
                    }}
                  >
                    <path
                      id="keyboard_backspace_FILL0_wght400_GRAD0_opsz48"
                      d="M12.55,25.1,6,18.55,12.55,12l1.178,1.178L9.179,17.728H25.732v1.644H9.179l4.549,4.549Z"
                      transform="translate(-6 -12)"
                      fill="#2b2b2b"
                    />
                  </svg>
                  {setData?.title + " - Practice Quiz"}
                </h3>
                {viewingResults ? (
                  <h5 className="sub-title">{"Finished Exam"}</h5>
                ) : (
                  <h5 className="sub-title">{getPart()}</h5>
                )}
                {viewingResults ? (
                  <h5 className="sub-title viewing-results-label">
                    {"Viewing Results"}
                  </h5>
                ) : (
                  <h5 className="sub-title">
                    {"Last saved: " + timeSince(lastAutosaveTime)}
                  </h5>
                )}
              </div>
              {viewingResults ? (
                <div className="quiz-finished-top-center">
                  <div className="progress-cont">
                    <h3 className="score-title">Your score</h3>
                    <ProgressBar
                      borderRadius={50}
                      completed={
                        resultsInfo?.grade[1] == undefined
                          ? 0
                          : resultsInfo?.grade[1]
                      }
                      isLabelVisible={false}
                      bgColor={getGradeColor()}
                      height="15px"
                    />
                    <p
                      className="progress-percent"
                      style={{ color: getGradeColor() }}
                    >
                      {resultsInfo?.grade[1] + "% correct"}
                    </p>
                  </div>
                  <h3 className="grade" style={{ color: getGradeColor() }}>
                    {resultsInfo?.grade[2]}
                  </h3>
                </div>
              ) : (
                <div className="quiz-exam-top-center">
                  <ProgressBar
                    completed={progress}
                    isLabelVisible={false}
                    bgColor="#8358E8"
                    height="15px"
                  />
                  <p className="progress-percent">{progress + "%"}</p>
                </div>
              )}
              <div className="quiz-exam-center mbl-view">
                {!isOnMainViewingResultsPage && (
                  <div className="quiz-exam-center-left">
                    <h4 className="title">Questions</h4>
                    <div className="questions-container">
                      {/* Question list on the left */}

                      {viewingResults
                        ? arrayOfQuestions().map((num) => (
                            <div
                              className={
                                (getQuestionDataByIndex_Results(num) == "C"
                                  ? "viewing-results-correct"
                                  : "viewing-results-incorrect") +
                                " question viewing-results " +
                                (currentQuestion == num
                                  ? "viewing-results-current"
                                  : "")
                              }
                              onClick={() => {
                                setCurrentQuestion(num);
                              }}
                            >
                              {num + 1}
                            </div>
                          ))
                        : arrayOfQuestions().map((num) => (
                            <div
                              className={
                                (currentQuestion == num
                                  ? "question-current"
                                  : (!Array.isArray(
                                      getQuestionDataByIndex(num)?.answer
                                    ) &&
                                      getQuestionDataByIndex(num)?.answer !==
                                        null &&
                                      getQuestionDataByIndex(num)?.answer !==
                                        "") ||
                                    getQuestionDataByIndex(num)?.answer
                                      ?.length > 0
                                  ? "question-answered"
                                  : "") + " question"
                              }
                              onClick={() => {
                                setCurrentQuestion(num);
                              }}
                            >
                              {num + 1}
                            </div>
                          ))}

                      {/* matching */}

                      {viewingResults &&
                      quizQueue[3] != undefined &&
                      quizQueue[3].length > 0 ? (
                        <div
                          className={
                            "viewing-results " +
                            (checkIfAllMatchingIsCorrect() == true
                              ? "viewing-results-correct"
                              : "viewing-results-incorrect") +
                            " question matching-question " +
                            (currentQuestion == arrayOfQuestions().length
                              ? "viewing-results-current"
                              : "")
                          }
                          onClick={() => {
                            setCurrentQuestion(arrayOfQuestions().length);
                          }}
                        >
                          {arrayOfQuestions().length +
                            1 +
                            "-" +
                            getProgress()[1]}
                        </div>
                      ) : (
                        quizQueue[3] != undefined &&
                        quizQueue[3].length > 0 && (
                          <div
                            className={
                              (currentQuestion == arrayOfQuestions().length
                                ? "question-current"
                                : "") +
                              (getProgress()[1] - arrayOfQuestions().length ===
                              Object.keys(quizQueue[3][0].answer).length
                                ? " question-answered"
                                : "") +
                              " question matching-question"
                            }
                            onClick={() => {
                              setCurrentQuestion(arrayOfQuestions().length);
                            }}
                          >
                            {arrayOfQuestions().length +
                              1 +
                              "-" +
                              getProgress()[1]}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="quiz-exam-top-right">
              {!viewingResults ? (
                <>
                  <div className="stop-watch-cont">
                    <CiStopwatch className="stop-watch-icon" />
                  </div>
                  <h3 className="time-left">{getTimerString()}</h3>
                </>
              ) : isViewingDetails ? (
                <button
                  className="another-quiz-btn"
                  onClick={() => {
                    setIsOnMainViewingResultsPage(true);
                    setIsViewingDetails(false);
                  }}
                >
                  <div className="arrow-icon-cont">
                    <BsArrowLeftShort className="arrow-icon" />
                  </div>{" "}
                  Summary
                </button>
              ) : (
                <button
                  className="another-quiz-btn"
                  onClick={() => {
                    retake_quiz(setid, () => {
                      window.location.href = "../../quiz/";
                    });
                  }}
                >
                  <div className="arrow-icon-cont">
                    <BsArrowLeftShort className="arrow-icon" />
                  </div>{" "}
                  Create New Quiz
                </button>
              )}
            </div>
          </div>
          <div className="quiz-exam-center">
            <div className="desk-view">
              {!isOnMainViewingResultsPage && (
                <div className="quiz-exam-center-left">
                  <h4 className="title">Questions</h4>
                  <div className="questions-container">
                    {/* Question list on the left */}

                    {viewingResults
                      ? arrayOfQuestions().map((num) => (
                          <div
                            className={
                              (getQuestionDataByIndex_Results(num) == "C"
                                ? "viewing-results-correct"
                                : "viewing-results-incorrect") +
                              " question viewing-results " +
                              (currentQuestion == num
                                ? "viewing-results-current"
                                : "")
                            }
                            onClick={() => {
                              setCurrentQuestion(num);
                            }}
                          >
                            {num + 1}
                          </div>
                        ))
                      : arrayOfQuestions().map((num) => (
                          <div
                            className={
                              (currentQuestion == num
                                ? "question-current"
                                : (!Array.isArray(
                                    getQuestionDataByIndex(num)?.answer
                                  ) &&
                                    getQuestionDataByIndex(num)?.answer !==
                                      null &&
                                    getQuestionDataByIndex(num)?.answer !==
                                      "") ||
                                  getQuestionDataByIndex(num)?.answer?.length >
                                    0
                                ? "question-answered"
                                : "") + " question"
                            }
                            onClick={() => {
                              setCurrentQuestion(num);
                            }}
                          >
                            {num + 1}
                          </div>
                        ))}

                    {/* matching */}

                    {viewingResults &&
                    quizQueue[3] != undefined &&
                    quizQueue[3].length > 0 ? (
                      <div
                        className={
                          "viewing-results " +
                          (checkIfAllMatchingIsCorrect() == true
                            ? "viewing-results-correct"
                            : "viewing-results-incorrect") +
                          " question matching-question " +
                          (currentQuestion == arrayOfQuestions().length
                            ? "viewing-results-current"
                            : "")
                        }
                        onClick={() => {
                          setCurrentQuestion(arrayOfQuestions().length);
                        }}
                      >
                        {arrayOfQuestions().length + 1 + "-" + getProgress()[1]}
                      </div>
                    ) : (
                      quizQueue[3] != undefined &&
                      quizQueue[3].length > 0 && (
                        <div
                          className={
                            (currentQuestion == arrayOfQuestions().length
                              ? "question-current"
                              : "") +
                            (getProgress()[1] - arrayOfQuestions().length ===
                            Object.keys(quizQueue[3][0].answer).length
                              ? " question-answered"
                              : "") +
                            " question matching-question"
                          }
                          onClick={() => {
                            setCurrentQuestion(arrayOfQuestions().length);
                          }}
                        >
                          {arrayOfQuestions().length +
                            1 +
                            "-" +
                            getProgress()[1]}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {setData?.terms[getCurrentQuestionData()?.term] != undefined &&
              !isOnMainViewingResultsPage && (
                <div className="quiz-exam-center-right">
                  <div className="quiz-exam-center-right-top">
                    {getCurrentQuestionData()?.type == "matching" ? (
                      <>
                        <h3 className="sub-title">
                          {"Question " +
                            (currentQuestion + 1) +
                            " - " +
                            getProgress()[1] +
                            " of " +
                            getProgress()[1]}
                          {viewingResults && getNIncorrectMatching() > 0 && (
                            <span
                              className="lost-pts"
                              style={{
                                marginLeft: "5px",
                                color: "#D83C3C",
                                fontSize: "18px",
                              }}
                            >
                              {"-" + getNIncorrectMatching() + " points"}
                            </span>
                          )}
                        </h3>
                      </>
                    ) : (
                      <h3 className="sub-title">
                        {"Question " +
                          (currentQuestion + 1) +
                          " of " +
                          getProgress()[1]}
                      </h3>
                    )}

                    {getCurrentQuestionData()?.type != "matching" && ( // The question at the top of the screen. Matching does not include this question.
                      <div className="top-question-container">
                        <div className="title-container">
                          {setData?.terms[getCurrentQuestionData()?.term] !=
                            undefined &&
                          setData?.terms[getCurrentQuestionData()?.term][4] !=
                            null &&
                          (getCurrentQuestionData().type == "mc" ||
                            getCurrentQuestionData().type == "short-answer" ||
                            getCurrentQuestionData().type == "t/f") ? (
                            getCurrentQuestionData()?.type == "t/f" ? (
                              <>
                                <StaticMathField>
                                  {setData?.terms[
                                    getCurrentQuestionData()?.term
                                  ][0] +
                                    " = " +
                                    setData?.terms[
                                      getCurrentQuestionData()?.response
                                    ][1]}
                                </StaticMathField>
                                {viewingResults &&
                                  getQuestionDataByIndex_Results(
                                    currentQuestion
                                  ) == "I" && (
                                    <span className="lost-pts">
                                      {"-1 point"}
                                    </span>
                                  )}
                              </>
                            ) : (
                              <>
                                <StaticMathField>
                                  {
                                    setData?.terms[
                                      getCurrentQuestionData()?.term
                                    ][0]
                                  }
                                </StaticMathField>
                                {viewingResults &&
                                  getQuestionDataByIndex_Results(
                                    currentQuestion
                                  ) == "I" && (
                                    <span className="lost-pts">
                                      {"-1 point"}
                                    </span>
                                  )}
                              </>
                            )
                          ) : (
                            <h3 className="title">
                              {" "}
                              {/* Question */}
                              {getCurrentQuestionData()?.type == "mc" &&
                                setData?.terms[
                                  getCurrentQuestionData()?.term
                                ][0]}
                              {getCurrentQuestionData()?.type ==
                                "short-answer" &&
                                setData?.terms[
                                  getCurrentQuestionData()?.term
                                ][0]}
                              {getCurrentQuestionData()?.type == "t/f" &&
                                setData?.terms[
                                  getCurrentQuestionData()?.response
                                ] != undefined &&
                                setData?.terms[
                                  getCurrentQuestionData()?.term
                                ][0] +
                                  " - " +
                                  setData?.terms[
                                    getCurrentQuestionData()?.response
                                  ][1]}
                              {viewingResults &&
                                getQuestionDataByIndex_Results(
                                  currentQuestion
                                ) == "I" && (
                                  <span className="lost-pts">{"-1 point"}</span>
                                )}
                            </h3>
                          )}
                        </div>
                        <div className="title-images-container">
                          {
                            /* Images */

                            setData?.terms[getCurrentQuestionData()?.term][2] !=
                              undefined &&
                              optionsResponse["images"] == "1" && (
                                <img
                                  src={
                                    setData?.terms[
                                      getCurrentQuestionData()?.term
                                    ][2]
                                  }
                                ></img>
                              )
                          }
                          {
                            // T/F Images
                            getCurrentQuestionData()?.type == "t/f" && (
                              <>
                                {setData?.terms[
                                  getCurrentQuestionData()?.term
                                ][2] != undefined &&
                                  optionsResponse["images"] == "1" && (
                                    <>
                                      <h1>-</h1>
                                      <img
                                        src={
                                          setData?.terms[
                                            getCurrentQuestionData()?.response
                                          ][2]
                                        }
                                      ></img>
                                    </>
                                  )}
                              </>
                            )
                          }
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="quiz-exam-center-right-bottom">
                    {" "}
                    {/* Answer Choices */}
                    {getCurrentQuestionData()?.type == "mc" && (
                      <div>
                        {getCurrentQuestionData()?.options.map((v, c) => (
                          <>
                            {viewingResults &&
                            getQuestionDataByIndex_Results(currentQuestion) ==
                              "C" ? ( // Viewing results for multiple choice
                              <>
                                <div
                                  className={
                                    "answer-cont " +
                                    (getCurrentQuestionData()?.correct_choice ==
                                    v
                                      ? "viewing-results-correct"
                                      : "viewing-results-greyed")
                                  }
                                  onClick={() => {}}
                                >
                                  <div className="horizontal-div">
                                    <div className="answer-number">
                                      {alphabet[c]}
                                    </div>
                                    {setData?.terms[v] != undefined &&
                                    setData?.terms[v][5] != null ? (
                                      <StaticMathField>
                                        {setData?.terms[v][1]}
                                      </StaticMathField>
                                    ) : (
                                      <h4 className="answer">
                                        {setData?.terms[v][1]}
                                      </h4>
                                    )}
                                  </div>
                                  {setData?.terms[v][3] != null &&
                                    optionsResponse["images"] == "1" && (
                                      <img src={setData?.terms[v][3]}></img>
                                    )}
                                </div>
                              </>
                            ) : viewingResults &&
                              getQuestionDataByIndex_Results(currentQuestion) ==
                                "I" ? (
                              <>
                                <div
                                  className={
                                    "answer-cont " +
                                    (getCurrentQuestionData()?.correct_choice ==
                                    v
                                      ? "viewing-results-correct"
                                      : getCurrentQuestionData()?.answer == v
                                      ? "viewing-results-incorrect"
                                      : "viewing-results-greyed")
                                  }
                                  onClick={() => {}}
                                >
                                  <div className="horizontal-div">
                                    <div className="answer-number">
                                      {alphabet[c]}
                                    </div>
                                    {setData?.terms[v] != undefined &&
                                    setData?.terms[v][5] != null ? (
                                      <StaticMathField>
                                        {setData?.terms[v][1]}
                                      </StaticMathField>
                                    ) : (
                                      <h4 className="answer">
                                        {setData?.terms[v][1]}
                                      </h4>
                                    )}
                                  </div>
                                  {setData?.terms[v][3] != null &&
                                    optionsResponse["images"] == "1" && (
                                      <img src={setData?.terms[v][3]}></img>
                                    )}
                                </div>
                              </>
                            ) : (
                              // Normal testing
                              <>
                                <div
                                  className={
                                    "answer-cont " +
                                    (getCurrentQuestionData()?.answer == v
                                      ? "answer-cont-selected"
                                      : "")
                                  }
                                  onClick={() => {
                                    overrideCurrentQuestionAnswer(v);
                                  }}
                                >
                                  <div className="horizontal-div">
                                    <div className="answer-number">
                                      {alphabet[c]}
                                    </div>
                                    {setData?.terms[v] != undefined &&
                                    setData?.terms[v][5] != null ? (
                                      <StaticMathField>
                                        {setData?.terms[v][1]}
                                      </StaticMathField>
                                    ) : (
                                      <h4 className="answer">
                                        {setData?.terms[v][1]}
                                      </h4>
                                    )}
                                  </div>
                                  {setData?.terms[v][3] != null &&
                                    optionsResponse["images"] == "1" && (
                                      <img src={setData?.terms[v][3]}></img>
                                    )}
                                </div>
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    )}
                    {viewingResults &&
                    getCurrentQuestionData()?.type == "t/f" ? (
                      <div>
                        {/* Correct */}
                        {getQuestionDataByIndex_Results(currentQuestion) ==
                          "C" &&
                          getCurrentQuestionData()?.correct_choice == "T" && (
                            <>
                              <div
                                className={
                                  "answer-cont viewing-results-correct"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"T"}</div>
                                  <h4 className="answer">{"True"}</h4>
                                </div>
                              </div>
                              <div
                                className={"answer-cont viewing-results-greyed"}
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"F"}</div>
                                  <h4 className="answer">{"False"}</h4>
                                </div>
                              </div>
                            </>
                          )}

                        {getQuestionDataByIndex_Results(currentQuestion) ==
                          "C" &&
                          getCurrentQuestionData()?.correct_choice == "F" && (
                            <>
                              <div
                                className={"answer-cont viewing-results-greyed"}
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"T"}</div>
                                  <h4 className="answer">{"True"}</h4>
                                </div>
                              </div>
                              <div
                                className={
                                  "answer-cont viewing-results-correct"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"F"}</div>
                                  <h4 className="answer">{"False"}</h4>
                                </div>
                              </div>
                            </>
                          )}

                        {/* Incorrect */}

                        {getQuestionDataByIndex_Results(currentQuestion) ==
                          "I" &&
                          getCurrentQuestionData()?.correct_choice == "T" && (
                            <>
                              <div
                                className={
                                  "answer-cont viewing-results-correct"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"T"}</div>
                                  <h4 className="answer">{"True"}</h4>
                                </div>
                              </div>
                              <div
                                className={
                                  "answer-cont viewing-results-incorrect"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"F"}</div>
                                  <h4 className="answer">{"False"}</h4>
                                </div>
                              </div>
                            </>
                          )}

                        {getQuestionDataByIndex_Results(currentQuestion) ==
                          "I" &&
                          getCurrentQuestionData()?.correct_choice == "F" && (
                            <>
                              <div
                                className={
                                  "answer-cont viewing-results-incorrect"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"T"}</div>
                                  <h4 className="answer">{"True"}</h4>
                                </div>
                              </div>
                              <div
                                className={
                                  "answer-cont viewing-results-correct"
                                }
                              >
                                <div className="horizontal-div">
                                  <div className="answer-number">{"F"}</div>
                                  <h4 className="answer">{"False"}</h4>
                                </div>
                              </div>
                            </>
                          )}
                      </div>
                    ) : (
                      getCurrentQuestionData()?.type == "t/f" && (
                        <div>
                          <div
                            className={
                              "answer-cont " +
                              (getCurrentQuestionData()?.answer == "T"
                                ? "answer-cont-selected"
                                : "")
                            }
                            onClick={() => {
                              overrideCurrentQuestionAnswer("T");
                            }}
                          >
                            <div className="horizontal-div">
                              <div className="answer-number">{"T"}</div>
                              <h4 className="answer">{"True"}</h4>
                            </div>
                          </div>
                          <div
                            className={
                              "answer-cont " +
                              (getCurrentQuestionData()?.answer == "F"
                                ? "answer-cont-selected"
                                : "")
                            }
                            onClick={() => {
                              overrideCurrentQuestionAnswer("F");
                            }}
                          >
                            <div className="horizontal-div">
                              <div className="answer-number">{"F"}</div>
                              <h4 className="answer">{"False"}</h4>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {getCurrentQuestionData().type == "short-answer" && (
                      <>
                        <div
                          className={
                            "textarea-wrapper textarea-wrapper-orig " +
                            (viewingResults &&
                            getQuestionDataByIndex_Results(currentQuestion) !=
                              "C"
                              ? "textarea-wrapper-incorrect"
                              : "")
                          }
                          style={
                            setData?.terms[getCurrentQuestionData()?.term][5] !=
                              null && viewingResults
                              ? { justifyContent: "flex-start" }
                              : {}
                          }
                        >
                          {setData?.terms[getCurrentQuestionData()?.term][5] !=
                            null && !viewingResults ? ( // editing your math equation to give an answer
                            <EditableMathField
                              config={{
                                sumStartsWithNEquals: true,
                                autoCommands:
                                  "bar overline sqrt sum prod int alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega rangle langle otimes neq leq ll geq gg approx dagger angle and or infty",
                              }}
                              latex={
                                getCurrentQuestionData().answer
                                  ? getCurrentQuestionData().answer
                                  : ""
                              }
                              onChange={(mathField) => {
                                overrideCurrentQuestionAnswer(
                                  mathField.latex()
                                );
                              }}
                            />
                          ) : setData?.terms[
                              getCurrentQuestionData()?.term
                            ][5] != null && viewingResults ? ( // viewing your math equation results
                            <StaticMathField>
                              {getCurrentQuestionData().answer
                                ? getCurrentQuestionData().answer
                                : ""}
                            </StaticMathField>
                          ) : (
                            // non math equation
                            <>
                              <textarea
                                disabled={viewingResults}
                                value={getCurrentQuestionData().answer}
                                style={
                                  viewingResults &&
                                  getCurrentQuestionData()?.answer !=
                                    getCurrentQuestionData()?.correct_choice
                                    ? {
                                        textDecoration: "line-through",
                                        color: "#D83C3C",
                                      }
                                    : viewingResults
                                    ? { color: "#58E892" }
                                    : {}
                                }
                                onChange={(e) => {
                                  if (e.target.value.length == 0) {
                                    overrideCurrentQuestionAnswer(null);
                                  }
                                  overrideCurrentQuestionAnswer(e.target.value);
                                }}
                                placeholder={
                                  setData?.terms[
                                    getCurrentQuestionData()?.term
                                  ][5] != null
                                    ? "Define the term.."
                                    : "Define '" +
                                      setData?.terms[
                                        getCurrentQuestionData()?.term
                                      ][0] +
                                      "'"
                                }
                              ></textarea>
                            </>
                          )}
                        </div>
                        {viewingResults &&
                          getCurrentQuestionData()?.answer !=
                            getCurrentQuestionData()?.correct_choice &&
                          setData?.terms[getCurrentQuestionData()?.term][5] ==
                            null && (
                            <div className="textarea-wrapper">
                              <textarea
                                disabled={true}
                                value={getCurrentQuestionData()?.correct_choice}
                                style={{ color: "#58E892" }}
                              ></textarea>
                            </div>
                          )}
                        {viewingResults &&
                          getQuestionDataByIndex_Results(currentQuestion) !=
                            "C" &&
                          setData?.terms[getCurrentQuestionData()?.term][5] !=
                            null && (
                            <div
                              className="textarea-wrapper textarea-wrapper-correct"
                              style={{ justifyContent: "flex-start" }}
                            >
                              <StaticMathField
                                config={{
                                  sumStartsWithNEquals: true,
                                  autoCommands:
                                    "bar overline sqrt sum prod int alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega rangle langle otimes neq leq ll geq gg approx dagger angle and or infty",
                                }}
                              >
                                {getCurrentQuestionData()?.correct_choice}
                              </StaticMathField>
                            </div>
                          )}
                      </>
                    )}
                    {getCurrentQuestionData().type == "matching" && (
                      <>
                        <div className="matching-answer-container">
                          <div className="matching-answer-container-left">
                            {" "}
                            {/* Left choices */}
                            {getCurrentQuestionData().options[0].map(
                              (
                                v,
                                c // v = index of term, c = count
                              ) => (
                                <div
                                  className={
                                    (viewingResults
                                      ? resultsInfo?.grade[3][3][0][v] == "C"
                                        ? "viewing-results viewing-results-correct"
                                        : "viewing-results viewing-results-incorrect"
                                      : "") + " option"
                                  }
                                  style={
                                    selectedMatchOption == v
                                      ? {
                                          backgroundColor: getColor(v),
                                          color: "white",
                                          transform: "scale(1.1)",
                                        }
                                      : getCurrentQuestionData().answer[v] !=
                                        undefined
                                      ? {
                                          backgroundColor: getColor(v),
                                          color: "white",
                                        }
                                      : {}
                                  }
                                  id={"matcha" + v}
                                  onClick={() => {
                                    if (!viewingResults) {
                                      setSelectedMatchOption(v);
                                      setMatchChoice1(v);
                                    }
                                  }}
                                >
                                  <div className="option-text">
                                    <div
                                      className="option-number"
                                      style={
                                        selectedMatchOption == v ||
                                        getCurrentQuestionData().answer[v] !=
                                          undefined
                                          ? { color: "white" }
                                          : {}
                                      }
                                    >
                                      {alphabet[c]}
                                    </div>
                                    <div className="answer-number"></div>
                                    {setData?.terms[v][5] != null ? (
                                      <StaticMathField>
                                        {setData?.terms[v][0]}
                                      </StaticMathField>
                                    ) : (
                                      <h4
                                        className="option-title"
                                        style={
                                          selectedMatchOption == v ||
                                          getCurrentQuestionData().answer[v] !=
                                            undefined
                                            ? { color: "white" }
                                            : {}
                                        }
                                      >
                                        {setData?.terms[v][0]}
                                      </h4>
                                    )}
                                  </div>

                                  {setData?.terms[v][2] != null &&
                                    optionsResponse["images"] == "1" && (
                                      <div className="option-image">
                                        <img src={setData?.terms[v][2]}></img>
                                      </div>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                          <div className="matching-answer-container-right">
                            {getCurrentQuestionData().options[1].map((v, c) => (
                              <div
                                className={
                                  (viewingResults
                                    ? resultsInfo?.grade[3][3][0][v] == "C"
                                      ? "viewing-results viewing-results-correct"
                                      : "viewing-results viewing-results-incorrect"
                                    : "") + " option"
                                }
                                style={
                                  getOriginalMatcher(v) != undefined
                                    ? {
                                        backgroundColor: getColor(
                                          getOriginalMatcher(v)
                                        ),
                                        color: "white",
                                      }
                                    : {}
                                }
                                id={"matchb" + v}
                                onClick={() => {
                                  if (!viewingResults) {
                                    var ans = {
                                      ...getCurrentQuestionData().answer,
                                    };
                                    ans[matchChoice1] = v;
                                    var valid = isValidMatchChoice(v, ans);
                                    var new_ans = { ...ans };
                                    if (!valid) {
                                      // responsible for undoing match collisions
                                      Object.keys(ans).forEach(function (c) {
                                        var val = ans[c];
                                        if (c != matchChoice1 && v == val) {
                                          new_ans[c] = null;
                                        }
                                      });
                                    }

                                    overrideCurrentQuestionAnswer(new_ans);
                                    updateMatchDataForCurrentQuestion();
                                  }
                                }}
                              >
                                <div
                                  style={
                                    !viewingResults &&
                                    getOriginalMatcher(v) != undefined
                                      ? {
                                          backgroundColor: getColor(
                                            getOriginalMatcher(v)
                                          ),
                                          color: "white",
                                        }
                                      : {}
                                  }
                                  className="option-number"
                                >
                                  {alphabet[c]}
                                </div>
                                <>
                                  {setData?.terms[v][5] != null ? (
                                    <StaticMathField>
                                      {setData?.terms[v][1]}
                                    </StaticMathField>
                                  ) : (
                                    <h4
                                      style={
                                        !viewingResults &&
                                        getOriginalMatcher(v) != undefined
                                          ? {
                                              backgroundColor: getColor(
                                                getOriginalMatcher(v)
                                              ),
                                              color: "white",
                                            }
                                          : {}
                                      }
                                      className="option-title"
                                    >
                                      {setData?.terms[v][1]}
                                    </h4>
                                  )}
                                </>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="btn-container">
                      {currentQuestion - 1 > -1 && (
                        <button
                          className="prev-btn"
                          onClick={() => {
                            if (currentQuestion - 1 < getProgress()[1]) {
                              setCurrentQuestion(currentQuestion - 1);
                            }
                          }}
                        >
                          <div className="arrow-icon-cont">
                            <BsArrowLeftShort className="arrow-icon" />
                          </div>{" "}
                          Previous
                        </button>
                      )}
                      {!viewingResults && getProgress()[0] == 100 ? (
                        <button
                          className="next-btn submit-btn"
                          onClick={() => {
                            setSubmitQuizPopup(true);
                          }}
                        >
                          Submit
                          <div className="arrow-icon-cont">
                            <BsCheck className="arrow-icon" />
                          </div>
                        </button>
                      ) : viewingResults &&
                        (quizQueue[3].length != 0
                          ? currentQuestion + 1 == arrayOfQuestions().length + 1
                          : currentQuestion + 1 ==
                            arrayOfQuestions().length) ? (
                        <button
                          className="next-btn"
                          onClick={() => {
                            setIsOnMainViewingResultsPage(true);
                          }}
                        >
                          Results
                          <BsInfoCircle className="info-icon" />
                        </button>
                      ) : (
                        <button
                          className="next-btn"
                          onClick={() => {
                            if (currentQuestion + 1 < getProgress()[1]) {
                              setCurrentQuestion(currentQuestion + 1);
                            }
                          }}
                        >
                          Next
                          <div className="arrow-icon-cont">
                            <BsArrowRightShort className="arrow-icon" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            {isOnMainViewingResultsPage && !isViewingDetails ? (
              <>
                <div className="quiz-finished-center-center">
                  {/* Your score page */}
                  <h2>Your score</h2>
                  <div className="chart-container">
                    <DoughnutChart config={doughnutChartConfig} />
                  </div>
                  <h2 className="">
                    You got {resultsInfo?.grade[0]} out of{" "}
                    {resultsInfo?.grade[4]} questions correct.
                  </h2>
                  {resultsInfo?.grade[1] === 100 && (
                    <p>You got a perfect score on this quiz! Wonderful job!</p>
                  )}
                  {resultsInfo?.grade[1] > 80 &&
                    resultsInfo?.grade[1] < 100 && (
                      <p>
                        Amazing! You almost got all of the questions correct!
                      </p>
                    )}
                  {resultsInfo?.grade[1] > 60 && resultsInfo?.grade[1] < 80 && (
                    <p>
                      Nice work! A bit more practice, and you'll get that A!
                    </p>
                  )}
                  {resultsInfo?.grade[1] < 60 && (
                    <p>
                      Continue reviewing your Flashcards to improve your score!
                    </p>
                  )}

                  <div className="btn-container">
                    <button
                      className="review-btn"
                      onClick={() => {
                        setCurrentQuestion(0);
                        setIsOnMainViewingResultsPage(false);
                      }}
                    >
                      Review
                      <div className="exclamation-icon-cont">
                        <BsInfoCircle className="exclamation-icon" />
                      </div>
                    </button>
                    <button
                      className="details-btn"
                      onClick={() => {
                        setIsViewingDetails(true);
                        get_quiz_details(setid, (data) => {
                          setQuizDetails(data.data);
                        });
                      }}
                    >
                      Details
                      <div className="arrow-icon-cont">
                        <BsArrowRightShort className="arrow-icon" />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="other-quizzes">
                  <p>Other Quizzes</p>
                  <div className="other-quizzes-main">
                    {resultsInfo?.past_quizzes.map((data, index) => (
                      <div
                        className="other-quiz-container"
                        onClick={() => {
                          window.location.href = "../" + data[0] + "/results";
                          //window.location.reload();
                        }}
                      >
                        <p>{"Quiz #" + (index + 1)}</p>
                        <div className="doughnut-cont">
                          <DoughnutChart
                            config={{
                              labels: [
                                data[1] + "% correct",
                                100 - data[1] + "% incorrect",
                              ],
                              ignoreTraditionalLabelCallback: true,
                              ignoreLegend: true,
                              //label: resultsInfo?.grade[1] + "%",
                              data: [data[1], 100 - data[1]],
                              bgColor: [getGradeColor(data[1]), "#363636"],
                              textColor: "#71EAA2",
                              textInside: data[2],
                              rotate: 0,
                              divider: 2.6,
                            }}
                          ></DoughnutChart>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              isViewingDetails &&
              quizDetails != undefined && (
                <>
                  <div className="quiz-details">
                    <h1>Your quiz progress</h1>
                    <div className="progress-circles">
                      {quizDetails[0].map((data, c) => (
                        <div className="circle-container">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              className={"circle"}
                              id={"circle-" + c}
                              style={{
                                backgroundColor:
                                  c == quizDetails[0].length - 1
                                    ? "white"
                                    : getGradeColor(data[0]),
                                border:
                                  c == quizDetails[0].length - 1 &&
                                  "4px solid " + getGradeColor(data[0]),
                              }}
                              onClick={() => {
                                window.location.href =
                                  "../" + data[3] + "/results";
                              }}
                            >
                              <p
                                style={{
                                  color:
                                    c == quizDetails[0].length - 1 &&
                                    getGradeColor(data[0]),
                                }}
                              >
                                {data[1]}
                              </p>
                            </div>
                            {c != quizDetails[0].length - 1 && (
                              <Xarrow
                                start={"circle-" + c} //can be react ref
                                end={"circle-" + (c + 1)} //or an id
                                showHead={false}
                                color={getGradeColor(data[0])}
                              />
                            )}

                            <p
                              style={{
                                color: getGradeColor(data[0]),
                              }}
                            >
                              {"Attempt #" + (c + 1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="recall-chart">
                      <SteppedLineChart
                        className="graph-chrt"
                        config={quizProgress}
                      />
                    </div>
                    <h1>Your quiz time progress</h1>
                    <div className="recall-chart">
                      <SteppedLineChart config={timeProgress} />
                    </div>
                    <div className="most-missed">
                      <h1>Most Missed Terms</h1>
                      <div className="chart">
                        <div
                          className="labels"
                          style={{
                            marginTop:
                              Object.keys(quizDetails[2]).length * 5 + "px",
                          }}
                        >
                          {Object.keys(quizDetails[2]).map((key) => (
                            <div className="label">
                              {setData.terms[key][4] == null ? (
                                <h5>{setData.terms[key][0]}</h5>
                              ) : (
                                <StaticMathField>
                                  {setData.terms[key][0]}
                                </StaticMathField>
                              )}
                            </div>
                          ))}
                        </div>
                        <div
                          className="chart_canvas"
                          style={{
                            height:
                              mostMissedTerms.data.datasets.length * 50 + "px",
                          }}
                        >
                          <HorizontalBarChart
                            config={mostMissedTerms}
                          ></HorizontalBarChart>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizExam;
