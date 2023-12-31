import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../AuthStore";

const UserInfo = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const { logout } = useAuthStore(); // import logout function from AuthStore
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // logout is done by state management
    navigate("/auth/login"); // then navigate to login page
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/user/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user information");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  return (
    <div class="card">
      {userData ? (
        <div class="card-body">
          <h2>User Information</h2>
          <p>User ID: {userData._id}</p>
          <p>Email: {userData.email}</p>
          <button onClick={handleLogout}>Logout</button> {/* logout is added */}
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>Loading user information...</div>
      )}
    </div>
  );
};

export default UserInfo;
