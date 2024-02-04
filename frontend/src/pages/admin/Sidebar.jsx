import React from "react";
import { NavLink, useMatch } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  // const mainPageMatch = useMatch("/admin");
  // const userMatch = useMatch("/admin/user");
  // const eventMatch = useMatch("/admin/event");

  // return (
  //   <div className="sidebar">
  //     {/* make Main Page always deactivated */}
  //     <div className={`sidebar__item ${mainPageMatch ? "active" : ""}`}>
  //       <NavLink to="/admin">Main Page</NavLink>
  //     </div>

  //     <div className={`sidebar__item ${userMatch ? "active" : ""}`}>
  //       <NavLink to="/admin/user">User</NavLink>
  //     </div>
  //     <div className={`sidebar__item ${eventMatch ? "active" : ""}`}>
  //       <NavLink to="/admin/event">Event</NavLink>
  //     </div>
  //   </div>
  // );
  return (
    <div className="sidebar">
      {/* make Main Page always deactivated */}
      <div className="sidebar__item_main">
        <NavLink to="/admin">Admin Page</NavLink>
      </div>

      <div className="sidebar__item">
        <NavLink to="/admin/user">User</NavLink>
      </div>
      <div className="sidebar__item">
        <NavLink to="/admin/event">Event</NavLink>
      </div>
      <div className="sidebar__item">
        <NavLink to="/admin/venue">Venue</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
