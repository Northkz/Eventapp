import React, { useState, useEffect } from "react";
import useAuthStore from "../../AuthStore";
import "./UserInfo.css";
const apiUrl = process.env.REACT_APP_API_URL;

const UserInfo = () => {
  const { email, token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });
  const [editedUser, setEditedUser] = useState({
    // email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // GET
  const fetchUsers = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }
      const data = await response.json();
      setUsers(data.users);
      setError("");
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleNewUserInputChange = (user) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      [user.target.name]: user.target.value,
    }));
  };

  const handleEditedUserInputChange = (user) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [user.target.name]: user.target.value,
    }));
  };

  // POST
  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setNewUser({
        email: "",
        password: "",
      });
      setError("");
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  // PUT
  const handleEditUser = async (event, email) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/user?email=${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });
      // console.log(editedUser);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setError("");
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete
  const handleDeleteUser = async (event, email) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/user?email=${email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Delete Error");
      }
      setError("");
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div>
      <h2>User Information</h2>
      <div className="content">
        <h3>Create a New User</h3>
        {error && <div className="error-message">Error: {error}</div>}
        <form className="form" onSubmit={handleCreateUser}>
          <input className="input" type="email" name="email" placeholder="Email" value={newUser.email} onChange={handleNewUserInputChange} required />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleNewUserInputChange}
            required
          />
          <button className="button" type="submit">
            Create User
          </button>
        </form>
      </div>

      <div className="content">
        <h3>Change User Password</h3>
        {/* <input className="input" type="text" name="email" placeholder="New email" value={editedUser.email} onChange={handleEditedUserInputChange} required /> */}
        <input className="input" type="text" name="password" placeholder="New Password" value={editedUser.password} onChange={handleEditedUserInputChange} required />
      </div>
      <div className="content">
        <div className="user-list">
          <h3>Existing Users:</h3>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="user-item">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Password:</strong> {user.password}</p>
                <p><strong>Admin:</strong> {user.isAdmin? "True": "False"}</p>
                <p><strong>Verified:</strong> {user.isVerified? "True": "False"}</p>
                <button className="button" onClick={(e) => handleEditUser(e, user.email)}>
                  Change User Password
                </button>
                <button className="button" onClick={(e) => handleDeleteUser(e, user.email)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    </div>
   
  );
};

export default UserInfo;
