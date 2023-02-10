import React, { useState, useEffect } from "react";
import "./QuizzyPlus.scss";

import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { lightBlue } from "@mui/material/colors";
import { alpha } from "@mui/material";

import { useDispatch } from "react-redux";

import { get_session_token, get_user } from "../../network/communication";
import Banner from "../../components/Banner/Banner";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function QuizzyPlus(props) {
  var user = props.user;
  var setUser = props.setUser;
  useEffect(() => {
    get_user(function (user) {
      if (user.success) {
        setUser(user);
      }
    });
    document.title = "Quizzy+ - Quizzy";
  }, []);

  var currentPlan = user.membership > 0 && user.membership_info.plan;

  const [upgradePlanPopupEnabled, setUpgradePlanPopupEnabled] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState("");
  const [selectedUpgradePlanIndex, setSelectedUpgradePlanIndex] =
    useState(null);
  const [upgradeOrSwitch, setUpgradeOrSwitch] = useState("");

  const navigate = useNavigate();

  const [pricing, setPricing] = useState(
    user.membership % 2 == 0 ? "yearly" : "monthly"
  );

  const LightBlue = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: lightBlue[300],
      "&:hover": {
        backgroundColor: alpha(
          lightBlue[300],
          theme.palette.action.hoverOpacity
        ),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: lightBlue[300],
    },
  }));

  const [plans] = useState([
    //50 KB regular image upload size; 500 KB basic; 3 MB standard
    {
      plan: "BASIC",
      planFullName: "Quizzy+ Basic",

      priceMonthly: "3.99",
      priceYearly: "37.99",
      planId: [1, 2],
      features: [
        "No ads",
        "Animated avatars",
        "Custom Recall Sessions",
        "Quizzy+ Badge",
        "500 KB Image Upload Size",
      ],
    },
    {
      plan: "STANDARD",
      planFullName: "Quizzy+ Standard",
      outdatedPriceMonthly: "11.99",
      outdatedPriceYearly: "120.99",
      priceMonthly: "7.99",
      priceYearly: "79.99",
      planId: [3, 4],
      banners: [
        ["RECOMMENDED", "purple"],
        ["MOST POPULAR", "red"],
      ],
      features: [
        "Basic Plan Benefits",
        "5 MB Image Upload Size",
        "Streak Repair",
        "Most Difficult Terms",
        "Combine Sets",
        "Add Tasks",
        "More Recall Sessions",
        "Priority Support",
      ],
    },
    {
      plan: "PROFESSIONAL",
      planFullName: "Quizzy+ Professional",
      outdatedPriceMonthly: "15.99",
      outdatedPriceYearly: "160.99",
      priceMonthly: "11.99",
      priceYearly: "99.99",
      planId: [5, 6],
      banners: [["BEST VALUE", "blue"]],
      features: [
        "Standard Plan Benefits",
        "10MB Image Upload Size",
        "Overall Stats",
        "Priority Support",
      ],
    },
  ]);

  // Create a Checkout Session with the selected product
  const createCheckoutSession = function (productId) {
    window.location.href =
      "https://quizzynow.com/php/payments/payment_init.php?product=" +
      productId +
      "&auth_cookie=" +
      get_session_token();
  };

  const enterPortal = function () {
    window.location.href =
      "https://quizzynow.com/php/payments/enter_customer_portal.php?auth_cookie=" +
      get_session_token();
  };

  useEffect(() => {
    setPricing(
      user.membership > 0 && user.membership % 2 == 0 ? "yearly" : "monthly"
    );
  }, [user]);

  return (
    <>
      <div className="quizzyplus">
        <img
          src="images/quizzyplus/plusbackground.svg"
          width={2200}
          height={2200}
          className="plusbg"
          alt="bg"
        />
        <main>
          <Helmet>
            <meta
              name="description"
              content={
                "Upgrade to Quizzy+ now, and get started with Quizzy's awesome premium features!"
              }
            />
            ;
            <meta
              property="og:description"
              content={
                "Upgrade to Quizzy+ now, and get started with Quizzy's awesome premium features!"
              }
            />
            <meta property="og:title" content={"Quizzy - Upgrade to Quizzy+"} />
            <title>{"Upgrade - Quizzy"}</title>
          </Helmet>
          <h1>Quizzy+</h1>
          <h6>
            {user.userid != undefined
              ? user.membership == 0
                ? user.name + ", forget the A. You're going to get an A+."
                : user.name + ", you've got Quizzy+!"
              : ""}
          </h6>
          <div className="switch">
            Monthly
            <LightBlue
              size="medium"
              checked={pricing === "yearly"}
              onChange={(e) =>
                setPricing(e.target.checked ? "yearly" : "monthly")
              }
            />
            Yearly
          </div>
          <section className="plans">
            {plans.map((plan, index) => (
              <div className="flip">
                <div
                  className="front"
                  style={
                    pricing === "monthly"
                      ? { opacity: 1, transform: "rotateY(0deg)", zIndex: "5" }
                      : { transform: "rotateY(180deg)" }
                  }
                >
                  <div
                    className="plan"
                    style={
                      currentPlan &&
                      currentPlan.indexOf(plan.planFullName + " Monthly") > -1
                        ? { border: "solid 2px #8358e8" }
                        : {}
                    }
                  >
                    {plan.banners != undefined &&
                      plan.banners.map((b) => (
                        <Banner text={b[0]} color={b[1]}></Banner>
                      ))}

                    <h2>{plan.plan}</h2>
                    <div className="line" />
                    {plan.outdatedPriceMonthly && (
                      <div className="price price-outdated">
                        <h1>${plan.outdatedPriceMonthly}</h1>
                        <h3>/month</h3>
                        <div className="strikethrough"></div>
                      </div>
                    )}
                    <div className="price">
                      <h1>${plan.priceMonthly}</h1>
                      <h3>/month</h3>
                    </div>

                    {!currentPlan ||
                    currentPlan.indexOf(plan.planFullName + " Monthly") ==
                      -1 ? (
                      <p
                        className="button"
                        onClick={function () {
                          if (user.membership == 0) {
                            createCheckoutSession(plan.planId[0]).then(
                              function (data) {
                                console.log(data);
                              }
                            );
                          } else {
                            setUpgradeOrSwitch(
                              index + 1 < user.membership ? "Switch" : "Upgrade"
                            );
                            enterPortal();
                          }
                        }}
                      >
                        {user.membership > 0
                          ? index + 1 < user.membership
                            ? "Switch"
                            : "Upgrade"
                          : "Get Started"}
                      </p>
                    ) : (
                      <p>{"Current Plan"}</p>
                    )}
                    <ul>
                      {plan.features.map((feature) => (
                        <li>
                          <img src="/images/bullet.svg" alt="bullet icon" />
                          <p>{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className="back"
                  style={
                    pricing === "yearly"
                      ? { opacity: 1, transform: "rotateY(0deg)" }
                      : { transform: "rotateY(180deg)" }
                  }
                >
                  <div
                    className="plan"
                    style={
                      currentPlan &&
                      currentPlan.indexOf(plan.planFullName + " Annually") > -1
                        ? { border: "solid 2px #8358e8" }
                        : {}
                    }
                  >
                    {plan.banners != undefined &&
                      plan.banners.map((b) => (
                        <Banner text={b[0]} color={b[1]}></Banner>
                      ))}
                    <h2>{plan.plan}</h2>
                    <div className="line" />
                    {plan.outdatedPriceYearly && (
                      <div className="price price-outdated">
                        <h1>${plan.outdatedPriceYearly}</h1>
                        <h3>/year</h3>
                        <div className="strikethrough"></div>
                      </div>
                    )}
                    <div className="price">
                      <h1>${plan.priceYearly}</h1>
                      <h3>/year</h3>
                    </div>

                    {!currentPlan ||
                    currentPlan.indexOf(plan.planFullName + " Annually") ==
                      -1 ? (
                      <p
                        className="button"
                        onClick={function () {
                          if (user.membership == 0) {
                            createCheckoutSession(plan.planId[1]).then(
                              function (data) {
                                console.log(data);
                              }
                            );
                          } else {
                            setUpgradeOrSwitch(
                              index + 1 < user.membership ? "Switch" : "Upgrade"
                            );
                            enterPortal();
                          }
                        }}
                      >
                        {user.membership > 0
                          ? index + 1 < user.membership
                            ? "Switch"
                            : "Upgrade"
                          : "Get Started"}
                      </p>
                    ) : (
                      <a>{"Current Plan"}</a>
                    )}
                    <ul>
                      {plan.features.map((feature) => (
                        <li>
                          <img src="/images/bullet.svg" alt="bullet icon" />
                          <p>{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>
          <section className="features">
            <div className="right_text">
              <div className="left">
                <img
                  src="/images/quizzyplus/features/grades.svg"
                  alt="main graphic"
                />
              </div>
              <div className="right">
                <h3>Boost your grades with Overall Stats</h3>
                <div className="checks">
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      See what study methods other students are using to make
                      the most out of your learning
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      Compare each set with how fast others learned their
                      material to get a glimpse of how fast you can master it
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      Look through the average set views by each weekday to see
                      when people are usually studying each set
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left_text">
              <div className="left">
                <h3>Enjoy an increased image limit of up to 250 MB</h3>
                <div className="checks">
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      With an increased image size, you have plenty of space to
                      upload any type of image that'll help you with studying
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      With Quizzy+ Standard or Professional, you also get the
                      ability to make your profile picture a .gif, asserting
                      your dominance over those with still-image profile
                      pictures.
                    </p>
                  </div>
                </div>
              </div>
              <div className="right">
                <img
                  src="/images/quizzyplus/features/imagelimit.svg"
                  alt="main graphic"
                />
              </div>
            </div>
            <div className="right_text">
              <div className="left">
                <img
                  src="/images/quizzyplus/features/noads.svg"
                  alt="main graphic"
                />
              </div>
              <div className="right">
                <h3>Say goodbye to those pesky ads</h3>
                <div className="checks">
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      With Quizzy+, you can enjoy an ad-free study experience.
                      With zero distractions, you'll be able to focus on what
                      matters most -- your education.
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>Study well, knowing you're supporting us ❤️</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left_text">
              <div className="left">
                <h3>Showcase your brand new Quizzy+ badge</h3>
                <div className="checks">
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      Flex your brand new Quizzy+ badge to your friends. You're
                      a part of the students who'll turn that A into an A+.
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      Once you purchase Quizzy+ once, you'll receive a permanent
                      badge showing that you were a part of the A+ club.
                    </p>
                  </div>
                </div>
              </div>
              <div className="right">
                <img
                  src="/images/quizzyplus/features/showcase.svg"
                  alt="main graphic"
                />
              </div>
            </div>
            <div className="right_text">
              <div className="left">
                <img
                  src="/images/quizzyplus/features/charts.svg"
                  alt="main graphic"
                />
              </div>
              <div className="right">
                <h3>More charts, more data</h3>
                <div className="checks">
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      See how you compare with other people who studied the same
                      set.
                    </p>
                  </div>
                  <div className="check">
                    <img
                      src="/images/quizzyplus/features/check.svg"
                      alt="graphic of a check"
                    />
                    <p>
                      See how you as an individual learn different sets, and
                      find out how you best learn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="much_more">...and much more!</h3>
          </section>
          <section className="footer">
            <h2>
              That A+ is waiting. You just have to claim it. Let's get started.
            </h2>
          </section>
        </main>
      </div>
    </>
  );
}

export default QuizzyPlus;
