import React from "react";
import { NavBar } from "../common";

const Layout = ({ children, ...rest }) => {
  return (
    <div>
      <NavBar {...rest} />
      <div>{children}</div>
    </div>
  );
};

export { Layout };
