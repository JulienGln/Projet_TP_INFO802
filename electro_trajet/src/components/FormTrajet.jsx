import React, { useState, useEffect } from "react";
import Select from "react-select";

export default function FormTrajet({ giveCoordsToMap, tempsTrajet }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTermB, setSearchTermB] = useState("");
  const [searchResultsB, setSearchResultsB] = useState([]);
  const [coordsVilleA, setCoordsVilleA] = useState(null); // coordonnées ville A et B
  const [coordsVilleB, setCoordsVilleB] = useState(null);
  const [optionsVilles, setOptionsVilles] = useState([]);
  const [optionsVehicules, setOptionsVehicules] = useState([]);
  const [vehicules, setVehicules] = useState([]); // les véhicules fournies via graphQL et leurs infos
  const [vehicule, setVehicule] = useState(null); // le véhicule choisi dans le select du formulaire (id + nom)
  const [isVillesLoading, setIsVillesLoading] = useState(true);
  const [isVehiclesLoading, setIsVehiclesLoading] = useState(true);
  const [hasErrors, setHasErrors] = useState(false);
  const [infoTrouPaume, setInfoTrouPaume] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false); // lorsque la map est affichée, les inputs sont désactivées

  /**
   * Formate les données JSON de l'API pour le composant React Select
   * @param {JSON} villes les villes renvoyées par l'API
   */
  function formatageVilles(villes) {
    var res = [];
    for (let i = 0; i < villes.length; i++) {
      //villes[i].population >= 3000 && // si on veut limiter aux plus grandes villes
      res.push({ value: villes[i].nom, label: villes[i].nom });
    }
    setOptionsVilles(res);
  }

  /**
   * Formate les données JSON de l'API pour le composant React Select
   * @param {JSON} vehicules les véhicules renvoyées par l'API
   */
  function formatageVehicules(vehicules) {
    var res = [];
    for (let i = 0; i < vehicules.length; i++) {
      //vehicules[i].population >= 3000 && // si on veut limiter aux plus grandes vehicules
      res.push({
        value: vehicules[i].id,
        label: vehicules[i].naming.make + " " + vehicules[i].naming.model,
        //+` [${vehicules[i].naming.chargetrip_version}]`,
      });
    }
    setOptionsVehicules(res);
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

  function handleVehiculeChange(event) {
    setVehicule(event.value);
  }

  function handleChangeCoordsVille(position) {
    if (position === "départ") {
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${searchTerm}&type=municipality&limit=1`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Vérifiez si des résultats ont été retournés
          if (data.features.length > 0) {
            const firstResult = data.features[0];
            const coords = firstResult.geometry.coordinates;

            const latitude = coords[1];
            const longitude = coords[0];

            if (firstResult.properties.population < 1000) {
              setInfoTrouPaume(true);
            } else {
              setInfoTrouPaume(false);
            }

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
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${searchTermB}&type=municipality&limit=1`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Vérifiez si des résultats ont été retournés
          if (data.features.length > 0) {
            const firstResult = data.features[0];
            const coords = firstResult.geometry.coordinates;

            const latitude = coords[1];
            const longitude = coords[0];

            if (firstResult.properties.population < 1000) {
              setInfoTrouPaume(true);
            } else {
              setInfoTrouPaume(false);
            }

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
      setHasErrors(false);
      setInfoTrouPaume(false);
      setDisableInputs(true);
      giveCoordsToMap({
        villeA: coordsVilleA,
        villeB: coordsVilleB,
        vehicule: vehicules.find((car) => car.id === vehicule),
      });
    } else {
      setHasErrors(true);
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

  // récup des véhicules électriques
  useEffect(() => {
    const apiUrl = "https://api.chargetrip.io/graphql";
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-client-id": "5ed1175bad06853b3aa1e492",
        "x-app-id": "623998b2c35130073829b2d2",
      },
      body: JSON.stringify({
        query: `query vehicleList {
          vehicleList(
            page: 0, 
            size: 20
          ) {
            id
            naming {
              make
              model
              chargetrip_version
            }
            media {
              image {
                thumbnail_url
              }
            }
            battery {
              usable_kwh
            }
            range {
              chargetrip_range {
                best
                worst
              }
            }
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVehicules(data.data.vehicleList),
          formatageVehicules(data.data.vehicleList);
      });
    /*const fetchData = async () => {
      try {
        const headers = {
          //Replace this x-client-id and app-id with your own to get access to more vehicles
          "x-client-id": "5ed1175bad06853b3aa1e492",
          "x-app-id": "623998b2c35130073829b2d2",
          //"x-client-id": "65aa81e90117350bae37ad07",
          //"x-app-id": "65aa81e90117350bae37ad09",
        };
        const apiUrl = "https://api.chargetrip.io/graphql";

        const response = await axios.get(apiUrl, {
          headers: headers,
        });

        setoptionsVehicules(response.data);
      } catch (err) {
        console.log(err);
        setIsVehiclesLoading(true);
      } finally {
        setIsVehiclesLoading(false);
      }
    };

    fetchData();*/
    /*clientQL
      .query({ query: GET_ELECTRIC_VEHICLES })
      .then((result) => {
        setoptionsVehicules(result.data.electricVehicles);
        setIsVehiclesLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsVehiclesLoading(true);
      });*/
  }, []);

  return (
    <div>
      <form className="form-floating" onSubmit={handleSubmitForm}>
        {!isVillesLoading ? (
          <div id="villes">
            <div className="form-floating m-3">
              <input
                id="villeA"
                required
                type="search"
                autoComplete="off"
                placeholder="Départ"
                className="form-control shadow-sm border border-bottom-0"
                onChange={handleSearchChange}
                value={searchTerm}
                disabled={disableInputs}
                style={{
                  width: "150%",
                }}
              />
              <label htmlFor="villeA">Départ</label>
              <ul
                style={{
                  listStyle: "none",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {searchResults
                  .sort((a, b) => {
                    return a.label.length - b.label.length;
                  })
                  .map(
                    (result, index) =>
                      index < 10 && (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchTerm(result.label);
                            setSearchResults([]);
                            handleChangeCoordsVille("départ");
                          }}
                          style={{
                            cursor: "pointer",
                            padding: "10px",
                            backgroundColor:
                              index % 2 === 0 ? "#f6f6f6" : "#fff",
                            borderBottom: "1px solid lightgray",
                          }}
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
                className="form-control shadow-sm border border-bottom-0"
                onChange={handleSearchBChange}
                value={searchTermB}
                disabled={disableInputs}
                style={{ width: "150%" }}
              />
              <label htmlFor="villeB">Arrivée</label>
              <ul
                style={{
                  listStyle: "none",
                  width: "100%",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                {searchResultsB
                  .sort((a, b) => {
                    return a.label.length - b.label.length;
                  })
                  .map(
                    (result, index) =>
                      index < 10 && (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchTermB(result.label);
                            setSearchResultsB([]);
                            handleChangeCoordsVille("arrivée");
                          }}
                          style={{
                            cursor: "pointer",
                            padding: "10px",
                            backgroundColor:
                              index % 2 === 0 ? "#f6f6f6" : "#fff",
                            borderBottom: "1px solid lightgray",
                          }}
                        >
                          {result.label}
                        </li>
                      )
                  )}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="spinner-border text-primary" role="status"></div>
            <br />
            <span className="fw-bold">
              Chargement des communes de France...
            </span>
          </>
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
            onChange={handleVehiculeChange}
            className="shadow-sm"
          />
        </div>
        {vehicule && (
          <img
            src={
              vehicules.find((car) => car.id === vehicule).media.image
                .thumbnail_url
            }
            alt="un véhicule électrique"
          />
        )}
        <br />
        <button
          className="btn btn-success shadow-sm"
          type="submit"
          disabled={!coordsVilleA || !coordsVilleB || !vehicule}
        >
          Valider
        </button>
      </form>
      {hasErrors && (
        <div
          className="alert alert-danger mt-4 mx-5 align-items-center shadow-sm"
          role="alert"
        >
          Les données des villes ne sont pas correctes
        </div>
      )}
      {infoTrouPaume && (
        <>
          {/*<div className="alert alert-info mt-4 mx-5 d-flex align-items-center shadow-sm" role="alert">
            Attention : Les coordonnées que vous avez entrées correspondent à un
            lieu isolé ou peu connu. Il se peut que les résultats de la
            recherche soient imprécis ou erronés. Veuillez vérifier la validité
            des données avant de les utiliser. Merci de votre compréhension.
      </div>*/}
          <div
            className="alert alert-info mt-4 mx-5 d-flex align-items-center shadow-sm"
            role="alert"
          >
            Attention : Vous avez tapé les coordonnées d’un bled paumé où même
            les mouches ne vont pas. Il y a de fortes chances que les résultats
            soient bidons ou à côté de la plaque. Ne faites pas confiance aux
            données sans les vérifier. C’est pas de ma faute, c’est la vôtre.
          </div>
        </>
      )}
      <div className={"mt-3" + (tempsTrajet ? "" : " placeholder-glow")}>
        <p className={"fw-bold" + (tempsTrajet ? "" : " placeholder")}>
          Temps de trajet : {tempsTrajet}h
        </p>
      </div>
    </div>
  );
}
