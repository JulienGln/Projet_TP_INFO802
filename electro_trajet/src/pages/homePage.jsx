import React from "react";
import Map from "../components/Map";
import FormTrajet from "../components/FormTrajet";

export default function Home() {
  return (
    <div>
      <h1
        style={{ backgroundColor: "blueviolet", color: "white" }}
        className="p-5 fw-light fs-1"
      >
        Electro'Trajet
      </h1>
      <div className="d-flex flex-column flex-md-row justify-content-around">
        <FormTrajet />
        <Map />
      </div>
    </div>
  );
}
