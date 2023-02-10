import React from "react";
import "./Dashboard-Study.scss";

import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useState, useEffect } from "react";
import { get_user } from "../../network/communication";
import { CHECKMARK_ICON } from "../../constants/constants";
import StudySets from "../../components/StudySets/StudySets";
import PlaceholderRectangle from "../../components/PlaceholderRectangle/PlaceholderRectangle";
import AddTask from "../../components/AddTask/AddTask";

function Study(props) {
  const navigate = useNavigate();
  var user = props.user;
  var setUser = props.setUser;
  const [addTaskVisible, setAddTaskVisible] = useState(false);

  useEffect(() => {
    get_user(function (user) {
      if (user.success) {
        setUser(user);
      }
    });
    document.title = "Study - Quizzy";
  }, []);

  return (
    <main className="dstudy-main">
      <Navbar user={user} setUser={setUser} active={1} />
      <AddTask
        user={user}
        visible={addTaskVisible}
        setVisible={setAddTaskVisible}
      ></AddTask>
      <section className="study">
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
          {!user.success ? (
            <PlaceholderRectangle
              className="hi"
              width="300px"
              height="50px"
              color="#AAAAAA"
            ></PlaceholderRectangle>
          ) : (
            <h1>Study</h1>
          )}

          {[
            ["Recent", "recent", "recent_sets"],
            ["My Sets", "my-sets", "study_sets"],
          ].map((sd) => (
            <div>
              {!user.success ? (
                <div className={sd[1] + " set-cover"}>
                  {/* <PlaceholderRectangle
                    className="hi"
                    width="300px"
                    height="50px"
                    color="#AAAAAA"
                    marginTop="2rem"
                  ></PlaceholderRectangle> */}
                </div>
              ) : (
                <div className={sd[1] + " set-cover"}>
                  <h2>{sd[0]}</h2>
                  <div className="flashcard-wrap">
                    {user[sd[2]] != undefined && (
                      <StudySets sets={user[sd[2]]}></StudySets>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <UserInfo
        setAddTaskVisible={setAddTaskVisible}
        user={user}
        setUser={setUser}
        root_img_url="../"
      />
    </main>
  );
}

export default Study;
