import React, { useEffect, useRef, useState } from "react";
import {
  create_set,
  create_set_from_combine,
  edit_set,
  get_session_token,
  get_set_data,
  get_tag_color_index,
  update_set,
} from "../../network/communication";
import "./Create.scss";

import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  TAG_SUGGESTIONS,
  evaluateTags,
  MAX_IMG_SIZE_MB_PER_MEMBERSHIP,
} from "../../constants/constants";
import Popup from "../../components/Popup/Popup";
import ReactTooltip from "react-tooltip";

import MDEditor from "@uiw/react-md-editor";
import EquationEditor from "equation-editor-react";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import AlertMessage from "../../components/AlertMessage/AlertMessage";

function Create(props) {
  const navigate = useNavigate();
  const MEGABYTE = 1000000;
  const MAXIMUM_CARD_LENGTH = 250;

  const [equation, setEquation] = useState("");

  const [equationData, setEquationData] = useState([[false, "", false, ""]]);
  const [deleteSetPopup, setDeleteSetPopup] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTagClicked, setNewTagClicked] = useState(false);
  const [visibilityClicked, setVisibilityClicked] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState(0);
  const [copyClicked, setCopyClicked] = useState(false);
  const [selectedCopySetting, setSelectedCopySetting] = useState(0);

  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [termData, setTermData] = useState([[]]);
  const [selectedCharSeparation, setSelectedCharSeparation] = useState(0);
  const [selectedNewCardSeparation, setSelectedNewCardSeparation] = useState(0);

  const [currentErrors, setCurrentErrors] = useState({
    title: "",
    description: "",
    terms: [],
    definitions: [],
  });

  const [errorFound, setErrorFound] = useState(false);

  const [createButtonEnabled, setCreateButtonEnabled] = useState(true); //currently not used

  const [previewImageData, setPreviewImageData] = useState([]);

  const [importTermData, setImportTermData] = useState([]);

  const [combineData, setCombineData] = useState([]);
  const [combineErrorMessage, setCombineErrorMessage] = useState(null);
  const MAXIMUM_COMBINE_LENGTH = 10;

  const [scanData, setScanData] = useState({});

  const [imageTooLargePopupEnabled, setImageTooLargePopupEnabled] =
    useState(false);
  const [genericQuizzyPlusPopupEnabled, setGenericQuizzyPlusPopupEnabled] =
    useState(false);

  const setLinkRef = useRef(null);
  const termRef = useRef(null);
  const importTermRef = useRef(null);
  const tagSuggestionBox = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const inputFile = useRef(null);
  const inputBox = useRef(null);

  const [description, setDescription] = useState("");

  const visibilities = [
    ["Public", "Everyone will be able see this set."],
    ["Friends", "Only your friends will be able to see this set."],
    /*["Specified", "Only these users will be able to see this set."],*/
    ["Private", "Only you will be able to see this set."],
  ];

  const visibilityToIndex = {
    public: 0,
    "friends-only": 1,
    private: 2,
    "creator-only": 2,
  };

  const copying_permissions = [
    ["Only Me", "Only you will be able to make a copy of this set."],
    ["Friends", "Only your friends will be able to make a copy of this set."],
    ["Everyone", "Everyone will be able to make a copy of this set."],
  ];

  const copyRightsToIndex = {
    "creator-only": 0,
    "friends-only": 1,
    public: 2,
  };

  const potentialTags = TAG_SUGGESTIONS;

  var user = props.user;

  /* Edit Mode Variables */
  var is_edit_mode = props.edit;
  const { setid, title } = useParams("");
  const [setdata, setSetData] = useState([]);
  useEffect(() => {
    if (is_edit_mode) {
      get_set_data(setid, get_session_token(), function (data) {
        setSetData(data);
        if (!data["title"] || !data["editable"]) {
          navigate("/404");
        }
        setDescription(data.description);
        setTermData(data.terms);
        setTags(data.tags);
        setSelectedVisibility(visibilityToIndex[data.visibility]);
        console.log(data.visibility);
        setSelectedCopySetting(copyRightsToIndex[data.copy_rights]);
        // handle equation data
        var eqData = [];
        data.terms.map((v, k) => {
          console.log(v);
          eqData[k] = [v[4], v[0], v[5], v[1]];
        });
        setEquationData(eqData);
        document.title = "Editing " + data.title + " - Quizzy";
      });
    } else {
      document.title = "Create - Quizzy";
    }
  }, []);

  useEffect(() => {
    if (currentErrors.description.length > 0) {
      document.getElementsByClassName("wmde-markdown-var")[0].style.border =
        "1px solid red";
    }
  }, [currentErrors]);

  var importPlaceholder = ``;

  var CHAR_SEPARATION_CHART = [" ", ",", ";"];

  var NEW_LINE_SEPARATION_CHART = ["\n", ";"];

  importPlaceholder =
    "Front" + CHAR_SEPARATION_CHART[selectedCharSeparation] + "Back";

  var ips = importPlaceholder;

  for (var i = 0; i < 3; i++) {
    if (selectedNewCardSeparation == 0) {
      importPlaceholder +=
        `
` + ips;
    } else if (selectedNewCardSeparation == 1) {
      importPlaceholder += ";" + ips;
    }
  }

  const SetError = function (key, value) {
    var e = { ...currentErrors };
    e[key] = value;
    setCurrentErrors(e);
  };

  const formatImportTermData = function (importStr) {
    var args_by_line = importStr.split(
      NEW_LINE_SEPARATION_CHART[selectedNewCardSeparation]
    );
    var import_term_data = [];
    args_by_line.forEach((line) => {
      var td_args = line.split(CHAR_SEPARATION_CHART[selectedCharSeparation]);
      import_term_data.push([td_args[0], td_args[1]]);
    });
    console.log(import_term_data);
    setImportTermData(import_term_data);
  };

  const onCardImageUpload = function (index, i, e) {
    var pid = [...previewImageData];
    if (pid[index] == undefined) {
      pid[index] = [];
    }
    var file = e.target.files[0];
    var size = file.size;
    if (size > MEGABYTE && user.membership < 1) {
      setImageTooLargePopupEnabled(true);
    } else if (size > MEGABYTE * 3 && user.membership < 2) {
      setImageTooLargePopupEnabled(true);
    } else if (size > MEGABYTE * 10 && user.membership < 3) {
      setImageTooLargePopupEnabled(true);
    } else if (size > MEGABYTE * 20) {
      setImageTooLargePopupEnabled(true);
    } else {
      pid[index][i] = e.target.files[0];
      console.log(e.target.files[0]);
      setPreviewImageData(pid);
    }
  };

  const onCardImageRemoved = function (index, i) {
    var pid = [...previewImageData];
    if (pid[index] == undefined) {
      pid[index] = [];
    }
    pid[index][i] = null;
    setPreviewImageData(pid);
  };

  /*const beginScan = function(e) {
        var selectedFile = e.target.files[0]; 
        var sd = {...scanData}
        sd.image_url = URL.createObjectURL(selectedFile)
        setScanData(sd)
        Tesseract.recognize(
            selectedFile,'eng',
            { 
              logger: function(m) {
                sd.logger = m 
                setScanLogger(m)
                console.log(m) 
              }
            }
          )
          .catch (err => {
            console.error(err);
          })
          .then(result => {
            // Get Confidence score
            let confidence = result.confidence    
           
            let text = result.data.text
            let paragraphs = result.data.paragraphs 
  
            console.log("Success!")
            console.log(result)
            sd.ocr_info = []
            for (var i = 0; i < paragraphs.length; i++) {
              var term = paragraphs[i].text.match(/[\w\d\s.,\/#!$%\^&\*;{}=\-_`~()]+:/)[0]
              var definition = paragraphs[i].text.match(/[\w\d\s.,\/#!$%\^&\*;{}=\-_`~()]+: ([\w\d\s.,\/#!$%\^&\*;{}=\-_`~()]+)/)[1] 
              sd.ocr_info.push([term, definition])
            }
            console.log(sd)
            setScanData(sd)
            setScanOcrInfo(sd.ocr_info)
          })
        
      }*/

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="create-main">
      <ReactTooltip id="default-font" fontFamily="Open Sans" />
      <Popup
        enabled={imageTooLargePopupEnabled}
        setEnabled={setImageTooLargePopupEnabled}
        variant="genericQuizzy+Popup"
        title="Your image is too large!"
        subtitle={
          "Your maximum image size is " +
          MAX_IMG_SIZE_MB_PER_MEMBERSHIP[user.membership] +
          " MB"
        }
        upgradeText="to upload larger images and much more!"
      ></Popup>
      <Popup
        enabled={genericQuizzyPlusPopupEnabled}
        setEnabled={setGenericQuizzyPlusPopupEnabled}
        variant="genericQuizzy+Popup"
        title="Upgrade to Quizzy+ for this feature!"
        subtitle={"This feature is only available to Quizzy+ users."}
      ></Popup>
      <Popup
        enabled={deleteSetPopup}
        setEnabled={setDeleteSetPopup}
        variant="ctaPopupWithIcon"
        title="Delete this set forever?"
        cta="Delete"
        ctaActivate={() => {
          update_set(setdata.id, get_session_token(), "delete", null, () => {
            navigate("https://quizzynow.com/dashboard");
          });
        }}
        ctaIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27.986"
            height="35.987"
            viewBox="0 0 27.986 35.987"
          >
            <path
              id="delete_FILL0_wght400_GRAD0_opsz48"
              d="M12.417,41.987a2.381,2.381,0,0,1-1.858-.875,3.114,3.114,0,0,1-.765-2.124V10.5H8v-3h8.221V6H27.765V7.5h8.221v3H34.193v28.49a3.089,3.089,0,0,1-.787,2.1,2.377,2.377,0,0,1-1.837.9ZM31.57,10.5H12.417v28.49H31.57ZM17.052,34.69h2.624V14.747H17.052Zm7.259,0h2.624V14.747H24.311ZM12.417,10.5v0Z"
              transform="translate(-8 -6)"
              fill="#fff"
            />
          </svg>
        }
        subtitle={
          "By clicking the Delete button, this set and all of its contents will be deleted forever."
        }
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="63.002"
            height="81.014"
            viewBox="0 0 63.002 81.014"
          >
            <path
              id="delete_FILL0_wght400_GRAD0_opsz48"
              d="M17.943,87.014a5.361,5.361,0,0,1-4.184-1.969,7.011,7.011,0,0,1-1.723-4.782V16.127H8V9.376H26.507V6H52.5V9.376H71v6.751H66.966V80.263a6.954,6.954,0,0,1-1.772,4.726,5.351,5.351,0,0,1-4.134,2.025ZM61.06,16.127H17.943V80.263H61.06ZM28.377,70.586h5.906v-44.9H28.377Zm16.341,0h5.906v-44.9H44.718ZM17.943,16.127v0Z"
              transform="translate(-8 -6)"
              fill="#ff4d4d"
            />
          </svg>
        }
      ></Popup>
      <section className="create">
        {errorFound && (
          <AlertMessage
            alertType="error"
            alert="Please fix the following errors before continuing."
          ></AlertMessage>
        )}
        <h1 className="title">
          {is_edit_mode
            ? 'Editing "' + setdata["title"] + '"'
            : "Create a new study set"}
        </h1>
        <MobileView>
          <input
            type="text"
            ref={titleRef}
            className="setname"
            defaultValue={setdata.title}
            name="setname"
            placeholder="Enter the name of your new study set"
            style={
              currentErrors.title.length > 0 ? { border: "1px solid red" } : {}
            }
          ></input>
        </MobileView>
        <BrowserView>
          <input
            type="text"
            ref={titleRef}
            className="setname"
            defaultValue={setdata.title}
            name="setname"
            placeholder="Enter the name of your new study set, like 'Calculus Vocab'"
            style={
              currentErrors.title.length > 0 ? { border: "1px solid red" } : {}
            }
          ></input>
        </BrowserView>
        <a className="error label">{currentErrors.title}</a>
        <div className="desc" data-color-mode="light">
          {/*{<textarea ref={descRef} className="setdesc" name="setdesc" onChange={() => {
                        setDescription(descRef.current.value)
                    }} placeholder={"Enter the description of your new study set, like: \"Contains the vocab for all of Calculus\""} style={currentErrors.description.length > 0 ? {border: "1px solid red"} : {}}>
                   
                </textarea>}*/}

          <MDEditor
            textareaProps={{
              placeholder:
                'Enter the description of your new study set, like: "Contains the vocab for all of Calculus"',
            }}
            value={description}
            onChange={setDescription}
          />
          <a className="error label" style={{ marginTop: "-15px" }}>
            {currentErrors.description}
          </a>
          <div className="settings">
            <div className="setting" id="visibility">
              <div
                data-effect="solid"
                data-tip="This setting controls who can see your set."
                data-for="default-font"
                className="icon"
              >
                <img
                  src={
                    is_edit_mode
                      ? "../../../images/create/visibility.svg"
                      : "images/create/visibility.svg"
                  }
                  alt="visibility"
                ></img>
              </div>
              <div className="info">
                {visibilities[selectedVisibility] != undefined && (
                  <>
                    <h2>
                      {"Visibility: " + visibilities[selectedVisibility][0]}
                    </h2>
                    <a>{visibilities[selectedVisibility][1]}</a>
                  </>
                )}

                <div className="change">
                  <a
                    className="clickable-text"
                    onClick={function () {
                      setVisibilityClicked(!visibilityClicked);
                    }}
                  >
                    Change
                  </a>
                  {visibilityClicked && (
                    <div className="visibility-suggestions">
                      {visibilities.map((vd, index) => (
                        <div
                          className="suggestion"
                          onClick={function () {
                            setVisibilityClicked(false);
                            setSelectedVisibility(index);
                          }}
                        >
                          <a>{vd[0]}</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/*
                        <div className="setting" id="editing">
                        <div className="icon">
                                <img src="images/create/person.svg"></img>
                            </div>
                            <div className="info">
                                <h2>Editing: Only Me</h2>
                                <a>Only you can edit this set</a>
                            </div>
                                </div>*/}
            <div className="setting" id="copying">
              <div
                className="icon"
                data-effect="solid"
                data-tip="This setting controls who can copy your set."
                data-for="default-font"
              >
                <img
                  alt=""
                  src={
                    is_edit_mode
                      ? "../../../images/create/person.svg"
                      : "images/create/person.svg"
                  }
                ></img>
              </div>
              <div className="info">
                <h2>
                  {"Copying: " + copying_permissions[selectedCopySetting][0]}
                </h2>
                <a>{copying_permissions[selectedCopySetting][1]}</a>
                <div className="change">
                  <a
                    className="clickable-text"
                    onClick={function () {
                      setCopyClicked(!copyClicked);
                    }}
                  >
                    Change
                  </a>
                  {copyClicked && (
                    <div className="visibility-suggestions">
                      {copying_permissions.map((vd, index) => (
                        <div
                          className="suggestion"
                          onClick={function () {
                            setCopyClicked(false);
                            setSelectedCopySetting(index);
                          }}
                        >
                          <a>{vd[0]}</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {is_edit_mode && (
                <div className="setting" id="delete">
                  <div className="icon icon-delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22.937"
                      height="25.804"
                      viewBox="0 0 22.937 25.804"
                    >
                      <path
                        id="delete_FILL0_wght400_GRAD0_opsz48"
                        d="M11.62,31.8a2.141,2.141,0,0,1-2.15-2.15V9.225H8V7.075h6.738V6H24.2V7.075h6.738v2.15H29.467V29.653a2.2,2.2,0,0,1-2.15,2.15Zm15.7-22.578H11.62V29.653h15.7Zm-11.9,17.346h2.15v-14.3h-2.15Zm5.949,0h2.15v-14.3h-2.15ZM11.62,9.225v0Z"
                        transform="translate(-8 -6)"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                  <div className="info">
                    <h2>Delete</h2>
                    <a>
                      This set and all data associated with it will be removed.
                    </a>
                    <div className="delete">
                      <p
                        className="clickable-text clickable-text-delete"
                        onClick={() => {
                          setDeleteSetPopup(true);
                        }}
                      >
                        Delete
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="tags">
          {tags.map((tag, index) => (
            <div
              className="tag"
              id={"tag-" + get_tag_color_index(tag)}
              onClick={function () {
                var t = [...tags];
                t.splice(index, 1);
                setTags(t);
              }}
            >
              <a>{tag}</a>
            </div>
          ))}
          {tags.length < 12 && (
            <div className="new-tag-cover">
              <div
                className="new tag"
                onClick={function () {
                  setNewTagClicked(!newTagClicked);
                }}
              >
                <a className="newa">+ Add Tag</a>
              </div>
              {newTagClicked && (
                <input
                  type="text"
                  ref={tagSuggestionBox}
                  className="add-new-tag"
                  name="add-new-tag"
                  placeholder={"Enter more than 3 characters.."}
                  onChange={function () {
                    setTagSuggestions(
                      evaluateTags(tagSuggestionBox.current.value, tags)
                    );
                  }}
                ></input>
              )}
              {newTagClicked && (
                <div className="tag-suggestions">
                  {tagSuggestions.map((tag, index) => (
                    <div
                      className="suggestion"
                      onClick={function () {
                        var t = [...tags];
                        t.push(tag);
                        setTags(t);
                      }}
                    >
                      <a>{tag}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {!is_edit_mode && (
          <div className="import-options">
            <h2 className="section-header">
              How do you want to add the terms?
            </h2>
            <div className="options">
              <div
                className={
                  "option create-new " + (selectedOption == 0 && "current")
                }
                onClick={function () {
                  setSelectedOption(0);
                }}
              >
                <img
                  src={
                    is_edit_mode
                      ? "../../../images/create/create-new.svg"
                      : "images/create/create-new.svg"
                  }
                ></img>
                <a>{"Create new"}</a>
              </div>
              <div
                className={
                  "option import " + (selectedOption == 1 && "current")
                }
                onClick={function () {
                  setSelectedOption(1);
                }}
              >
                <img
                  src={
                    is_edit_mode
                      ? "../../../images/create/import.svg"
                      : "images/create/import.svg"
                  }
                ></img>
                <a>{"Import"}</a>
              </div>
              <div className="combine-option">
                <div
                  className={
                    "option combine " + (selectedOption == 2 && "current")
                  }
                  onClick={function () {
                    if (user.membership < 2) {
                      //    navigate("/quizzyplus")
                      setGenericQuizzyPlusPopupEnabled(true);
                      return false;
                    }
                    setSelectedOption(2);
                  }}
                >
                  <img
                    src={
                      is_edit_mode
                        ? "../../../images/create/combine.svg"
                        : "images/create/combine.svg"
                    }
                  ></img>
                  <a>{"Combine"}</a>
                </div>
                <div className="plus-icon">
                  <a>PLUS</a>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedOption == 0 && (
          <div className="create-new-terms">
            <h2 className="section-header">
              {is_edit_mode ? "Modify your terms" : "Create new terms"}
            </h2>
            <div className="terms" ref={termRef}>
              {termData
                .filter((e) => {
                  return e != undefined && e != null;
                })
                .map((td, index) => (
                  <div className={"row row-" + index}>
                    {/*<p className="label" style={{marginTop: "25px"}}>{"#" + (index + 1)}</p>*/}
                    <div className="front row-div">
                      <div className="term">
                        <a className="label">Front of card</a>
                        <div
                          style={
                            currentErrors.terms[index] != undefined &&
                            currentErrors.terms[index].length > 0
                              ? { border: "1px solid red" }
                              : {}
                          }
                          className="wrapper"
                        >
                          {equationData[index] != undefined &&
                          equationData[index][0] == true ? (
                            <EquationEditor
                              value={equationData[index][1]}
                              readOnly={true}
                              onChange={(eq) => {
                                var previousEquationData = [...equationData];
                                if (previousEquationData[index] === undefined) {
                                  previousEquationData[index] = [];
                                }

                                previousEquationData[index][1] = eq;
                                setEquationData(previousEquationData);
                              }}
                              autoCommands="bar overline sqrt sum prod int alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega rangle langle otimes neq leq ll geq gg approx dagger angle and or infty"
                              autoOperatorNames="sin cos tan"
                            />
                          ) : (
                            <textarea
                              placeholder="Enter term"
                              defaultValue={
                                equationData[index] != undefined
                                  ? equationData[index][1]
                                  : ""
                              }
                              onChange={(e) => {
                                var previousEquationData = [...equationData];
                                if (previousEquationData[index] === undefined) {
                                  previousEquationData[index] = [];
                                }
                                previousEquationData[index][1] = e.target.value;
                                setEquationData(previousEquationData);
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                            ></textarea>
                          )}
                          <div className="equation-wrap">
                            {equationData[index] != undefined &&
                            equationData[index][0] == true ? (
                              <img
                                alt="equation"
                                className={"add-equation add-equation-active"}
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/equation.svg"
                                    : "images/create/equation.svg"
                                }
                                onClick={() => {
                                  var previousEquationData = [...equationData];
                                  if (
                                    previousEquationData[index] === undefined
                                  ) {
                                    previousEquationData[index] = [];
                                  }
                                  previousEquationData[index][0] = false;
                                  setEquationData(previousEquationData);
                                }}
                              ></img>
                            ) : (
                              <img
                                alt="equation"
                                className={"add-equation"}
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/equation.svg"
                                    : "images/create/equation.svg"
                                }
                                onClick={() => {
                                  var previousEquationData = [...equationData];
                                  if (
                                    previousEquationData[index] === undefined
                                  ) {
                                    previousEquationData[index] = [];
                                  }
                                  previousEquationData[index][0] = true;
                                  setEquationData(previousEquationData);
                                }}
                              ></img>
                            )}
                          </div>
                          <div className="image-wrap">
                            <input
                              accept={
                                user.membership > 0
                                  ? "image/png, image/jpeg, image/gif"
                                  : "image/png, image/jpeg"
                              }
                              type="file"
                              className="uploadfile"
                              ref={inputFile}
                              onChange={function (e) {
                                onCardImageUpload(index, 0, e);
                              }}
                            />
                            {previewImageData[index] != undefined &&
                            previewImageData[index][0] != undefined ? (
                              <img
                                alt=""
                                className="image-preview"
                                src={
                                  td[2] ??
                                  URL.createObjectURL(
                                    previewImageData[index][0]
                                  )
                                }
                                onClick={function () {
                                  onCardImageRemoved(index, 0);
                                }}
                              ></img>
                            ) : (
                              <img
                                alt=""
                                className="add-image"
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/img.svg"
                                    : "images/create/img.svg"
                                }
                                onClick={function () {
                                  termRef.current.children[
                                    index
                                  ].children[0].children[0].children[1].children[2].children[0].click();
                                }}
                              ></img>
                            )}
                          </div>
                        </div>
                        <a className="error label">
                          {currentErrors.terms[index]}
                        </a>
                      </div>
                    </div>
                    <div className="back row-div">
                      <div className="term">
                        <a className="label">Back of card</a>
                        <div
                          style={
                            currentErrors.definitions[index] != undefined &&
                            currentErrors.definitions[index].length > 0
                              ? { border: "1px solid red" }
                              : {}
                          }
                          className="wrapper"
                        >
                          {/* Equation Editing */}
                          {equationData[index] != undefined &&
                          equationData[index][2] == true ? (
                            <EquationEditor
                              value={equationData[index][3]}
                              onChange={(eq) => {
                                var previousEquationData = [...equationData];
                                if (previousEquationData[index] === undefined) {
                                  previousEquationData[index] = [];
                                }
                                previousEquationData[index][3] = eq;
                                setEquationData(previousEquationData);
                              }}
                              autoCommands="bar overline sqrt sum prod int alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omikron pi rho sigma tau upsilon phi chi psi omega rangle langle otimes neq leq ll geq gg approx dagger angle and or infty"
                              autoOperatorNames="sin cos tan"
                            />
                          ) : (
                            <textarea
                              placeholder="Enter definition"
                              defaultValue={
                                equationData[index] != undefined
                                  ? equationData[index][3]
                                  : ""
                              }
                              onChange={(e) => {
                                var previousEquationData = [...equationData];
                                if (previousEquationData[index] === undefined) {
                                  previousEquationData[index] = [];
                                }
                                previousEquationData[index][3] = e.target.value;
                                setEquationData(previousEquationData);
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                            ></textarea>
                          )}
                          <div className="equation-wrap">
                            {equationData[index] != undefined &&
                            equationData[index][2] == true ? (
                              <img
                                alt="equation"
                                className={"add-equation add-equation-active"}
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/equation.svg"
                                    : "images/create/equation.svg"
                                }
                                onClick={() => {
                                  var previousEquationData = [...equationData];
                                  if (
                                    previousEquationData[index] === undefined
                                  ) {
                                    previousEquationData[index] = [];
                                  }
                                  previousEquationData[index][2] = false;
                                  setEquationData(previousEquationData);
                                }}
                              ></img>
                            ) : (
                              <img
                                alt="equation"
                                className={"add-equation"}
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/equation.svg"
                                    : "images/create/equation.svg"
                                }
                                onClick={() => {
                                  var previousEquationData = [...equationData];
                                  if (
                                    previousEquationData[index] === undefined
                                  ) {
                                    previousEquationData[index] = [];
                                  }
                                  previousEquationData[index][2] = true;
                                  setEquationData(previousEquationData);
                                }}
                              ></img>
                            )}
                          </div>

                          {/* Image Uploading */}

                          <div className="image-wrap">
                            <input
                              accept={
                                user.membership > 0
                                  ? "image/png, image/jpeg, image/gif"
                                  : "image/png, image/jpeg"
                              }
                              type="file"
                              className="uploadfile"
                              ref={inputFile}
                              onChange={function (e) {
                                onCardImageUpload(index, 1, e);
                              }}
                            />
                            {previewImageData[index] != undefined &&
                            previewImageData[index][1] != undefined ? (
                              <img
                                className="image-preview"
                                src={
                                  td[3]
                                    ? td[3]
                                    : URL.createObjectURL(
                                        previewImageData[index][1]
                                      )
                                }
                                onClick={function () {
                                  onCardImageRemoved(index, 1);
                                }}
                              ></img>
                            ) : (
                              <img
                                className="add-image"
                                src={
                                  is_edit_mode
                                    ? "../../../images/create/img.svg"
                                    : "images/create/img.svg"
                                }
                                onClick={function () {
                                  termRef.current.children[
                                    index
                                  ].children[1].children[0].children[1].children[2].children[0].click();
                                }}
                              ></img>
                            )}
                          </div>
                        </div>
                        <a className="error label">
                          {currentErrors.definitions[index]}
                        </a>
                      </div>
                    </div>
                    {/*<div className="remove-div">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15.719" height="15.719" viewBox="0 0 15.719 15.719">
                    <path id="close_FILL0_wght400_GRAD0_opsz48" d="M11.559,26.069,10.35,24.86,17,18.21l-6.65-6.65,1.209-1.209L18.21,17l6.65-6.65,1.209,1.209-6.65,6.65,6.65,6.65L24.86,26.069l-6.65-6.65Z" transform="translate(-10.35 -10.35)" fill="#fff"/>
                  </svg>
                    <p>Remove</p>
                            </div>*/}
                    {termData.length > 1 && (
                      <p
                        className="error label remove"
                        style={{ marginTop: "25px" }}
                        onClick={() => {
                          var tData = [...termData];
                          var previousEquationData = [...equationData];
                          tData.splice(index, 1);
                          previousEquationData.splice(index, 1);
                          setTermData(tData); //todo
                          setEquationData(previousEquationData);
                          console.log(tData);
                          console.log(previousEquationData);
                        }}
                      >
                        Remove
                      </p>
                    )}
                  </div>
                ))}
            </div>
            <h2 className="section-header add-more-terms">Add more terms</h2>
            <div className="terms-options">
              <div
                className="option add-card"
                onClick={() => {
                  var td = [];
                  for (var i in termRef.current.children) {
                    var obj = termRef.current.children[i];
                    if (obj.children != undefined) {
                      td.push([
                        obj.children[0].children[0].children[1].children[0]
                          .value,
                        obj.children[1].children[0].children[1].children[0]
                          .value,
                      ]);
                    }
                  }
                  td.push(["", ""]); //new card
                  setTermData(td);
                }}
              >
                <div className="image-icon">
                  <img
                    src={
                      is_edit_mode
                        ? "../../../images/create/card.svg"
                        : "images/create/card.svg"
                    }
                  ></img>
                </div>
                <div className="text">
                  <h2>+ Add Card</h2>
                  <a>Add terms and definitions</a>
                </div>
              </div>
              {/*
                            <div className="option scan-image" onClick={() => {
                                
                            }}>
                                <div className="image-icon">
                                    <img src="images/create/scan_img.svg"></img>
                                </div>
                                <div className="text">
                                    <h2>+ Scan Image</h2>
                                    <a>Quickly make flashcards from an image containing terms and definitions</a>
                                </div>
                        </div>*/}
              {/*
                            <div className="option add-diagram">
                                <div className="image-icon">
                                    <img src="images/create/diagram.svg"></img>
                                </div>
                                <div className="text">
                                    <h2>+ Add Diagram</h2>
                                    <a>Add a diagram that you can label</a>
                                </div>
                            </div>
                            <div className="option add-drawing">
                                <div className="image-icon">
                                    <img src="images/create/drawing.svg"></img>
                                </div>
                                <div className="text">
                                    <h2>+ Add Drawing</h2>
                                    <a>Add a drawing that you can use to train muscle memory</a>
                                </div>
                            </div>*/}
            </div>
            {/*
                        <div className="scan-terms-section">
                            <h2 className="section-header scan-terms">Scan Terms</h2>
                            <a className="label">Add an image of a list of terms, and Quizzy will automatically turn it into a Study Set.<br></br>Note: The terms and definitions must be easily readable and in the following format:<br></br>Term: Definition<br></br><span style={{color: "#8358E8"}}>Click here to see an example</span></a>
                            <div className="terms-options">
                            {scanData.image_url == undefined && <div className="option scan-image" onClick={() => {
                                        
                                    }}>
                                        <div className="image-icon">
                                            <img src="images/create/scan_img.svg"></img>
                                        </div>
                                        
                                        <div className="text">
                                            <h2>+ Add Image to Scan</h2>
                                            <a>Add an image to scan for terms and definitions.</a>
                                            <input type="file" name="photo" id="upload-photo" onChange={function(e) {
                                                beginScan(e)
                                            }}/>
                                        </div>
                                    </div>}
                                </div>
                            
                            {scanData.image_url && <div className="image-info">
                                <h2 className="section-header uploaded-image">Uploaded Image</h2>
                                <img src={scanData.image_url}></img>
                                <h2 className="section-header preview">Preview</h2>
                                {scanLogger && <a className="sub-text preview-sub label">{scanLogger.progress < 1 ? ("Quizzy is currently scanning your set, please wait.. (" + Math.ceil(scanLogger.progress * 100) + "%)") : "Scan complete! Find a preview of the new additions to your flashcards below."}</a>}
                              
                                {scan_ocr_info != undefined && 
                                    <div className="terms" ref={importTermRef}>
                                    { 
                                        scan_ocr_info.map((td, index) => ( 
                                            <div className={"row row-" + index}> 
                                                <div className="front row-div">
                                                    <div className="term">
                                                        <a className="label">Front of card</a>
                                                        <div className="wrapper"> 
                                                            <textarea placeholder="Term" readOnly value={td[0]}></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="back row-div">
                                                    <div className="term">
                                                        <a className="label">Back of card</a>
                                                        <div className="wrapper"> 
                                                            <textarea readOnly placeholder="Definition" defaultValue={td[1]}></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    </div>
                                }
                                <div className="scan-options">
                                    <button className="gradient-button add-button">Clear</button>
                                    <button className="gradient-button add-button">Add</button>
                                    
                                </div>
                                
                               
                            </div>}
                        </div>*/}
          </div>
        )}
        {selectedOption == 1 && (
          <div className="import-terms">
            <h2 className="section-header">Import Terms</h2>
            <a className="sub-text">
              You can copy and paste preformatted terms here, and Quizzy will
              automatically convert them into a Set.
            </a>
            <textarea
              className="import-textarea"
              placeholder={importPlaceholder}
              ref={inputBox}
              onChange={function (e) {
                formatImportTermData(inputBox.current.value);
              }}
            ></textarea>
            <div className="separation-settings">
              <div className="character-separation separation-setting">
                <a className="info-text">Term/Definition Separation</a>
                <div className="selection">
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="char-sep"
                      id="tab"
                      value="Tab"
                      checked={selectedCharSeparation == 0}
                      onChange={function (e) {
                        setSelectedCharSeparation(0);
                      }}
                    ></input>
                    <label for="tab">Tab</label>
                    <br></br>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="char-sep"
                      id="comma"
                      value="Comma"
                      checked={selectedCharSeparation == 1}
                      onChange={function (e) {
                        setSelectedCharSeparation(1);
                      }}
                    ></input>
                    <label for="comma">Comma</label>
                    <br></br>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="char-sep"
                      id="semicolon"
                      value="Semicolon"
                      checked={selectedCharSeparation == 2}
                      onChange={function (e) {
                        setSelectedCharSeparation(2);
                      }}
                    ></input>
                    <label for="semicolon">Semicolon</label>
                    <br></br>
                  </div>
                </div>
              </div>
              <div className="new-card-separation separation-setting">
                <a className="info-text">New Card Separation</a>
                <div className="selection">
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="nc-sep"
                      id="newline"
                      value="New line"
                      checked={selectedNewCardSeparation == 0}
                      onChange={function (e) {
                        setSelectedNewCardSeparation(0);
                      }}
                    ></input>
                    <label for="tab">New line</label>
                    <br></br>
                  </div>
                  <div className="radio-button">
                    <input
                      type="radio"
                      name="nc-sep"
                      id="semicolon"
                      value="Semicolon"
                      checked={selectedNewCardSeparation == 1}
                      onChange={function (e) {
                        setSelectedNewCardSeparation(1);
                      }}
                    ></input>
                    <label for="comma">Semicolon</label>
                    <br></br>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="section-header preview">Preview</h2>
            <a className="sub-text preview-sub">
              Find a live preview of what your cards will look like when you're
              done below
            </a>
            {/* Term Stuff */}
            <div className="terms" ref={importTermRef}>
              {importTermData.map((td, index) => (
                <div className={"row row-" + index}>
                  <div className="front row-div">
                    <div className="term">
                      <a className="label">Front of card</a>
                      <div className="wrapper">
                        <textarea
                          placeholder="Term"
                          readOnly
                          value={td[0]}
                        ></textarea>
                        <div className="image-wrap">
                          <input
                            accept="image/*"
                            type="file"
                            className="uploadfile"
                            ref={inputFile}
                            onChange={function (e) {
                              onCardImageUpload(index, 0, e);
                            }}
                          />
                          {previewImageData[index] != undefined &&
                          previewImageData[index][0] != undefined ? (
                            <img
                              className="image-preview"
                              src={URL.createObjectURL(
                                previewImageData[index][0]
                              )}
                              onClick={function () {
                                onCardImageRemoved(index, 0);
                              }}
                            ></img>
                          ) : (
                            <img
                              className="add-image"
                              src={
                                is_edit_mode
                                  ? "../../../images/create/img.svg"
                                  : "images/create/img.svg"
                              }
                              onClick={function () {
                                importTermRef.current.children[
                                  index
                                ].children[0].children[0].children[1].children[1].children[0].click();
                              }}
                            ></img>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="back row-div">
                    <div className="term">
                      <a className="label">Back of card</a>
                      <div className="wrapper">
                        <textarea
                          readOnly
                          placeholder="Definition"
                          defaultValue={td[1]}
                        ></textarea>
                        <div className="image-wrap">
                          <input
                            accept="image/*"
                            type="file"
                            className="uploadfile"
                            ref={inputFile}
                            onChange={function (e) {
                              onCardImageUpload(index, 1, e);
                            }}
                          />
                          {previewImageData[index] != undefined &&
                          previewImageData[index][1] != undefined ? (
                            <img
                              className="image-preview"
                              src={URL.createObjectURL(
                                previewImageData[index][1]
                              )}
                              onClick={function () {
                                onCardImageRemoved(index, 1);
                              }}
                            ></img>
                          ) : (
                            <img
                              className="add-image"
                              src={
                                is_edit_mode
                                  ? "../../../images/create/img.svg"
                                  : "images/create/img.svg"
                              }
                              onClick={function () {
                                termRef.current.children[
                                  index
                                ].children[1].children[0].children[1].children[1].children[0].click();
                              }}
                            ></img>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedOption == 2 && (
          <div className="combine-sets">
            <div className="plus-feature-header">
              <h2 className="section-header">Combine Terms</h2>
              <div className="plus-icon">
                <a>PLUS</a>
              </div>
            </div>
            <a className="sub-text">
              You can combine premade sets and turn them into your own study
              set. <br></br>
              <br></br>Note: You must have edit permissions in order to combine
              sets.
            </a>
            {combineData.length > 0 && (
              <div className="combine-links">
                {combineData.map((link) => (
                  <div className="link">
                    <a className="label">
                      {"Added: " + link[0]}
                      <span style={{ color: "#7B7B7B" }}>
                        {" (" + link[1] + " terms)"}
                      </span>
                      <a
                        style={{
                          color: "red",
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                        onClick={function () {
                          var cd = [...combineData];
                          cd.forEach(function (element, index) {
                            if (element[2] == link[2]) {
                              cd.splice(index, 1);
                            }
                            setCombineData(cd);
                            setCombineErrorMessage(null);
                          });
                        }}
                      >
                        {" "}
                        Remove
                      </a>
                    </a>
                  </div>
                ))}
              </div>
            )}
            {combineErrorMessage != undefined && (
              <a className="sub-text" style={{ color: "red" }}>
                {combineErrorMessage}
              </a>
            )}
            <div className="wrapper">
              <a className="label">Set Link</a>
              <input
                type="text"
                ref={setLinkRef}
                placeholder="Enter set link"
              ></input>
            </div>
            <button
              onClick={function () {
                var cd = [...combineData];
                var linkUrl = setLinkRef.current.value;
                var urlObject = null;
                try {
                  urlObject = new URL(linkUrl);
                } catch (e) {
                  setCombineErrorMessage(
                    "Error: You provided an invalid set link."
                  );
                  return false;
                }
                var setId = urlObject.pathname.match(/study\/([\d]+)/)[1];
                if (setId == null) {
                  setCombineErrorMessage(
                    "Error: You provided an invalid set link."
                  );
                  return false;
                }
                get_set_data(setId, get_session_token(), function (sd) {
                  if (
                    sd["title"] != undefined &&
                    sd["terms"] != undefined &&
                    sd["terms"].length > 0
                  ) {
                    var setDataAlreadyExists = false;
                    cd.forEach((element) => {
                      if (element[2] == setId) {
                        setDataAlreadyExists = true;
                      }
                    });
                    if (setDataAlreadyExists) {
                      setCombineErrorMessage("Error: This set already exists.");
                      return false;
                    }
                    if (cd.length > MAXIMUM_COMBINE_LENGTH) {
                      setCombineErrorMessage(
                        "Error: You can't combine more than 10 sets."
                      );
                      return false;
                    }
                    cd.push([sd["title"], sd["terms"].length, setId, sd]);
                    setCombineData(cd);
                    setCombineErrorMessage(null);
                  } else {
                    if (sd["error"] && sd["error"] == "access denied") {
                      setCombineErrorMessage(
                        "Error: You do not have access to copy this set."
                      );
                    } else {
                      setCombineErrorMessage(
                        "Error: The specified Study Set was not found."
                      );
                    }

                    return false;
                  }
                });
              }}
            >
              Add
            </button>
          </div>
        )}
        <div className="create-cover">
          <button
            className={
              "create-button " + (createButtonEnabled ? "enabled" : "disabled")
            }
            onClick={function () {
              // verify
              var errorFound = false;
              var err = { ...currentErrors };
              if (titleRef.current.value.length == 0) {
                err.title = "Your title is empty.";
                errorFound = true;
              } else {
                err.title = "";
              }
              if (description.length == 0) {
                err.description = "Your description is empty.";
                errorFound = true;
                scrollToTop();
              } else {
                err.description = "";
              }

              // get updated term data
              var td = [];
              if (selectedOption == 0) {
                for (var i in equationData) {
                  var termUsesEquation = equationData[i][0];
                  var term = equationData[i][1];
                  var defUsesEquation = equationData[i][2];
                  var def = equationData[i][3];
                  if (term.length === 0) {
                    err.terms[i] = "This term is empty";
                    errorFound = true;
                  }
                  if (def.length === 0) {
                    err.definitions[i] = "This definition is empty";
                    errorFound = true;
                  }
                  td.push([term, def, termUsesEquation, defUsesEquation]);
                }
              } else if (selectedOption == 1) {
                for (var i in importTermRef.current.children) {
                  var obj = importTermRef.current.children[i];
                  if (obj.children != undefined) {
                    td.push([
                      obj.children[0].children[0].children[1].children[0].value,
                      obj.children[1].children[0].children[1].children[0].value,
                    ]);
                  }
                }
              } else if (selectedOption == 2) {
                if (combineData.length < 1) {
                  setCombineErrorMessage("Error: You have 0 sets added.");
                }
                if (combineErrorMessage) {
                  return false;
                }
                var combineData_Id_only = [];
                combineData.forEach(function (element, index) {
                  combineData_Id_only.push(element[2]);
                });
                return create_set_from_combine(
                  titleRef.current.value,
                  descRef.current.value,
                  selectedVisibility,
                  selectedCopySetting,
                  tags,
                  combineData_Id_only
                ).then(function (response) {
                  response.json().then(function (data) {
                    console.log(data);
                    var urlSafeTitle = data.title
                      .replace(/\s+/g, "-")
                      .toLowerCase();
                    navigate("/study/" + data.setid + "/" + urlSafeTitle);
                  });
                });
              }
              setErrorFound(errorFound);
              if (errorFound) {
                setCurrentErrors(err);
                return false;
              }
              if (!createButtonEnabled) {
                return false;
              }
              if (is_edit_mode) {
                edit_set(
                  get_session_token(),
                  setdata.id,
                  titleRef.current.value,
                  description,
                  td,
                  selectedVisibility,
                  selectedCopySetting,
                  tags,
                  previewImageData
                ).then(function (response) {
                  response.json().then(function (data) {
                    console.log(data);
                    var urlSafeTitle = titleRef.current.value
                      .replace(/\s+/g, "-")
                      .toLowerCase();
                    navigate("/study/" + setdata.id + "/" + urlSafeTitle);
                  });
                });
              } else {
                create_set(
                  get_session_token(),
                  titleRef.current.value,
                  description,
                  td,
                  selectedVisibility,
                  selectedCopySetting,
                  tags,
                  previewImageData
                ).then(function (response) {
                  response.json().then(function (data) {
                    console.log(data);
                    var urlSafeTitle = data.title
                      .replace(/\s+/g, "-")
                      .toLowerCase();
                    navigate("/study/" + data.setid + "/" + urlSafeTitle);
                    //<Navigate to={"study/" + data.id + "/" + data.title.replace(/\s+/g, '-').toLowerCase()}></Navigate>
                  });
                });
              }
            }}
          >
            Create
          </button>
        </div>
      </section>
    </main>
  );
}

export default Create;
