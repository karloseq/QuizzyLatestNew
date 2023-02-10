import "./App.css"; //npm run build to build
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, { useEffect, useState } from "react";

import { Suspense, lazy } from "react";

import { Provider } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

import store from "./store";

import LoadingPage from "./pages/Loading/Loading";
import { post_to_server, update_status } from "./network/communication.js";
import { HelmetProvider } from "react-helmet-async";
import QuizExam from "./pages/QuizExam/QuizExam";
import QuizFinished from "./pages/QuizFinished/QuizFinished";
import PracticeExamOption from "./pages/PracticeExamOption/PracticeExamOption";
import RecallSessionOption from "./pages/RecallSessionOption/RecallSessionOption";
import "react-range-slider-input/dist/style.css";
import SupportSection from "./pages/SupportSection/SupportSection";
import SupportArticle from "./pages/SupportArticle/SupportArticle";

const Index = lazy(() => import("./pages/Index/Index"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail/VerifyEmail"));
const VerifyEmailSuccess = lazy(() =>
  import("./pages/VerifyEmailSuccess/VerifyEmailSuccess")
);
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Dashboard_Study = lazy(() =>
  import("./pages/Dashboard-Study/Dashboard-Study")
);
const Dashboard_Friends = lazy(() =>
  import("./pages/Dashboard-Friends/Dashboard-Friends")
);
const Dashboard_Changelog = lazy(() =>
  import("./pages/Dashboard-Changelog/Dashboard-Changelog")
);
const Header = lazy(() => import("./components/Header/Header"));
const Footer = lazy(() => import("./components/Footer/Footer"));
const QuizzyPlus = lazy(() => import("./pages/QuizzyPlus/QuizzyPlus"));
const Purchase = lazy(() => import("./pages/Purchase/Purchase"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const Create = lazy(() => import("./pages/Create/Create"));
const Jobs = lazy(() => import("./pages/Jobs/Jobs"));

const ThanksForPurchase = lazy(() =>
  import("./pages/Purchase/ThanksForPurchase/ThanksForPurchase")
);
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Study = lazy(() => import("./pages/Study/Study"));
const Recall = lazy(() => import("./pages/Recall/Recall"));

const Support = lazy(() => import("./pages/Support/Support"));

const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Tag = lazy(() => import("./pages/Tag/Tag"));
const User = lazy(() => import("./pages/User/User"));
const User_Friends = lazy(() => import("./pages/User-Friends/User-Friends"));
const User_Sets = lazy(() => import("./pages/User-Sets/User-Sets"));

const Search = lazy(() => import("./pages/Search/Search"));

function App() {
  const [user, setUser] = useState({
    name: "",
    success: false,
    schedule: [],
    recent_schedule: [],
    friends: {},
    streak: 0,
    today: {
      most_difficult_terms: {},
      pending: 0,
      completed: 0,
      std: {},
      study_time: 0,
      streak_saved: 0,
    },
    streak_calendar: { this_month: [] },
    email_verified: true,
  });

  useEffect(() => {
    update_status("online");
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      update_status("offline");
    });
  }, []);

  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
          <Suspense fallback={<LoadingPage />}>
            <Header user={user} setUser={setUser} />
            <Routes>
              <Route index element={<Index /*user = {user}*/ />} />
              <Route
                path="/verify-email"
                element={<VerifyEmail user={user} setUser={setUser} />}
              />
              <Route
                path="/verify-email-success"
                element={<VerifyEmailSuccess user={user} setUser={setUser} />}
              />
              <Route
                path="/about-us"
                element={<AboutUs user={user} setUser={setUser} />}
              />
              <Route
                path="/create"
                element={<Create user={user} setUser={setUser} />}
              />
              <Route
                path="/dashboard"
                element={<Dashboard user={user} setUser={setUser} />}
              />
              <Route
                path="/dashboard/study"
                element={<Dashboard_Study user={user} setUser={setUser} />}
              />
              <Route
                path="/dashboard/friends"
                element={<Dashboard_Friends user={user} setUser={setUser} />}
              />
              <Route
                path="/dashboard/changelog"
                element={<Dashboard_Changelog user={user} setUser={setUser} />}
              />
              <Route
                path="/quizzyplus"
                element={<QuizzyPlus user={user} setUser={setUser} />}
              />
              <Route
                path="/quizzyplus/purchase"
                element={<Purchase user={user} setUser={setUser} />}
              />
              <Route
                path="/quizzyplus/purchase/thanks"
                element={<ThanksForPurchase user={user} setUser={setUser} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/quiz-exam" element={<QuizExam />} />
              <Route path="/quiz-finished" element={<QuizFinished />} />
              <Route path="/support" element={<Support/>}/>
              <Route path="/support/sections/:section" element={<SupportSection/>}/>
              <Route path="/support/sections/:section/:id/:article" element={<SupportArticle/>}/>
              <Route
                path="/practice-exam-option"
                element={<PracticeExamOption />}
              />
              <Route
                path="/recall-session-option"
                element={<RecallSessionOption />}
              />
              <Route
                path="/search/:query"
                element={<Search user={user} setUser={setUser} />}
              />
              <Route
                path="/study/:setid/:title"
                element={<Study user={user} setUser={setUser} />}
              />
              <Route
                path="/study/:setid/:title/recall"
                element={<Recall user={user} setUser={setUser} />}
              />
              <Route
                path="/study/:setid/:title/quiz"
                element={<QuizExam user={user} setUser={setUser} />}
              />
              <Route
                path="/study/:setid/:title/quiz/:id/results"
                element={<QuizExam user={user} setUser={setUser} />}
              />
              <Route
                path="/study/:setid/:title/edit"
                element={<Create user={user} setUser={setUser} edit={true}/>}
              />
              <Route path="/tag/:tag" element={<Tag />} />
              <Route
                path="/users/:userid"
                element={<User me={user} setUser={setUser} />}
              />
              <Route
                path="/users/:userid/friends"
                element={<User_Friends me={user} setUser={setUser} />}
              />`1`
              <Route
                path="/users/:userid/sets"
                element={<User_Sets me={user} setUser={setUser} />}
              />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/*" element={<Navigate to="/404" />} />
              <Route path="/404" element={<NotFound />} />
            </Routes>
            <Footer user={user} setUser={setUser} />
          </Suspense>
        </Router>
      </Provider>
    </HelmetProvider>
  );
}

export default App;
