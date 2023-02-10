import React, {useState, useEffect} from "react"

import "./PlaceholderRectangle.scss"

function PlaceholderRectangle(props) {
    const placeholderColor = props.color ? props.color : "#888787";
    const placeholderWidth = props.width ? props.width : "500px";
    const placeholderHeight = props.height ? props.height : "35px";
    const placeholderBorder = props.radius ? props.radius : "5px";
    const marginTop = props.marginTop ? props.marginTop : "0px"; 
    const marginRight = props.marginRight ? props.marginRight : "0px"; 
    const className = props.className; 

    return (
        <div className={"placeholder-rectangle " + className} style={{
                backgroundColor: placeholderColor,
                width: placeholderWidth,
                height: placeholderHeight,
                borderRadius: placeholderBorder,
                marginTop: marginTop,
                marginRight: marginRight
            }}>
        </div>
    )
}

export default PlaceholderRectangle