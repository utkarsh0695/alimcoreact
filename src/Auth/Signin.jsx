import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { TabContent, TabPane } from "reactstrap";
import logoLight from "../assets/images/logo/Alimco_Logo.png";
import AuthTab from "./Tabs/AuthTab";
import LoginTab from "./Tabs/LoginTab";
const Logins = () => {
  const [selected, setSelected] = useState("simpleLogin");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // useEffect(() => {
  if (token) {
    navigate(-1);
  }
  // }, []);
  const callbackNav = (select) => {
    setSelected(select);
  };

  return (
    <>
      <div className="login-card flex-column">
        <div>
          <div>
            <div className="text-center">
              <Link className="logo" to="/login">
                <img
                  className="img-fluid for-light"
                  src={logoLight}
                  alt="looginpage"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="login-main">
          {/* <NavAuth callbackNav={callbackNav} selected={selected} /> */}
          <TabContent activeTab={selected} className="content-login">
            <TabPane
              className="fade show"
              tabId={selected === "simpleLogin" ? "simpleLogin" : "jwt"}
            >
              <LoginTab selected={selected} />
            </TabPane>
            <TabPane className="fade show" tabId="auth0">
              <AuthTab />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </>
  );
};

export default Logins;
