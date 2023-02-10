import React, { useEffect, useRef, useState } from "react";
import {
  edit_set,
  get_session_token,
  get_set_data,
  get_tag_color_index,
} from "../../network/communication";
import "./Edit.scss";

import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  TAG_SUGGESTIONS,
  evaluateTags,
  MAX_IMG_SIZE_MB_PER_MEMBERSHIP,
} from "../../constants/constants";
import Popup from "../../components/Popup/Popup";

import Tesseract from "tesseract.js";

function Edit(props) {
  const navigate = useNavigate();

  const MEGABYTE = 1000000;
  const { setid, title } = useParams("");

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

  const [expectedTitle, setExpectedTitle] = useState(null);
  const [setdata, setSetData] = useState({});

  const [currentErrors, setCurrentErrors] = useState({
    title: "",
    description: "",
    terms: [],
    definitions: [],
  });

  const [createButtonEnabled, setCreateButtonEnabled] = useState(true); //currently not used

  const [previewImageData, setPreviewImageData] = useState([]);

  const [combineData, setCombineData] = useState([]);
  const [combineErrorMessage, setCombineErrorMessage] = useState(null);
  const MAXIMUM_COMBINE_LENGTH = 10;

  const [imageTooLargePopupEnabled, setImageTooLargePopupEnabled] =
    useState(false);
  const [genericQuizzyPlusPopupEnabled, setGenericQuizzyPlusPopupEnabled] =
    useState(false);
    const [deleteSetPopup, setDeleteSetPopup] =
    useState(true);

  const setLinkRef = useRef(null);
  const termRef = useRef(null);
  const importTermRef = useRef(null);
  const tagSuggestionBox = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const inputFile = useRef(null);
  const inputBox = useRef(null);

  const visibilities = [
    ["Public", "Everyone will be able see this set."],
    ["Friends", "Only your friends will be able to see this set."],
    /*["Specified", "Only these users will be able to see this set."],*/
    ["Private", "Only you will be able to see this set."],
  ];

  const visibilityToIndex = {
    public: 0,
    "friends-only": 1,
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

  var user = props.user;

  var importPlaceholder = ``;

  var CHAR_SEPARATION_CHART = [" ", ",", ";"];

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
    var td = [...termData];
    td[index][2 + i] = null;
    setTermData(td);
    setPreviewImageData(pid);
  };

  useEffect(() => {
    get_set_data(setid, get_session_token(), function (data) {
      setSetData(data);
      setExpectedTitle(
        !data["title"] ? "ERROR" : title.replace(/\s+/g, "-").toLowerCase()
      );

      if (!data["title"] || !data["editable"]) {
        navigate("/404");
      }

      setTermData(data.terms);
      setTags(data.tags);
      setSelectedVisibility(visibilityToIndex[data.visibility]);
      setSelectedCopySetting(copyRightsToIndex[data.copy_rights]);
      document.title = "Editing " + data.title + " - Quizzy";
    });
  }, []);

  console.log(termData);

  return (
    <main className="create-main">
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
        variant="deletePopup"
        title="Delete this set forever?"
        subtitle={"Are you sure you want to delete this set and all of its contents?"}
      ></Popup>
      {setdata.title && (
        <section className="create">
          <h1 className="title">{'Editing "' + setdata["title"] + '"'}</h1>
          <input
            type="text"
            ref={titleRef}
            className="setname"
            name="setname"
            placeholder="Enter the name of your new study set, like 'Calculus Vocab'"
            defaultValue={setdata.title}
            style={
              currentErrors.title.length > 0 ? { border: "1px solid red" } : {}
            }
          ></input>
          <a className="error label">{currentErrors.title}</a>
          <div className="desc">
            <textarea
              ref={descRef}
              defaultValue={setdata.description}
              className="setdesc"
              name="setdesc"
              placeholder={
                'Enter the description of your new study set, like: "Contains the vocab for all of Calculus"'
              }
              style={
                currentErrors.description.length > 0
                  ? { border: "1px solid red" }
                  : {}
              }
            ></textarea>

            <div className="settings">
              <div className="setting" id="visibility">
                <div className="icon">
                  <img src="/images/create/visibility.svg"></img>
                </div>
                <div className="info">
                  <h2>
                    {"Visibility: " + visibilities[selectedVisibility][0]}
                  </h2>
                  <a>{visibilities[selectedVisibility][1]}</a>
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
                <div className="icon">
                  <img src="/images/create/person.svg"></img>
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
                <div className="setting" id="delete">
                <div className="icon icon-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="22.937" height="25.804" viewBox="0 0 22.937 25.804">
                    <path id="delete_FILL0_wght400_GRAD0_opsz48" d="M11.62,31.8a2.141,2.141,0,0,1-2.15-2.15V9.225H8V7.075h6.738V6H24.2V7.075h6.738v2.15H29.467V29.653a2.2,2.2,0,0,1-2.15,2.15Zm15.7-22.578H11.62V29.653h15.7Zm-11.9,17.346h2.15v-14.3h-2.15Zm5.949,0h2.15v-14.3h-2.15ZM11.62,9.225v0Z" transform="translate(-8 -6)" fill="#fff"/>
                    </svg>
                    </div>
                    <div className="info">
                        <h2>Delete</h2>
                        <a>This set and all data associated with it will be removed.</a>
                        <div className="delete">
                            <p className="clickable-text clickable-text-delete" onClick={() => {
                                setDeleteSetPopup(!deleteSetPopup);
                            }}>
                                Delete
                            </p>
                        </div>
                    </div>
                    
                        </div>
              </div>
            </div>
          </div>
          <a className="error label">{currentErrors.description}</a>
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

          <div className="create-new-terms">
            <h2 className="section-header">Your terms</h2>
            <div className="terms" ref={termRef}>
              {termData.map((td, index) => (
                <div className={"row row-" + index}>
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
                        <textarea
                          placeholder="Enter term"
                          defaultValue={td[0]}
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
                          {td[2] != undefined ||
                          (previewImageData[index] != undefined &&
                            previewImageData[index][0] != undefined) ? (
                            <img
                              alt="preview"
                              className="image-preview"
                              src={
                                td[2] ??
                                URL.createObjectURL(previewImageData[index][0])
                              }
                              onClick={function () {
                                onCardImageRemoved(index, 0);
                              }}
                            ></img>
                          ) : (
                            <img
                              alt="add img"
                              className="add-image"
                              src="/images/create/img.svg"
                              onClick={function () {
                                termRef.current.children[
                                  index
                                ].children[0].children[0].children[1].children[1].children[0].click();
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
                        <textarea
                          placeholder="Enter definition"
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
                          {td[3] != undefined ||
                          (previewImageData[index] != undefined &&
                            previewImageData[index][1] != undefined) ? (
                            <img
                              alt="preview"
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
                              alt="add img"
                              className="add-image"
                              src="/images/create/img.svg"
                              onClick={function () {
                                termRef.current.children[
                                  index
                                ].children[1].children[0].children[1].children[1].children[0].click();
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
                </div>
              ))}
            </div>
            <h2 className="section-header add-more-terms">Add more terms</h2>
            <div className="terms-options">
              <div
                className="option add-card"
                onClick={() => {
                  var td = [...termData];
                  /*for (var i in termRef.current.children) {
                                    var obj = termRef.current.children[i];
                                    if (obj.children != undefined) {
                                        td.push([obj.children[0].children[0].children[1].children[0].value, obj.children[1].children[0].children[1].children[0].value])
                                    }
                                }*/
                  td.push(["", ""]); //new card
                  setTermData(td);
                }}
              >
                <div className="image-icon">
                  <img src="/images/create/card.svg"></img>
                </div>
                <div className="text">
                  <h2>+ Add Card</h2>
                  <a>Add terms and definitions</a>
                </div>
              </div>
            </div>
          </div>
          <div className="create-cover">
            <button
              className={
                "create-button " +
                (createButtonEnabled ? "enabled" : "disabled")
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
                if (descRef.current.value.length == 0) {
                  err.description = "Your description is empty.";
                  errorFound = true;
                } else {
                  err.title = "";
                }

                // get updated term data
                var td = [];
                if (selectedOption == 0) {
                  for (var i in termRef.current.children) {
                    var obj = termRef.current.children[i];
                    if (obj.children != undefined) {
                      var term =
                        obj.children[0].children[0].children[1].children[0]
                          .value;
                      var def =
                        obj.children[1].children[0].children[1].children[0]
                          .value;
                      if (term.length == 0) {
                        err.terms[i] = "This term is empty";
                        errorFound = true;
                      } else {
                        err.terms[i] = "";
                      }
                      if (def.length == 0) {
                        err.definitions[i] = "This definition is empty";
                        errorFound = true;
                      } else {
                        err.definitions[i] = "";
                      }
                      td.push([term, def, termData[i][2], termData[i][3]]);
                    }
                  }
                }

                if (errorFound) {
                  setCurrentErrors(err);
                  return false;
                }
                if (!createButtonEnabled) {
                  return false;
                }
                edit_set(
                  get_session_token(),
                  setdata.id,
                  titleRef.current.value,
                  descRef.current.value,
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
                    //<Navigate to={"study/" + data.id + "/" + data.title.replace(/\s+/g, '-').toLowerCase()}></Navigate>
                  });
                });
              }}
            >
              Update
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default Edit;
