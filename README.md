# FoodHealth — Ontologie des aliments camerounais & Santé

Système d'aide à la décision médicale basé sur une ontologie RDF, permettant de relier les aliments locaux camerounais (Eru, Koki, Sanga, Okok, Fufu...) à des maladies nutritionnelles (diabète, malnutrition, obésité), afin d'aider médecins et patients à mieux orienter leurs choix alimentaires.

Projet réalisé dans le cadre du cours **INF 4188 — Semantic Web & Application** donne par Dr. Azanzi Jiomekong.

---

## Table des matières

1. [Description du produit](#description-du-produit)
2. [Architecture générale](#architecture-générale)
3. [Démarrage rapide](#démarrage-rapide)
4. [Backend — API Express](#backend--api-express)
5. [Frontend — Application React](#frontend--application-react)
6. [Sécurité](#sécurité)
7. [Auteur](#auteur)

---

## Description du produit

### Objectif

Le but principal est d'aider les médecins et nutritionnistes à savoir rapidement quels aliments locaux recommander ou éviter pour un patient selon sa pathologie, en s'appuyant sur une base de connaissances structurée (une ontologie) plutôt que sur la mémoire ou des tableaux papier.

La connaissance du domaine (quels aliments existent, quelles relations avec quelles maladies) vit entièrement dans une ontologie RDF interrogée via SPARQL — rien n'est codé en dur dans l'application. Cela permet d'enrichir continuellement les connaissances sans jamais modifier le code source.

### Les deux usages couverts

**Usage 1 — Maladie → Aliments** : *"Mon patient est diabétique, qu'est-ce que je peux lui recommander de manger, qu'est-ce qu'il doit éviter ?"* L'utilisateur entre une maladie (et optionnellement une région), et reçoit la liste des aliments qui préviennent cette maladie ainsi que ceux qui l'aggravent.

**Usage 2 — Aliment → Maladies** : *"Mon patient mange beaucoup d'Okok, est-ce risqué pour sa santé ?"* L'utilisateur entre un aliment, et reçoit la liste des maladies que cet aliment aide à prévenir, ainsi que celles qu'il peut aggraver en cas de consommation excessive.

### Fonctionnalités de l'application

L'application publique (sans authentification requise) propose une page d'accueil présentant le projet, une page de consultation interactive couvrant les deux usages avec un effet de chargement et un affichage des résultats façon terminal, et un formulaire permettant à quiconque d'enrichir l'ontologie avec de nouveaux aliments et leurs relations aux maladies.

---

## Architecture générale

Le projet est composé de trois briques indépendantes :

| Brique | Rôle | Dossier |
|---|---|---|
| **Apache Jena Fuseki** | Triplestore RDF, stocke l'ontologie et répond aux requêtes SPARQL | `outil/apache-jena-fuseki-*` (téléchargé séparément) |
| **API Express (backend)** | Pont HTTP entre le frontend et Fuseki, contient la logique métier | `food-api/` |
| **Application React (frontend)** | Interface utilisateur : présentation, consultation, formulaire d'ajout | `food-frontend/` |

```
Client (navigateur)
      │
      ▼
React + Vite (port 5173)
      │  appels HTTP (fetch)
      ▼
API Express (port 4000)
      │  requêtes SPARQL (HTTP POST)
      ▼
Apache Jena Fuseki (port 3030)
      │
      ▼
Ontologie RDF (fichier .rdf chargé dans le triplestore)
```

La connaissance du domaine vit entièrement dans l'ontologie RDF interrogée via SPARQL ; l'API Express ne fait que traduire les requêtes HTTP du frontend en requêtes SPARQL, et inversement pour les réponses.

---

## Démarrage rapide

L'ordre de démarrage est important : Fuseki doit tourner avant l'API Express, qui doit tourner avant que le frontend puisse afficher des résultats.

### Prérequis

Java JDK 11+ (Java 21+ pour Fuseki 6.x), Node.js v18+, et Apache Jena Fuseki téléchargé depuis `https://jena.apache.org/download/`.

### Lancement

```bash
# 1. Lancer Fuseki (depuis son dossier décompressé)
cd outil/apache-jena-fuseki-6.1.0
mkdir -p data
./fuseki-server --update --loc=./data /foodhealth
```

Puis, via l'interface web `http://localhost:3030`, uploader le fichier `ontologie_aliments.rdf` dans le dataset `foodhealth` (onglet "upload data").

```bash
# 2. Lancer le backend (dans un autre terminal)
cd food-api
npm install
cp .env.example .env
npm run dev
```

```bash
# 3. Lancer le frontend (dans un autre terminal)
cd food-frontend
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:5173` dans le navigateur.

---

## Backend — API Express

API Express.js qui expose l'ontologie RDF des aliments camerounais via SPARQL/Fuseki, pour les deux usages : recommandation par maladie, et risques/bénéfices par aliment.

### Dépendances de production

| Package | Version | Rôle |
|---|---|---|
| [`express`](https://expressjs.com/) | ^4.19.2 | Framework serveur HTTP : définit les routes et gère les requêtes/réponses |
| [`mysql2`](https://github.com/sidorares/node-mysql2) | ^3.10.0 | Client MySQL (prévu pour une éventuelle gestion de patients/comptes, non utilisé dans la version actuelle centrée sur l'ontologie) |
| [`node-fetch`](https://github.com/node-fetch/node-fetch) | ^2.7.0 | Permet à Node.js d'envoyer des requêtes HTTP vers Fuseki (équivalent du `fetch` du navigateur) |
| [`dotenv`](https://github.com/motdotla/dotenv) | ^16.4.5 | Charge les variables d'environnement depuis le fichier `.env` |
| [`cors`](https://github.com/expressjs/cors) | ^2.8.5 | Autorise les requêtes cross-origin (nécessaire pour que le frontend React, sur un autre port, puisse appeler cette API) |
| [`helmet`](https://helmetjs.github.io/) | ^7.1.0 | Sécurise les en-têtes HTTP par défaut (protection contre certaines attaques courantes) |
| [`morgan`](https://github.com/expressjs/morgan) | ^1.10.0 | Journalise chaque requête HTTP reçue dans la console (utile pour le débogage) |
| [`express-rate-limit`](https://github.com/express-rate-limit/express-rate-limit) | ^7.x | Limite le nombre de requêtes par adresse IP sur une fenêtre de temps donnée, contre les abus |

### Dépendances de développement

| Package | Rôle |
|---|---|
| [`nodemon`](https://github.com/remy/nodemon) | Redémarre automatiquement le serveur à chaque modification de fichier pendant le développement |

### Service externe requis (hors npm)

| Outil | Rôle |
|---|---|
| [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/) | Triplestore RDF : stocke l'ontologie et répond aux requêtes SPARQL |

### Variables d'environnement (`.env`)

```
PORT=4000
FUSEKI_QUERY_URL=http://localhost:3030/foodhealth/sparql
FUSEKI_UPDATE_URL=http://localhost:3030/foodhealth/update
```

### Architecture du code

```
food-api/
├── server.js                       # Point d'entrée : middlewares globaux, montage des routes
├── config/
│   └── sparql.js                   # URLs de l'endpoint Fuseki + préfixes RDF réutilisés
├── routes/
│   └── ontology.routes.js          # Définit les chemins HTTP et les relie aux contrôleurs
├── controllers/
│   └── ontology.controller.js      # Logique métier : construit les requêtes SPARQL selon l'usage
├── services/
│   └── sparql.service.js           # Communication HTTP brute avec Fuseki (lecture/écriture)
├── middlewares/
│   └── rateLimiter.js              # Limiteurs de débit (lecture vs écriture)
└── utils/
    └── validators.js               # Validation des entrées contre l'injection SPARQL
```

Le principe de séparation des responsabilités est appliqué à chaque couche : `services/` ne connaît que la mécanique HTTP brute vers Fuseki, `controllers/` construit les requêtes SPARQL spécifiques à chaque usage métier, `routes/` ne fait que relier une URL à une fonction, et `utils/` centralise les règles de validation réutilisées partout.

### Endpoints disponibles

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/recommend?disease=...&region=...` | Usage 1 : aliments recommandés et à éviter pour une maladie (région optionnelle) |
| `GET` | `/api/risks?food=...` | Usage 2 : maladies prévenues et aggravées par un aliment |
| `POST` | `/api/foods` | Ajoute un aliment à l'ontologie, ou enrichit un aliment existant avec de nouvelles relations |

#### Exemple de body pour `POST /api/foods`

```json
{
  "id": "Ndole",
  "label": "Ndolé",
  "glycemicIndex": 35,
  "region": "Centre",
  "prevents": ["Diabetes"],
  "worsens": ["Obesity"]
}
```

### Tester rapidement avec curl

```bash
# Usage 1
curl "http://localhost:4000/api/recommend?disease=Diabetes&region=Nord"

# Usage 2
curl "http://localhost:4000/api/risks?food=Okok"

# Ajout/enrichissement
curl -X POST http://localhost:4000/api/foods \
  -H "Content-Type: application/json" \
  -d '{"id":"Ndole","label":"Ndolé","glycemicIndex":35,"prevents":["Diabetes"]}'
```

---

## Frontend — Application React

Interface React permettant de présenter l'application, consulter l'ontologie selon les deux usages (par maladie / par aliment), et l'enrichir via un formulaire.

### Dépendances de production

| Package | Rôle |
|---|---|
| [`react`](https://react.dev/) / `react-dom` | Bibliothèque d'interface utilisateur : construit les composants et gère leur affichage/mise à jour |
| [`react-router-dom`](https://reactrouter.com/) | Gère la navigation entre les pages (Accueil, Usages, Ajouter) sans recharger le site (SPA) |
| [`lucide-react`](https://lucide.dev/) | Bibliothèque d'icônes (utilisées dans la navbar, le footer, les boutons, le terminal de résultats) |

### Dépendances de développement

| Package | Rôle |
|---|---|
| [`vite`](https://vitejs.dev/) | Outil de build et serveur de développement, démarrage rapide et rechargement instantané |
| [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) | Permet à Vite de comprendre et transformer le JSX |
| [`tailwindcss`](https://tailwindcss.com/) | Framework CSS utilitaire, stylise directement via des classes dans le JSX |
| [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite) | Intègre Tailwind CSS directement dans le pipeline de build Vite |
| [`daisyui`](https://daisyui.com/) | Bibliothèque de composants prêts à l'emploi construite sur Tailwind (boutons, cartes, onglets, badges, alertes...), avec un système de thèmes personnalisables |
| `eslint` (+ plugins React) | Analyse statique du code pour repérer les erreurs et incohérences de style |

### Architecture du code

```
food-frontend/
├── src/
│   ├── App.jsx                     # Point d'entrée : routing (Accueil / Usages / Ajouter)
│   ├── index.css                   # Import Tailwind + définition du thème DaisyUI personnalisé
│   ├── components/
│   │   ├── Navbar.jsx               # Barre de navigation, présente sur toutes les pages
│   │   ├── Footer.jsx               # Pied de page (nom, droits, liens GitHub/LinkedIn/mail)
│   │   └── ResultTerminal.jsx       # Zone d'affichage des résultats façon terminal, avec spinner de chargement
│   ├── pages/
│   │   ├── Home.jsx                 # Page de présentation de l'application
│   │   ├── OntologyUsage.jsx        # Page des deux usages (onglets, formulaires, terminaux)
│   │   └── AddFoodForm.jsx          # Formulaire d'ajout/enrichissement d'un aliment
│   └── services/
│       ├── api.js                   # Fonctions d'appel HTTP vers l'API Express (fetch)
│       └── formatResults.js         # Transforme les réponses JSON de l'API en texte lisible
```

Le dossier `services/` isole toute la logique de communication réseau et de formatage : les composants de `pages/` se contentent d'appeler ces fonctions et de gérer l'affichage, sans connaître le détail du format JSON renvoyé par le backend.

### Pages et fonctionnalités

**Accueil (`/`)** : présente le but de l'application (lien alimentation locale / santé), avec une section illustrative et trois cartes expliquant les enjeux (diabète, malnutrition, fiabilité de l'ontologie).

**Consulter (`/usages`)** : deux onglets pour les deux usages définis dans le projet. L'onglet "Par maladie" interroge `GET /api/recommend` ; l'onglet "Par aliment" interroge `GET /api/risks`. Chaque recherche affiche un effet de chargement (icône animée) puis une description textuelle des résultats dans une zone façon terminal. Un bouton en bas de page renvoie vers le formulaire d'ajout.

**Ajouter (`/ajouter`)** : formulaire complet (identifiant, nom affiché, index glycémique, région, listes de maladies prévenues/aggravées sous forme de tags) qui appelle `POST /api/foods` pour enrichir l'ontologie.

### Thème visuel

Le thème DaisyUI personnalisé (`foodhealth`, défini dans `src/index.css`) utilise un fond blanc (`base-100`) avec une couleur primaire vert/teal, cohérente avec la thématique santé et alimentation du projet.

### Connexion au backend

L'URL de base de l'API est définie dans `src/services/api.js` :

```javascript
const API_BASE_URL = 'http://localhost:4000/api';
```

À modifier si le backend est déployé à une autre adresse.

---

## Sécurité

**Validation contre l'injection SPARQL** : tout identifiant destiné à devenir une ressource RDF (`disease`, `food`, `id`, `region`, éléments de `prevents`/`worsens`) est vérifié par une expression régulière stricte (lettres/chiffres/underscore uniquement, doit commencer par une lettre) avant toute construction de requête. Les champs texte libre comme `label` sont échappés (guillemets et antislashs) plutôt que validés strictement.

**Limitation de débit** : les routes de lecture (`GET`) tolèrent 100 requêtes par IP toutes les 15 minutes ; la route d'écriture (`POST /api/foods`), plus sensible, est limitée à 20 requêtes par IP sur la même durée.

**Gestion des doublons** : si un aliment avec le même `id` est soumis une seconde fois, son label et son index glycémique d'origine sont conservés (le premier contributeur fait foi), tandis que les nouvelles relations (maladies prévenues/aggravées, région) sont ajoutées sans dupliquer celles déjà existantes.

**Création automatique des ressources liées** : si une région ou une maladie mentionnée dans une soumission n'existe pas encore dans l'ontologie, elle est créée automatiquement avec un label par défaut, plutôt que de générer une référence orpheline sans label.

---

## Auteur

**Kieran Junior Foguem** — INF 4188, Semantic Web & Application
