import React, { useRef } from "react";
import "./Dashboard-Changelog.scss";

import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useState, useEffect } from "react";
import { get_user } from "../../network/communication";
import party from "party-js"
import AddTask from "../../components/AddTask/AddTask";


function Changelog(props) {
    const navigate = useNavigate();
    const confetti = useRef(null);

    const [addTaskVisible, setAddTaskVisible] = useState(false);
    const [changelogData, setChangelogData] = useState({
       
    })
    var user = props.user 
    var setUser = props.setUser 
    useEffect(() => {
        get_user(function(user) {
          if (user.success) {
            setUser(user)
          }
        })
        document.title = "Changelog - Quizzy"
        
        fetch("https://quizzynow.com/php/fetch-changelog.php", {
            method: 'GET',
        }).then(function(resp) {
            resp.json().then(function(data) {
                setChangelogData(data)
            })})

        }, []) 
//
    return (
        <main className="changelog-main">
            <Navbar user={user} setUser={setUser} active={4}/>
            <AddTask
                user={user}
                visible={addTaskVisible}
                setVisible={setAddTaskVisible}
            ></AddTask>
            <section className="changelog">
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
                <h1>What's new</h1>
                <div className="changelog-content">
                    {Object.keys(changelogData).map((date) => (
                        <div className="changelog-item">
                        <div className="header">
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22.114" height="22.114" viewBox="0 0 22.114 22.114">
                                    <path id="update_FILL0_wght400_GRAD0_opsz48" d="M17.149,28.114a10.806,10.806,0,0,1-4.331-.875,11.433,11.433,0,0,1-3.547-2.38,11.117,11.117,0,0,1-2.4-3.532A10.806,10.806,0,0,1,6,17a10.589,10.589,0,0,1,.875-4.3,11.03,11.03,0,0,1,2.4-3.486,11.348,11.348,0,0,1,3.547-2.35A10.973,10.973,0,0,1,17.149,6,10.448,10.448,0,0,1,21.8,7.075,11.688,11.688,0,0,1,25.6,10.024V6.768h1.843v6.389H21.019V11.314h3.225A10.68,10.68,0,0,0,21.065,8.8a8.352,8.352,0,0,0-3.916-.952,9.149,9.149,0,0,0-6.573,2.626A8.578,8.578,0,0,0,7.843,16.9a9.085,9.085,0,0,0,2.7,6.634,8.932,8.932,0,0,0,6.6,2.734,8.71,8.71,0,0,0,6.481-2.7,9.017,9.017,0,0,0,2.641-6.542h1.843a10.766,10.766,0,0,1-3.194,7.847A10.5,10.5,0,0,1,17.149,28.114ZM20.9,22.064,16.166,17.4V10.822h1.843v5.805l4.208,4.116Z" transform="translate(-6 -6)" fill="#fff"/>
                                </svg>
                            </div>
                            <div className="version-info">
                                <div className="version-header">
                                    <h1 className="date">{date}</h1>
                                    <p className="version">{"(v. " + changelogData[date].version + ")"}</p>
                                </div>
                                <div className="version-content">
                                    {changelogData[date].new?.map((content) => (
                                        <div className="modification">
                                            <div className="new tag">
                                                <p>NEW</p>
                                            </div>
                                            <p className="modification-content">{content}</p>
                                        </div>
                                    ))}
                                    {changelogData[date].improved?.map((content) => (
                                        <div className="modification">
                                            <div className="improved tag">
                                                <p>IMPROVED</p>
                                            </div>
                                            <p className="modification-content">{content}</p>
                                        </div>
                                    ))}
                                    {changelogData[date].disabled?.map((content) => (
                                        <div className="modification">
                                            <div className="disabled tag">
                                                <p>DISABLED</p>
                                            </div>
                                            <p className="modification-content">{content}</p>
                                        </div>
                                    ))}
                                    {changelogData[date].shoutout?.map((content) => (
                                        <div className="modification">
                                            <div className="shoutout tag" ref={confetti} onClick={() => {
                                                party.confetti(confetti.current) 
                                            }}>
                                                <p>SHOUTOUT</p>
                                            </div>
                                            <p className="modification-content">{content}</p>
                                        </div>
                                    ))}
    
                                </div>
                            
                            </div>
                        </div>
                       
                    </div>
                    ))}
                    
                </div>
            </section>
            <UserInfo setAddTaskVisible={setAddTaskVisible} user={user} setUser={setUser} root_img_url="../"/>
        </main>
        
        
    )
}

export default Changelog;
