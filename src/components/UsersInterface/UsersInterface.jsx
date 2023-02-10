import "./UsersInterface.scss";

import { useNavigate, useParams } from 'react-router-dom'    
import { useEffect, useRef, useState } from "react";
import Tags from "../Tags/Tags";

import "../../constants/constants.scss";
import { CHECKMARK_ICON } from "../../constants/constants";

function UsersInterface(props) {
    const users = props.users 
    const navigate = useNavigate();
    return (
    <div className="users-cover">
        {users != undefined && Object.keys(users).map((k, index) => 
            (
            <div className="user-info" onClick={() => { 
                navigate("/users/" + users[k].userid)
                window.location.reload();
            }}>
                <div className="content">
                    <div className="img-cover">
                        <img className="avatar" src={users[k].avatar != undefined ? users[k].avatar : users[k].image}></img>
                        <div className={"status " + users[k]['status']}></div>
                    </div>
                    <div className="userinfo-cover">
                        <div className="user-info-cover">
                            <h1 id="first-last">{users[k].name}</h1> 
                            {users[k].verified && <img id="verified" src={CHECKMARK_ICON}></img>}
                            {users[k].membership > 0 && 
                            <div className="plus-icon">
                                <p className="plus-icon">PLUS</p>
                            </div>
                            }
                        </div>
                        {/*<h1>{users[k].name}</h1>*/}
                        <a>{"@" + users[k].username}</a>
                    </div>
                </div>
            </div>
        ))}
    </div>
    )
}

export default UsersInterface