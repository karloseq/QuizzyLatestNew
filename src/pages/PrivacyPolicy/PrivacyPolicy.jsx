import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { Link, Navigate} from "react-router-dom";
import DocumentMeta from "react-document-meta";
import "./Index.scss";
//import { get_set_data } from "../../network/communication";


function index(props) {
    return (
        <main className="main">
            <DocumentMeta {...meta} />
            <h1>Quizzy Privacy Policy</h1>
        </main>
    )
}

export default index;