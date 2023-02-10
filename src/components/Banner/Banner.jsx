import React, {useState, useEffect} from "react"

import "./Banner.scss"

function Banner(props) {
    const color = props.color 
    const text = props.text 

    return (
        <div className="banner">
            <img src={"/images/general/banner/" + color + ".svg"}></img>
            <h2 className="banner-text">{text}</h2>
        </div>
    )
}

export default Banner