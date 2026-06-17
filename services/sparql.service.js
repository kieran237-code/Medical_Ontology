const fetch = require('node-fetch');
const { QUERY_ENDPOINT, UPDATE_ENDPOINT, PREFIXES } = require('../config/sparql');
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

module.exports = {
    runSelectQuery
};  
