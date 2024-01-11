import React, { useState } from "react";

export default function FormTrajet() {
  const [tempsTrajet, setTempsTrajet] = useState(0);
  return (
    <div>
      <form className="form-floating m-3">
        <div className="form-floating m-3">
          {/* mettre un component select de react cf CISALB*/}
          <input
            type="text"
            className="form-control"
            id="villeA"
            placeholder="Entrez le nom d'une ville"
            autoComplete="off"
          />
          <label htmlFor="villeA">Départ</label>
        </div>
        <div className="form-floating m-3">
          {/* mettre un component select de react cf CISALB*/}
          <input
            type="text"
            className="form-control"
            id="villeB"
            placeholder="Entrez le nom d'une ville"
            autoComplete="off"
          />
          <label htmlFor="villeB">Arrivée</label>
        </div>
        <div className="form-floating m-3">
          {/* mettre un component select de react cf CISALB*/}
          <select className="form-select" id="vehicule">
            <option selected>Sélectionnez un véhicule</option>
            <option value="1">Tesla</option>
            <option value="2">Peugeot</option>
            <option value="3">Renault</option>
          </select>
          <label htmlFor="vehicule">Véhicule</label>
        </div>
      </form>
      <p className="fw-bold">Temps de trajet : {tempsTrajet}</p>
    </div>
  );
}
