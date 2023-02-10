import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FiArrowRight } from "react-icons/fi";
import "./PracticeExamOption.scss";

const PracticeExamOption = () => {
  return (
    <div className="practice-exam-container">
      <div className="practice-exam-option">
        <div className="practice-exam-container">
          <div className="practice-exam-top">
            <div className="practice-exam-top-left">
              <div className="title"></div>
              <div className="sub-title"></div>
            </div>
          </div>
          <div className="practice-exam-center">
            <div className="practice-exam-center-left">
              <div className="title"></div>
              <div className="questions-container">
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
                <div className="question"></div>
              </div>
            </div>
            <div className="practice-exam-center-right">
              <div className="practice-exam-center-right-top">
                <div className="sub-title"></div>
                <div className="title-container">
                  <div className="title"></div>
                </div>
              </div>
              <div className="practice-exam-center-right-bottom">
                <div>
                  <div className="answer-cont"></div>
                  <div className="answer-cont"></div>
                  <div className="answer-cont"></div>
                  <div className="answer-cont"></div>
                </div>

                <div className="btn-container">
                  <button className="prev-btn"></button>
                  <button className="next-btn"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="practice-exam-main">
        <div className="container">
          <h3 className="title">Practice Exam Options</h3>
          <div className="container-top">
            <div className="container-top-radio">
              <p>Audio</p>
              <div className="radio-container">
                <div>
                  <label for="on">
                    <input
                      id="on"
                      type="radio"
                      name="audio"
                      checked="checked"
                    />
                    <span></span>
                    On
                  </label>
                </div>
                <div>
                  <label for="off">
                    <input id="off" type="radio" name="audio" />
                    <span></span>
                    Off
                  </label>
                </div>
              </div>
            </div>
            <div className="container-top-radio">
              <p>Answer with</p>
              <div className="radio-container">
                <div>
                  <label for="term">
                    <input
                      id="term"
                      type="radio"
                      name="answer-with"
                      checked="checked"
                    />
                    <span></span>
                    Term
                  </label>
                </div>
                <div>
                  <label for="definition">
                    <input id="definition" type="radio" name="answer-with" />
                    <span></span>
                    Definition
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="container-center">
            <div className="checkbox-container">
              <p>Types of questions</p>
              <div className="radio-container">
                <div>
                  <label for="true-false">
                    <input
                      id="true-false"
                      type="checkbox"
                      name="types-of-questions"
                    />
                    True/False
                  </label>
                </div>
                <div>
                  <label for="multiple-choice">
                    <input
                      id="multiple-choice"
                      type="checkbox"
                      name="types-of-questions"
                    />
                    Multiple Choice
                  </label>
                </div>
                <div>
                  <label for="matching">
                    <input
                      id="matching"
                      type="checkbox"
                      name="types-of-questions"
                    />
                    Matching
                  </label>
                </div>
                <div>
                  <label for="short-answer">
                    <input
                      id="short-answer"
                      type="checkbox"
                      name="types-of-questions"
                    />
                    Short Answer
                  </label>
                </div>
              </div>
            </div>
            <div className="container-top-radio">
              <p>Types of terms</p>
              <div className="radio-container">
                <div>
                  <label for="all-term">
                    <input
                      id="all-term"
                      type="radio"
                      name="types-of-terms"
                      checked="checked"
                    />
                    <span></span>
                    All terms
                  </label>
                </div>
                <div>
                  <label for="difficult">
                    <input id="difficult" type="radio" name="types-of-terms" />
                    <span></span>
                    Most difficult only
                  </label>
                </div>
              </div>
              <div className="images-radio-cont">
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
          </div>
          <div className="container-bottom">
            <div className="container-bottom-top">
              <div className="box">
                <p>Number of Questions</p>
                <div className="box-cont">
                  <input type="text" />
                  <div className="btn-cont">
                    <button>
                      <IoIosArrowUp />
                    </button>
                    <button>
                      <IoIosArrowDown />
                    </button>
                  </div>
                </div>
              </div>
              <div className="box">
                <p>Time</p>
                <div className="box-cont">
                  <input type="text" />
                  <div className="btn-cont">
                    <button>
                      <IoIosArrowUp />
                    </button>
                    <button>
                      <IoIosArrowDown />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-bottom">
              <p>Email Results</p>
              <div className="email-cont">
                <input type="email" placeholder="Enter email address" />
              </div>
            </div>
          </div>

          <div className="create-btn-cont">
            <button className="create-btn">
              Create{" "}
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

export default PracticeExamOption;
