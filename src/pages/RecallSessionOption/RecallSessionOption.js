import React from "react";
import { FiArrowRight } from "react-icons/fi";
import RangeSlider from "react-range-slider-input";

import "./RecallSessionOption.scss";

const RecallSessionOption = () => {
  return (
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
            <div className="container-top-radio">
              <p>Email Notification</p>
              <div className="radio-container">
                <div>
                  <label for="email-on">
                    <input
                      id="email-on"
                      type="radio"
                      name="email-notification"
                      checked="checked"
                    />
                    <span></span>
                    On
                  </label>
                </div>
                <div>
                  <label for="email-off">
                    <input
                      id="email-off"
                      type="radio"
                      name="email-notification"
                    />
                    <span></span>
                    Off
                  </label>
                </div>
              </div>
            </div>
            <div className="container-top-radio">
              <p>Images</p>
              <div className="radio-container">
                <div>
                  <label for="image-on">
                    <input
                      id="image-on"
                      type="radio"
                      name="images"
                      checked="checked"
                    />
                    <span></span>
                    On
                  </label>
                </div>
                <div>
                  <label for="image-off">
                    <input id="image-off" type="radio" name="images" />
                    <span></span>
                    Off
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="container-center">
            <div className="container-top-radio">
              <p>Audio</p>
              <div className="radio-container">
                <div>
                  <label for="audio-on">
                    <input
                      id="audio-on"
                      type="radio"
                      name="audio"
                      checked="checked"
                    />
                    <span></span>
                    On
                  </label>
                </div>
                <div>
                  <label for="audio-off">
                    <input id="audio-off" type="radio" name="audio" />
                    <span></span>
                    Off
                  </label>
                </div>
              </div>
            </div>
            <div className="container-top-radio">
              <p>Smart Completion</p>
              <div className="radio-container">
                <div>
                  <label for="smart-completion-on">
                    <input
                      id="smart-completion-on"
                      type="radio"
                      name="smart-completion"
                 
                    />
                    <span></span>
                    On
                  </label>
                </div>
                <div>
                  <label for="smart-completion-off">
                    <input
                      id="smart-completion-off"
                      type="radio"
                      name="smart-completion"
                    />
                    <span></span>
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
                Quizzy will schedule Recall Sessions often.
              </p>
            </div>
            <div className="center">
              <RangeSlider
                defaultValue={[0, 50]}
                thumbsDisabled={[true, false]}
                rangeSlideDisabled={true}
                className="range-slider"
              />
            </div>
            <div className="bottom">
              <p className="title">Your Test Date is next week.</p>
              <p className="sub-title">
                Quizzy will schedule Recall Sessions for this set to put you in
                the best spot to get that A.
              </p>
            </div>
          </div>
          <div className="create-btn-cont">
            <button className="create-btn">
              Begin{" "}
              <div className="arrow-icon-cont">
                <FiArrowRight />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecallSessionOption;
