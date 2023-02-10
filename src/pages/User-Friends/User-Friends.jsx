import "./User-Friends.scss";

import { useNavigate, useParams } from 'react-router-dom'  
import { useEffect, useRef, useState } from "react";
import { view_user_info } from "../../network/communication";
import UsersInterface from "../../components/UsersInterface/UsersInterface";


function User_Friends(props) {
    const me = props.me; 
    const [user, setUser] = useState({});
    const {userid} = useParams("")
    const navigate = useNavigate();

    function update_user() {
        view_user_info(userid, function(d) {
            if (d.username == null) {
                navigate("../404")
            }
            document.title = d.username + "'s Friends - Quizzy"
            var t = {...d}
            Object.keys(d.friends).map((k) => {
                if (d.friends[k].userid == me.userid) {
                    t.friends_with_me = true; 
                }
            })
            setUser(t)
        })
    }

    useEffect(() => {
        update_user();
        
    }, [])
    console.log(user)
    return (
        <main className="user-friends-main">
            {user != undefined && user.friends != undefined && 
                <div className="user-friends">
                    <a className="back" onClick={function() {
                        navigate("../users/" + user.userid)
                    }}>{"🡐 Back to " + user.name + "'s profile"}</a>
                    <h1>{user.name + "'s Friends - " + Object.keys(user.friends).length}</h1>
                    {/*<div className="friends-cover">
                            {user.friends != undefined && Object.keys(user.friends).map((k, index) => 
                                (
                                <div className="user-info" onClick={() => { 
                                    navigate("/users/" + user.friends[k].userid)
                                    window.location.reload();
                                }}>
                                    <div className="content">
                                        <div className="img-cover">
                                            <img className="avatar" src={user.friends[k].avatar}></img>
                                        </div>
                                        <div className="userinfo-cover">
                                            <h1>{user.friends[k].name}</h1>
                                            <a>{"@" + user.friends[k].username}</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                             
                        </div>
                            </div> */} 
                   <UsersInterface users={user.friends}></UsersInterface>
                </div>
            }
        </main>
    )
}

export default User_Friends;