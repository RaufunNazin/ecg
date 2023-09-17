/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api.js";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useGlobalState } from "../components/UserContext.jsx";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useGlobalState("user");
  const [jwt, setJwt] = useGlobalState("user");
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");

  const nav = useNavigate();
  const { state } = useLocation();

  const login = () => {
    api
      .post("/login", { username: phone, password: password })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("jwt", res.data["access_token"]);
          const decoded = (jwt_decode(res.data["access_token"]));
          api
            .get(`/users/${decoded.id}`, {
              headers: {
                Authorization: `Bearer ${res.data["access_token"]}`,
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
              nav("/home");
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
              toast.error("Login Failed!");
            });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Login Failed!");
      });
  };

  useEffect(() => {
    if (state === "redirected") toast.error("Please sign in to view the page");
    if (state === "login") toast.error("Please sign in");
  }, []);

  return (
    <section className="bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="colored"
      />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-4">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required=""
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required=""
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => login()}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
            <div className="flex justify-between items-center">
              <div className="text-gray-500 font-light">Need an account?</div>
              <button
                type="button"
                onClick={() => nav("/register")}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
      <label className="fixed top-5 left-5 md:top-10 md:left-10 inline-flex items-center mb-4 cursor-pointer">
        <FaHome
          onClick={() => nav("/home")}
          className="text-3xl cursor-pointer dark:text-blue-600 dark:hover:text-blue-700"
        />
      </label>
    </section>
  );
};

export default Login;
