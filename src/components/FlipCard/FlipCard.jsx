import React, { useEffect, useRef } from "react";
import "./FlipCard.scss";
import "./FlipCard.css";
import { addStyles, StaticMathField  } from 'react-mathquill'
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

addStyles()

function FlipCard(props) {
  const flipCard = useRef();
  // const front = useRef(); 
  // const back = useRef(); 
  const [flipped, setFlipped] = useState(true); 
  const canHover = window.matchMedia('(hover: hover)').matches;
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();
  const voiceIndex = props.selectedVoiceIndex ?? 1;

  useEffect(() => {
    if (!canHover) {
      // front.current.style.transform = "rotateX(0deg)";
      // front.current.style.webkitTransform = "rotateX(0deg)";
      // back.current.style.webkitTransform = "rotateX(180deg)";
      // back.current.style['transform'] = "rotateX(180deg)";
      // back.current.style['opacity'] = "0";
      setFlipped(false);
    }
    
  }, [props.currentCard])
  const [loading, setloading] = useState(false);
  let loadFunc=()=>{
    setloading(true)
  }

  setTimeout(() => {
    loadFunc()
  }, 1500);
  
  let flipno=()=>{
    if(flipped==false){
      setFlipped(true)
    }
    else{
      setFlipped(false)
    }
  }
  return (
    <div className="flip" ref={flipCard} onMouseEnter={() => {
      if (canHover && props.soundEnabled && !props.currentCard.back_equation) {
        cancel();
        speak({text: props.currentCard.back, voice: voices[voiceIndex]});   
      }
      
      setFlipped(true);
    }
  } onMouseLeave={() => {
      if (canHover && props.soundEnabled && !props.currentCard.front_equation) {
        cancel();
        speak({text: props.currentCard.front, voice: voices[voiceIndex]});  
      }
      setFlipped(false);

    }
  } onClick={() => {
    flipno()
      if (!canHover) {
        if (!flipped) {
          // front.current.style.transform = "rotateX(180deg)";
          // front.current.style.webkitTransform = "rotateX(180deg)";
          // back.current.style.webkitTransform = "rotateX(0deg)";
          // back.current.style['transform'] = "rotateX(0deg)";
          // back.current.style['opacity'] = "1";
          if (props.soundEnabled && !props.currentCard.back_equation) {
            cancel();
            speak({text: props.currentCard.back, voice: voices[voiceIndex]});   
          }
        }
        else {
          // front.current.style.transform = "rotateX(0deg)";
          // front.current.style.webkitTransform = "rotateX(0deg)";
          // back.current.style.webkitTransform = "rotateX(180deg)";
          // back.current.style['transform'] = "rotateX(180deg)";
          // back.current.style['opacity'] = "0";
          if (props.soundEnabled && !props.currentCard.front_equation) {
            cancel();
            speak({text: props.currentCard.front, voice: voices[voiceIndex]});   
          }
        }
        
      }
      
    }} onAnimationEnd = {props.onAnimationEnd} appear = {props.appear} slideleft={props.slideleft} slideright={props.slideright}>

      <div className={flipped ? "front rotate-yes" : "front rotate-no"}  >
        {props.currentCard.front_equation ? (
          <StaticMathField>{props.currentCard.front}</StaticMathField>
        ) : (
          <h4 className="fronth4">{props.currentCard.front}</h4>
        )}
        
        {
          props.currentCard.front_img != undefined && (
            <img className="card-img" src={props.currentCard.front_img}></img>
          )
        }
        
      </div>
      <div  className={flipped ? "back rotate-no" : "back rotate-yes"}  >
        {props.currentCard.back_equation ? (
          <StaticMathField>{props.currentCard.back}</StaticMathField>
        ) : (
          <p className="backp">
          {props.currentCard.back}
        </p>
        )}
       
        
        {props.currentCard.back_img != undefined && (
          <img className="card-img" src={props.currentCard.back_img}></img>
        )}
        
      </div>
      <div className={loading ? "num" : "num hide-it"}>
        <p>{props.currentCard.num + 1} of {props.nterms}</p>
      </div>
    </div>
  );
}

export default FlipCard;
