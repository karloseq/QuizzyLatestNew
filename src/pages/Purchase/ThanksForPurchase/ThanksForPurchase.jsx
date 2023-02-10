import React, { useEffect, useState } from "react";
import "./ThanksForPurchase.scss";

import { useDispatch, useSelector } from "react-redux";
import { CHECKMARK_ICON } from "../../../constants/constants";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { fetch_transaction, get_user } from "../../../network/communication";
import UsersInterface from "../../../components/UsersInterface/UsersInterface";

function ThanksForPurchase(props) { //https://quizzynow.com/quizzyplus/purchase/thanks?status=success&pricing=monthly&plan=Basic&transaction_id=sub_1LBlJYDGf5VXzls5YXxLwS5p
  const dispatch = useDispatch();
  var user = props.user 
  var setUser = props.setUser 

  const location = useLocation();
  const urlTransactionInfo = new URLSearchParams(location.search);
  const navigate = useNavigate();
  
  const plan = urlTransactionInfo.get("plan")
  const pricing = urlTransactionInfo.get("pricing")
  const price = pricing === "yearly" ? plan.priceYearly : plan.priceMonthly;

  const [transactionInfo, setTransactionInfo] = useState({})
  useEffect(() => {
    get_user(function(user) {
      if (user.success) {
        setUser(user)
      }
    })
    fetch_transaction(urlTransactionInfo.get("transaction_id"), function(data) { 
      setTransactionInfo(data)
    }) 
    document.title = "Thanks for your purchase! - Quizzy"
  }, [])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let future = new Date();
  if (pricing === "yearly") {
    future.setFullYear(future.getFullYear() + 1);
  } else {
    future.setDate(future.getDate() + 30);
  }

  if (urlTransactionInfo.get("status") != "success" || !urlTransactionInfo.get("transaction_id")) {
    return navigate(".../404")
  }

  return (
    <div className="thanks_for_purchase">
      <div className="top">
        <img src="/images/purchase/top.svg" alt="Icon of top graphic" />
        <div className="text">
          <h1>Quizzy+</h1>
          <p>{"Congratulations! You're all set to get that A+!"}</p>
        </div>
      </div>

      {/* Main Block */}

      <div className="main">
        <div className="main_row">
          <div className="details">
            <div className="success">
              <h2>Success!</h2>
              <div className="line" />
              <img src={CHECKMARK_ICON} />
            </div>
            <div className="thanks_details">
              <h3>Thanks for your purchase!</h3>
              <p>
                Please allow up to 5 minutes for the new Quizzy+ changes to be
                applied onto your account. We've packed a ton of features into
                Quizzy+ already, and there are even more coming soon. We hope
                this purchase is worthwhile for you and helps you achieve your
                desired grades and test results.
                <br />
                <br /> You can find the receipt for your purchase in the bottom section of this
                page. Additionally, a copy of your receipt and an order confirmation has been automatically
                emailed to you at <a className="link" href={"mailto:" + transactionInfo.email}>{transactionInfo.email}</a>.
                <br />
                <br /> Please contact <a href={"mailto:payments@quizzynow.com?subject=Quizzy+ Transaction " + urlTransactionInfo.get("transaction_id")}>payments@quizzynow.com</a> via
                email if there are any concerns regarding your subscription.
                <br />
                <br /> Thanks again, The Quizzy Team.
              </p>
              <h4>Order Details</h4>
              <p>
                You can <a href={transactionInfo.receipt_url}> view your receipt here.</a>
              </p>
              <h4>Admire that new badge of yours some more</h4>
              {/*<div className="big_user">
                <img src="/images/user/pfp.svg" alt="Your profile icon" />
                <h5>Script Ing</h5>
                <p>
                  Student - <span>Online</span>
                </p>
                <p className="user_plan">PLUS</p>
              </div>
              <div className="mid_user">
                <img src="/images/user/pfp.svg" alt="Your profile icon" />
                <p>script_ing</p>
                <p className="user_plan">PLUS</p>
              </div>
              <div className="small_user">
                <img src="/images/user/pfp.svg" alt="Your profile icon" />
                <p className="user_plan">PLUS</p>
              </div>*/}
              <UsersInterface users={{user}}></UsersInterface>
              
            </div>
          </div>
          {/*
          <div className="order">
          <div className="title">
              <img
                src="/images/purchase/order_details.svg"
                alt="Order Details icon"
              />
              <h2>View Order Receipt</h2>
          </div>
            <div className="product_details">
              <h3>
              {transactionInfo.product_name}
              </h3>
              <h3 className="price">${transactionInfo.product_price}</h3>
              </div>
              <p>
                Next payment is due on {monthNames[future.getMonth()]}{" "}
                {future.getDate()} {future.getFullYear()}. You may cancel at any
                time.
              </p>
              <div className="total">
              <h3 className="totalText">Total</h3>
              <h3 className="price">${transactionInfo.product_price}</h3>
              
            </div>
            <div>
            <h3 style={{fontWeight: 500}} href={transactionInfo.invoice_url}>Click here to view the invoice for this receipt.</h3>
            </div>

          </div>
          {/* Complete order 
          
          <div className="order">
            <div className="title">
              <img
                src="/images/purchase/order_details.svg"
                alt="Order Details icon"
              />
              <h2>Order Receipt</h2>
            </div>
            <div className="product_details">
              <h3>
                {transactionInfo.product_name}
                {Quizzy+ {plan.plan} ({pricing})}
              </h3>
              <h3 className="price">${transactionInfo.product_price}</h3>
            </div>
            <p>
              Next payment is due on {monthNames[future.getMonth()]}{" "}
              {future.getDate()} {future.getFullYear()}. You may cancel at any
              time.
            </p>
            {<div className="coupon">
              <h3>Coupon "Test"</h3>
              <h3 className="discount">-$2.50</h3>
            </div>}
            <div className="total">
              <h3 className="totalText">Total</h3>
              <h3 className="price">${transactionInfo.product_price}</h3>
            </div>
            {/*}
            <div className="total_savings">
              <p>Your total savings amount:</p>
              <h3 className="price">$2.50</h3>
            </div>
        
            <div className="paid">
              <h3 className="totalText">Paid</h3>
              <h3 className="price">-${transactionInfo.price_paid}</h3>
            </div>
            <div className="total_due">
              <h3 className="totalText">Total Due</h3>
              <h3 className="price">$0.00</h3>
            </div>
            <p>
              Thanks for your purchase! We will also email a copy of this to you
              shortly for your convenience.
            </p>
          </div>*/}
            </div>
            </div>
    </div>
  );
}

export default ThanksForPurchase;
