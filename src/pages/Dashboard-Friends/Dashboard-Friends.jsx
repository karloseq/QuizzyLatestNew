import React from "react";
import "./Dashboard-Friends.scss"; 
import { Link, Navigate, useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useState, useEffect } from "react";
import { accept_friend_request, get_user } from "../../network/communication";
import { CHECKMARK_ICON } from "../../constants/constants";
import UsersInterface from "../../components/UsersInterface/UsersInterface";
import { Helmet } from "react-helmet-async";
import PlaceholderRectangle from "../../components/PlaceholderRectangle/PlaceholderRectangle";
import AddTask from "../../components/AddTask/AddTask";

function Study(props) {
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(0);
    var user = props.user 
    var setUser = props.setUser 
    
    const [addTaskVisible, setAddTaskVisible] = useState(false);

    useEffect(() => {
        get_user(function(user) {
          if (user.success) {
            setUser(user)
          }
        })
        document.title = "Friends - Quizzy"
      }, []) 
//
    return (
        <main className="main">
            <Helmet>
                {user && user.membership == 0 && (
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7056673711339024"
            crossorigin="anonymous"></script>
                )}
            </Helmet> 
            <Navbar user={user} setUser={setUser} active={2}/>
            <AddTask
                user={user}
                visible={addTaskVisible}
                setVisible={setAddTaskVisible}
            ></AddTask>
            <section className="friends">
                <div className="friends-content">
                    <div className="show-navbars align-bar">
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
                    <div className="selection">
                        <PlaceholderRectangle className="button" width="193px" height="auto" radius="25px" color="#AAAAAA"></PlaceholderRectangle> 
                        <PlaceholderRectangle className="button" width="193px" height="auto" radius="25px" color="#AAAAAA"></PlaceholderRectangle> 
                    </div>
                ) : (
                    <div className="selection">
                        <div className={"button button-friends " + (currentSection == 0 && "current")} onClick={() => {
                            setCurrentSection(0);
                        }}>
                            <img className="icon" src="../images/friends/friends.svg"/>
                            <a>Friends</a>
                        </div>
                        <div className={"button button-requests " + (currentSection == 1 && "current")} onClick={() => {
                            setCurrentSection(1);
                        }}>
                            <img className="icon" src="../images/friends/friends-add.svg"/>
                            <a>Requests</a>
                        </div>
                    </div>)}
                    <div className="content">
                        
                        {currentSection == 0 && 
                        (
                            <div>
                                {user.success ? (
                                <h1 className="spec-frnds">{"Friends (" + Object.keys(user.friends).length + ")"}</h1>
                                ) : (
                                    <PlaceholderRectangle className="button" width="300px" height="50px"></PlaceholderRectangle> 
                                )}
                                <UsersInterface users={user.friends}></UsersInterface> 
                            </div>
                        )
                        || currentSection == 1 && (
                            <div>
                                <h1>{"Friend Requests (" + user.friend_requests.length + ")"}</h1>
                                <div className="friends-div">
                                {user.friend_requests.map((d) => (
                                    <div className="friend f-request">
                                        <div className="info">
                                            <img className="avatar" src={d['avatar']}></img>
                                            <div className="right">
                                                <h2 className="name">{d['username']}</h2>
                                                <a className="username">{'@' + d['username']}</a>
                                            </div>
                                        </div>
                                        <div className="options">
                                            <div className="accept option-button" onClick={() => {
                                                accept_friend_request(d['userid'], function(data) {
                                                    setUser(data.user);
                                                })
                                            }}>
                                                <img src="../images/friends/add-person.svg"></img>
                                                <a>Accept</a>
                                            </div>
                                            <div className="decline option-button">
                                                <img src="../images/friends/decline-person.svg"></img>
                                                <a>Decline</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                 </div>
                            </div>
                        )}
                        

                    </div>
                </div>
                
            </section>
            <UserInfo setAddTaskVisible={setAddTaskVisible}
                addTaskVisible={addTaskVisible} user={user} setUser={setUser} root_img_url="../"/>
        </main>
        
        
    )
}

export default Study;
