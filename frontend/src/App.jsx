// Adil Toktarov 1155147818
// Kambar Nursulatan (1155147668)
// Mincheol Kim (1155131310)
// Byeong Hyun Park (1155149086)
// Wong Po Wa (1155161947)

import "./App.css";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Auth from "./pages/auth/AuthPage";
import Admin from "./pages/admin/Admin";
import User from "./pages/user/User";
import VenueDetails from "./pages/programmes/VenueDetails.jsx";
import React, { useEffect, useState } from "react";
import useAuthStore from "./AuthStore.js";
import { logOut } from "./pages/auth/logic/AuthLogic.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Programmes from "./pages/programmes/Programmes";
import Chat from "./pages/chat/Chat";
import Home from "./pages/home/Home";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth();
    return () => {};
  }, [initializeAuth]);

  return (
    <>
      <div className="App">
        <BrowserRouter>
          {/* this is a top bar, which shows:
          1. the logo
          2. the navigation bar
          3. the current logged in user */}
          <TopBar />
          {/* this is the main content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/programmes/*" element={<Programmes />} />
            <Route path="/user/*" element={<User />} />
            <Route path="/chat/*" element={<Chat />} />
            <Route path="/location/:venueId" element={<VenueDetails />} />
            <Route path="/venue/:venueId" element={<VenueDetails />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { email, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="top-bar justify-content-between">
      <div className="d-flex">
        <div className="logo">Cultural Programmes Viewing System</div>
        {/* menu toggle button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={solid("bars")} />
        </button>
      </div>
      {/* Navigation menu should always be rendered, but visibility controlled via CSS */}
      <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-link mx-md-0 mx-lg-1">
          Home
        </NavLink>
        <NavLink to="/programmes" className="nav-link mx-md-0 mx-lg-1">
          Programmes
        </NavLink>
        <NavLink to="/user" className="nav-link mx-md-0 mx-lg-1">
          User
        </NavLink>
        <NavLink to="/admin" className="nav-link mx-md-0 mx-lg-1">
          Admin
        </NavLink>
        <NavLink to="/chat" className="nav-link mx-md-0 mx-lg-1">
          Anonymous Venue Chats
        </NavLink>
        <div className="login-btn align-items-center">
          {email ? (
            <>
              <span>Logged in as:&nbsp;</span>
              <span className="user-email fw-bold">{email.replaceAll('"', "")}</span>
              <div style={{ width: "10px" }}></div>
              <button className="btn-auth-small p-2" onClick={handleLogout}>
                <FontAwesomeIcon icon={solid("sign-out-alt")} className="mr-2" />
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/auth/login" className="nav-link">
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default App;
