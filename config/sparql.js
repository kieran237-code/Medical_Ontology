require("dotenv").config();

module.exports = {
    QUERY_ENDPOINT: process.env.FUSEKI_QUERY_URL || "http://localhost:3030/foodhealth/sparql",
    UPDATE_ENDPOINT: process.env.FUSEKI_UPDATE_URL || "http://localhost:3030/foodhealth/update",

  PREFIXES: `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX hlt: <http://www.health-food.cm/2024/food-ontology#>
    `
};

