import React from "react";
import Map from "../components/Map";
import FormTrajet from "../components/FormTrajet";

export default function Home() {
  return (
    <div>
      <h1>Bienvenue !</h1>
      <FormTrajet />
      <Map />
    </div>
  );
}
