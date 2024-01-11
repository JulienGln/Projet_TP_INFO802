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
      mapRef.current = L.map("map", { zoom: 5 }).setView(
        [46.227638, 2.213749],
        5
      );

      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      );

      tileLayer.on("load", function () {
        // La carte est entièrement chargée
        mapRef.current.invalidateSize();
      });
      tileLayer.addTo(mapRef.current);
    }

    mapRef.current.on("load", function () {
      // La carte est entièrement chargée
      mapRef.current.invalidateSize();
    });

    // Ajoutez un écouteur d'événements pour le zoom
    mapRef.current.on("zoomend", function () {
      // Ajustez la taille de la carte après le zoom
      mapRef.current.invalidateSize();
    });
  }, []);

  return (
    <div
      id="map-container"
      style={{
        height: "500px",
        width: "50%",
        maxWidth: "50%",
        maxHeight: "500px",
        overflow: "hidden",
      }}
    >
      <div
        id="map"
        style={{
          height: "100%",
          width: "100%",
        }}
        className="border rounded"
      ></div>
    </div>
  );
}
