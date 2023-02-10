import React, {useRef} from "react";
import "./Jobs.scss";

import DocumentMeta from "react-document-meta";

function Jobs(props) {
    const meta = {
        title: "Jobs - Quizzy",
        description: "Here are some of the openings available for Quizzy.",
    };
    return (
        <div class="jobs">
            <DocumentMeta {...meta} />
            <img src="images/quizzyplus/plusbackground.svg" width="2200" height="2200" className="plusbg" alt="bg"></img>
            <main className="jobs-main">
                <h1 className="about">Our Jobs</h1>
                <h2 className="sub">Here are our current openings at Quizzy.</h2>
                <div className="jobs-container">
                    <div className="nojobs">
                        <div className="row">
                            <img src="/images/jobs/broke.svg"></img>
                            <div className="col">
                                <h1>Hmm, we don't seem to have any job openings at the moment.</h1>
                                <p>Check this page later and a thing or two might pop up.</p>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </main>
            
        </div>
        
    )
}

export default Jobs;