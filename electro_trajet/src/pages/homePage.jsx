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
    setInfosTrajet(data);
    // appel à SOAP ...
    /*const url = "http://127.0.0.1:8000?wsdl";

    const argsHello = { name: "Julien", times: 5 };
    const args = {
      distance: 5,
      autonomie: 4,
      vitesse_moyenne: 0,
      tps_chargement: 0,
    };

    SOAP.createClient(url, (err, client) => {
      if (err) {
        console.error(err);
        return;
      }

      // Appel à la méthode say_hello
      client.say_hello(argsHello, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Result say_hello:", result);
        }
      });

      // Appel à la méthode addition
      client.calcul_trajet(args, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Result addition:", result);
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
