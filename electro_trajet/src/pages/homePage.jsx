import React, { useState } from "react";
import Map from "../components/Map";
import FormTrajet from "../components/FormTrajet";
//import * as SOAP from "soap";

export default function Home() {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [infosTrajet, setInfosTrajet] = useState(null);

  function getCoordsFromForm(data) {
    setSelectedCoordinates(data);
  }

  function getInfosTrajet(data) {
    /* data : 
    {"temps":14733.9,"distance":367.8192,"vitesseMoyenne":"90.08",
    "vehicule":{"id":"600e964a5fc2ee68bcb1f183","naming":{"make":"Kia","model":"e-Niro","chargetrip_version":"64 kWh (2021 - 2022)"},"media":{"image":{"thumbnail_url":"https://cars.chargetrip.io/6012a20df9c50f63d328b28a-d9a03dddc473b43c8e54e9ff967185d26a95444c.png"}},"battery":{"usable_kwh":64},"range":{"chargetrip_range":{"best":392,"worst":337}}}} */
    setInfosTrajet(data);

    // appel à SOAP ...
    const url = "http://127.0.0.1:8000?wsdl";

    const puissance_borne = 11; // champ "puiss_max" de l'API Borne IRVE
    const args = {
      distance: data.distance,
      autonomie: data.vehicule.range.chargetrip_range.worst,
      vitesse_moyenne: data.vitesseMoyenne,
      tps_chargement: data.vehicule.battery.usable_kwh / puissance_borne,
    };

    /*SOAP.createClient(url, (err, client) => {
      if (err) {
        console.error(err);
        return;
      }

      // Appel à la méthode addition
      client.calcul_trajet(args, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Resultat trajet:", result);
        }
      });
    });*/
  }

  return (
    <div>
      <h1
        style={{
          backgroundColor: "blueviolet",
          color: "white",
          cursor: "pointer",
        }}
        className="p-5 fw-light fs-1"
        onClick={() => window.location.replace(".")}
      >
        Electro'Trajet
      </h1>
      <div className="d-flex flex-column flex-md-row justify-content-around">
        <FormTrajet giveCoordsToMap={getCoordsFromForm} />
        {selectedCoordinates && (
          <Map villes={selectedCoordinates} giveInfosTrajet={getInfosTrajet} />
        )}
      </div>
    </div>
  );
}
