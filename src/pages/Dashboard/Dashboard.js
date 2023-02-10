import React from "react";
import "./Dashboard.scss";
import "./dashboard.css";
import Navbar from "../../components/Navbar/Navbar";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useState, useEffect } from "react";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import LineChart from "../../components/LineChart/LineChart";
import { VerticalBarChart } from "../../components/VerticalBarChart/VerticalBarChart";
import ReactTooltip from "react-tooltip";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import * as configs from "../../DATA/chart_configs/dashboard.js";
import { PinDropSharp } from "@mui/icons-material";
import { get_user } from "../../network/communication";
import { Helmet } from "react-helmet-async";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import PlaceholderRectangle from "../../components/PlaceholderRectangle/PlaceholderRectangle";
import AddTask from "../../components/AddTask/AddTask";
import Popup from "../../components/Popup/Popup";

function Dashboard(props) {
  let dates = document.getElementsByClassName("dates");

  for (let i = 0; i < dates.length; i++) {
    const element = dates[i];
    console.log("dates", dates[29].innerHTML);
    dates[31].classList.add("no-hover");
    dates[32].classList.add("no-hover");
    dates[33].classList.add("no-hover");
    dates[34].classList.add("no-hover");
    // dates[35].remove();
  }
  // console.log("dates", dates, element);

  var needsRedirect = false;
  var user = props.user;
  var setUser = props.setUser;
  const navigate = useNavigate();

  //const [user, setUser] = useState({name: "", success: true, streak: 0, today: {pending: 0, completed: 0, std: {}, study_time: 0, streak_saved: 0}, streak_calendar: {this_month: []}, email_verified: true});
  useEffect(() => {
    var successful = true;
    get_user(function (user) {
      if (user && user.success === true) {
        setUser(user);
        if (!user.email_verified) {
          successful = false;
          navigate("/verify-email");
        } else if (user.name == "") {
          successful = false;
          navigate("/login");
        }
      } else {
        successful = false;
        navigate("/login");
      }
    });

    if (successful == true) {
      document.title = "Dashboard - Quizzy";
    }
  }, []);

  console.log(user);

  const loggedIn = !needsRedirect; //user.success
  const streak = user.streak;

  const pending = user.today.pending;
  const completed = user.today.completed;
  const currentStreak = user.today.streak_saved;
  const todayStudyTimeDistribution = user.today.std;

  const friends = user.friends;
  const n_friends_online = user.n_friends_online;

  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [displayDates, setDisplayDates] = useState([]);
  const [previousDates, setPreviousDates] = useState([]);
  const [newRowIndex] = useState([6, 13, 20, 27, 34]);
  const [todayIndex, setTodayIndex] = useState();
  const [genericQuizzyPlusPopupEnabled, setGenericQuizzyPlusPopupEnabled] =
    useState(false);

  var alert =
    "Welcome, new users. Quizzy is still in development and there is still much left to develop before it can be officially released.";
  /*fetch("https://quizzynow.com/php/system_message.php", {
      method: 'GET',
    }).then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
               response.status);
           return;
      }
      response.json().then(function(data) {
          alert = response.msg;
      })
    })*/

  let months = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  const month = new Date().toLocaleString("en-US", {
    month: "long",
  });
  const year = new Date().getFullYear();
  const day = new Date(`${month} 1, ${year}`).getDay();
  const today = new Date().getDate();
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
    rotate: 70,
    divider: 3,
  };

  var studyPercent = {
    labels: ["Today's studying  ", "Remaining time  "],
    data: [],
    bgColor: ["#8358E8", "#363636"],
    textInside: "0%",
    rotate: 70,
    divider: 3,
  };

  var weekly_recalls = user.weekly_recalls;

  var weeklyRecallSessions = {
    labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
    data:
      user.weekly_recalls != undefined
        ? [
            weekly_recalls[0],
            weekly_recalls[1],
            weekly_recalls[2],
            weekly_recalls[3],
            weekly_recalls[4],
            weekly_recalls[5],
            weekly_recalls[6],
          ]
        : [0, 0, 0, 0, 0, 0, 0],
    gradientStart: "#4C72E6",
    gradientEnd: "#8358E8",
    max: 300,
    maxTicks: 8,
    barThickness: 0.9,
  };

  var timeSpentOnLearning = {
    labels: [],
    datasets: [],
  };

  var time_spent_on_learning = user.today.time_spent_on_learning;
  var increment = 0;

  for (var setName in time_spent_on_learning) {
    var data = [];
    var index = 0;
    for (var timeStamp in time_spent_on_learning[setName]) {
      timeSpentOnLearning.labels.push(timeStamp);
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
      data[i] = time_spent_on_learning[setName][timeStamp];
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

  const dayInSeconds = 24 * 60 * 60;

  studyPercent.data[0] = user.today.study_time;
  studyPercent.data[1] = dayInSeconds - studyPercent.data[0];

  const percent = studyPercent.data[0] / dayInSeconds;
  const textInsideString =
    percent < 1 ? percent.toFixed(5) : percent.toFixed(2);

  studyPercent.textInside = textInsideString + "%";

  for (var key in todayStudyTimeDistribution) {
    if (todayStudyTimeDistribution.hasOwnProperty(key)) {
      studyTimeDistrib.labels.push(key);
      studyTimeDistrib.data.push(todayStudyTimeDistribution[key]);
    }
  }

  if (studyTimeDistrib.data.length == 0) {
    studyTimeDistrib.labels.push("Empty");
    studyTimeDistrib.data.push(24 * 60 * 60);
    studyTimeDistrib.bgColor = ["#363636"];
  }

  var sum = 0;

  for (const [key, value] of Object.entries(user.today.std)) {
    sum += value;
  }

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

  studyTimeDistrib.textInside = sum > 0 ? secondsToHms(sum) : "0 hours";

  let tempDates = [];

  const calculateCalendar = () => {
    if ((0 === year % 4 && 0 !== year % 100) || 0 === year % 400) {
      months["February"] = 29;
    }

    const keys = Object.keys(months);
    const index = keys.indexOf(month);

    let previousMonth = "";
    if (month === "January") {
      previousMonth = "December";
    } else {
      previousMonth = keys[index - 1];
    }

    for (
      let i = months[previousMonth] - day + 1;
      i <= months[previousMonth];
      i++
    ) {
      tempDates.push(i);
      setPreviousDates((previousDates) => [...previousDates, i]);
    }

    const remaining = 35 - displayDates.length;
    let j = 1;
    while (j <= remaining && j <= months[month]) {
      // eslint-disable-next-line no-loop-func
      tempDates.push(j);
      j++;
    }

    setTodayIndex(tempDates.indexOf(today));

    if (tempDates.length % 7 != 0) {
      tempDates.push(" ");
      tempDates.push(" ");
      tempDates.push(" ");
      tempDates.push(" ");
      tempDates.push(" ");
      tempDates.push(" ");
      tempDates.push(" ");
    }

    setDisplayDates(tempDates);
  };

  useEffect(() => {
    calculateCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(user);
  return (
    <main className="dashboard-main">
      <Helmet>
        {user && user.membership == 0 && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7056673711339024"
            crossorigin="anonymous"
          ></script>
        )}
      </Helmet>
      <ReactTooltip id="default-font" fontFamily="Open Sans" />
      <Navbar user={user} active={0}></Navbar>
      <AddTask
        user={user}
        visible={addTaskVisible}
        setVisible={setAddTaskVisible}
      ></AddTask>
      <Popup
        enabled={genericQuizzyPlusPopupEnabled}
        setEnabled={setGenericQuizzyPlusPopupEnabled}
        variant="genericQuizzy+Popup"
        title="Upgrade to Quizzy+ for this feature!"
        subtitle={"This feature is only available to Quizzy+ users."}
      ></Popup>
      <section className="dashboard">
        <div className="content">
          <div className="show-navbars">
            <div
              className="navbars-left"
              onClick={() => {
                var navbar = document.getElementsByClassName("navbar")[0];
                navbar.style.display = "block";
                navbar.style.left = "0";
              }}
            >
              <img
                className="hotdog-nav"
                src="/images/general/threelines.svg"
                alt=""
              />
            </div>
            <div
              className="navbars-right"
              onClick={() => {
                var navbar = document.getElementsByClassName("userinfo")[0];
                navbar.style.display = "block";
                navbar.style.position = "absolute";
                navbar.style.width = "25%";
                navbar.style.right = "0";
              }}
            >
              <img className="userinfo-toggle" src={user.image} alt="" />
            </div>
          </div>
          {user.success && (
            <AlertMessage alert="Welcome, new users! Quizzy is functional, but is still being actively developed. Please send bugs to support@quizzynow.com. Thanks!"></AlertMessage>
          )}

          {!user.success ? (
            <div className="dash-profile-container">
              <PlaceholderRectangle
                className="user"
                width="150px"
                height="150px"
                radius="50%"
                color="#AAAAAA"
              ></PlaceholderRectangle>
              <PlaceholderRectangle
                className="hi"
                width="300px"
                height="50px"
                color="#AAAAAA"
              ></PlaceholderRectangle>
            </div>
          ) : (
            <div className="dash-profile-container">
              <img
                src={user.image} //"images/user/pfplarge.svg"
                alt="Profile large"
                //width={200}
                height={200}
                className="profile"
                style={{ width: "auto", maxWidth: "195px" }}
              />
              <h1>Hi, {user.username}</h1>
            </div>
          )}

          {!user.success ? (
            <PlaceholderRectangle
              className="infoBar"
              width="auto"
              height="50px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <section className="infoBar">
              <div className="infoBox">
                <div
                  data-effect="solid"
                  data-tip="Come back tomorrow to increase your streak!"
                  data-for="default-font"
                  className="infoImage"
                  style={{ backgroundColor: "#FFCEA8" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25.602"
                    height="40.96"
                    viewBox="0 0 25.602 40.96"
                  >
                    <g
                      id="flame-svgrepo-com"
                      transform="translate(-114.73 0.001)"
                    >
                      <path
                        id="Path_200"
                        data-name="Path 200"
                        d="M121.509,40.905a.442.442,0,0,0,.577-.629A10.127,10.127,0,0,1,121.5,30.24c3.345-7.478,5.381-11.351,5.381-11.351a26.925,26.925,0,0,0,4.018,8.539c2.825,3.868,4.371,8.733,1.878,12.785a.442.442,0,0,0,.576.626c3.085-1.578,6.546-4.744,6.936-11.044a21.555,21.555,0,0,0-1.152-8.021c-1.388-4.311-3.095-6.322-4.082-7.186a.442.442,0,0,0-.73.362c.288,4.651-1.462,5.831-2.458,3.171a16.277,16.277,0,0,1-.63-5.138,17.569,17.569,0,0,0-3.464-10.677A12.092,12.092,0,0,0,125.6.093a.442.442,0,0,0-.71.381c.183,2.526.017,9.764-6.333,18.411-5.758,8.021-3.527,14.182-2.735,15.85A13.058,13.058,0,0,0,121.509,40.905Z"
                        transform="translate(0 0)"
                        fill="#ff8626"
                      />
                    </g>
                  </svg>
                </div>
                <div className="infoContent">
                  <h3>Streak</h3>
                  <h2>{streak}</h2>
                </div>
              </div>
              <div className="infoBox">
                <div
                  data-effect="solid"
                  data-tip={"You have " + pending + " items pending today."}
                  data-for="default-font"
                  className="infoImage"
                  style={{ backgroundColor: "#D6D6D6" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34.875"
                    height="47"
                    viewBox="0 0 34.875 47"
                  >
                    <g
                      id="pending_actions_black_24dp"
                      transform="translate(4.5)"
                    >
                      <rect
                        id="Rectangle_165"
                        data-name="Rectangle 165"
                        width="29"
                        height="47"
                        transform="translate(-2)"
                        fill="none"
                      />
                      <path
                        id="Path_76"
                        data-name="Path 76"
                        d="M29.187,22.312A9.688,9.688,0,1,0,38.875,32,9.691,9.691,0,0,0,29.187,22.312Zm3.2,14.241-4.166-4.166v-6.2h1.938v5.406l3.584,3.584ZM31.125,4.875H24.964a5.789,5.789,0,0,0-10.927,0H7.875A3.886,3.886,0,0,0,4,8.75V37.813a3.886,3.886,0,0,0,3.875,3.875H19.713a13.065,13.065,0,0,1-2.751-3.875H7.875V8.75H11.75v5.813h15.5V8.75h3.875v9.842A13.621,13.621,0,0,1,35,19.755v-11A3.886,3.886,0,0,0,31.125,4.875ZM19.5,8.75a1.938,1.938,0,1,1,1.938-1.938A1.943,1.943,0,0,1,19.5,8.75Z"
                        transform="translate(-8.5 0.938)"
                        fill="#4b4b4b"
                      />
                    </g>
                  </svg>
                </div>
                <div className="infoContent">
                  <h3>Pending</h3>
                  <h2>{pending}</h2>
                </div>
              </div>
              <div className="infoBox">
                <div
                  data-effect="solid"
                  data-tip={"You have completed " + completed + " items today."}
                  data-for="default-font"
                  className="infoImage"
                  style={{ backgroundColor: "#A8FFAB" }}
                >
                  <svg
                    id="task_black_24dp"
                    xmlns="http://www.w3.org/2000/svg"
                    width="41.554"
                    height="41.554"
                    viewBox="0 0 41.554 41.554"
                  >
                    <g id="Group_13" data-name="Group 13">
                      <path
                        id="Path_77"
                        data-name="Path 77"
                        d="M0,0H41.554V41.554H0Z"
                        fill="none"
                      />
                    </g>
                    <g
                      id="Group_14"
                      data-name="Group 14"
                      transform="translate(6.926 3.463)"
                    >
                      <path
                        id="Path_78"
                        data-name="Path 78"
                        d="M21.314,2H7.463A3.458,3.458,0,0,0,4.017,5.463L4,33.166a3.458,3.458,0,0,0,3.446,3.463H28.24A3.473,3.473,0,0,0,31.7,33.166V12.389ZM28.24,33.166H7.463V5.463h12.12V14.12H28.24ZM12.345,21.132,9.887,23.574,16.016,29.7l9.8-9.8-2.441-2.441L16.033,24.8Z"
                        transform="translate(-4 -2)"
                        fill="#3dae45"
                      />
                    </g>
                  </svg>
                </div>
                <div className="infoContent">
                  <h3>Completed</h3>
                  <h2>{completed}</h2>
                </div>
              </div>
              <div className="infoBox">
                <div
                  data-effect="solid"
                  data-tip={
                    "You have " +
                    n_friends_online +
                    " friends online right now."
                  }
                  data-for="default-font"
                  className="infoImage"
                  style={{ backgroundColor: "#C8A8FF" }}
                >
                  <svg
                    id="people_black_24dp"
                    xmlns="http://www.w3.org/2000/svg"
                    width="43.433"
                    height="43.433"
                    viewBox="0 0 43.433 43.433"
                  >
                    <path
                      id="Path_85"
                      data-name="Path 85"
                      d="M0,0H43.433V43.433H0Z"
                      fill="none"
                    />
                    <path
                      id="Path_86"
                      data-name="Path 86"
                      d="M14.668,20.835C10.433,20.835,2,22.952,2,27.169v3.167H27.336V27.169C27.336,22.952,18.9,20.835,14.668,20.835ZM6.235,26.717a17.449,17.449,0,0,1,8.433-2.262A17.449,17.449,0,0,1,23.1,26.717Zm8.433-9.049a6.334,6.334,0,1,0-6.334-6.334A6.341,6.341,0,0,0,14.668,17.668Zm0-9.049a2.715,2.715,0,1,1-2.715,2.715A2.711,2.711,0,0,1,14.668,8.619Zm12.74,12.324a7.587,7.587,0,0,1,3.547,6.225v3.167h7.239V27.169C38.194,23.513,31.86,21.432,27.408,20.944Zm-1.882-3.276A6.334,6.334,0,1,0,25.526,5a6.235,6.235,0,0,0-2.715.633,9.883,9.883,0,0,1,0,11.4A6.235,6.235,0,0,0,25.526,17.668Z"
                      transform="translate(1.619 4.049)"
                      fill="#623dae"
                    />
                  </svg>
                </div>
                <div className="infoContent">
                  <h3>Friends Online</h3>
                  <h2>{n_friends_online}</h2>
                </div>
              </div>
            </section>
          )}
          {!user.success ? (
            <PlaceholderRectangle
              className="infoBar"
              width="auto"
              height="478px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <section className="calendar">
              <h1>My Calendar</h1>
              <section className="container">
                <div className="calendarBox">
                  <h2>
                    {month} {year}
                  </h2>
                  <div className="calendarTable">
                    <table>
                      <thead>
                        <tr>
                          <th>S</th>
                          <th>M</th>
                          <th>T</th>
                          <th>W</th>
                          <th>T</th>
                          <th>F</th>
                          <th>S</th>
                        </tr>
                      </thead>

                      <tbody className={currentStreak ? "streak" : "nostreak"}>
                        {displayDates.map(
                          (date, index /*date is the numerical day*/) => (
                            <>
                              {newRowIndex.includes(index) && (
                                <tr
                                  cellspacing="0"
                                  cellpadding="0"
                                  className={
                                    (todayIndex <=
                                      newRowIndex[newRowIndex.indexOf(index)] &&
                                      newRowIndex[newRowIndex.indexOf(index)]) <
                                      todayIndex + 7 &&
                                    todayIndex >
                                      newRowIndex[
                                        newRowIndex.indexOf(index - 7)
                                      ]
                                      ? "current"
                                      : null //< newRowIndex[newRowIndex.indexOf(index)] && todayIndex < newRowIndex[newRowIndex.indexOf(index) + 1] ? "current" : null
                                  }
                                >
                                  {displayDates.map((d, newIndex) => (
                                    <>
                                      {newIndex <= index &&
                                        newIndex > index - 7 && (
                                          <th
                                            className={
                                              (newIndex === todayIndex
                                                ? "dates currentDay"
                                                : "dates ") +
                                              (user.streak_calendar.this_month[
                                                d
                                              ]
                                                ? " saved-streak"
                                                : "")
                                            }
                                            style={
                                              newIndex < previousDates.length
                                                ? { color: "#CECECE" }
                                                : null
                                            }
                                          >
                                            {newIndex != todayIndex &&
                                            user.streak_calendar.this_month[
                                              d
                                            ] ? (
                                              <img
                                                className="streak-fire"
                                                width="15"
                                                height="15"
                                                src="/images/streak_fire.svg"
                                              ></img>
                                            ) : (
                                              d
                                            )}
                                          </th>
                                        )}
                                    </>
                                  ))}
                                </tr>
                              )}
                            </>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {currentStreak ? (
                  <div className="streakContainer">
                    <img
                      src="images/streak.svg"
                      alt="Streak"
                      width={250}
                      height={250}
                    />
                    <h1>Superb!</h1>
                    <h3>You saved your streak and kept the fire burning!</h3>
                  </div>
                ) : (
                  <div className="streakContainer">
                    <img
                      src="images/nostreak.svg"
                      alt="No Streak"
                      width={250}
                      height={250}
                    />
                    <h3>
                      Finish all the items on your schedule to continue your
                      streak!
                    </h3>
                  </div>
                )}
              </section>
            </section>
          )}
          {!user.success ? (
            <PlaceholderRectangle
              className="infoBar"
              width="auto"
              height="478px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <section className="studyTime">
              <h1>Today's Study Time</h1>
              <div className="doughnutContainer">
                <div>
                  <DoughnutChart config={studyTimeDistrib} />
                </div>
                <div>
                  <DoughnutChart config={studyPercent} />
                </div>
              </div>
            </section>
          )}
          {!user.success ? (
            <PlaceholderRectangle
              className="infoBar"
              width="auto"
              height="478px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <section className="studyTime lineChart">
              <h1>Today's Studying</h1>
              <div
                style={{ width: "100%", height: "600px" }}
                className="container"
              >
                <LineChart
                  width={400}
                  height={200}
                  data={timeSpentOnLearning}
                />
              </div>
            </section>
          )}
          {!user.success ? (
            <PlaceholderRectangle
              className="infoBar"
              width="auto"
              height="478px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <section className="studyTime doughnutChart">
              <h1>My Recall Sessions</h1>
              <div
                style={{ width: "100%", height: "600px" }}
                className="container"
              >
                <VerticalBarChart config={weeklyRecallSessions} />
              </div>
            </section>
          )}

          {user !== undefined &&
            user.success &&
            user.today !== undefined &&
            user.today.most_difficult_terms !== undefined && (
              <section className="moreOptions">
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
                    <div className="card study_history">
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
                          {user.today !== undefined &&
                            user.today.most_difficult_terms !== undefined &&
                            Object.keys(user.today.most_difficult_terms).map(
                              (key) => (
                                <div className="sep">
                                  <div className="left">
                                    `` <p>{key}</p>
                                  </div>
                                  <div className="right">
                                    <p>
                                      {user.today.most_difficult_terms[key]}
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
        </div>
      </section>
      <UserInfo
        user={user}
        setUser={setUser}
        setAddTaskVisible={setAddTaskVisible}
        addTaskVisible={addTaskVisible}
        setGenericQuizzyPlusPopupEnabled={setGenericQuizzyPlusPopupEnabled}
        genericQuizzyPlusPopupEnabled={genericQuizzyPlusPopupEnabled}
      />
    </main>
  );
}

export default Dashboard;
