import { useGoogleMaps } from "@/context/GoogleMapsContext";
import { GoogleMap } from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px", // Set a default height
  borderRadius: "0.5rem",
};

export function Map({ place, className }) {
  const [coordinates, setCoordinates] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const isLoaded = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && place) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: place }, (results, status) => {
        if (status === "OK") {
          const { lat, lng } = results[0].geometry.location;
          setCoordinates({ lat: lat(), lng: lng() });
        }
      });
    }
  }, [place, isLoaded]);

  const onLoad = useCallback(
    (map) => {
      setMap(map);
      if (coordinates) {
        const newMarker = new window.google.maps.Marker({
          position: coordinates,
          map: map,
        });
        setMarker(newMarker);
      }
    },
    [coordinates]
  );

  const onUnmount = useCallback(() => {
    if (marker) {
      marker.setMap(null);
    }
    setMap(null);
    setMarker(null);
  }, [marker]);

  if (!isLoaded || !coordinates) return null;

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      ></GoogleMap>
    </div>
  );
}
