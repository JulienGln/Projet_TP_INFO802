import React, { useEffect, useRef } from "react";
// import Openrouteservice from "openrouteservice-js";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ villes }) {
  // const orsDirections = new Openrouteservice.Directions({
  //   api_key: "Votre clé API",
  // });

  const mapRef = useRef(null); // éviter de s'afficher plusieurs fois

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoom: 5 }).setView(
        [45.583223, 5.909299],
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

    // Ajoutez un écouteur d'événements pour le zoom
    mapRef.current.on("zoomend", function () {
      // Ajustez la taille de la carte après le zoom
      mapRef.current.invalidateSize();
    });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // deux marqueurs
      const icon_marker = {
        icon: L.icon({
          iconUrl:
            "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
          iconSize: [25, 41],
        }),
      };
      const coordsVilleA = villes.villeA;
      const marker1 = L.marker(
        [coordsVilleA.lat, coordsVilleA.lon],
        icon_marker
      ).addTo(mapRef.current);
      const coordsVilleB = villes.villeB;
      const marker2 = L.marker(
        [coordsVilleB.lat, coordsVilleB.lon],
        icon_marker
      ).addTo(mapRef.current);

      // ligne de trajet entre les deux marqueurs
      const latlngs = [marker1.getLatLng(), marker2.getLatLng()];
      const polyline = L.polyline(latlngs, { color: "blue" }).addTo(
        mapRef.current
      );

      // Ajuster la vue pour inclure les deux marqueurs
      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds);
    }
  }, [mapRef.current]);

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
      <p>{JSON.stringify(villes)}</p>
      <div
        id="map"
        style={{
          height: "100vh",
          width: "100%",
        }}
        className="border rounded"
      ></div>
    </div>
  );
}
