import React, {useState, useEffect} from "react"
import './alert.css'
import "./AlertMessage.scss"

function AlertMessage(props) {
    const alertType = props.alertType;

    const backgroundColor = alertType == "error" ? "#FF4D4D" : "#cdb8ff"
    const textColor = alertType == "error" ? "#880000" : "#8358e8"
    const alert = props.alert 

    return (
        <div className="alert_message" style={{backgroundColor: backgroundColor}}>
            {alertType == "error" ? (
                <svg className="infobx-ico" xmlns="http://www.w3.org/2000/svg" width="44" height="38" viewBox="0 0 44 38">
                    <path id="warning_FILL0_wght400_GRAD0_opsz48_1_" data-name="warning_FILL0_wght400_GRAD0_opsz48 (1)" d="M2,42,24,4,46,42Zm5.2-3H40.8L24,10Zm17-2.85a1.454,1.454,0,1,0-1.075-.425A1.457,1.457,0,0,0,24.2,36.15ZM22.7,30.6h3V19.4h-3ZM24,24.5Z" transform="translate(-2 -4)" fill="#800"/>
                </svg>
              
            ) : (
                    <svg className="infobx-ico" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <path id="info_FILL0_wght400_GRAD0_opsz48_2_" data-name="info_FILL0_wght400_GRAD0_opsz48 (2)" d="M22.65,34h3V22h-3ZM24,18.3a1.643,1.643,0,0,0,1.175-.45,1.515,1.515,0,0,0,.475-1.15,1.681,1.681,0,0,0-.475-1.2,1.631,1.631,0,0,0-2.35,0,1.681,1.681,0,0,0-.475,1.2,1.515,1.515,0,0,0,.475,1.15A1.643,1.643,0,0,0,24,18.3ZM24,44a19.352,19.352,0,0,1-7.75-1.575A20.15,20.15,0,0,1,5.575,31.75a19.978,19.978,0,0,1,0-15.55,19.988,19.988,0,0,1,4.3-6.35A20.5,20.5,0,0,1,16.25,5.575a19.978,19.978,0,0,1,15.55,0A19.969,19.969,0,0,1,42.425,16.2a19.978,19.978,0,0,1,0,15.55,20.5,20.5,0,0,1-4.275,6.375,19.988,19.988,0,0,1-6.35,4.3A19.475,19.475,0,0,1,24,44Zm.05-3a16.3,16.3,0,0,0,12-4.975A16.483,16.483,0,0,0,41,23.95a16.342,16.342,0,0,0-4.95-12A16.4,16.4,0,0,0,24,7a16.424,16.424,0,0,0-12.025,4.95A16.359,16.359,0,0,0,7,24a16.383,16.383,0,0,0,4.975,12.025A16.441,16.441,0,0,0,24.05,41ZM24,24Z" transform="translate(-4 -4)" fill="#8358e8"/>
                </svg>
            )}
            <h2 style={{color: textColor}}>{alert}</h2>
        </div>
    )
}

export default AlertMessage