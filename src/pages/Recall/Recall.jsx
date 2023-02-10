import { wait } from "@testing-library/user-event/dist/utils";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import DocumentMeta from "react-document-meta";
import { useNavigate, useParams } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import { get_session_token, get_user, get_set_data, update_recall_session, get_recall_info, get_recall_intervals, get_recall_queue, submit_recall_choice, on_set_closed, update_recall_settings } from "../../network/communication";
import ReactTooltip from 'react-tooltip';
import { FiArrowRight } from "react-icons/fi";
import { createTheme, Slider } from "@mui/material";
import { ThemeProvider } from "@mui/system";

// 

import "./Recall.scss"
import "./recall.css"
import party from "party-js"
import { addStyles, StaticMathField } from "react-mathquill";
import PlaceholderRectangle from "../../components/PlaceholderRectangle/PlaceholderRectangle";
import { useSpeechSynthesis } from "react-speech-kit";

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

addStyles() 

const DISABLED_TEXT_AREA_COLOR = "#d9d9d9"
  
const theme = createTheme({
    palette: {
      primary: {
        main: '#8358E8',
      },
    }
});

const EMOJIS = [
    //"/images/recall/extremely_dissatisfied.svg",
    "/images/recall/very_dissatisfied.svg",
    "/images/recall/neutral.svg",
    "/images/recall/satisfied.svg",
    "/images/recall/very_satisfied.svg",
]

const RECALL_INDEXES_LEARNING = [
    "again",
    "good",
    "perfect"
]

