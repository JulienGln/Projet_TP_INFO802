import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function FormTrajet() {
  const [tempsTrajet, setTempsTrajet] = useState(0);
  const [villeA, setVilleA] = useState("");
  const [villeB, setVilleB] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTermB, setSearchTermB] = useState("");
  const [searchResultsB, setSearchResultsB] = useState([]);
  const [optionsVilles, setOptionsVilles] = useState([]);
  const [isVillesLoading, setIsVillesLoading] = useState(true);
  // const optionsVilles = [
  //   { value: "chambery", label: "Chambéry" },
  //   { value: "paris", label: "Paris" },
  //   { value: "brest", label: "Brest" },
  // ]; // à chercher dynamiquement
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

  function handleVilleAChange(event) {
    setVilleA(event.value);
  }

  function handleVilleBChange(event) {
    setVilleB(event.value);
  }

  useEffect(() => {
    // fetch("https://geo.api.gouv.fr/communes") => très bien mais très lent !
    fetch("https://geo.api.gouv.fr/departements/73/communes")
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
            noOptionsMessage={() => {
              return "Aucune véhicule disponible...";
            }}
            options={optionsVehicules}
          />
        </div>
      </form>
      <p className="fw-bold">Temps de trajet : {tempsTrajet}</p>
    </div>
  );
}
