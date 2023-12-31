import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const SingleLocationView = ({ latitude, longitude, venueName, eventNumber }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCNHq8YnW9beK2TfB2B05wTWW7zhMVgrPI",
  });

  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  const center = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
  const zoom = 15;

  const mapStyles = {
    backgroundColor: "#f0f0f0",
    height: "400px",
  };

  const handleMarkerClick = () => {
    setInfoWindowOpen(!infoWindowOpen);
  };

  return (
    <div>
      <GoogleMap mapContainerStyle={mapStyles} center={center} zoom={zoom}>
        <Marker position={center} onClick={handleMarkerClick} />

        {infoWindowOpen && (
          <InfoWindow position={center} onCloseClick={() => setInfoWindowOpen(false)}>
            <div>
              <p>{venueName}</p>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default SingleLocationView;
