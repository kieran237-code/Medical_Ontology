const {runSelectQuery} = require('../services/sparql.service');

//-------------------------------------------------------------------------------------
// Premiere partie: maladie----> aliments
//GET /api/recommend?disease=diabetes&region=Nord
// Renvoie les aliments et Ceux a eviter pour une maladie et une region donnee
//-------------------------------------------------------------------------------------

async function recommendedFoods(req, res) {
    const { disease, region } = req.query;
    if (!disease ) {
        return res.status(400).json({ error: "le parametre \"disease\" est requis(ex: Diabetes)" });
    }
    try{
        //Requete 1 : Aliments qui previennent cette maladie
        const recommendQuery = `
            SELECT ?food ?label ?glycemicIndex WHERE {
                ?food hlt:preventsDisease hlt:${disease} .
                ?food rdfs:label ?label .
                FILTER (lang(?label) = "fr") .
                OPTIONAL { ?food hlt:glycemicIndex ?glycemicIndex . }
            }
        `;
        if(region){
            recommendQuery += `
                ?food hlt:isConsumedIn ?reg .
                ?reg rdfs:label ?regLabel .
                FILTER (CONTAINS(?regLabel, "${region}")) 
            `;
        }
        recommendQuery += `} ORDER BY ?glycemicIndex`;
        
        const recommendedFoods = await runSelectQuery(recommendQuery);

        // Requete 2 : Aliments qui aggravent cette maladie
        const avoidQuery = `
            SELECT ?food ?label WHERE {
                ?food hlt:worsensDisease hlt:${disease} .
                ?food rdfs:label ?label .
                FILTER (lang(?label) = "fr") .
            }
        `;
        const toAvoidFoods = await runSelectQuery(avoidQuery);

        res.json({diseases,
            region: region || "toutes regions",
            recommended_foods: recommendedFoods,
            to_avoid_foods: toAvoidFoods
        })
        
    } catch(err){
        res.status(500).json({ error: "Erreur lors de la récupération des aliments recommandés" , err: err.message });
}
}

//-------------------------------------------------------------------------------------
// deuxieme partie: aliments----> maladies
//GET /api/risks?food=broccoli
// Renvoie les maladies qui sont prevenues ou aggravees par un aliment donne
//-------------------------------------------------------------------------------------
async function getFoodRisks(req, res) {
    const { food } = req.query;
    if (!food ) {
        return res.status(400).json({ error: "le parametre \"food\" est requis(ex: Broccoli)" });
    }
    try{
        // Maladies aggravees par cet aliment
        const risksQuery = `
            SELECT ?disease ?label WHERE {
                hlt:${food} hlt:worsensDisease ?disease .
                ?disease rdfs:label ?label .
                FILTER (lang(?label) = "fr") .
            }
        `;
        const risks = await runSelectQuery(risksQuery);

        // Maladies prevenues par cet aliment
        const benefitsQuery = `
            SELECT ?disease ?label WHERE {
                hlt:${food} hlt:preventsDisease ?disease .
                ?disease rdfs:label ?label .
                FILTER (lang(?label) = "fr") .
            }
        `;
        const benefits = await runSelectQuery(benefitsQuery);

        res.json({
            food,
            risks: risks,
            benefits: benefits
        });
    } catch(err){
        res.status(500).json({ error: "Erreur lors de la récupération des risques liés à cet aliment" , err: err.message });
    }
}

module.exports = {
    recommendedFoods,
    getFoodRisks
}   ;
