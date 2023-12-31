// import React from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// const GoogleMapView = ({ locations, center, zoom }) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
//   });

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading maps</div>;

//   const mapStyles = {
//     backgroundColor: "#f0f0f0",
//     height: "100%",
//   };

//   return (
//     <GoogleMap mapContainerClassName="map-container" center={center} zoom={zoom} options={{ styles: mapStyles }}>
//       {locations.map((location) => (
//         <Marker key={location.id} position={location.position} />
//       ))}
//     </GoogleMap>
//   );
// };
// export default GoogleMapView;
