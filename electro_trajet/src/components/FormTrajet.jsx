import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function FormTrajet({ giveCoordsToMap }) {
  const [tempsTrajet, setTempsTrajet] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTermB, setSearchTermB] = useState("");
  const [searchResultsB, setSearchResultsB] = useState([]);
  const [coordsVilleA, setCoordsVilleA] = useState(null); // coordonnées ville A et B
  const [coordsVilleB, setCoordsVilleB] = useState(null);
  const [optionsVilles, setOptionsVilles] = useState([]);
  const [isVillesLoading, setIsVillesLoading] = useState(true);

  const optionsVehicules = [
    { value: "tesla", label: "Tesla" },
    { value: "renault", label: "Renault Zoé" },
    { value: "peugeot", label: "Peugeot e-208" },
  ]; // à chercher dynamiquement

  /**
   * Formate les données JSON de l'API pour le composant React Select
   * @param {JSON} villes les villes renvoyées par l'API
   */
  function formatageVilles(villes) {
    var res = [];
    for (let i = 0; i < villes.length; i++) {
      res.push({ value: villes[i].nom, label: villes[i].nom });
    }
    setOptionsVilles(res);
  }

  function handleSearchChange(e) {
    const term = e.target.value;
    setSearchTerm(term);

    const results = optionsVilles.filter((ville) =>
      ville.label.toLowerCase().includes(term.toLowerCase())
    );

    term !== "" ? setSearchResults(results) : setSearchResults([]);
  }

  function handleSearchBChange(e) {
    const term = e.target.value;
    setSearchTermB(term);

    const results = optionsVilles.filter((ville) =>
      ville.label.toLowerCase().includes(term.toLowerCase())
    );

    term !== "" ? setSearchResultsB(results) : setSearchResultsB([]);
  }

  function handleChangeCoordsVille(position) {
    if (position === "départ") {
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${searchTerm}&limit=1`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Vérifiez si des résultats ont été retournés
          if (data.features.length > 0) {
            const firstResult = data.features[0];
            const coords = firstResult.geometry.coordinates;

            const latitude = coords[1];
            const longitude = coords[0];

            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            setCoordsVilleA({ lat: latitude, lon: longitude });
          } else {
            console.log("Aucun résultat trouvé pour la ville spécifiée.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la requête API Adresse", error);
        });
    } else if (position === "arrivée") {
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${searchTermB}&limit=1`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Vérifiez si des résultats ont été retournés
          if (data.features.length > 0) {
            const firstResult = data.features[0];
            const coords = firstResult.geometry.coordinates;

            const latitude = coords[1];
            const longitude = coords[0];

            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            setCoordsVilleB({ lat: latitude, lon: longitude });
          } else {
            console.log("Aucun résultat trouvé pour la ville spécifiée.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la requête API Adresse", error);
        });
    }
  }

  function handleSubmitForm(event) {
    event.preventDefault(); // évite le rechargement de la page
    // transmission des coordonnées à la map une fois les deux villes renseignées
    if (coordsVilleA && coordsVilleB) {
      giveCoordsToMap({ villeA: coordsVilleA, villeB: coordsVilleB });
    }
  }

  useEffect(() => {
    // fetch("https://geo.api.gouv.fr/departements/73/communes") => pour tester
    fetch("https://geo.api.gouv.fr/communes")
      .then((response) => response.json())
      .then((data) => {
        //setOptionsVilles(data);
        formatageVilles(data);
        setIsVillesLoading(false); // Les données sont récupérées, on met isLoading à false
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setIsVillesLoading(false); // Il y a eu une erreur, on met quand même isLoading à false
      });
  }, []);

  return (
    <div>
      <form className="form-floating">
        {!isVillesLoading ? (
          <div id="villes">
            <div className="form-floating m-3">
              <input
                id="villeA"
                required
                type="search"
                autoComplete="off"
                placeholder="Départ"
                class="form-control"
                onChange={handleSearchChange}
                value={searchTerm}
                style={{ width: "150%" }}
              />
              <label for="villeA">Départ</label>
              <ul
                style={{
                  listStyle: "none",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {searchResults.map(
                  (result, index) =>
                    index < 5 && (
                      <li
                        key={index}
                        onClick={() => {
                          setSearchTerm(result.label);
                          setSearchResults([]);
                          handleChangeCoordsVille("départ");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {result.label}
                      </li>
                    )
                )}
              </ul>
            </div>
            <div className="form-floating m-3">
              <input
                id="villeB"
                required
                type="search"
                autoComplete="off"
                placeholder="Arrivée"
                class="form-control"
                onChange={handleSearchBChange}
                value={searchTermB}
                style={{ width: "150%" }}
              />
              <label for="villeB">Arrivée</label>
              <ul
                style={{
                  listStyle: "none",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {searchResultsB.map(
                  (result, index) =>
                    index < 5 && (
                      <li
                        key={index}
                        onClick={() => {
                          setSearchTermB(result.label);
                          setSearchResultsB([]);
                          handleChangeCoordsVille("arrivée");
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {result.label}
                      </li>
                    )
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        )}

        <div className="m-3">
          <Select
            placeholder="Véhicule"
            id="vehicule"
            required
            noOptionsMessage={() => {
              return "Aucune véhicule disponible...";
            }}
            options={optionsVehicules}
          />
        </div>
        <button
          className="btn btn-success"
          type="submit"
          disabled={!coordsVilleA && !coordsVilleB}
          onClick={handleSubmitForm}
        >
          Valider
        </button>
      </form>
      <p className="fw-bold">Temps de trajet : {tempsTrajet}</p>
    </div>
  );
}
