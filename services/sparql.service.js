const fetch = require('node-fetch');
const { QUERY_ENDPOINT, UPDATE_ENDPOINT, PREFIXES } = require('../config/sparql');

// Executer les requetes SPARQL de type SELECT et retourner
/**
 * @param{string} query 
 */
async function runSelectQuery(query) {
    const fullQuery = PREFIXES + query;
    const response = await fetch(QUERY_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: fullQuery
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SPARQL query failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data.results.bindings.map(row =>{
        const simplified={};
        for(const key in row){
            simplified[key] = row[key].value;
        }
        return simplified;  
    });
}


// Executer les requetes SPARQL de type UPDATE (INSERT, DELETE, etc)
/**
 * @param{string} updateQuery
 */

async function runUpdateQuery(updateQuery) {
    const fullQuery = PREFIXES + updateQuery;
    const response = await fetch(UPDATE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-update'
        },
        body: fullQuery
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SPARQL update failed with status ${response.status}: ${errorText}`);
    }       
}

// Verifier si une ressource existe déjà, sinon la créer (ex: région ou maladie)
/**

 * @param {string} id - l'identifiant RDF (ex: "Littoral")
 * @param {string} classType - la classe parente (ex: "Region" ou "Disease")
 */
async function ensureResourceExists(id, classType) {
  const checkQuery = `
    SELECT ?label WHERE {
      hlt:${id} rdfs:label ?label .
    } LIMIT 1
  `;

  const existing = await runSelectQuery(checkQuery);

  if (existing.length > 0) {
    return { created: false, label: existing[0].label };
  }

  // N'existe pas encore : on la crée avec un label = id (lisible)
  const insertQuery = `
    INSERT DATA {
      hlt:${id} rdf:type hlt:${classType} .
      hlt:${id} rdfs:label "${id}"@fr .
    }
  `;
  await runUpdateQuery(insertQuery);

  return { created: true, label: id };
}

/**
 * Vérifie si un aliment (classe Food) existe déjà dans l'ontologie.
 * Renvoie son label et son index glycémique existants si trouvés.
 */
async function getExistingFood(id) {
  const query = `
    SELECT ?label ?glycemicIndex WHERE {
      hlt:${id} rdfs:subClassOf hlt:Food .
      OPTIONAL { hlt:${id} rdfs:label ?label . FILTER(lang(?label) = "fr") }
      OPTIONAL { hlt:${id} hlt:glycemicIndex ?glycemicIndex . }
    } LIMIT 1
  `;
  const results = await runSelectQuery(query);
  return results.length > 0 ? results[0] : null;
}

/**
 * Vérifie si un triplet exact existe déjà (pour éviter les doublons
 * de relations comme preventsDisease/worsensDisease/isConsumedIn).
 */
async function tripleExists(subjectId, property, objectId) {
  const query = `
    SELECT ?s WHERE {
      hlt:${subjectId} hlt:${property} hlt:${objectId} .
      BIND(hlt:${subjectId} AS ?s)
    } LIMIT 1
  `;
  const results = await runSelectQuery(query);
  return results.length > 0;
}

module.exports = { runSelectQuery, runUpdateQuery, ensureResourceExists, getExistingFood, tripleExists };

