import "./User.scss";

import { useNavigate, useParams } from 'react-router-dom'    
import { add_friend, remove_friend, revoke_friend_request, update_description, update_favorite_subjects, view_user_info } from "../../network/communication";
import { useEffect, useRef, useState } from "react";
import Tags from "../../components/Tags/Tags";
import StudySets from "../../components/StudySets/StudySets";
import UsersInterface from "../../components/UsersInterface/UsersInterface";

import "../../constants/constants.scss";
import Loading from "../Loading/Loading";
import PlaceholderRectangle from "../../components/PlaceholderRectangle/PlaceholderRectangle";

function User(props) { 
    const me = props.me; 
    const [user, setUser] = useState({});
    const {userid} = useParams("")
    const [favoriteSubjects, setFavoriteSubjects] = useState([])
    const [mutualFavoriteSubjects, setMutualFavoriteSubjects] = useState([])
    const [editingDescription, setEditingDescription] = useState(false);
    const descriptionRef = useRef(null);

    const [displayDates, setDisplayDates] = useState([]);
    const [previousDates, setPreviousDates] = useState([]); 
    const [newRowIndex] = useState([6, 13, 20, 27, 34]);
    const [todayIndex, setTodayIndex] = useState();
    const currentStreak =  user?.today?.streak_saved;

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
    
    const addFriendRef = useRef(null);
    const navigate = useNavigate();
    function update_user() {
        console.log("updating user")
        view_user_info(userid, function(d) {
            if (d.username == null) {
                navigate("../404")
            }
            document.title = d.username + " - Quizzy"
            var t = {...d}
            Object.keys(d.friends).map((k) => {
                if (k == me.userid) {
                    t.friends_with_me = true; 
                }
            })
            setUser(t)
            setFavoriteSubjects(t.favorite_subjects)
            setMutualFavoriteSubjects(t.mutual_favorite_subjects)
        })
    }
   
    useEffect(() => {
        update_user();
        
    }, [me])

    const MAX_ALLOWED_FRIENDS_ON_PAGE = 10;
    const MAX_ALLOWED_SETS_ON_PAGE = 6;

    var minUserFriends = {};
    var minUserSets = {};


    let i = 0; 
    if (user.friends != undefined) {
        for (const [key, value] of Object.entries(user.friends)) {
            i++;
            minUserFriends[key] = value; 
            if (i >= MAX_ALLOWED_FRIENDS_ON_PAGE) {
                break; 
            }
        }
    }

    i = 0;

    if (user.sets != undefined) {
        for (const [key, value] of Object.entries(user.sets)) {
            i++;
            minUserSets[key] = value; 
            if (i >= MAX_ALLOWED_SETS_ON_PAGE) {
                break; 
            }
        }
    }

    
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

    if(tempDates.length %7!=0)
    {
      tempDates.push(' ');
      tempDates.push(' ');
      tempDates.push(' ');
      tempDates.push(' ');
      tempDates.push(' ');
      tempDates.push(' ');
      tempDates.push(' ');
    };

        setDisplayDates(tempDates);
      };


  useEffect(() => {
    calculateCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    return (
        <main className="user-main">
            <div className="user">
                <div className="top-info">
                {user.image ? 
                    <div className="avatar-wrap">
                            <img className="avatar" src={user.image}></img>
                            <div className={"status " + user.status}></div>
                            <a className={"role " + user.role} id={user.role == "Administrator" ? "flicker-text" : ""}>{user.role}</a>
                        
                    </div>
                : (
                    <div className="avatar-wrap">
                        <PlaceholderRectangle className="avatar" height="175px" width="175px" radius="50%"/>
                        <PlaceholderRectangle className="role" width="100%" height="25px" marginTop="20px" />
                    </div>
                )}
                    <div className="user-info">
                        {/*
                        <h1 className="first-last">{user.name} {user['verified'] && <img src="../images/user/check.svg" title="This user is verified." className="verified"  alt="checkmark icon" />}</h1> */}
                        {user.username == undefined ? (
                            <div className="user-info-cover">
                                <PlaceholderRectangle className="first-last" width="300px" height="30px" color="#888787"  />
                            </div>
                        ) : <div className="user-info-cover">
                                <h1 id="first-last">{user.username}</h1> 
                                {user.verified && <img id="verified" src="../images/user/check.svg"></img>}
                                {user.membership > 0 &&
                                    <div className="plus-icon">
                                        <p className="plus-icon">PLUS</p>
                                    </div>
                                }
                            </div>}
                        {user.username == undefined ? (
                            <div className="user-info-cover">
                                <PlaceholderRectangle className="username" width="100px" height="25px" marginTop="20px" />
                            </div>
                        ) : (
                            <a className="username">{"@" + user.username}</a>
                        )}
                        
                        {/*<textarea className="description">{user.description}</textarea>*/}
                        {(editingDescription && me.userid == user.userid) ? (
                            <div className="actions description-edit"> 
                                <textarea className="description" maxLength={500} ref={descriptionRef}>{user.description}</textarea>
                                <div className="button-actions"> 
                                    <div className="button hoverable" onClick={() => {
                                        update_description(descriptionRef.current.value, function() {
                                            update_user();
                                            setEditingDescription(false)
                                        });
                                        
                                    }}>
                                        <a>Update</a>
                                    </div>
                                    <div className="button hoverable" onClick={() => {
                                        setEditingDescription(false)
                                    }}>
                                        <a>Cancel</a>
                                    </div>
                                </div>
                                
                            </div>
                        ) : (user != undefined && (<a className="description">{user.description}{user != undefined && me.userid == user.userid && <img src="../images/study/test/edit.svg" className="edit-icon" alt="edit" onClick={() => {
                            setEditingDescription(true)
                        }}></img>}</a>))}
                        
                        {
                            (user.username != undefined && me.userid != user.userid) && (
                            <div className="actions">
                                <div className={(user.friends_with_me || user.friend_requested ? "pending " : "") + "button add-friend"} ref={addFriendRef} onClick={function() {
                                    if (user.friends_with_me) { 
                                        remove_friend(user.userid, function() {
                                            update_user();
                                        }); 
                                    }
                                    else {
                                        if (!user.friend_requested) {
                                            add_friend(user.userid, function() {
                                                update_user();
                                            });
                                        }
                                        else {
                                            revoke_friend_request(user.userid, function() {
                                                update_user();
                                            }); 
                                        }
                                    }
                                    
                                }} onMouseEnter={function() {
                                    if (user.friends_with_me) {
                                        addFriendRef.current.children[1].innerHTML = "Remove";
                                    }
                                    else if (user.friend_requested) {
                                        addFriendRef.current.children[1].innerHTML = "Revoke";
                                    }
                                }} 
                                onMouseLeave={function() {
                                    if (user.friends_with_me) {
                                        addFriendRef.current.children[1].innerHTML = "Friends";
                                    }
                                    else if (user.friend_requested) {
                                        addFriendRef.current.children[1].innerHTML = "Pending";
                                    }
                                }}>
                                    <img src="/images/user/user/add_friend.svg"></img>
                                    <a>{user.friends_with_me ? "Friends" : (user.friend_requested ? "Pending" : "Add Friend")}</a>
                                </div>
                                <div className="disabled button study-together">
                                <img src="/images/user/user/together.svg"></img>
                                    <a>Study  Together</a>
                                </div>
                                <div className="disabled button chat">
                                <img src="/images/user/user/chat.svg"></img>
                                    <a>Chat</a>
                                </div>
                            </div>
                            )
                        }

                    </div>
                </div>
                <div className="bottom-info">
                    {user.username != undefined ? (
                        <div className="favorite-subjects">
                            {<h1>{user.name + "'s Favorite Subjects"}</h1>}
                            <Tags tags={favoriteSubjects} setTags={setFavoriteSubjects} readonly={me.userid !== user.userid} max={15} onModified={function(tags) { 
                                update_favorite_subjects(tags)
                            }}></Tags> 
                        </div>
                    ) : (
                        <div className="favorite-subjects">
                            <PlaceholderRectangle className="first-last" width="300px" height="30px"  />
                            <PlaceholderRectangle className="tags" width="102px" height="30px" />
                        </div>
                    )}
                    
                    {user.username == undefined ? 
                        (<div className="mutual-favorite-subjects">
                                <PlaceholderRectangle className="first-last" width="300px" height="30px" />
                                <PlaceholderRectangle className="tags" width="102px" height="30px"  />
                        </div>) : 
                        <div>
                            {me.userid !== user.userid && 
                                <div className="mutual-favorite-subjects">
                                    <div className="mutual-favorite-subjects">
                                        {<h1>{"Mutual Favorite Subjects"}</h1>}
                                        <Tags tags={mutualFavoriteSubjects} readonly={true}></Tags> 
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {/*user.username != undefined ? 
                    me.userid !== user.userid && (
                        <div className="mutual-favorite-subjects">
                            <div className="mutual-favorite-subjects">
                            {<h1>{"Mutual Favorite Subjects"}</h1>}
                            <Tags tags={mutualFavoriteSubjects} readonly={true}></Tags> 
                        </div>)
                        
                    : (<div className="mutual-favorite-subjects">
                            <PlaceholderRectangle className="first-last" width="300px" height="30px" />
                            <PlaceholderRectangle className="tags" width="102px" height="30px"  />
                    </div>)*/}
                    {user != undefined && user.friends != undefined && minUserFriends != undefined ? (
                        <div className="friends">
                            <h1>{user.name + "'s Friends - " + Object.keys(user.friends).length}</h1>
                            <UsersInterface users={minUserFriends ? minUserFriends : {}}></UsersInterface>
                            {Object.keys(user.sets).length >= MAX_ALLOWED_FRIENDS_ON_PAGE && (
                            <div className="more-cover" onClick={() => {
                                navigate("./friends")
                            }}>
                                <h1 className="more">More Friends<svg
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
                                    </svg></h1>
                            </div>)}
                            
                            
                        </div>
                   ): (<div className="friends">
                        <PlaceholderRectangle className="friends-label" width="300px" height="30px" />
                        <PlaceholderRectangle className="friend" width="380px" height="178px" marginTop="20px"/>
                    </div>)}
                    
                    {user.sets !== undefined && 
                        <div className="sets">
                            <h1>{user.name + "'s Sets - " + Object.keys(user.sets).length}</h1>
                            <StudySets sets={minUserSets}></StudySets>
                            {Object.keys(user.sets).length > MAX_ALLOWED_SETS_ON_PAGE && (
                            <div className="more-cover" onClick={() => {
                                navigate("./sets")
                            }}>
                                <h1 className="more">{"More Sets by @" + user.username}<svg
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
                                    </svg></h1>
                            </div>)}
                            
                        </div>
                    }
                    {user != undefined && user.streak_calendar != undefined && (
                        <div className="streak-calendar">
                        <h1>{user.name + "'s Streak Calendar"}</h1>
                        <section className="calendar">
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
                                    {displayDates.map((date, index) => ( /*date is the numerical day*/
                                        <> 
                                        {newRowIndex.includes(index) && (
                                            <tr
                                            cellspacing="0"
                                            cellpadding="0"
                                            className={
                                                ((todayIndex <= newRowIndex[newRowIndex.indexOf(index)] && newRowIndex[newRowIndex.indexOf(index)]) < todayIndex + 7) /*&& ((todayIndex > newRowIndex[newRowIndex.indexOf(index-7)]))*/  ? "current" : null//< newRowIndex[newRowIndex.indexOf(index)] && todayIndex < newRowIndex[newRowIndex.indexOf(index) + 1] ? "current" : null
                                            }
                                            >
                                            {displayDates.map((d, newIndex) => (
                                                <>
                                                {newIndex <= index && newIndex > index - 7 && (
                                                    
                                                    <th
                                                    className={
                                                        (newIndex === todayIndex ? "dates currentDay" : "dates") + (user.streak_calendar.this_month[d] ? " saved-streak" : "")
                                                    }
                                                    style={
                                                        newIndex < previousDates.length
                                                        ? { color: "#CECECE" }
                                                        : null
                                                    }
                                                    >
                                                    
                                                    {(newIndex != todayIndex && user.streak_calendar.this_month[d]) ? <img className="streak-fire" width="15" height="15" src="/images/streak_fire.svg"></img> : d}
                                                    </th>
                                                )}
                                                </>
                                            ))}
                                            </tr>
                                        )}
                                        </>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
                                
                            </div>
                            </section>
                        </section>
                    </div>
                    )}
                </div>
            </div>
        
            
        </main>
    )
}

export default User; 