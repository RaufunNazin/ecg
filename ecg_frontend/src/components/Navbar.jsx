/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGlobalState } from "../components/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

const Navbar = () => {
  const [user, setUser] = useGlobalState("user");
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  const [modal2Open, setModal2Open] = useState(false);

  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    nav("/login");
    window.location.reload();
  };
  return (
    <nav className="bg-gray-50 py-2 shadow-md border-gray-200 z-50">
      <div className="flex justify-between items-center mx-auto max-w-screen-xl p-3">
        <button
          type="button"
          onClick={() => nav("/")}
          className="flex items-center"
        >
          <img src="/vite.svg" className="h-8 mr-3" alt="Website Logo" />
          <span className="self-center text-md lg:text-2xl font-semibold whitespace-nowrap">
            ECG Monitoring
          </span>
        </button>
        <div className="flex items-center gap-x-2">
          {user.role === 1 ? (
            <div className="mr-6 text-gray-500">
              {user.name ? user.name : ""}
            </div>
          ) : (
            ""
          )}
          {isLoggedIn === false ? (
            <button
              type="button"
              onClick={() => nav("/login")}
              className="bg-blue-600 p-1 lg:py-2 lg:px-4 rounded-md text-white font-medium hover:bg-blue-700 transition-all duration-300"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setModal2Open(true)}
              className="bg-red-700 p-1 lg:py-2 lg:px-4 rounded-md text-white font-medium hover:bg-red-800 transition-all duration-300"
            >
              Logout
            </button>
          )}
          {user.role === 2 ? (
            <button
              type="button"
              onClick={() => nav("/admin")}
              className="bg-green-600 p-1 lg:py-2 lg:px-4 rounded-md text-white font-medium hover:bg-green-700 transition-all duration-300"
            >
              Admin
            </button>
          ) : (
            ""
          )}
        </div>
        <Modal
          title="Confirmation"
          centered
          open={modal2Open}
          okText={"Log out"}
          onOk={logout}
          onCancel={() => setModal2Open(false)}
        >
          <div>Are you sure you want to log out?</div>
        </Modal>
      </div>
    </nav>
  );
};

export default Navbar;
