import "./StudySets.scss";

import { useNavigate, useParams } from 'react-router-dom'    
import { useEffect, useRef, useState } from "react";
import Tags from "../Tags/Tags";
import { CHECKMARK_ICON } from "../../constants/constants";
import FlipCard from "../FlipCard/FlipCard";



function StudySets(props) {
    const sets = props.sets 
    const navigate = useNavigate();

    const tagSuggestionBox = useRef(null);
    const [newTagClicked, setNewTagClicked] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState([])

    const pathPrefix = props.pathPrefix ? props.pathPrefix : "../"
    return (
    <div className="studyset-wrap">
    {
        Object.keys(sets).map((k) => ( 
            <div className="studyset">
                <div className="contents">
                    <div className="set-icon">
                        <div className="background">
                            <img className="icon" src="/images/search/set.svg" alt=''></img>
                            {/*<FlipCard currentCard={{front: "German", back: "Language"}}/>*/}
                        </div>
                        <div className="label-background">
                            <a>Study Set</a>
                        </div>
                        
                    </div>
                    {/* <div className="set-cover">
                        
                    </div> */}
                    <div className="set-data">
                        <h2 className="set-title">{sets[k]?.title}</h2>
                        <a className="set-info">Terms: <strong>{sets[k]?.terms?.length}</strong></a>
                        <a className="set-desc">{sets[k]?.description}</a>
                        <Tags tags={sets[k]?.tags} readonly={true}></Tags>
                    </div>
                    
                    <div className="creator-data">
                        {/*<div className="separation-line"></div>**/}
                        <div className="creator-info">
                            <img className="creator-avatar" src={sets[k]?.creator?.avatar_url}></img>
                            <a className="creator-username" onClick={() => {
                                navigate("../users/" + sets[k].creator.userid)
                            }}>{sets[k].creator?.username}</a>
                            {sets[k]?.creator?.verified && <img src={CHECKMARK_ICON} title="This user is verified."  alt="checkmark icon"/>}
                            {sets[k]?.creator?.membership > 0 && 
                                <div className="plus-icon">
                                    <a className="plus-icon" href="../quizzyplus/">PLUS</a>
                                </div>
                            }

                        </div>
                        {props.show_mastery && 
                            <div className="mastery-progress">
                                    <a className="label">Mastery Progress</a>
                                    <div className="mbar">
                                        <a className="mastery-label">{sets[k]?.psd?.mastery_progress + "%"}</a>
                                        <div className="mastery-bar">
                                            <div className="fill" style={{width: sets[k]?.psd?.mastery_progress + "%"}}></div>
                                        </div>
                                    </div>
                            </div>
                        }
                        <div className="study-button" onClick={() => {
                            navigate("../study/" + sets[k]?.id + "/" + sets[k]?.title?.replace(/\s+/g, '-').toLowerCase())
                        }}>
                            <a>Study</a>
                        </div>
                    </div>
                </div>
                
            </div>
        ))
    }
    </div>
    )
}

export default StudySets 
