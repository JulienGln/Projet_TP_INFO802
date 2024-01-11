import React from "react";

export default function Map() {
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
