import React from "react";
import Openrouteservice from "openrouteservice-js";

export default function Map() {
  const orsDirections = new Openrouteservice.Directions({
    api_key: "Votre clé API",
  });

  return (
    <div>
      <iframe
        width="600"
        height="450"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=
    &q=Space+Needle,Seattle+WA"
      ></iframe>
    </div>
  );
}
