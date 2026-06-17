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


module.exports = {
    runSelectQuery ,
    runUpdateQuery
};  