const RECALL_INDEXES = [
    "again",
    "hard",
    "good",
    "perfect"
]
function Recall(props) {
  const navigate = useNavigate();
  const { speak, cancel, voices } = useSpeechSynthesis();
  const selectedVoiceIndex = 1;
  const [user, setUser] = useState(props.user); 
  const [setData, setSetData] = useState(null);
  const confetti = useRef(null);

  const [recallQueue, setRecallQueue] = useState([])//useState([0, 1, 2, 3])
  const [lrmData, setLRMData] = useState([0, 0, 0])

  const [settingsVisible, setSettingsVisible] = useState(false);

  const [recallSettings, setRecallSettings] = useState([]); 

  const [expectedTitle, setExpectedTitle] = useState(null)
  const [currentTermPositionInQueue, setCurrentTermPositionInQueue] = useState(0)
  const [oftenSliderValue, setOftenSliderValue] = useState(0);
  const [oftenSliderLabel, setOftenSliderLabel] = useState("Not very often");

  const [currentTermStamp, setCurrentTermStamp] = useState("/images/recall/extremely_dissatisfied.svg");
  const [termStampShown, setTermStampShown] = useState(false)

  const [recallPercentage, setRecallPercentage] = useState(0);

  const bottomFlashcardInput = useRef(null); 
  const [bottomFlashcardInputDisabled, setBottomFlashcardInputDisabled] = useState(false);

  const [recallSessionFinished, setRecallSessionFinished] = useState(false);

  const [recallData, setRecallData] = useState({});
  const [hasRecalledBefore, setHasRecalledBefore] = useState(true);

  const [nextSession, setNextSession] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [termShown, setTermShown] = useState(false);
  const [bottomFlashcardShown, showBottomFlashCard] = useState(false);
  const [definitionShown, setDefinitionShown] = useState(false);
  const [emojisShown, setEmojisShown] = useState(false);
  const [toggleBlock, settoggleBlock] = useState(false);

  const [recallIntervals, setRecallIntervals] = useState([])
  const {setid, title} = useParams("")

  const emailNotificationsRadio = useRef(null); 
  const imagesRadio = useRef(null);
  const audioRadio = useRef(null);
  const smartCompletionRadio = useRef(null);

  const limits = { enabled: true, minStart: 10, minEnd: 40 };
  const marks = [
    {
      value: 0,
      label: 'Not very often',
    },
    {
      value: 33,
      label: 'Often',
    },
    {
      value: 66,
      label: 'Very often',
    },
    {
      value: 100,
      label: 'Extremely often',
    },
  ];

  const addZero = (num) => (num >= 10 ? num : "0" + num);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const stringifyDate = (rawDate, includeYear = false, monthString = false) => {
    const date = new Date(rawDate);

    const day = addZero(date.getDate() + 1);

    const month = addZero(date.getMonth() + 1);
    const year = date.getFullYear();

    if (monthString) {
      return months[parseInt(date.getMonth())] + " " + day;
    }

    return `${month}/${day}${
      includeYear ? `/${year.toString().substr(2)}` : ""
    }`;
  };
  const showFlashcard = useSpring({from: {opacity: 0}, to: {opacity: 1}, delay: 250});
  
  let classToggle =()=>{ 
    setTimeout(() => {
      settoggleBlock(true)

    }, 200);
    setTimeout(() => {
      settoggleBlock(false)

    }, 1000);
  }
  const animateEmojiStamp = useSpring({
    from: {
        opacity: termStampShown ? 0 : 1
    },
    to: {
        opacity: termStampShown ? 1 : 0
    }
  })

  const animateProgressBar = useSpring({
    to: {
        width: recallPercentage + "%"
    }
  })

  const animateEmojis = useSpring({
    from: {
        opacity: emojisShown ? 0 : 1,
    },
    to: {
        opacity: emojisShown ? 1 : 0,
    },
  })

  const animateTerm = useSpring({
    from: {
        opacity: termShown ? 0 : 1,
        fontSize: definitionShown ? 52 : 32,
        marginBottom: definitionShown ? 0 : 170
    },
    to: {
        opacity: termShown ? 1 : 0,
        fontSize: definitionShown ? 32 : 52,
        marginBottom: definitionShown ? 170 : 0
    },
    delay: definitionShown ? 100 : 500
  })

  const animateImage = useSpring({
    from: {
        opacity: (termShown && !definitionShown) ? 0 : 1,
    },
    to: {
        opacity: (termShown && !definitionShown) ? 1 : 0,
    },
    delay: definitionShown ? 100 : 500
  })

  const animateSubtitle = useSpring({
    from: {
        opacity: definitionShown ? 1 : (termShown ? 0 : 1),
    },
    to: {
        opacity: definitionShown ? 0 : (termShown ? 1 : 0),
    },
    delay: definitionShown ? 0 : 750
  })

  const animateDefinition = useSpring({
    from: {
        opacity: definitionShown ? 0 : 1
    },
    to: {
        opacity: definitionShown ? 1: 0
    }
  })
  // opacity: bottomFlashcardShown ? 0: 1, 
  // opacity: bottomFlashcardShown ? 1: 0, 
  
  const animateBottomFlashcard = useSpring({
    from: {
        marginTop: bottomFlashcardShown ? -340 : 0,
        
    },
    to: {

      marginTop: bottomFlashcardShown ? 0 : -340,
    },

  } )
   
  const animateBottomFlashcardTextArea = useSpring({
    from: {
        background: bottomFlashcardInputDisabled ? "white" : DISABLED_TEXT_AREA_COLOR
    },
    to: {
        background: bottomFlashcardInputDisabled ? DISABLED_TEXT_AREA_COLOR : "white"
    }
  })
  
  const voiceOver = (str) => {
    cancel()
    speak({
      text: str,
      voice: voices[selectedVoiceIndex],
    });
  }
  

  const onRecallSessionFinished = function() {
    setEmojisShown(false)
    showBottomFlashCard(false)
    setTermShown(false)
    setDefinitionShown(false)
    setTermStampShown(false)
    setRecallSessionFinished(true)
    setTermShown(true)
    voiceOver("Congratulations! You have finished your Recall Session!")
    
  }

  const assumeAnswer = function(emojiIndex) {
    submit_recall_choice(setid, RECALL_INDEXES[emojiIndex], function() {
        setDefinitionShown(false)
        setTimeout(function() { 
            updateRecallQueue(function(finished, d) {
                showBottomFlashCard(false)
                setCurrentTermStamp(EMOJIS[emojiIndex])
                setTermStampShown(true)
                if (!finished) {
                  
                    setTimeout(function() {
                        setBottomFlashcardInputDisabled(false)
                        bottomFlashcardInput.current.readOnly = false
                        bottomFlashcardInput.current.value = ""
                        setTermStampShown(false)
                        setTermShown(true)
                        showBottomFlashCard(true);
                    }, 2000)
                }
                
            })
        }, 1000)
        
    })
  }

  const updateRecallQueue = function(f) {
    var finished = false; 
    get_recall_queue(setid, function(d) {
        setRecallQueue(d.queue)
        setCurrentTermPositionInQueue(parseInt(d.queue_index))
        setLRMData(d.lrm_data)
        if (d.queue.length == 0) {
            setNextSession(d.next_recall_date)
           
            onRecallSessionFinished()
            finished = true; 
        }
        if (f) { 
          f(finished, d)
        }
       
    })
    return finished; 
  }
  
  const onEmojiClicked = function(emojiIndex) {
    if (isBusy) { return false; }
    setIsBusy(true)
    submit_recall_choice(setid, recallIntervals.length === 3 ? RECALL_INDEXES_LEARNING[emojiIndex] : RECALL_INDEXES[emojiIndex], function() {
        setEmojisShown(false)
        setDefinitionShown(false)
        showBottomFlashCard(false)
        setCurrentTermStamp(EMOJIS[emojiIndex])
        setTermStampShown(true)
        updateRecallQueue(function(finished, d) {
            if (!finished) {
              voiceOver(setData.terms[d.queue[parseInt(d.queue_index)]][0])
                setTimeout(function() {
                    setBottomFlashcardInputDisabled(false)
                    bottomFlashcardInput.current.readOnly = false
                    bottomFlashcardInput.current.value = ""
                    setTermStampShown(false)
                    setTermShown(true)
                    showBottomFlashCard(true);
                    setIsBusy(false);
                    
                    
                }, 2000)
            }
            else { 
                setIsBusy(false);
            }
            
        })
        
    })
  }

  // Voices 
  /*useEffect(() => { 
    if (recallQueue.length > 0 && setData.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined) { 
      if (definitionShown) { 
        cancel()
        speak({
          text: setData.terms[recallQueue[currentTermPositionInQueue]][1],
          voice: voices[selectedVoiceIndex],
        });
      }
      else if (termShown) {
        cancel()
        speak({
          text: setData.terms[recallQueue[currentTermPositionInQueue]][0],
          voice: voices[selectedVoiceIndex],
        });
      }
    }
    
  }, [termShown, definitionShown])*/
  


  useEffect(() => {
    setTermShown(true);
    showBottomFlashCard(true);
    get_user(function(user) {
      setUser(user)
      console.log(user)
    })
    get_set_data(setid, get_session_token(), function(data) {
        setSetData(data)
        setExpectedTitle(!data['title'] ? "ERROR" : title.replace(/\s+/g, '-').toLowerCase())
        get_recall_queue(setid, function(d) {
            if (d.queue.length == 0) {
                onRecallSessionFinished()
            }
            setLRMData(d.lrm_data)
            setCurrentTermPositionInQueue(parseInt(d.queue_index))
            setRecallQueue(d.queue)
            if (d.queue.length == 0) {
                setNextSession(d.next_recall_date)
            }
            
        })
        get_recall_intervals(data.id, function(intervals) {
            setRecallIntervals(intervals.intervals);
        })
    }, 'recall')
    
  }, []) 

  useEffect(() => {
   // if (settingsVisible == true) {
      get_recall_info(setid, function(data) {
        setHasRecalledBefore(data.recalled_before)
        setRecallSettings(data['recall_settings']);
        if (data['recall_settings']["often_value"] === 0) {
          setOftenSliderValue(0);
          setOftenSliderLabel("Not very often");
        }
        else if (data['recall_settings']["often_value"] === 1) {
          setOftenSliderValue(33);
          setOftenSliderLabel("Often");
        }
        else if (data['recall_settings']["often_value"] === 2) {
          setOftenSliderValue(66);
          setOftenSliderLabel("Very often");
        }
        else if (data['recall_settings']["often_value"] === 3) {
          setOftenSliderValue(100);
          setOftenSliderLabel("Extremely often");
        }
        
        
      })
   // }
    
  }, [settingsVisible])


  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault(); 
        on_set_closed(setid, "recall sessions", get_session_token(), () => {})
    });
    if (!hasRecalledBefore) { 
      
       setSettingsVisible(true);
     }
  }, [])

  useEffect(() => {
    if (currentTermPositionInQueue > 0 && setData != undefined && setData.terms.length > 0) { 
        setRecallPercentage(Math.floor(currentTermPositionInQueue / recallQueue.length * 100))
    }
    else if (recallSessionFinished && recallQueue.length === 0) {
        setRecallPercentage(100)
        if (confetti.current != undefined) {
            party.confetti(confetti.current)
        }
        
    }
    
  }, [currentTermPositionInQueue, recallSessionFinished, recallQueue, setData])

    return (<main className="recall-main">
        {settingsVisible && (
            <div className="recall-session-option">
            <div className="recall-session-option-bg"> 
              <div className="top-container">
                <div className="avatar"></div>
                <div>
                  <div className="title"></div>
                  <div className="sub-title"></div>
                  <div className="sub-title-2"></div>
                </div>
              </div>
              <div className="bottom-container">
                <div className="top">
                  <div className="title"></div>
                  <div className="avatar-sm"></div>
                </div>
                <div className="center">
                  <div className="title"></div>
                  <div className="avatar-sm"></div>
                </div>
                <div className="bottom">
                  <div className="title"></div>
                  <div className="avatar-sm"></div>
                </div>
              </div>
            </div>
            <div className="recall-session-option-main">
              <div className="container">
                <div className="heading-cont">
                  <h3 className="title">Recall Session Options</h3>
                  <p className="sub-title">You can change these options anytime.</p>
                </div>
      
                <div className="container-top">
                  <div className="container-top-radio on">
                    <p>Email Notifications</p>
                    <div className="radio-container" ref={emailNotificationsRadio}>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                      <input
                            id="email-on"
                            type="radio"
                            name="email-notification"
                            defaultChecked={recallSettings["email_notifications"]}
                          />
                        <label for="email-on">
                          On
                        </label>
                      </div>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                        <input
                            id="email-off"
                            type="radio"
                            name="email-notification"
                            defaultChecked={!recallSettings["email_notifications"]}
                          />
                        <label for="email-off">
                          Off
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="container-top-radio tw">
                    <p>Images</p>
                    <div className="radio-container" ref={imagesRadio}>
                    <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                        <input
                            id="image-on"
                            type="radio"
                            name="images"
                            defaultChecked={recallSettings["image_enabled"]}
                          />
                        <label for="image-on">
                         
                          
                          On
                        </label>
                      </div>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                      <input id="image-off" type="radio" name="images" defaultChecked={!recallSettings["image_enabled"]}/>
                        <label for="image-off">
                          
      
                          Off
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-center">
                  <div className="container-top-radio on">
                    <p>Audio</p>
                    <div className="radio-container" ref={audioRadio}>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                       <input
                            id="audio-on"
                            type="radio"
                            name="audio"
                            defaultChecked={recallSettings["audio_enabled"]}
                          />
                        <label for="audio-on">
                          
                          On
                        </label>
                      </div>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                      <input id="audio-off" type="radio" name="audio" defaultChecked={!recallSettings["audio_enabled"]}/>
                        <label for="audio-off">
                          
                          Off
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="container-top-radio tw">
                    <p>Smart Completion</p>
                    <div className="radio-container" ref={smartCompletionRadio}>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                        <input
                            id="smart-completion-on"
                            type="radio"
                            name="smart-completion"
                            defaultChecked={recallSettings["smart_completion"]}
                          />
                        <label for="smart-completion-on">
                          
                          On
                        </label>
                      </div>
                      <div style={{display: "flex", flexDirection: "row", gap: "5px"}}>
                      <input
                            id="smart-completion-off"
                            type="radio"
                            name="smart-completion"
                            defaultChecked={!recallSettings["smart_completion"]}
                          />
                        <label for="smart-completion-off">
                          
                          Off
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-bottom">
                  <div className="top">
                  <p className="title">How often do you want to study this set?</p>
                  <p className="sub-title">
                        {oftenSliderLabel == "Not very often" && (
                            "Quizzy will rarely schedule Recall Sessions for this set. This gives you a low chance of scoring well on your tests."
                        )}
                        {oftenSliderLabel == "Often" && (
                            "Quizzy will schedule Recall Sessions for this set often. This gives you a good chance of scoring well on your tests."
                        )}
                        {oftenSliderLabel == "Very often" && (
                            "Quizzy will schedule Recall Sessions for this set very often. This gives you a great chance of scoring well on your tests!"
                        )}
                        {oftenSliderLabel == "Extremely often" && (
                            "Quizzy will schedule Recall Sessions for this set extremely often. This gives you an excellent chance of scoring well on your tests!"
                        )}
                       
                        
                      
                    </p>
                   
                    
                    
                  </div>
                  <div className="center">
                  <div className="slider"> 
                    <a className="slider-label">{oftenSliderLabel} {(oftenSliderLabel == "Very often" || oftenSliderLabel == "Extremely often") && (
                          <div className="plus-icon" style={{marginLeft: "10px"}}>
                            <p className="plus-icon">PLUS</p>
                        </div>)}</a>
                        <ThemeProvider theme={theme}>
                            <Slider color="primary" 
                              value={oftenSliderValue} 
                              step={null}
                              marks={marks}
                              valueLabelDisplay="off"
                              getAriaValueText={() => { return false;}}
                              sx={{
                                '& .MuiSlider-track': {
                                    height: '10px'
                                },
                                '& .MuiSlider-rail': {
                                    height: '10px',
                                    background: '#C8C8C8',
                                    opacity: 1,
                                },
                                '& .MuiSlider-thumbColorPrimary': {
                                    background: "white",
                                    filter: 'drop-shadow(0px 0px 15px rgba(0, 0, 0, 16%))',
                                    width: "26px",
                                    height: "26px",
                                    boxShadow: "none",
                                    '::before': {
                                        boxShadow: "none",
                                    }
                                }
                            }} onChange={function(e, x) {
                                if (x == 0) {
                                    setOftenSliderLabel("Not very often");
                                }
                                else if (x == 33) {
                                    setOftenSliderLabel("Often");
                                }
                                else if (x == 66) { 
                                    setOftenSliderLabel("Very often");
                                }
                                else if (x == 100) { 
                                    setOftenSliderLabel("Extremely often");
                                }
                                setOftenSliderValue(x);
                            }} />
                        </ThemeProvider>
                    </div>
                  </div>
                  <div className="bottom">
                    <p className="title">{setData?.psd?.test?.test_date == undefined ? "You have not entered a Test Date for this set." : "Your Test Date is " + stringifyDate(setData?.psd?.test?.test_date, true) + "."}</p>
                    <p className="sub-title">
                      {setData?.psd?.test?.test_date == undefined ? "Quizzy will schedule Recall Sessions for this set to put you in the best spot to remember everything for the long-term." : "Quizzy will schedule Recall Sessions for this set to put you in the best spot to get that A."}
                      
                    </p>
                  </div>
                </div>
                <div className="create-btn-cont">
                  <button className={"create-btn " + (oftenSliderValue > 33 && user.membership < 2 && "create-btn-disabled")} onClick={() => {
                    var updatedRecallSettings = {...recallSettings};
                    /* Resolve often value */ 
                    if (oftenSliderValue === 0) {
                      updatedRecallSettings["often_value"] = 0;
                    }
                    else if (oftenSliderValue === 33) {
                      updatedRecallSettings["often_value"] = 1;
                    }
                    else if (oftenSliderValue === 66) {
                      updatedRecallSettings["often_value"] = 2;
                    }
                    else if (oftenSliderValue === 100) {
                      updatedRecallSettings["often_value"] = 3;
                    }
                    /* Resolve Raduis */ 
                    var emailNotificationsOn = emailNotificationsRadio.current.children[0].children[0];
                    updatedRecallSettings["email_notifications"] = emailNotificationsOn.checked == true ? 1 : 0;

                    var imagesOn = imagesRadio.current.children[0].children[0];
                    updatedRecallSettings["image_enabled"] = imagesOn.checked == true ? 1 : 0;

                    var audioOn = audioRadio.current.children[0].children[0];
                    updatedRecallSettings["audio_enabled"] = audioOn.checked == true ? 1 : 0;
                    
                    var smartCompletionOn = smartCompletionRadio.current.children[0].children[0];
                    updatedRecallSettings["smart_completion"] = smartCompletionOn.checked == true ? 1 : 0;

                    update_recall_settings(setid, updatedRecallSettings, (data) => {
                      if (data.success) { 
                        get_recall_intervals(setid, function(intervals) {
                          setRecallIntervals(intervals.intervals);
                      })
                        setSettingsVisible(false)
                      }
                    })
                  }}>
                   {hasRecalledBefore ? "Continue" : "Begin"}
                    <div className="arrow-icon-cont">
                      <FiArrowRight />
                    </div>
                    
                  </button>
                  {(oftenSliderLabel == "Very often" || oftenSliderLabel == "Extremely often") && (
                          <div className="plus-icon" style={{marginLeft: "10px"}}>
                            <p className="plus-icon">PLUS</p>
                        </div>)}
                </div>
              </div>
            </div>
          </div>
        )}
       <ReactTooltip />
        <div className="top-info">
        <svg 
        className="back-svg" 
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => navigate(-1)}
          viewBox="0 0 19.732 13.1"
         
        >
          <path
            id="keyboard_backspace_FILL0_wght400_GRAD0_opsz48"
            d="M12.55,25.1,6,18.55,12.55,12l1.178,1.178L9.179,17.728H25.732v1.644H9.179l4.549,4.549Z"
            transform="translate(-6 -12)"
            fill="#2b2b2b"
          />
        </svg>
            {setData == undefined ? (
                <PlaceholderRectangle className="avatar" width="80px" height="80px" radius="50%"></PlaceholderRectangle>
            ) : (
                <div className="creator-info">
                    <img className="avatar" src={setData?.creator?.avatar_url}></img>
                </div>
            )}
           
            <div className="set-info">
                {setData == undefined ? (
                    <div>
                        <PlaceholderRectangle className="title" color="#cccbcb70"/>
                        <PlaceholderRectangle className="terms" width="400px" height="35px" color="#888787" marginTop="20px"/>
                    </div>
                    
                ) : (<div>
                    <div className="title-container" style={{display: "flex", flexDirection: "row", flexWrap: "nowrawp", alignItems: "center", gap: "12px", justifyContent: "flex-start"}}>
                        <h1>{setData.title}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="settings-button" width="30.03" height="30.03" viewBox="0 0 30.03 30.03" onClick={() => {
                          setSettingsVisible(true);
                        }}>
                            <path id="settings_FILL1_wght400_GRAD0_opsz48" d="M15.561,34.03l-.751-4.73a10.058,10.058,0,0,1-1.5-.713,10.317,10.317,0,0,1-1.389-.938L7.491,29.675,4,23.519l4.054-2.965a4.463,4.463,0,0,1-.094-.77q-.019-.432-.019-.77t.019-.77a4.463,4.463,0,0,1,.094-.77L4,14.51,7.491,8.354l4.429,2.027a10.317,10.317,0,0,1,1.389-.938,7.768,7.768,0,0,1,1.5-.676L15.561,4h6.907l.751,4.73a12.17,12.17,0,0,1,1.52.694,6.461,6.461,0,0,1,1.37.957l4.429-2.027L34.03,14.51,29.976,17.4a5.29,5.29,0,0,1,.094.807q.019.432.019.807t-.019.788a5.227,5.227,0,0,1-.094.788l4.054,2.928-3.491,6.156-4.429-2.027a12.452,12.452,0,0,1-1.37.957,6.541,6.541,0,0,1-1.52.694l-.751,4.73Zm3.453-10.135a4.87,4.87,0,0,0,4.88-4.88,4.87,4.87,0,0,0-4.88-4.88,4.87,4.87,0,0,0-4.88,4.88,4.87,4.87,0,0,0,4.88,4.88Z" transform="translate(-4 -4)" fill="#7b7b7b"/>
                        </svg>


                    </div>
                    
                    <a>{setData.terms.length + " terms"}</a>
                    

                </div>)}
                {setData == undefined ? (
                    <div>
                        <PlaceholderRectangle className="prog" width="200px" height="20px" color="#888787" marginTop="20px"/>
                    </div>
                ) : (<div className="progress-bar" data-effect="solid" data-tip={"You are " + recallPercentage + "% complete!"}>
                    <animated.div className="prog-fill" style={animateProgressBar}></animated.div>
                </div>)}
            </div>
        </div>
        <div className="mid-cover">
        
            <div className="lrm">
                <div className="lrm-section learning">
                    {setData == undefined ? (
                        <PlaceholderRectangle className="learning" width="130px" height="20px" color="#8358E8" radius="3px"/>
                    ) : (
                        <div className="lrm-section-title">
                            <div className="dot"></div>
                            <a>Learning</a>
                        </div>
                    )}
                    {setData == undefined ? (
                        <PlaceholderRectangle className="learning-circle" width="30px" height="30px" color="#8358E8" radius="50%"/>
                    ) : (<h1>{lrmData[0]}</h1>)}
                </div>
                <div className="lrm-section reviewing">
                    {setData == undefined ? (
                        <PlaceholderRectangle className="reviewing" width="130px" height="20px" color="#888787" radius="3px"/>
                    ) : (
                        <div className="lrm-section-title">
                            <div className="dot"></div>
                            <a>Reviewing</a>
                        </div>
                    )}
                    {setData == undefined ? (
                        <PlaceholderRectangle className="reviewing-circle" width="30px" height="30px" color="#888787" radius="50%"/>
                    ) : (<h1>{lrmData[1]}</h1>)}
                </div>
                <div className="lrm-section mastered">
                    {setData == undefined ? (
                        <PlaceholderRectangle className="mastered" width="130px" height="20px" color="#71EAA2" radius="3px"/>
                    ) : (
                        <div className="lrm-section-title">
                            <div className="dot"></div>
                            <a>Mastered</a>
                        </div>
                    )}
                    {setData == undefined ? (
                        <PlaceholderRectangle className="mastered-circle" width="30px" height="30px" color="#71EAA2" radius="50%"/>
                    ) : (<h1>{lrmData[2]}</h1>)}
                    
                </div>
            </div>
        
            {setData == undefined ? (
                <div className="flashcard-cover">
                    <PlaceholderRectangle className="recall-flashcard-cover" width="601px" height="340px" color="#6658E8" radius="30px"/>
                </div>
                 
            ) : (<animated.div className="flashcard-cover cnb" ref={confetti} >
                <div className="front" >
                  {recallQueue.length > 0 && recallSettings.image_enabled == true && setData.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && setData.terms[recallQueue[currentTermPositionInQueue]][2] != undefined && (
                      <animated.img style={animateImage} className="term-img" src={setData.terms[recallQueue[currentTermPositionInQueue]][2]}></animated.img>
                  )}
                    {recallSessionFinished && (
                <animated.h1  className={` ${termShown ? "showterm" : " hideterm"} ${definitionShown   ? "fontsmall" : "fontlarge"}`} >{"Recall Session Complete!"}</animated.h1>
                    )}
                    
                    {recallQueue.length > 0 && setData.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && !setData.terms[recallQueue[currentTermPositionInQueue]][4] && (
                <animated.h1 className={` ${termShown ? "showterm" : " hideterm"} ${definitionShown ? "fontsmall" : "fontlarge"}`}>{setData.terms[recallQueue[currentTermPositionInQueue]][0]}</animated.h1>
                    )}
                    {recallQueue.length > 0 && setData.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && setData.terms[recallQueue[currentTermPositionInQueue]][4] && (
                        /*<animated.h1 style={animateTerm}>{setData.terms[recallQueue[currentTermPositionInQueue]][0]}</animated.h1>*/
                <animated.div className={` ${termShown ? "showterm" : " hideterm"} ${definitionShown ? "fontsmall" : "fontlarge"}`}>
                            <StaticMathField>{setData.terms[recallQueue[currentTermPositionInQueue]][0]}</StaticMathField>
                        </animated.div>
                        
                        
                    )} 
                    
                    {/*<animated.h1 style={animateTerm}>{recallSessionFinished ? "Recall Session Complete!" : (recallQueue.length > 0 && setData.terms[recallQueue[currentTermPositionInQueue]][0])}</animated.h1>*/}
              <animated.h2 className={`${definitionShown ? "hidesub" : (termShown?"showsub":"hidesub")}`}>{recallSessionFinished ? ("You're on track to get that A! Come back " + (nextSession) + ".") : (setData?.title + " - " + (currentTermPositionInQueue + 1) + "/" + recallQueue?.length)}</animated.h2>
                    {(recallQueue?.length > 0 && setData?.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && setData?.terms[recallQueue[currentTermPositionInQueue]][5]) ? (
                <animated.div className={definitionShown ? "show definition" :"hide definition"}   >
                            <StaticMathField>{setData.terms[recallQueue[currentTermPositionInQueue]][1]}</StaticMathField>
                        </animated.div>
              ) : (recallQueue?.length > 0 && setData?.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && <animated.a className={definitionShown ? "show definition" : "hide definition"}>{recallQueue.length > 0 && setData.terms[recallQueue[currentTermPositionInQueue]][1]}</animated.a>)}
                    
                </div>
                {recallQueue.length > 0 && setData?.terms != undefined && setData.terms[recallQueue[currentTermPositionInQueue]] != undefined && (
              <animated.div className={toggleBlock ? "back animateit" :"back animateitup"}>
                        <animated.textarea ref={bottomFlashcardInput} style={animateBottomFlashcardTextArea} placeholder={recallQueue.length > 0 && !setData.terms[recallQueue[currentTermPositionInQueue]][1] ? ("Write as much as you know about the term '" + setData.terms[recallQueue[currentTermPositionInQueue]][0] + "' here..") : ("Write as much as you know about the term here..")} onBlur={function() {
                            var def = setData.terms[recallQueue[currentTermPositionInQueue]][1]
                            setDefinitionShown(true)
                            setBottomFlashcardInputDisabled(true)
                            bottomFlashcardInput.current.readOnly = true 
                            // Smart Completion 
                            if (recallSettings.smart_completion) {
                              if (bottomFlashcardInput.current.value === def) { /* If what the user has typed is == the definition of the value.. */ 
                                  assumeAnswer(3)
                              }
                              else if (bottomFlashcardInput.current.value.length === 0) { /* If the user has typed nothing in, then they don't know it */ 
                                  assumeAnswer(0)
                              }
                              else { 
                                setEmojisShown(true)
                              }
                            }
                            else {
                                setEmojisShown(true)
                            } 

                            
                        }}></animated.textarea>
                    </animated.div>
                )}
                
            <animated.img   className={emojisShown ? "emoji-stamp show" : "emoji-stamp  hide"} src={currentTermStamp}></animated.img>
            </animated.div>)}
            <div className="smiley-faces-cover">
          <animated.div  className={emojisShown ? "smiley-faces show" : "smiley-faces  hide"}>
                    {setData != undefined && (
                        <h2>How well do you know this term?</h2>
                    )}
                    
                    <div className="smileys">
                        {recallIntervals?.length > 0 && recallIntervals?.map((str, index) => (
                           <div onClick={classToggle} className="emojiAnim">
                            <div className="smiley-cover" onClick={function () {
                              onEmojiClicked(index)
                            }}>
                              <div className="smiley-button">
                                <img src={EMOJIS[index]} alt=""></img>
                              </div>
                              <a>{str}</a>
                            </div>
                           </div>
                        ))}
                    </div>
                </animated.div>
            </div>
           
        </div>
        
    </main>)
}

export default Recall 