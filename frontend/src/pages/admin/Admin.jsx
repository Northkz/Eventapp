import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserInfo from "./UserInfo";
import EventInfo from "./EventInfo";
import VenueInfo from "./VenueInfo";
import MainPage from "./MainPage";
import "./Admin.css";
import useAuthStore from "../../AuthStore";

const Admin = ({}) => {
  const match = useMatch("/admin");

  // try a random admin action like GET /api/admin/user, if it fails ,show error
  const { token } = useAuthStore();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [error, setError] = React.useState("Loading...");

  React.useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch(`${apiUrl}/api/admin/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user role");
        const data = await response.json();
        console.log("DATA", data);

        setError("");
      } catch (error) {
        setError("You are not an admin");
      } finally {
      }
    }

    if (token) fetchUserRole();
  }, [apiUrl, token]);

  if (error && token) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-body" style={{ height: "calc(100vh - 60px)" }}>
        <div className="login-box">
          {
            // show error if there is one
            error ? (
              <h4>{error}</h4>
            ) : (
              <div>
                <h4 className="text-center">Oops! It seems like you are not an admin</h4>
              </div>
            )
          }
          <div style={{ height: "25px" }}></div>
          {/* go back button */}
          <div className="d-flex">
            <button className="btn btn-primary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!error && token) {
    return (
      <div className="admin">
        <div className="admin__sidebar">
          <Sidebar />
        </div>
        <div className="admin__content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="user" element={<UserInfo />} />
            <Route path="event" element={<EventInfo />} />
            <Route path="venue" element={<VenueInfo />} />
            {match ? <Route path="*" element={<h1>Not Found in admin</h1>} /> : null}
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4>Something has gone wrong. Try logging in.</h4>
    </div>
  );
};

export default Admin;
