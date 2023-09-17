/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate } from "react-router-dom";
import { useGlobalState } from "./UserContext";

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  if (isLoggedIn === true) {
    return children;
  } else return <Navigate to="/login" state={"redirected"}></Navigate>;
};

export default PrivateRoute;