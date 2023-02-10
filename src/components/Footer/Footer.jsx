import React, { useState, } from "react";
import { useLocation } from "react-router-dom";

import "./Footer.scss"


function Footer(props) {
    const location = useLocation();
    const [facebookIconHovered, setFacebookIconHovered] = useState(false);
    const [instagramIconHovered, setInstagramIconHovered] = useState(false);
    const [twitterIconHovered, setTwitterIconHovered] = useState(false); 
    const [linkedinIconHovered, setLinkedInIconHovered] = useState(false);
    return (
        <>
        {(!["/signup", "/login", "/404", "/forgot-password", "/reset-password", "/dashboard", "/dashboard/study", "/dashboard/friends"].includes(location.pathname) && location.pathname.indexOf("/recall") === -1) && (
        <footer className="quizzy-footer">
            <div className="cover">
                <div className="divider">
                    <div className="main-container">
                        <h1 className="quizzy-logo"><a href="https://quizzynow.com/">Quizzy</a></h1>
                        <p className="company-desc">Founded by an ambitious 18 year old in his basement, Quizzy is a web-app rooted in the belief that AI and cooperative studying can be used to bolster students' grades and material retention more effectively than traditional study methods. </p>
                        <div className="socials">
                            <a href="https://twitter.com/"><img src={twitterIconHovered ? "/images/footer/hovered/icons8-twitter.svg" : "/images/footer/icons8-twitter.svg"} alt="Twitter" onMouseEnter={() => {
                                setTwitterIconHovered(true);
                            }} onMouseLeave={() => {
                                setTwitterIconHovered(false);
                            }}></img></a>
                            <a href="https://facebook.com/"><img src={facebookIconHovered ? "/images/footer/hovered/icons8-facebook.svg" : "/images/footer/icons8-facebook.svg"} alt="Facebook" onMouseEnter={() => {
                                setFacebookIconHovered(true);
                            }} onMouseLeave={() => {
                                setFacebookIconHovered(false);
                            }}></img></a>
                            <a href="https://www.instagram.com/quizzynow/"><img src={instagramIconHovered ? "/images/footer/hovered/icons8-instagram.svg" : "/images/footer/icons8-instagram.svg"} alt="Instagram" onMouseEnter={() => {
                                setInstagramIconHovered(true);
                            }} onMouseLeave={() => {
                                setInstagramIconHovered(false);
                            }}></img></a>
                            <a href="https://linkedin.com"><img src={linkedinIconHovered ? "/images/footer/hovered/icons8-linkedin-circled.svg" : "/images/footer/icons8-linkedin-circled.svg"} alt="LinkedIn" onMouseEnter={() => {
                                setLinkedInIconHovered(true);
                            }} onMouseLeave={() => {
                                setLinkedInIconHovered(false);
                            }}></img></a>
                            

                        </div>
                    </div>
                    <div className="hrefs">
                        <div className="upgrade">
                            <p>Upgrade</p>
                            <a href="/quizzyplus">Quizzy+</a>
                        </div>
                        <div className="product">
                            <p>Product</p>
                            <a href="/faq#flashcards">Flashcards</a>
                            <a href="/faq#recalls">Recall Sessions</a>
                        </div>
                        <div className="company">
                            <p>Company</p>
                            <a href="/about-us">About Us</a>
                            <a href="/faq">FAQ</a>
                            <a href="/jobs">Jobs</a>
                        </div>
                        <div className="policies">
                            <p>Policies</p>
                            <a href="/terms">Terms</a>
                            <a href="/privacy">Privacy</a>
                            <a href="/cookies">Cookies</a>
                        </div>
                    </div>
                </div>
                
            </div>
           
        </footer>)}
        </>
    )
    
}

export default Footer 