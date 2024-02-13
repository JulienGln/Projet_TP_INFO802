const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");
//import fetch from "node-fetch";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/proxy", async (req, res) => {
  const { lat, lon, radius } = req.query;

  const apiUrl = `https://odre.opendatasoft.com/explore/dataset/bornes-irve/api/?disjunctive.region&disjunctive.departement&geofilter.distance=${lat},${lon},${radius}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(response);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des bornes électriques :",
      error
    );
    res
      .status(500)
      .send("Erreur lors de la récupération des bornes électriques");
  }
});

app.post("/soap-proxy", async (req, res) => {
  const { distance, autonomie, vitesse_moyenne, tps_chargement } = req.body;

  const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="spyne.examples.trajet">
       <soapenv:Header/>
       <soapenv:Body>
          <spy:calcul_trajet>
             <spy:distance>${distance}</spy:distance>
             <spy:autonomie>${autonomie}</spy:autonomie>
             <spy:vitesse_moyenne>${vitesse_moyenne}</spy:vitesse_moyenne>
             <spy:tps_chargement>${tps_chargement}</spy:tps_chargement>
          </spy:calcul_trajet>
       </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await axios.post("http://127.0.0.1:8000/", soapRequest, {
      headers: { "Content-Type": "text/xml" },
    });

    xml2js
      .parseStringPromise(response.data)
      .then(function (result) {
        console.log(result);
        res.json(result);
      })
      .catch(function (err) {
        console.error("Erreur lors de la conversion du XML en JSON :", err);
        res.status(500).send("Erreur lors de la conversion du XML en JSON");
      });
  } catch (error) {
    console.error("Erreur lors de la requête SOAP :", error);
    res.status(500).send("Erreur lors de la requête SOAP");
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy en cours d'exécution sur le port ${port}`);
});
