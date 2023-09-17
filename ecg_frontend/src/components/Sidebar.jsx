/* eslint-disable no-unused-vars */
import React from "react";
import { slide as Menu } from "react-burger-menu";
import "../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdDarkMode } from "react-icons/md";
import { useGlobalState } from "./UserContext";
import { Modal } from "antd";

const Sidebar = () => {
  //TODO : Sidebar opening by default
  const nav = useNavigate();
  let location = useLocation();
  const [user, setUser] = useGlobalState("user");
  const [modal2Open, setModal2Open] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  const [isOpen, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState();

  const to = (address) => {
    setOpen(false);
    nav(`/${address}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    nav("/login");
    setModal2Open(false);
  };

  return (
    <div
      className={`${
        location.pathname === "/register" || location.pathname === "/login"
          ? "hideButton"
          : ""
      }`}
    >
      <Menu
        right
        isOpen={isOpen}
        onOpen={() => setOpen(!isOpen)}
        onClose={() => setOpen(!isOpen)}
      >
        <div onClick={() => to("home")} className="menu-item">
          Home
        </div>
        {user.role === "2" ? (
          <div onClick={() => to("admin")} className="menu-item">
            Admin
          </div>
        ) : (
          ""
        )}
        {isLoggedIn ? (
          <li>
            <div
              onClick={() => {
                setModal2Open(true);
                setOpen(false);
              }}
              className="menu-item"
            >
              Logout
            </div>
          </li>
        ) : (
          <li>
            <div onClick={() => to("login")} className="menu-item">
              Login
            </div>
          </li>
        )}
        <Modal
          title="Confirmation"
          style={{ top: 350 }}
          open={modal2Open}
          okText={"Log out"}
          onOk={logout}
          onCancel={() => setModal2Open(false)}
        >
          <div>Are you sure you want to log out?</div>
        </Modal>
      </Menu>
    </div>
  );
};

export default Sidebar;
