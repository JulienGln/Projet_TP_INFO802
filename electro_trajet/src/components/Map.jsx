import React, { useEffect, useRef } from "react";
// import Openrouteservice from "openrouteservice-js";
import * as L from "leaflet";

export default function Map() {
  // const orsDirections = new Openrouteservice.Directions({
  //   api_key: "Votre clé API",
  // });

  const mapRef = useRef(null); // éviter de s'afficher plusieurs fois

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoom: 13 }).setView(
        [48.8566, 2.3522],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // Ajoutez un écouteur d'événements pour le zoom
    mapRef.current.on("zoomend", function () {
      // Ajustez la taille de la carte après le zoom
      mapRef.current.invalidateSize();
    });
  }, []);

  return <div id="map" style={{ height: "500px", width: "50%" }}></div>;
}
