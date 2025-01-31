import React from "react";
import AppLogout from "./AppLogout";

const withAuth = (Component) => {

  return (props) => (
    <AppLogout>
      <Component {...props} />
    </AppLogout>
  );
};

export default withAuth;
