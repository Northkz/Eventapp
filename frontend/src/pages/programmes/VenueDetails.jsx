import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SingleLocationView from "./SingleLocationView"; // For map view
import CommentComponent from "./CommentComponent"; // For comments
import useAuthStore from "../../AuthStore"; // For authentication
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid, regular, brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./VenueDetails.css";
import "./Programmes.css";
import "../../App.css";
import ShareComponent from "./ShareComponent";

const VenueDetails = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [venueDetails, setVenueDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null); // [eventDetails, setEventDetails
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [commentAdded, setCommentAdded] = useState(false);

  const fetchAverageRating = async () => {
    const response = await fetch(`/api/venue/${venueId}/averageRating`);
    const data = await response.json();
    setAverageRating(data.averageRating);
  };

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/venue?id=${venueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch venue details");
        const data = await response.json();
        // console.log("DATA", data);
        setVenueDetails(data);

        // Fetch favorite venues
        const favResponse = await fetch(`${apiUrl}/api/user/fav_venues`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favResponse.ok) throw new Error("Failed to fetch favorite venues");

        const favData = await favResponse.json();
        // console.log(favData);
        // Check if the current venue is in the list of favorite venues
        setIsFavorite(favData.some((favVenue) => favVenue === venueId));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchVenueDetails();
  }, [apiUrl, venueId, token, navigate, isFavorite, averageRating]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/venue/averageRating/?venueId=${venueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch average rating");
        const data = await response.json();
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchAverageRating();
  }, [apiUrl, venueId, token, averageRating, commentAdded]);

  // // fetch events details using each event id in the venueDetails.eventsList array
  /*
  useEffect(() => {
    const fetchEventsDetails = async () => {
      try {
        if (!venueDetails || !venueDetails.eventsList) {
          // Don't proceed if venueDetails or eventsList is not available
          return;
        }
        const eventIds = venueDetails.eventsList.join(',');
  
        const response = await fetch(`${apiUrl}/api/event?id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        const matchingItems = data.events.filter(event => venueDetails.eventsList.includes(event.id));
        //console.log("MatchItem",matchingItems);
        setEventDetails(matchingItems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    if (token && venueDetails) {
      fetchEventsDetails();
    }
  }, [apiUrl, venueDetails, token, navigate]);
  */
  

  const handleFavorite = async () => {
    try {
      let method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(`${apiUrl}/api/user/fav_venues`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ venue_id: venueId }),
      });

      if (!response.ok) throw new Error("Failed to update favorite");
      const data = await response.json();

      // Update favorite state
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a notification)
    }
  };

  if (loading) return <p>Loading...</p>;

  // Function to navigate back
  const goBack = () => navigate(-1);
  console.log("matchingEVENTTTTT",eventDetails);
  console.log("VENUEDetail",venueDetails);
  return (
    <div className="venue-details">
      <button className="back-button" onClick={goBack}>
        <FontAwesomeIcon icon={solid("arrow-left")} /> Back
      </button>
      {venueDetails && (
        <>
          <SingleLocationView latitude={venueDetails.latitude} longitude={venueDetails.longitude} venueName={venueDetails.name}/>
          {/*SECTION VENUE NAME*/}
          <h3 class="pt-3 fw-bold">{venueDetails.name}</h3>
          {/* Additional venue details */}
          <div class="d-flex gap-4">
            <button className="btn btn-outline" onClick={handleFavorite}>
              <FontAwesomeIcon icon={isFavorite ? solid("heart") : regular("heart")} className="pe-2" />
              {isFavorite ? " Remove from Favorites" : " Add to Favorites"}
            </button>
            <div className="average-rating">
              {/* Average Rating: {averageRating.toFixed(1)} */}
              {/* if average rating is null, show "No ratings yet" */}
              {averageRating ? (
                <div className="average-rating">
                  Average Rating: {averageRating.toFixed(1)}
                  <div className="stars">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <FontAwesomeIcon icon={ratingValue <= averageRating + 0.5 ? solid("star") : regular("star")} className="star" />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="average-rating">No ratings yet</div>
              )}
            </div>

            <div className="share">
              <div>
                Share:
                <ShareComponent content={"Check out this venue: " + venueDetails.name} />
              </div>
            </div>
          </div>
 
          <div class="card mt-3">
            <div className="">
              <h4>Venue Information</h4>
              <p>Longitude: {venueDetails.longitude}</p>
              <p>Latitude: {venueDetails.latitude}</p>
              <p>Number of Events: {venueDetails.eventsList.length}</p>
            </div>
          </div>
          <div className="">
            <CommentComponent venueId={venueId} fetchAverageRating={fetchAverageRating} setCommentAdded={setCommentAdded} />
          </div>
          {
          /*           <div>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Venue ID</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Presenter</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventDetails && eventDetails.map(event => (
                          <tr key={event.id}>
                          <td>{event.id}</td>
                          <td>{event.title}</td>
                          <td>{event.venue_id}</td>
                          <td>{event.date}</td>
                          <td>{event.description}</td>
                          <td>{event.presenter}</td>
                        </tr>
                        ))}
                      </tbody>
                    </table>

                    </div> */
          }
          

          

        </>
      )}
    </div>
  );
};

export default VenueDetails;
