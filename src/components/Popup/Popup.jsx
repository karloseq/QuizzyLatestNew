import "./Popup.scss";

import { Link, useNavigate, useParams } from 'react-router-dom'    
import { useEffect, useRef, useState } from "react";
import { Spring, useSpring, useTransition, animated } from 'react-spring'
import { Timeline } from "@mui/icons-material";


function Popup(props) { 
    const user = props.user 
    const setUser = props.setUser 
    const variant = props.variant
    const enabled = props.enabled 
    const [active, setActive] = useState(true);
    const setEnabled = props.setEnabled 
    const navigate = useNavigate();
    
      
    const styles = useSpring({background: enabled ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)"})
    return (enabled &&
        <animated.div style={styles} className="fader">
            <div className="main-popup">
                {variant == "genericQuizzy+Popup" && (
                    <div className="popup">
                        <div className="content">
                            <h1>Ready to turn the A into an A+?</h1>
                            <p>Access this feature, and tons of exclusive features with an upgrade!</p>
                            <button onClick={() => {
                                navigate("/quizzyplus")
                            }}>Get Quizzy+</button>
                            <p onClick={() => {
                                setEnabled(false);
                            }}>No thanks</p>
                        </div>
                        
                    </div>
                )}
                {variant == "genericCTAPopup" && (
                    <div className="popup">
                        <div className="content">
                            <h1>{props.title}</h1>
                            <p>{props.subtitle}</p>
                            <button onClick={() => {
                                props.ctaActivate();
                            }}>{props.cta}</button>
                            <p onClick={() => {
                                setEnabled(false);
                            }}>No thanks</p>
                        </div>
                    </div>
                )}
                {variant == "ctaPopupWithIcon" && (
                    <div className="popup-w-icon">
                        <div className="content">
                            {props.icon}
                            <h1>{props.title}</h1>
                            <p>{props.subtitle}</p>
                            <div className="btns">
                                <button className={(!active ? "cta-btn-inactive" : "") + " cta-btn color-" + props.color} style={!active ? {backgroundColor: "#7B7B7B", opacity: "50%", cursor: "pointer"} : {}} onClick={() => {
                                    setActive(false);
                                    if (active) {
                                        props.ctaActivate();
                                    }

                                }}>{props.ctaIcon}{props.cta}</button>
                                <button className="cancel-btn" style={!active ? {backgroundColor: "#7B7B7B", opacity: "50%", cursor: "pointer"} : {}} onClick={() => {
                                    setEnabled(false);
                                }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path id="close_FILL0_wght400_GRAD0_opsz48_1_" data-name="close_FILL0_wght400_GRAD0_opsz48 (1)" d="M12.2,34.35,10.35,32.5,20.5,22.35,10.35,12.2,12.2,10.35,22.35,20.5,32.5,10.35,34.35,12.2,24.2,22.35,34.35,32.5,32.5,34.35,22.35,24.2Z" transform="translate(-10.35 -10.35)" fill="#fff"/>
                              </svg>
                              Cancel</button>
                            </div>
                            
                        </div>
                    </div>
                )}
            </div>
        </animated.div>
    )
}

export default Popup 