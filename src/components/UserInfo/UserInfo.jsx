import React from "react";
import "./UserInfo.scss";

import { useDispatch, useSelector } from "react-redux";

import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  get_user,
  network,
  post_to_server,
  update_schedule,
  upload_image,
} from "../../network/communication.js";
import { useState, useEffect } from "react";
import "../../constants/constants.scss";
import ReactTooltip from "react-tooltip";
import PlaceholderRectangle from "../PlaceholderRectangle/PlaceholderRectangle";

function UserInfo(props) {
  const user = props.user;
  const setUser = props.setUser;
  const ROOT_IMG_URL = props.root_img_url ? props.root_img_url : "";
  const navigate = useNavigate();
  const [uploadingNewImage, setUploadingNewImage] = useState(false);


  const friends = [
    /*{
      img: "images/user/friends/1.svg",
      online: true,
    },
    {
      img: "images/user/friends/2.svg",
      online: true,
    },
    {
      img: "images/user/friends/3.svg",
      online: false,
    },*/
  ];

  const scheduleImages = {
    "Recall Session": ROOT_IMG_URL + "images/user/schedule/1.svg",
    "Recall Session Today": ROOT_IMG_URL + "images/user/schedule/3.svg",
    Test: ROOT_IMG_URL + "images/user/schedule/2.svg",
    Flashcards: ROOT_IMG_URL + "images/user/schedule/4.svg",
    Quiz: ROOT_IMG_URL + "images/user/schedule/5.svg"
  };

  const [state, setstate] = useState({ user: "" });

  console.log(user);
  const schedule = Object.values(user.schedule);

  var recentSchedule = [...Object.values(user.recent_schedule)];

  const recentScheduleLength = Object.keys(recentSchedule).length;

  recentSchedule.length = 3;

  const scheduleLength = Object.keys(schedule).length;
  schedule.length = 6;

  //const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))//useSelector((state) => state.user.user);
  const loggedIn = user != null;

  const onFileUpload = function (e) {
    var selectedFile = e.target.files[0];
    const formData = new FormData();
    formData.append("new_avatar", selectedFile);
    console.log("uploading photo..");
    setUploadingNewImage(true);
    upload_image("update_avatar", formData, function (data) {
      if (data["success"] && data["userdata"]) {
        get_user(function (user) {
          setUser(user);
          setUploadingNewImage(false);
        });
      }
    });
  };

  useEffect(() => {
    update_schedule(function (user) {
      setUser(user);
    });
  }, []);

  return (
    <aside className="userinfo">
      <ReactTooltip id="default-font" fontFamily="Open Sans" />
      <div className="close-userinfo">
        <img
          onClick={() => {
            var navbar = document.getElementsByClassName("userinfo")[0];
            navbar.style.display = "none";
          }}
          src="/images/general/threelines.svg"
          alt=""
        />
      </div>
      <div className="imgDiv">
        <input
          type="file"
          name="photo"
          id="upload-photo"
          accept={user.membership > 0 ? "image/png, image/jpeg, image/gif" : "image/png, image/jpeg"}
          onChange={onFileUpload}
        />
        {!uploadingNewImage && (
          user.image == undefined ? (
            <PlaceholderRectangle className="avatar" width="200px" height="200px" radius="50%"></PlaceholderRectangle> 
          ) : (
          <div>
            <img
              src={user.image} //"images/user/pfplarge.svg"
              alt="Profile large"
              //width={200}
              height={200}
              className="profile"
              style={{ width: "auto", maxWidth: "195px" }}
            />
            <svg className="add-image-icon" viewBox="2 1 81.327 81.327">
              <path
                id="add-image-icon"
                d="M 63.96354293823242 74.58171081542969 L 9.745443344116211 74.58171081542969 L 9.745443344116211 20.36360740661621 L 44.59993743896484 20.36360740661621 L 44.59993743896484 12.6181640625 L 9.745443344116211 12.6181640625 C 5.485449314117432 12.6181640625 2 16.10361480712891 2 20.36360740661621 L 2 74.58171081542969 C 2 78.84170532226562 5.485449314117432 82.32715606689453 9.745443344116211 82.32715606689453 L 63.96354293823242 82.32715606689453 C 68.22353363037109 82.32715606689453 71.708984375 78.84170532226562 71.708984375 74.58171081542969 L 71.708984375 39.72721481323242 L 63.96354293823242 39.72721481323242 L 63.96354293823242 74.58171081542969 Z M 33.7950439453125 62.30517959594727 L 26.20450782775879 53.16555786132812 L 15.55452537536621 66.83626556396484 L 58.15446090698242 66.83626556396484 L 44.44503021240234 48.59574508666992 L 33.7950439453125 62.30517959594727 Z M 71.708984375 12.6181640625 L 71.708984375 1 L 63.96354293823242 1 L 63.96354293823242 12.6181640625 L 52.34537887573242 12.6181640625 C 52.38410949707031 12.65689182281494 52.34537887573242 20.36360740661621 52.34537887573242 20.36360740661621 L 63.96354293823242 20.36360740661621 L 63.96354293823242 31.94304466247559 C 64.00226593017578 31.98177146911621 71.708984375 31.94304466247559 71.708984375 31.94304466247559 L 71.708984375 20.36360740661621 L 83.3271484375 20.36360740661621 L 83.3271484375 12.6181640625 L 71.708984375 12.6181640625 Z"
              ></path>
            </svg>
          </div>)
        )}
        {uploadingNewImage && (
          <img
            className="uploading-gif"
            src="https://quizzynow.com/images/Rolling.svg"
            alt="Loader"
          />
        )}
      </div>
      {user.username == undefined ? (
        <PlaceholderRectangle className="user" width="250px" height="32px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
      ) : (
        <div className="user-info-cover">
          <h2 id="username">{user.username}</h2>
          {user.verified && (
            <img
              id="verified"
              alt="verified"
              src={ROOT_IMG_URL + "images/verified.png"}
            ></img>
          )}
          {user.membership > 0 && (
            <div className="plus-icon">
              <p className="plus-icon">PLUS</p>
            </div>
          )}
        </div>
      )}
      
      {user.role == undefined ? (
        <PlaceholderRectangle className="user" width="175px" height="32px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
      ) : (
        <div>
          {{ Administrator: true }[user.role] == true ? (
            <h3 id="flicker-text" className={user.role}>
              {user.role}
            </h3>
          ) : (
            <h3 className={user.role}>{user.role}</h3>
          )}
        </div>
        
      )}
      
      {user.description == undefined ? (
        <PlaceholderRectangle className="user" width="100%" height="175px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
      ) : (
        <p className="user-description">{user.description}</p>
      )}
      
      <section className="social">
        {user.username == undefined ? (
          <PlaceholderRectangle className="user" width="200px" height="35px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
        ) : (
          <div className="friend-count">
            <h3>
              {Object.keys(user.friends).length +
                " Friend" +
                (Object.keys(user.friends).length != 1 ? "s" : "")}
            </h3>
            <h6>({user.n_friends_online} online)</h6>
          </div>
        )}
        
        {user.username == undefined ? (
          <div className="friends-cover">
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
            <PlaceholderRectangle className="user" width="50px" height="50px" radius="50%" marginTop="20px" marginRight="10px" color="#AAAAAA"></PlaceholderRectangle> 
          </div>
        ) : (
          <div className="friends-cover">
            {Object.keys(user.friends).map((id) => (
              <div
                className="friends-userbar"
                onClick={() => {
                  navigate("/users/" + id);
                }}
              >
                <img src={user.friends[id].avatar} width={50} height={50} />
                <div
                  className="online"
                  style={
                    user.friends[id].status == "online"
                      ? { backgroundColor: "#48E47A" }
                      : { backgroundColor: "gray" }
                  }
                />
              </div>
            ))}
          </div>
        )}
        
      </section>

      <section className="schedule">
      {user.username == undefined ? (
        <div className="title">
            <PlaceholderRectangle className="schedule" width="200px" height="35px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
        </div>
          
        ) : (
        <div className="title">
          <h3>Recent</h3>
        </div>)}
        {recentScheduleLength > 0 ? (
          recentSchedule.map((task) => (
            <div className="task">
              <div className="content">
                <div className="img">
                  <img
                    src={scheduleImages[task.type]}
                    alt={task.name}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="info">
                  <h4 className="title">
                    <a
                      href={
                        "/study/" + task.id + "/" + task["url-compatible-name"]
                      }
                    >
                      {task.name}
                    </a>
                  </h4>
                  <div className="row">
                    <h5>{task.type}</h5>
                    <h5>{task.time}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            {user.success && <p>You haven't studied anything yet.</p>}
          </div>
        )}
        {user.success && recentScheduleLength >= 3 && (
          <div className="more">
            <Link to="./study">
              <h3>More</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g id="east_black_24dp" transform="translate(-0.13)">
                  <rect
                    id="Rectangle_103"
                    data-name="Rectangle 103"
                    width="24"
                    height="24"
                    transform="translate(0.13)"
                    fill="none"
                  />
                  <path
                    id="Path_62"
                    data-name="Path 62"
                    d="M15,5,13.59,6.41,18.17,11H2v2H18.17l-4.59,4.59L15,19l7-7Z"
                    fill="#484848"
                  />
                </g>
              </svg>
            </Link>
          </div>
        )}
      </section>
      <section className="schedule">
      {user.username == undefined ? (
        <div className="title">
            <PlaceholderRectangle className="schedule" width="200px" height="35px" marginTop="20px" color="#AAAAAA"></PlaceholderRectangle> 
        </div>
          
        ) : (
        <div className="title">
          <h3>Schedule</h3>
          <button onClick={() => {
            if (user.membership < 2) {
              props.setGenericQuizzyPlusPopupEnabled(true); 
            }
            else { 
              props.setAddTaskVisible(true);
            }
            
            //
          }}> + Add Task</button>
        </div>)}
        {user.success && scheduleLength > 0 ? (
          schedule.map((task) => (
            <div className="task">
              <div className="content">
                <div
                  className="img"
                  data-effect="solid"
                  data-tip={
                    task.type == "Recall Session"
                      ? "You have a Recall Session for this set coming up " +
                        String(task.time).toLowerCase()
                      : "You have a Test for this set coming up " +
                        String(task.time).toLowerCase()
                  }
                  data-for="default-font"
                >
                  <img
                    src={scheduleImages[task.type]}
                    alt={task.name}
                    width={30}
                    height={30}
                  />
                </div>
                <div className="info">
                  <h4 className="title">
                    <a
                      href={
                        "/study/" + task.id + "/" + task["url-compatible-name"]
                      }
                    >
                      {task.name}
                    </a>
                  </h4>
                  <div className="row">
                    <h5>{task.type}</h5>
                    <h5>{task.time}</h5>
                  </div>
                </div>
              </div>
              {task.time === "Today" && task.type == "Recall Session" && (
                <Link
                  to={
                    "/study/" +
                    task.id +
                    "/recall" +
                    task["url-compatible-name"]
                  }
                >
                  <button>Study</button>
                </Link>
              )}
            </div>
          ))
        ) : (
          <p>Hooray! Your schedule is empty!</p>
        )}
        {/*scheduleLength > 2 && 
        <div className="more">
          <Link to="/study">
            <h3>More</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g id="east_black_24dp" transform="translate(-0.13)">
                <rect
                  id="Rectangle_103"
                  data-name="Rectangle 103"
                  width="24"
                  height="24"
                  transform="translate(0.13)"
                  fill="none"
                />
                <path
                  id="Path_62"
                  data-name="Path 62"
                  d="M15,5,13.59,6.41,18.17,11H2v2H18.17l-4.59,4.59L15,19l7-7Z"
                  fill="#484848"
                />
              </g>
            </svg>
          </Link>
        </div>
    */}
      </section>
    </aside>
  );
}

export default UserInfo;
