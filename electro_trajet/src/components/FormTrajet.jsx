import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function FormTrajet() {
  const [tempsTrajet, setTempsTrajet] = useState(0);
  const [villeA, setVilleA] = useState("");
  const [villeB, setVilleB] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

    // Effectuer la recherche dans le fichier JSON
    const results = optionsVilles.filter((ville) =>
      ville.label.toLowerCase().includes(term.toLowerCase())
    );

    // Mettre à jour les résultats de la recherche
    term !== "" ? setSearchResults(results) : setSearchResults([]);
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
        <input
          type="search"
          autoComplete="off"
          placeholder="Départ"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <ul
          style={{
            listStyle: "none",
            width: "100%",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {searchResults.map((result, index) => (
            <li key={index}>{result.label}</li>
          ))}
        </ul>
      </form>

      <form className="form-floating m-3">
        {!isVillesLoading ? (
          <div id="villes">
            <div className="m-3">
              <Select
                placeholder="Départ"
                id="villeA"
                noOptionsMessage={() => {
                  return "Aucune ville disponible...";
                }}
                onChange={handleVilleAChange}
                options={optionsVilles}
              />
            </div>
            <div className="m-3">
              <Select
                placeholder="Arrivée"
                id="villeB"
                noOptionsMessage={() => {
                  return "Aucune ville disponible...";
                }}
                onChange={handleVilleBChange}
                options={optionsVilles}
              />
            </div>
          </div>
        ) : (
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Chargement...</span>
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
