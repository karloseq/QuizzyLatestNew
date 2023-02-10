import "./User-Sets.scss";

import { useNavigate, useParams } from 'react-router-dom'  
import { useEffect, useRef, useState } from "react";
import { view_user_info } from "../../network/communication";
import StudySets from "../../components/StudySets/StudySets";


function User_Sets(props) {
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
                    <h1>{user.name + "'s Sets - " + Object.keys(user.sets).length}</h1>
                    <StudySets sets={user.sets}></StudySets>
                </div> 
            }
        </main>
    )
}

export default User_Sets;