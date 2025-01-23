import { createContext, useContext } from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

const GoogleMapsContext = createContext(null);

export function GoogleMapsProvider({ children }) {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
    >
      <GoogleMapsContext.Provider value={true}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
}

export const useGoogleMaps = () => useContext(GoogleMapsContext);
