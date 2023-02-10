import React, {useRef} from "react";
import "./AboutUs.scss";
import { Link} from "react-router-dom";

import party from "party-js"
import DocumentMeta from "react-document-meta";

function AboutUs(props) {
    const meta = {
        title: "About Us",
        description: "Founded by an 18 year old in his basement, Quizzy is a web-app rooted in the belief that AI and cooperative studying can be used to bolster students' grades and material retention more effectively than traditional study methods. He primarily developed Quizzy to help students revise vocabulary terms and concepts several weeks before the test date, so that they would succeed when the day arrived",
    };
    const confetti = useRef(null);
    return (
        <div class="aboutus">
            <DocumentMeta {...meta} />
            <img src="images/quizzyplus/plusbackground.svg" width="2200" height="2200" className="plusbg" alt="bg"></img>
            <main className="about-us-main">
                    <h1 className="about">About Quizzy</h1>
                    <h2 className="sub">We're here to make learning easier for everyone.</h2>
                    <h1 className="tagline" id="tagline-1">Quizzy. Founded by a student, for students.</h1>
                    <br></br>
                    <a>Founded by an 18 year old in his basement, Quizzy is a web-app rooted in the belief that AI and cooperative studying can be used to bolster students' grades and material retention more effectively than traditional study methods (rereading, <span class="highlight">highlighting</span>, <span class="underline">underlining</span> etc.) He primarily developed Quizzy to help students revise vocabulary terms and concepts several weeks before the test date, so that they would succeed when the day arrived.</a>
                    <h2 className="subtagline">Meet Kushal, our Founder and CEO.</h2>
                    <br></br>
                    
                    <a>Currently studying Computer Science at community college, Kushal hopes to eliminate the stress of cramming for tests and make it more fun to learn and revise material. As a passionate Game Developer since 2015, Kushal has tremendous experience in the factors that contribute to making games fun and enjoyable for all ages. </a>
                    <br></br>
                    <h1 className="tagline">The Story</h1>
                    <br></br>
                    <a>It was one normal day in November in school. Everything was going well, until Kushal remembered that he had an Accounting Quiz in 30 minutes. He felt okay though - after all, he'd studied for 30 minutes the day before and believed knew all of the terms at the time. He'd be fine, right? <br></br><strong>Wrong.</strong></a>
                    <a>When he quizzed himself on the terms, he found that he remembered very little of the definitions.. bad news.</a>
                    <a>Long story short, he studied for those 30 minutes, and aced the test. But this experience left him wondering how many people around the world have had trouble studying for their exam. He concluded that lots of students have trouble studying for their exam, and that it would be beneficial for them if there was some sort of software that automatically created study schedules based on their test dates for their exams.</a>
                    <br></br>
                    <h2 className="subtagline">Quizzy is born! 
                        <img className="party" width="50" ref={confetti} height="50" src="https://emojipedia-us.s3.amazonaws.com/source/skype/289/party-popper_1f389.png" onClick={function() {
                            party.confetti(confetti.current)
                        }}></img>
                    </h2>
                    <br></br>
                    <a>On November 11, 2021, Kushal began designing Quizzy, an app that would address these concerns and implement effective solutions to them. Quizzy utilizes features such as: Recall Sessions, Cooperative Learning, and Smart Study Projection, and scientific-based study methods such as: Spaced Repetition and Active Recall to help students plan and study for their exams, with the intention of maximizing the chance that they'd get an A on their tests.</a>
                    <h3>Thanks for reading - Wanna help us on our mission? ❤️</h3>
                    <br></br>
                    <Link to="/jobs" className="button">
                    Join the Team
                    </Link>
       

            </main>
            
        </div>
        
    )
}

export default AboutUs;