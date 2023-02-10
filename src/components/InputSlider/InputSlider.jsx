import React, { useRef, useState } from "react";

import "./InputSlider.scss";

function InputSlider(props) {
    
    const defaultValue = props.defaultValue ? props.defaultValue : 0;
    const backgroundColor = props.backgroundColor ? props.backgroundColor : "#8358E8";
    const slider = useRef(null);
    const [sliderStyle, setSliderStyle] = useState('linear-gradient(90deg, ' + backgroundColor + ' ' + defaultValue + '%, rgb(214, 214, 214) ' + defaultValue + '%)');
    return (
    <input ref={slider} defaultValue={defaultValue} type="range" id="mastery-time-range" name="mastery-time-range" min="0" max="100" style={{background: sliderStyle}} onMouseMove={function() {
        var x = slider.current.value;
        var color = 'linear-gradient(90deg, ' + backgroundColor + ' ' + x + '%, rgb(214, 214, 214) ' + x + '%)';
        setSliderStyle(color);
        props.onSlide(x);
       
    }}></input>)
}

export default InputSlider; 