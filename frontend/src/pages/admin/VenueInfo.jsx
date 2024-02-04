import React, { useState, useEffect } from "react";
import useAuthStore from "../../AuthStore";
import "./VenueInfo.css";

const apiUrl = process.env.REACT_APP_API_URL;

const VenueInfo = () => {
  const { email, token } = useAuthStore();
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({
    name: "",
    latitude: "",
    longitude: ""
  });
  const [editedVenue, setEditedVenue] = useState({
    name: "",
    latitude: "",
    longitude: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  // GET
  const fetchVenues = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/venue`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch venue information");
      }
      const data = await response.json();
      setVenues(data.venues);
    } catch (error) {
      console.error("Error fetching venue information:", error);
    }
  };

  const handleNewVenueInputChange = (event) => {
    setNewVenue((prevVenue) => ({
      ...prevVenue,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditedVenueInputChange = (event) => {
    setEditedVenue((prevVenue) => ({
      ...prevVenue,
      [event.target.name]: event.target.value,
    }));
  };

  // POST
  const handleCreateVenue = async (event) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/venue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVenue),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setNewVenue({
        name: "",
        latitude: "",
        longitude: ""
      });
      setError("");
      fetchVenues();
    } catch (error) {
      setError(error.message);
    }
  };

  // PUT need to fix
  const handleUpdateVenue = async (event, id) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/venue?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedVenue),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setError("");
      fetchVenues();
    } catch (error) {
      setError(error.message);
    }
  };

  // DELETE
  const handleDeleteVenue = async (event, id) => {
    event.preventDefault();
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/venue?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Delete Error");
      }
      console.log(response)
      setError("");
      fetchVenues();
    } catch (error) {
      setError(error.message);
    }
  };

  if (venues.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Venue Information</h2>
      <div className="content">
        {/* Error message display */}
        {error && <div className="error-message">Error: {error}</div>}
        <h3>Create a New Venue</h3>
        <form className="form" onSubmit={handleCreateVenue}>
          <input type="text" placeholder="Name" name="name" value={newVenue.name} onChange={handleNewVenueInputChange} required />
          <input type="text" placeholder="Latitude" name="latitude" value={newVenue.latitude} onChange={handleNewVenueInputChange} required />
          <input type="text" placeholder="Longitude" name="longitude" value={newVenue.longitude} onChange={handleNewVenueInputChange} required />
          <button type="submit">Create a New Venue</button>
        </form>
      </div>    

      <div className="content">
        <h3>Change Venue Details</h3>
        <input type="text" placeholder="Name" name="name" value={editedVenue.name} onChange={handleEditedVenueInputChange} required />
        <input type="text" placeholder="Latitude" name="latitude" value={editedVenue.latitude} onChange={handleEditedVenueInputChange} required />
        <input type="text" placeholder="Longitude" name="longitude" value={editedVenue.longitude} onChange={handleEditedVenueInputChange} required />
      </div>

      <div className="content">
        <h3>Existing Venues:</h3>
        {venues.map((venue) => (
          <div key={venue.id} className="venue-item">
            <p><strong>Name:</strong> {venue.name}</p>
            <p><strong>Venue ID:</strong> {venue.id}</p>
            <p><strong>Latitude: </strong>{venue.latitude}</p>
            <p><strong>Longitude: </strong> {venue.longitude}</p>
            <button
              onClick={(e) => {
                handleUpdateVenue(e, venue.id);
              }}
            >
              Change Venue Details
            </button>
            <button
              onClick={(e) => {
                handleDeleteVenue(e, venue.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default VenueInfo;
