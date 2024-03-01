# Projet_TP_INFO802
## Galerne Julien

### Scénario
L’utilisateur choisit son véhicule dans une liste, il entre un trajet entre deux villes.
L’application lui indique les villes dans lesquelles il devra s’arrêter pour recharger son véhicule
afin d’effectuer son trajet.


### Services à mettre en œuvre
1. Développez et déployez un service **SOAP** qui calcul un temps de trajet en fonction de la
distance et de l’autonomie des véhicules et en tenant compte du temps de
chargement
2. Interrogez un service **REST** qui fournit un emplacement de prise de rechargement
disponible à proximité de coordonnées GPS passées en paramètre.
3. Interrogez un service **REST** de cartographie pour afficher le trajet du véhicule
4. Interrogez un service en **GraphQL** qui fournit la liste des véhicules avec leurs
caractéristiques.


### Application
L'application est divisée en trois parties : 

- #### Application React
    Le **front** est écrit avec **React**.
    
    La page d'accueil, `src/pages/homePage.jsx`, est composée de deux composants `src/components` :
    - `FormTrajet.jsx` : C'est le formulaire à remplir, contenant les informations des villes de départ et d'arrivée ainsi que le véhicule sélectionné. Les appels **API** aux services du gouvernement pour renseigner les **communes** et obtenir leurs **positions GPS**, de même que l'appel à l'**API GraphQL** pour les **véhicules**, sont également présentes dans ce composant. Une fois le formulaire validé, le composant **transmet** à `homePage.jsx` les **coordonnées des villes** ainsi que la **fiche technique du véhicule**.

    - `Map.jsx` : Ce composant contient la carte de la France, affichée avec *Leaflet*. Il **récupère** les **données fournies par le formulaire**, via la `homePage.jsx`, puis **trace le trajet** sur la carte. Ensuite, l'**API** qui répertorie les **bornes électriques**, **est appelée** non pas sur l'ensemble des points qui composent le trajet, mais **tous les 100 points** environ afin d'optimiser les performances et pour avoir un délai d'attente raisonnable. **Cet appel** se charge, pour un point donné, de **récupérer la borne la plus proche** dans un **rayon de 30 km**. Une fois les bornes pertinentes récupérées, elles sont placées sur la carte.

    `homePage.jsx` : La page d'accueil gère l'**affichage** du formulaire et de la carte, le **passage des informations** de l'un à l'autre et l'**appel à l'API SOAP**, via le serveur proxy, pour avoir l'informations sur le temps de trajet (en prenant en compte les caractéristiques du véhicule)

- #### Serveur proxy
    Le serveur proxy (`serveur.js`), écrit en JavaScript avec Express, **contient une route** pour l'appel à l'**API SOAP**. Les **informations** du trajet et du véhicules sont **envoyées en JSON** au serveur, qui les **insère** dans une **enveloppe XML**, qui l'envoie au programme Python, et qui **récupère la réponse** XML de ce programme pour ensuite **reconvertir en JSON les données** et les transmettre à l'application.
- #### API SOAP
    Le programme contenant l'API SOAP est écrit en Python (`temps_trajet_SOAP.py`).

### Instructions de démarrage
1. Se placer dans le répertoire `electro_trajet`
2. Lancer le programme `temps_trajet_SOAP.py`
3. Lancer le serveur proxy `serveur.js` avec la commande **`node serveur.js`**
4. Lancer l'application avec **`npm start`**

### Liens API
- [Communes de France](https://geo.api.gouv.fr/communes)
- [Coordonnées des communes](https://api-adresse.data.gouv.fr/search/?q=chambéry&type=municipality&limit=1)
- [Véhicules électriques](https://api.chargetrip.io/graphql)
- [Bornes électriques](https://opendata.reseaux-energies.fr/explore/dataset/bornes-irve/api/?disjunctive.region)