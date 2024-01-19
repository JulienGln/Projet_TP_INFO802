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
