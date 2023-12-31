import React, { useState, useEffect } from "react";
import UserInfo from "./UserInfo";
import useAuthStore from "../../AuthStore";
import "./User.css";
import { Link } from "react-router-dom";

const User = () => {
  const { token } = useAuthStore();
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFavoriteVenues = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/fav_venues`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch favorite venues");
        }
        const data = await response.json();
        setFavoriteVenues(data); // Assuming the response contains the list of favorite venue IDs
      } catch (error) {
        console.error("Error fetching favorite venues:", error);
      }
    };

    if (token) {
      fetchFavoriteVenues();
    }
  }, [token, apiUrl]);

  if (!token) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-body" style={{ height: "calc(100vh - 60px)" }}>
        <div className="login-box">
          <h4>Oops! You are not logged in.</h4>
          <div style={{ height: "25px" }}></div>
          <Link to="/auth">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page container">
      {token && <UserInfo token={token} />}
      <FavoriteVenuesTable venueIds={favoriteVenues} token={token} apiUrl={apiUrl} />
    </div>
  );
};

const FavoriteVenuesTable = ({ venueIds, token, apiUrl }) => {
  const [venueDetails, setVenueDetails] = useState([]);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const detailedVenues = await Promise.all(
          venueIds.map(async (venueId) => {
            const response = await fetch(`${apiUrl}/api/venue?id=${venueId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch venue details for ID: ${venueId}`);
            }
            return response.json();
          })
        );
        setVenueDetails(detailedVenues);
      } catch (error) {
        console.error("Error fetching venue details:", error);
      }
    };

    if (venueIds.length > 0) {
      fetchVenueDetails();
    }
  }, [venueIds, token, apiUrl]);

  return (
    <>
      <h4>My Favorite Venues</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Number of Events</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {venueDetails.map((venue) => (
            <tr key={venue.id}>
              <td>{venue.name}</td>
              <td>{venue.latitude}</td>
              <td>{venue.longitude}</td>
              <td>{venue.eventsList.length}</td>
              <td>
                <a href={`/location/${venue.id}`}>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default User;
