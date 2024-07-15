import React from "react";
import "./Sidebar.css";
import { useTheme } from "./ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} ${theme}`}>
      <div className="toogle-main">
        <button onClick={onClose} className="close-btn">
          &times;
        </button>{" "}
        <div onClick={toggleTheme} className="theme-toggle-btn">
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </div>
      </div>
      <div className="profile-section">
        <img
          src="./icons/testi-3 (1).png"
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2>Pankaj Baranwal</h2>
          <p>+91 7289926396</p>
        </div>
      </div>
      <a href="#" className="sidebar-item">
        <i className="fas fa-user"></i> My Profile
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-users"></i> New Group
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-address-book"></i> Contacts
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-phone"></i> Calls
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-map-marker-alt"></i> People Nearby
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-bookmark"></i> Saved Messages
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-cog"></i> Settings
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-user-plus"></i> Invite Friends
      </a>
      <a href="#" className="sidebar-item">
        <i className="fas fa-info-circle"></i> Telegram Features
      </a>
    </div>
  );
}

export default Sidebar;
