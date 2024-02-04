import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import useAuthStore from "./AuthStore"; // Path may vary

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const { token, email } = useAuthStore();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venue"); // Add your API URL here
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Failed to load venues:", error);
    }
  };

  const addFavoriteVenue = async (venueId) => {
    try {
      const response = await fetch("/api/user/fav_venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ venue_id: venueId }),
      });
      if (response.ok) {
        // Handle the success response
        // Reload the venues or update the state to reflect the changes
      } else {
        throw new Error("Failed to add favorite venue");
      }
    } catch (error) {
      console.error("Failed to add favorite venue:", error);
    }
  };

  return (
    <div>
      <h2>Venues</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.id}>
            {venue.name}
            {email && <Button onClick={() => addFavoriteVenue(venue.id)}>Add to Favorites</Button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VenueList;
