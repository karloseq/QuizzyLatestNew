import React, {useState, useEffect, useRef} from "react"
import { add_task } from "../../network/communication";
import Popup from "../Popup/Popup";

import "./AddTask.scss"

function AddTask(props) {
    const getDate = function(s) {
        var now = new Date(new Date().getTime() + (s * 1000));
        var utcString = now.toISOString().substring(0,19);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var localDatetime = year + "-" +
        (month < 10 ? "0" + month.toString() : month) + "-" +
        (day < 10 ? "0" + day.toString() : day) + "T" +
        (hour < 10 ? "0" + hour.toString() : hour) + ":" +
        (minute < 10 ? "0" + minute.toString() : minute) +
        utcString.substring(16,19);
        return localDatetime;
    }

    const user = props.user; 
    const taskOverride = props.taskOverride; 
    const setsOverride = props.setsOverride;
    const stageOverride = props.stageOverride; 
    const customChoice = useRef(null);
    

    const [selectedTaskIndex, setSelectedTaskIndex] = useState(taskOverride ?? null);
    const [stage, setStage] = useState(stageOverride ?? 0);
    const [setSuggestions, setSetSuggestions] = useState([]);
    const [addedSets, setAddedSets] = useState(setsOverride ?? []);

    const [addedTerms, setAddedTerms] = useState([]); //[['term1', 'term2'], 'all', 'unlearned']
    const [termChoiceIndex, setTermChoiceIndex] = useState(0);

    const [addedDates, setAddedDates] = useState([null]); //getDate(0)
    const [showAddDates, setShowAddDates] = useState(false);
    const visible = props.visible  
    const setVisible = props.setVisible

    const MAX_DATES = 15; 

    const dateContainer = useRef(null);
    const datetimeContainer = useRef(null);
    const setSearch = useRef(null); 

    var minISO = getDate(60*2); 

    const advanceStage = function() {
        setStage(stage + 1);
    }

    const evaluateSetSuggestions = function(str, recallNeeded=false) {
        var suggestions = []
        const MAX_SUGGESTIONS = 4; 
        function pushSuggestion(potentialSuggestion) { // ensure no duplicate suggestions
            var validSuggestion = true; 
            if (recallNeeded && potentialSuggestion.psd.has_recalled_before == false) {
                validSuggestion = false;
                return false; 
            }
            suggestions.forEach(suggestion => {
                if (suggestion.id == potentialSuggestion.id) { // already suggested
                    validSuggestion = false; 

                }
            })
            addedSets.forEach(set => {
                if (set.id == potentialSuggestion.id) { // set was already added 
                    validSuggestion = false; 
                }
            })
            
            if (validSuggestion == true) {
                console.log(potentialSuggestion.title + " WAS A VALID SUGGESTION!")
                suggestions.push(potentialSuggestion);
            }
            
        }
        user.recent_sets.forEach(element => {
            if (element.title.toLowerCase().search(str) != -1 && str.length > 0 && suggestions.length < MAX_SUGGESTIONS) {
                pushSuggestion(element)
            }
        });
        user.study_sets.forEach(element => {
            if (element.title.toLowerCase().search(str) != -1 && str.length > 0 && suggestions.length < MAX_SUGGESTIONS) {
                pushSuggestion(element)
            }
        });
        
        setSetSuggestions(suggestions);
    }
    
    const getUpdatedDates = function() {
        var newAddedDates = [];
        // Update the table with the current dates 
        for (var i in datetimeContainer.current.children) {
            var obj = datetimeContainer.current.children[i];
            if (obj.children != undefined) {
                newAddedDates.push(obj.children[0].value);
            }
        } 
        return newAddedDates;
    }

    const addDate = function(s) {
        var newAddedDates = getUpdatedDates();
        var beginTime = new Date(newAddedDates[newAddedDates.length-1]).getTime();
        // Add a new date
        var now = new Date(beginTime + (s * 1000));
        var utcString = now.toISOString().substring(0,19);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var localDatetime = year + "-" +
        (month < 10 ? "0" + month.toString() : month) + "-" +
        (day < 10 ? "0" + day.toString() : day) + "T" +
        (hour < 10 ? "0" + hour.toString() : hour) + ":" +
        (minute < 10 ? "0" + minute.toString() : minute) +
        utcString.substring(16,19);
        newAddedDates.push(localDatetime);
        setAddedDates(newAddedDates)
    }

    return visible && (
        
        <div className="add-task">
           
            <div className="add-task-main">
                <div className="cover">
                    <div className="title-wrap">
                        <h1 className="title">Add Task</h1>
                        <div className="plus-icon" style={{display: "inlineFlex"}}>
                            <p className="plus-icon">PLUS</p>
                        </div>
                        <p className="close-button" onClick={() => {
                            setAddedDates([null]);
                            setAddedTerms([])
                            setAddedSets(setsOverride ?? [])
                            setSelectedTaskIndex(null);
                            setStage(stageOverride ?? 0);
                            setVisible(false);
                        }}>X</p>
                    </div>
                    <p className="subtitle">Add a task to your schedule</p>
                </div>
                <div className="content">
                    {stage == 0 && (
                    <>
                        <p>Which task would you like to add?</p>
                        <div className="task-list">
                            <div className={(selectedTaskIndex == 0 ? "selected " : "") + ("task flashcards")} onClick={() => {
                                setSelectedTaskIndex(0);
                                advanceStage();
                            }}>
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18.835" height="18.835" viewBox="0 0 18.835 18.835">
                                        <path id="indeterminate_check_box_FILL0_wght400_GRAD0_opsz48" d="M9.4,16.15H21.46V14.58H9.4ZM7.57,24.835A1.609,1.609,0,0,1,6,23.265V7.57A1.609,1.609,0,0,1,7.57,6h15.7a1.609,1.609,0,0,1,1.57,1.57v15.7a1.609,1.609,0,0,1-1.57,1.57Zm0-1.57h15.7V7.57H7.57v15.7Zm0,0h0V7.57h0v15.7Z" transform="translate(-6 -6)" fill="#8358e8"/>
                                    </svg>
                                </div>
                                <p className="task-name">Flashcards</p>
                            </div>
                            <div className={(selectedTaskIndex == 1 ? "selected " : "") + ("task recall-sessions")} onClick={() => {
                                setSelectedTaskIndex(1);
                                advanceStage();
                            }}>
                                <div className="icon">
                                <svg id="notifications_active_black_24dp" xmlns="http://www.w3.org/2000/svg" width="23.674" height="23.674" viewBox="0 0 23.674 23.674">
                                    <path id="Path_63" data-name="Path 63" d="M0,0H23.674V23.674H0Z" fill="none"/>
                                    <path id="Path_64" data-name="Path 64" d="M11.145,20.141a1.824,1.824,0,0,0,1.829-1.809H9.317A1.824,1.824,0,0,0,11.145,20.141Zm5.486-5.428V10.19c0-2.777-1.49-5.1-4.114-5.718V3.857a1.372,1.372,0,0,0-2.743,0v.615C7.159,5.087,5.66,7.4,5.66,10.19v4.523L3.831,16.522v.9H18.46v-.9Zm-1.829.9H7.488V10.19c0-2.244,1.381-4.071,3.657-4.071S14.8,7.946,14.8,10.19ZM7.1,3.929,5.8,2.636a9.4,9.4,0,0,0-3.767,7.1H3.859A7.621,7.621,0,0,1,7.1,3.929ZM18.432,9.737h1.829a9.46,9.46,0,0,0-3.767-7.1L15.2,3.929A7.666,7.666,0,0,1,18.432,9.737Z" transform="translate(0.691 0.851)" fill="#8358e8"/>
                                </svg>

                                </div>
                                <p className="task-name">Recall Sessions</p>
                            </div>
                            <div className={(selectedTaskIndex == 2 ? "selected " : "") + ("task quiz")} onClick={() => {
                                setSelectedTaskIndex(2);
                                advanceStage();
                            }}>
                                <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <path id="quiz_FILL0_wght400_GRAD0_opsz48" d="M15.575,17.5a1.024,1.024,0,1,0-.725-.3A.988.988,0,0,0,15.575,17.5Zm-.625-3.15h1.175a3.222,3.222,0,0,1,.212-1.075,3.913,3.913,0,0,1,.813-.975,4.994,4.994,0,0,0,.938-1.137,2.363,2.363,0,0,0,.263-1.137,2.432,2.432,0,0,0-.788-1.875A2.925,2.925,0,0,0,15.5,7.425a2.917,2.917,0,0,0-2.8,1.95l1.125.475a2.418,2.418,0,0,1,.688-.95,1.547,1.547,0,0,1,.988-.325A1.722,1.722,0,0,1,16.712,9a1.4,1.4,0,0,1,.462,1.075,1.668,1.668,0,0,1-.225.875,3,3,0,0,1-.8.8,4.26,4.26,0,0,0-1,1.163,3.731,3.731,0,0,0-.2,1.438ZM8.5,21A1.538,1.538,0,0,1,7,19.5V5.5a1.439,1.439,0,0,1,.45-1.05A1.439,1.439,0,0,1,8.5,4h14a1.439,1.439,0,0,1,1.05.45A1.439,1.439,0,0,1,24,5.5v14A1.538,1.538,0,0,1,22.5,21Zm0-1.5h14V5.5H8.5ZM5.5,24a1.439,1.439,0,0,1-1.05-.45A1.439,1.439,0,0,1,4,22.5V7H5.5V22.5H21V24Zm3-18.5v0Z" transform="translate(-4 -4)" fill="#8358e8"/>
                                </svg>

                                </div>
                                <p className="task-name">Quiz</p>
                            </div>
                        </div>
                        </>
                    )} 
                    {stage == 1 && (
                        <>
                            <p>Which set(s) are you adding this task for?</p>
                            <div className="set-cover">
                                <div className="added-sets">
                                    {addedSets.map((set, index) => (
                                        <div className="set-info">
                                            <div className="set-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                                    <path id="sticky_note_2_FILL0_wght400_GRAD0_opsz48" d="M9,39H29V29H39V9H9Zm0,3a2.988,2.988,0,0,1-3-3V9A2.988,2.988,0,0,1,9,6H39a2.988,2.988,0,0,1,3,3V30L30,42Zm6-15V24h8.5v3Zm0-8V16H33v3ZM9,39v0Z" transform="translate(-6 -6)" fill="#fff"/>
                                                </svg>
                                            </div>
                                            <div className="set-content">

                                                <p>{set.title}</p>
                                                <p className="desc">{set.description}</p>
                                               
                                            </div>
                                            <button className="remove-container" onClick={() => {
                                                var newAddedSets = [...addedSets];
                                                // remove a set 
                                                
                                                newAddedSets.splice(index, 1)
                                                setAddedSets(newAddedSets)
                                            }}>
                                                <p>Remove</p>
                                            </button>
                                        </div>
                                    ))}
                                    
                                </div>
                                
                            </div>
                            <input type="text" placeholder="Search for a set.." className="set-search" ref={setSearch} onChange={() => {
                                evaluateSetSuggestions(setSearch.current.value, selectedTaskIndex === 1)
                            }}></input>
                            <div className="suggestions">
                                {setSuggestions.map((set) => (
                                    <div className="suggestion" onClick={() => {
                                        var previousAddedSets = [...addedSets]
                                        previousAddedSets.push(set);
                                        setAddedSets(previousAddedSets);
                                        setSetSuggestions([]);
                                        setSearch.current.value = "";
                                        console.log(previousAddedSets)
                                    }}>
                                        <p>{set.title}</p>
                                        <p className="desc">{set.description}</p>
                                        
                                    </div>
                                ))}
                            
                            </div>
                            <div className="btn-cover" onClick={() => {
                                advanceStage();
                            }}>
                                <div className={"continue-btn" + (addedSets.length == 0 ? " continue-btn-disabled" : "")}>
                                    <p>Continue</p>
                                </div>
                            </div>
                            
                        </>
                    )}
                    {stage == 2 && (
                        <>
                            <p>When do you want to be reminded of this task?</p>
                            <div className="date-container" ref={dateContainer}>
                                <div className="datetime-container" ref={datetimeContainer}>
                                    {addedDates.map((date, index) => (
                                        <div className="date-time">
                                            <input type="datetime-local" value={date} min={minISO} step={0} onChange={() => {
                                                setAddedDates(getUpdatedDates())
                                                setShowAddDates(true)
                                            }}></input>
                                            {addedDates.length > 1 && (
                                                <button className="remove-container" onClick={() => {
                                                var newAddedDates = [...addedDates];
                                                // remove a date 
                                                
                                                newAddedDates.splice(index, 1)
                                                console.log(addedDates)
                                                setAddedDates(newAddedDates)
                                            }}>
                                                <p>Remove</p>
                                            </button>
                                            )}
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {addedDates.length > 0 && showAddDates && addedDates.length < MAX_DATES && (
                                <div className="add-dates">
                                    <button className="add-date" onClick={() => {
                                        addDate(60*5)
                                    }}>
                                        <p>+ 5 min</p>
                                    </button>
                                    <button className="add-date" onClick={() => {
                                        addDate(60*60*24)
                                    }}>
                                        <p>+ 1 day</p>
                                    </button>
                                    <button className="add-date" onClick={() => {
                                        addDate(60*60*24*3)
                                    }}>
                                        <p>+ 3 days</p>
                                    </button>
                                    <button className="add-date" onClick={() => {
                                        addDate(60*60*24*7)
                                    }}>
                                        <p>+ 1 week</p>
                                    </button>
                                    <button className="add-date" onClick={() => {
                                        addDate(60*60*24*30)
                                    }}>
                                        <p>+ 1 month</p>
                                    </button>
                                </div>
                            )}
                            <div onClick={() => {
                                if (selectedTaskIndex == 0) { // Flashcards - Ready to finish 
                                    add_task(["Flashcards", "Recall Session", "Quiz"][selectedTaskIndex], addedSets, addedDates, addedTerms, (data) => {
                                        if (data['success'] == true) {
                                            window.location.reload();
                                        }
                                    })
                                }
                                else { 
                                    advanceStage();
                                }
                            }} className={"continue-btn finish-btn" + (addedDates.length == 0 ? " continue-btn-disabled" : "")}>
                                <p>{selectedTaskIndex == 0 ? "Finish" : "Continue"}</p>
                            </div>
                           
                        </>
                    )}
                    {stage >= 3 && (
                        <>
                            
                            <p>{"Select the terms you want to practice for " + addedSets[stage-3].title}</p>
                            <div className="term-choices">
                                <div className="term-choice">
                                    <input
                                        id="unlearned"
                                        type="radio"
                                        name="term-choice"
                                        defaultChecked={true}
                                        onChange={(e) => {
                                            if (e.target.checked == true) {
                                                setTermChoiceIndex(0)
                                            }
                                        }}
                                    />
                                    <label for="unlearned">Unlearned terms</label>
                                </div>
                                
                                <div className="term-choice">
                                    <input
                                        id="all-terms"
                                        type="radio"
                                        name="term-choice"
                                        onChange={(e) => {
                                            if (e.target.checked == true) {
                                                setTermChoiceIndex(1)
                                            }
                                        }}
                                    />
                                    <label for="all-terms">All terms</label>
                                </div>
                                
                                <div className="term-choice">
                                    <input
                                        id="custom-choice"
                                        type="radio"
                                        name="term-choice"
                                        
                                        onChange={(e) => {
                                            if (e.target.checked == true) {
                                                setTermChoiceIndex(2)
                                            }
                                        }}
                                        
                                    />
                                    <label for="custom-choice">Custom</label>
                                </div>
                            </div>
                            {termChoiceIndex == 2 && (
                                <div className="term-choices custom-choices" ref={customChoice}>
                                    {addedSets[stage-3].terms.map((td, index) => (
                                        <div className="term-choice">
                                            <input
                                                id={"custom-choice" + index}
                                                type="checkbox"
                                                defaultChecked={true}
                                            />
                                            <label for={"custom-choice" + index}>{td[0]}</label>
                                        </div>
                                    ))}
                                    
                                </div>
                            )}
                            <div onClick={() => {
                                if (stage == 2 + addedSets.length) { // Ready to finish 
                                    add_task(["Flashcards", "Recall Session", "Quiz"][selectedTaskIndex], addedSets, addedDates, addedTerms, (data) => {
                                        console.log(data);
                                        if (data['success'] == true) {
                                            window.location.reload();
                                            
                                        }
                                    })
                                }
                                else { // More custom terms
                                    var terms = [...addedTerms];
                                    console.log("terms before: ");
                                    console.log(terms);
                                    var i = stage - 3; 
                                    if (termChoiceIndex == 0) { 
                                        terms[i] = "unlearned";
                                    }
                                    else if (termChoiceIndex == 1) { 
                                        terms[i] = "all";
                                    }
                                    else {
                                        terms[i] = [];
                                        for (var x in customChoice.current.children) {
                                            var child = customChoice.current.children[x];
                                            if (child != undefined && child.children != undefined) {
                                                terms[i].push(child.children[0].checked);
                                            }
                                        }
                                        
                                    }
                                    if (terms[i].length > 0) {
                                        setAddedTerms(terms);
                                        advanceStage();
                                    }
                                }
                            }} className={"continue-btn finish-btn"}>
                                <p>{(stage == 2 + addedSets.length) ? "Finish" : "Continue"}</p>
                            </div>
                        
                        
                            
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default AddTask