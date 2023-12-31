import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Admin.css";

const MainPage = () => {
  return (
    <div className="content">
      <h2 style={{textAlign: "center"}}>Welcome to Admin Page!</h2>
      <p style={{textAlign: "center"}}>Please select the following buttons for admin actions</p>
      <div className="navigation-buttons d-flex justify-content-center">
        {/* Links to User and Event Info pages */}
        <Link to="/admin/user" className="btn btn-primary responsive-btn" >
          User Information
        </Link>
        {/* horizontal space */}
        <div style={{ width: "25px" }}></div>
        <Link to="/admin/event" className="btn btn-primary responsive-btn">
          Event Information
        </Link>
        <div style={{ width: "25px" }}></div>
        <Link to="/admin/venue" className="btn btn-primary responsive-btn">
          Venue Information
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
