import React, { useEffect, useRef } from "react";

import "./SupportSection.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { fetch_articles } from "../../network/communication";

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
      return { innerWidth, innerHeight };
    }

function SupportSection(props) {
  const { section} = useParams("");
  const [articleData, setArticleData] = useState([]);
  useEffect(() => {
    fetch_articles(section, (data) => {
      setArticleData(data.data);
    })
  }, [])
  return (
    <main className="support-section-main">
      <div className="main-section-header">
        <div className="icon-header">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="43.447" height="48.275" viewBox="0 0 43.447 48.275">
                <path id="assignment_FILL0_wght400_GRAD0_opsz48" d="M9.621,50.275A3.606,3.606,0,0,1,6,46.654V10.448A3.606,3.606,0,0,1,9.621,6.827h12.37a5.354,5.354,0,0,1,1.931-3.47,6,6,0,0,1,7.6,0,5.354,5.354,0,0,1,1.931,3.47h12.37a3.606,3.606,0,0,1,3.621,3.621V46.654a3.606,3.606,0,0,1-3.621,3.621Zm0-3.621H45.827V10.448H9.621Zm6.034-6.034H32.129V37H15.655Zm0-10.258H39.792V26.741H15.655Zm0-10.258H39.792V16.482H15.655ZM27.724,9.422A2.026,2.026,0,0,0,29.2,8.789a2.042,2.042,0,0,0,0-2.957,2.042,2.042,0,0,0-2.957,0,2.042,2.042,0,0,0,0,2.957A2.026,2.026,0,0,0,27.724,9.422ZM9.621,46.654v0Z" transform="translate(-6 -2)" fill="#fff"/>
            </svg>
          </div>
          <h1>{{"getting-started": "Getting Started", "the-interface": "The Interface", "quizzy-plus": "Quizzy+", "flashcards": "Flashcards", "recall-sessions": "Recall Sessions", "quizzes": "Quizzes"}[section]}</h1>
        </div>
        
        <p>{{"getting-started": "Ready to take your studying to the next level? Get a Quizzy 101 right here.", "the-interface": "Confused about what certain buttons do? We'll make you an expert.", "quizzy-plus": "Learn more about our Quizzy+ program and more here.", "flashcards": "Need help with making Study Sets? Learn about how they work here.", "recall-sessions": "We admit it -- Recall Sessions can be confusing. Learn about them here.", "quizzes": "Put the Quiz in Quizzy here and learn about Quizzy's comprehensive Quiz feature."}[section]}</p>
      </div>
      <div className="content">
        {Object.keys(articleData).map((sectionName) => (
          <section>
            <h1>{sectionName}</h1>
            {articleData[sectionName].map((data) => (
              <a className="article" href={"/support/sections/" + section + "/" + data.id + "/" + data.title.replace(/\s+/g, "-").toLowerCase()} >{data.title}</a>
            ))}
            
          </section>
        ))}
        
      </div>
    </main>
  );
}

export default SupportSection;
