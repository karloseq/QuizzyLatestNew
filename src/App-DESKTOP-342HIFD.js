import "./App.css"; //npm run build to build
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, { useState } from "react";

import { Suspense, lazy } from "react";

import { Provider } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

import store from "./store";

import LoadingPage from "./pages/Loading/Loading";
import {post_to_server } from "./network/communication.js";

const Index = lazy(() => import("./pages/Index/Index"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail/VerifyEmail"));
const VerifyEmailSuccess = lazy(() => import("./pages/VerifyEmailSuccess/VerifyEmailSuccess"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Header = lazy(() => import("./components/Header/Header"));
const QuizzyPlus = lazy(() => import("./pages/QuizzyPlus/QuizzyPlus"));
const Purchase = lazy(() => import("./pages/Purchase/Purchase"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const Create = lazy(() => import("./pages/Create/Create"));

const ThanksForPurchase = lazy(() =>
  import("./pages/Purchase/ThanksForPurchase/ThanksForPurchase")
);
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Study = lazy(() => import("./pages/Study/Study"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Tag = lazy(() => import("./pages/Tag/Tag"))
const User = lazy(() => import('./pages/User/User'))

function App() { //{loggedIn ? <Dashboard /> : <Navigate to="/login"/>} />
 // const loggedIn = useSelector((state) => state.user.loggedIn);
 /*const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  function SetUser(u) {
    localStorage.setItem("user", JSON.stringify(u))
    setUser(u);
  }*/
  const [user, setUser] = useState({name: "", success: true, schedule: [], recent_schedule: [], friends: {}, streak: 0, today: {pending: 0, completed: 0, std: {}, study_time: 0, streak_saved: 0}, streak_calendar: {this_month: []}, email_verified: true});

  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingPage />}>
          <Header user={user} setUser={setUser}/>
          <Routes>
            <Route index element={<Index /*user = {user}*//>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-success" element={<VerifyEmailSuccess />} />
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>}/> 
            <Route path="/quizzyplus" element={<QuizzyPlus />} />
            <Route path="/quizzyplus/purchase" element={<Purchase />} />
            <Route
              path="/quizzyplus/purchase/thanks"
              element={<ThanksForPurchase />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/study/:setid/:title" element={<Study/>} />
            <Route path="/tag/:tag" element={<Tag/>} />
            <Route path="/users/:userid" element={<User/>} />
            <Route exact path="*" element={<Navigate to="/404" />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
