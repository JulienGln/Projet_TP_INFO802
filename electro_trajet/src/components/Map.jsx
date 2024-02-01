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
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconSize: [25, 41],
    }),
  };
  const icon_marker_borne = {
    icon: L.icon({
      //iconUrl: "./../../img/electro_trajet_ico_1.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
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
          /*L.marker(
            [borne.geo_point_borne.lat, borne.geo_point_borne.lon],
            icon_marker_borne
          ).addTo(mapRef.current);*/
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }

  /**
   * Récupère les bornes prêt d'un point (lat, lon), dans un rayon en km donné (radius)
   */
  async function fetchBornesNearPoint(lat, lon, radius) {
    const apiUrl = `https://odre.opendatasoft.com/explore/dataset/bornes-irve/api/?disjunctive.region&disjunctive.departement&geofilter.distance=${lat},${lon},${radius}`;
    //const proxyUrl = `http://localhost:3001/proxy?lat=${lat}&lon=${lon}&radius=${radius}`;
    const point = "POINT(" + lat + " " + lon + ")";
    const api2Url =
      "https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=1&where=(distance(`geo_point_borne`, geom'" +
      point +
      "', " +
      radius +
      "m))";
    try {
      const response = await fetch(api2Url);
      if (!response.ok) {
        throw new Error(`Erreur de l'API: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bornes électriques :",
        error
      );
      throw error;
    }
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

    trajet.on("routesfound", async function (e) {
      var route = e.routes[0];
      var tempsDeTrajet = route.summary.totalTime; // Temps de trajet en secondes
      var distanceKm = route.summary.totalDistance / 1000; // distance du trajet en km
      var points = route.coordinates; // tous les points qui composent le trajet

      console.log("Points du trajet : " + points.length);
      const radius = 20 * 1000; // rayon en kilomètres
      var bornesProches = [];

      // faire un serveur express proxy qui interroge l'API
      // OU récupérer le geojson des bornes et faire un serveur express pour ma propre API : https://transport.data.gouv.fr/datasets/fichier-consolide-des-bornes-de-recharge-pour-vehicules-electriques
      for (let i = 0; i < points.length; i += Math.floor(points.length / 100)) {
        const result = await fetchBornesNearPoint(
          points[i].lat,
          points[i].lng,
          radius
        );
        result.results.length > 0 && bornesProches.push(result.results);
        //console.log(i);
      }
      console.log("Bornes proches : " + JSON.stringify(bornesProches));
      for (let i = 0; i < bornesProches.length; i++) {
        const borne = bornesProches[i];
        if (
          borne[0] !== undefined &&
          borne[0].ylatitude !== undefined &&
          borne[0].xlongitude !== undefined
        ) {
          L.marker(
            [borne[0].xlongitude, borne[0].ylatitude],
            icon_marker_borne
          ).addTo(mapRef.current);
        }
      }

      var heures = Math.floor(tempsDeTrajet / 3600);
      var minutes = Math.floor((tempsDeTrajet % 3600) / 60);

      var vitesse_moyenne = distanceKm / (heures + minutes / 60);

      giveInfosTrajet({
        temps: tempsDeTrajet,
        distance: distanceKm,
        vitesseMoyenne: vitesse_moyenne.toPrecision(4),
        vehicule: villes.vehicule,
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
