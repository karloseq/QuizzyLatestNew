import React from "react";
import {
  BsArrowLeft,
  BsArrowRightShort,
  BsExclamationCircle,
} from "react-icons/bs";
import ProgressBar from "@ramonak/react-progress-bar";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.jsx";
import "./QuizFinished.scss";

const QuizFinished = () => {
  var studyTimeDistrib = {
    labels: [],
    // data: [0, 100],
    bgColor: "#71EAA2",
    textColor: "#71EAA2",
    textInside: "B+",
    rotate: 0,
    divider: 2.6,
  };

  var test = {
    labels: [],
    // data: [0, 100],
    bgColor: "#F5B041",
    textColor: "#F5B041",
    textInside: "C",
    rotate: 0,
    divider: 2.6,
  };

  var test2 = {
    labels: [],
    // data: [0, 100],
    bgColor: "#FF4D4D",
    textColor: "#FF4D4D",
    textInside: "F-",
    rotate: 0,
    divider: 2.6,
  };

  return (
    <div className="quiz-finished-container">
      <div className="quiz-finished-top">
        <div className="quiz-finished-top-left">
          <h3 className="title">
            <BsArrowLeft className="right-arrow-icon" /> Accounting Terms
            Practice Exam
          </h3>
          <h5 className="sub-title">Finished Exam</h5>
          <button>Viewing Results</button>
        </div>
        <div className="quiz-finished-top-center">
          <div className="progress-cont">
            <h3 className="score-title">Your score</h3>
            <ProgressBar
              completed={85}
              isLabelVisible={false}
              bgColor="#71EAA2"
              height="15px"
            />
            <p className="progress-percent">85% correct</p>
          </div>
          <h3 className="grade">B+</h3>
        </div>
      </div>
      <div className="quiz-finished-center">
        <div className="quiz-finished-center-left">
          <h4 className="title">Questions</h4>
          <div className="questions-container">
            <div className="question">1</div>
            <div className="question">2</div>
            <div className="question">3</div>
            <div className="question">4</div>
            <div className="question">5</div>
            <div className="question">6</div>
            <div className="question">7</div>
            <div className="question">8</div>
            <div className="question">9</div>
            <div className="question">10</div>
            <div className="question">11</div>
            <div className="question">12</div>
          </div>
        </div>
        <div className="quiz-finished-center-center">
          <h2>Your score</h2>
          <div className="chart-container">
            <DoughnutChart config={studyTimeDistrib} />
          </div>
          <h2 className="">You got 15 out of 20 questions correct.</h2>
          <p>Good job! that's 4 more questions correct than your last test!</p>
          <div className="btn-container">
            <button className="review-btn">
              Review
              <div className="exclamation-icon-cont">
                <BsExclamationCircle className="exclamation-icon" />
              </div>
            </button>
            <button className="details-btn">
              Details
              <div className="arrow-icon-cont">
                <BsArrowRightShort className="arrow-icon" />
              </div>
            </button>
          </div>
        </div>
        <div className="quiz-finished-center-right">
          <h4 className="title">Previous practice tests</h4>
          <div className="test-card-container">
            <div className="test-card">
              <h4>Test #2</h4>
              <DoughnutChart config={test} />
            </div>
            <div className="test-card test-card-2">
              <h4>Test #1</h4>
              <DoughnutChart config={test2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizFinished;
