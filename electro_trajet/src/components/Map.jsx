import React, { useEffect, useRef, useState } from "react";
// import Openrouteservice from "openrouteservice-js";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function Map({ villes, giveInfosTrajet }) {
  // const orsDirections = new Openrouteservice.Directions({
  //   api_key: "Votre clé API",
  // });

  const mapRef = useRef(null); // éviter de s'afficher plusieurs fois
  const [bornesIRVE, setBornesIRVE] = useState([]);

  const icon_marker = {
    icon: L.icon({
      iconUrl:
        "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
      iconSize: [25, 41],
    }),
  };
  const icon_marker_borne = {
    icon: L.icon({
      iconUrl: "./../../img/electro_trajet_ico_1.png",
      iconSize: [25, 41],
    }),
  };

  /**
   * Initialisation de la map
   */
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoom: 5 }).setView(
        //[45.583223, 5.909299],
        [
          (villes.villeA.lat + villes.villeB.lat) / 2,
          (villes.villeA.lon + villes.villeB.lon) / 2,
        ],
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

  /**
   * Ajout des villes sur la carte
   */
  useEffect(() => {
    if (mapRef.current) {
      addVilleAAndVilleB(mapRef);
      fetchTrajet();
    }
  }, [mapRef.current]);

  /**
   * Récupérer les bornes électriques
   */
  useEffect(() => {
    fetchBornesIRVE();
  }, []);

  /**
   * Ajoute à la carte les marqueurs de départ et d'arrivée
   * @param mapRef la carte
   */
  function addVilleAAndVilleB(mapRef) {
    // deux marqueurs
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
    // Ajuster la vue pour inclure les deux marqueurs
    const bounds = L.latLngBounds(latlngs);
    mapRef.current.fitBounds(bounds);
  }

  /**
   * Récupère des bornes électriques sur le trajet
   */
  function fetchBornesIRVE() {
    fetch(
      "https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=100"
    )
      .then((response) => response.json())
      .then((data) => {
        setBornesIRVE(data.results);
        for (let i = 0; i < data.results.length; i++) {
          let borne = data.results[i];
          L.marker(
            [borne.geo_point_borne.lat, borne.geo_point_borne.lon],
            icon_marker_borne
          ).addTo(mapRef.current);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }

  function fetchTrajet() {
    // Utiliser l'API Directions de OpenRouteService
    //const apiKey = "5b3ce3597851110001cf62482c9e7f7bfca24259965f3fbafb3fba43";
    //const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${villes.villeA.lon},${villes.villeA.lat}&end=${villes.villeB.lon},${villes.villeB.lat}`;

    // Ajouter le contrôle Leaflet Routing Machine
    var trajet = L.routing.control({
      waypoints: [
        L.latLng(villes.villeA.lat, villes.villeA.lon),
        L.latLng(villes.villeB.lat, villes.villeB.lon),
      ],
      routeWhileDragging: true,
      addWaypoints: false,
      show: false,
      draggableWaypoints: false,
    });

    trajet.on("routesfound", function (e) {
      var route = e.routes[0];
      var tempsDeTrajet = route.summary.totalTime; // Temps de trajet en secondes
      var distanceKm = route.summary.totalDistance / 1000; // distance du trajet en km

      var heures = Math.floor(tempsDeTrajet / 3600);
      var minutes = Math.floor((tempsDeTrajet % 3600) / 60);

      var vitesse_moyenne = distanceKm / (heures + minutes / 60);

      giveInfosTrajet({
        temps: tempsDeTrajet,
        distance: distanceKm,
        vitesseMoyenne: vitesse_moyenne.toPrecision(4),
      });
    });

    trajet.addTo(mapRef.current);

    /*fetch(apiUrl, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        const routePoints = data.features[0].geometry.coordinates.map((coord) =>
          L.latLng(coord[1], coord[0])
        );

        // Maintenant, routePoints contient la liste de points intermédiaires
        // Vous pouvez utiliser ces points pour afficher le trajet sur votre carte Leaflet
        const route = L.polyline(routePoints, { color: "blue" }).addTo(
          mapRef.current
        );
        mapRef.current.fitBounds(route.getBounds());
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des directions:", error)
      );*/
  }

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
      className="shadow-sm rounded"
    >
      <p className="visually-hidden">{JSON.stringify(villes)}</p>
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
