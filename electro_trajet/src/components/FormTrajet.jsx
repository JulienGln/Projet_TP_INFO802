import React from "react";

export default function FormTrajet() {
  return (
    <div>
      <form className="form-floating">
        <div className="form-floating">
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
        <div className="form-floating">
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
        <div className="form-floating">
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
    </div>
  );
}
