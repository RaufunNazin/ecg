/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import { useGlobalState } from "./components/UserContext";
import jwt_decode from "jwt-decode";
import api from "./api";

const App = () => {
  const [user, setUser] = useGlobalState("user");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  const [jwt, setJwt] = useGlobalState("jwt");

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setLoading(true);
      const decoded = jwt_decode(localStorage.getItem("jwt"));
      api
        .get(`/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .then((res) => {
          let toUpdateKeys = ["id", "name", "phone", "role"];
          let profile = res.data;
          Object.keys(user).forEach((k) => {
            if (toUpdateKeys.includes(k)) {
              user[k] = profile[k];
            }
          });
          setUser(user);
          setIsLoggedIn(true);
          setJwt(localStorage.getItem("jwt"));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);
  if (loading === true)
    return (
      <div>
        <br />
      </div>
    );
  else
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="admin"
                element={
                    <Admin />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
