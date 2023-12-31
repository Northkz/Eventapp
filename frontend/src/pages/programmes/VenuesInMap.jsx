import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const VenuesInMap = ({ token }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCNHq8YnW9beK2TfB2B05wTWW7zhMVgrPI",
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch(`${apiUrl}/api/venue`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Response data:", data);

        if (Array.isArray(data.venues)) {
          setLocations(data.venues);
        } else {
          throw new Error("Invalid data format. Expected an array.");
        }
      } catch (error) {
        console.error("Error fetching locations:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [token, apiUrl]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const onLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach(({ latitude, longitude }) =>
      bounds.extend(new window.google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)))
    );
    map.fitBounds(bounds);
    setMapRef(map);
  };

  const handleMarkerClick = (location) => {
    // Use the Link component to navigate to the single view of the clicked location
    window.location.href = `/venue/${location.id}`;
  };

  const defaultCenter = locations.length > 0 ? { lat: parseFloat(locations[0].latitude), lng: parseFloat(locations[0].longitude) } : { lat: 0, lng: 0 };

  const mapStyles = {
    backgroundColor: "#f0f0f0",
    height: "400px",
  };

  return (
    <div>
      <GoogleMap mapContainerStyle={mapStyles} center={defaultCenter} zoom={10} onLoad={onLoad}>
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
            onClick={() => handleMarkerClick(location)}
          />
        ))}
      </GoogleMap>

      {loading && <div>Loading locations...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default VenuesInMap;
