const { runSelectQuery, runUpdateQuery , ensureResourceExists} = require('../services/sparql.service');
const { isValidRdfId, isValidNumber, escapeRdfLiteral } = require('../utils/validators');

// ----------------------------------------------------------
// USAGE 1 : "maladie → aliments"
// GET /api/recommend?disease=Diabetes&region=Nord
// ----------------------------------------------------------
async function recommendFoods(req, res) {
  const { disease, region } = req.query;

  if (!disease) {
    return res.status(400).json({ error: 'Le paramètre "disease" est requis (ex: Diabetes)' });
  }

  if (!isValidRdfId(disease)) {
    return res.status(400).json({ error: 'Le paramètre "disease" contient des caractères non autorisés' });
  }

  if (region && !isValidRdfId(region)) {
    return res.status(400).json({ error: 'Le paramètre "region" contient des caractères non autorisés' });
  }

  try {
    let recommendQuery = `
      SELECT ?food ?label ?glycemicIndex WHERE {
        ?food hlt:preventsDisease hlt:${disease} .
        ?food rdfs:label ?label .
        FILTER(lang(?label) = "fr")
        OPTIONAL { ?food hlt:glycemicIndex ?glycemicIndex . }
    `;

    if (region) {
      recommendQuery += `
        ?food hlt:isConsumedIn ?reg .
        ?reg rdfs:label ?regLabel .
        FILTER(CONTAINS(?regLabel, "${region}"))
      `;
    }

    recommendQuery += ` }`;

    const recommended = await runSelectQuery(recommendQuery + ' ORDER BY ?glycemicIndex');

    const avoidQuery = `
      SELECT ?food ?label WHERE {
        ?food hlt:worsensDisease hlt:${disease} .
        ?food rdfs:label ?label .
        FILTER(lang(?label) = "fr")
      }
    `;
    const toAvoid = await runSelectQuery(avoidQuery);

    res.json({
      disease,
      region: region || 'toutes régions',
      recommended_foods: recommended,
      foods_to_avoid: toAvoid
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------------------------------------------
// USAGE 2 : "aliment → maladies"
// GET /api/risks?food=Okok
// ----------------------------------------------------------
async function getFoodRisks(req, res) {
  const { food } = req.query;

  if (!food) {
    return res.status(400).json({ error: 'Le paramètre "food" est requis (ex: Okok)' });
  }

  if (!isValidRdfId(food)) {
    return res.status(400).json({ error: 'Le paramètre "food" contient des caractères non autorisés' });
  }

  try {
    const risksQuery = `
      SELECT ?disease ?label WHERE {
        hlt:${food} hlt:worsensDisease ?disease .
        ?disease rdfs:label ?label .
        FILTER(lang(?label) = "fr")
      }
    `;
    const risks = await runSelectQuery(risksQuery);

    const benefitsQuery = `
      SELECT ?disease ?label WHERE {
        hlt:${food} hlt:preventsDisease ?disease .
        ?disease rdfs:label ?label .
        FILTER(lang(?label) = "fr")
      }
    `;
    const benefits = await runSelectQuery(benefitsQuery);

    res.json({ food, risks, benefits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ----------------------------------------------------------
// AJOUT D'UN ALIMENT (depuis un formulaire)
// POST /api/foods
// ----------------------------------------------------------
async function createFood(req, res) {
  const { id, label, glycemicIndex, region, prevents, worsens } = req.body;

  // ---- Validation des champs obligatoires ----
  if (!id || !label) {
    return res.status(400).json({ error: 'Les champs "id" et "label" sont requis' });
  }

  if (!isValidRdfId(id)) {
    return res.status(400).json({ error: 'Le champ "id" doit commencer par une lettre et ne contenir que lettres/chiffres/underscore (pas d\'espace ni de caractère spécial)' });
  }

  if (glycemicIndex !== undefined && glycemicIndex !== '' && !isValidNumber(glycemicIndex)) {
    return res.status(400).json({ error: 'Le champ "glycemicIndex" doit être un nombre valide' });
  }

  if (region && !isValidRdfId(region)) {
    return res.status(400).json({ error: 'Le champ "region" contient des caractères non autorisés' });
  }

  if (prevents && (!Array.isArray(prevents) || !prevents.every(isValidRdfId))) {
    return res.status(400).json({ error: 'Le champ "prevents" doit être un tableau de noms de maladies valides' });
  }

  if (worsens && (!Array.isArray(worsens) || !worsens.every(isValidRdfId))) {
    return res.status(400).json({ error: 'Le champ "worsens" doit être un tableau de noms de maladies valides' });
  }

  try {
    const safeLabel = escapeRdfLiteral(label);

    // ---- S'assurer que la région existe (création auto si besoin) ----
    if (region) {
      await ensureResourceExists(region, 'Region');
    }

    // ---- S'assurer que chaque maladie citée existe (création auto si besoin) ----
    const allDiseases = [...(prevents || []), ...(worsens || [])];
    for (const disease of allDiseases) {
      await ensureResourceExists(disease, 'Disease');
    }

    // ---- Construction des triplets de l'aliment lui-même ----
    let triples = `hlt:${id} rdfs:subClassOf hlt:Food .\n`;
    triples += `hlt:${id} rdfs:label "${safeLabel}"@fr .\n`;

    if (glycemicIndex !== undefined && glycemicIndex !== '') {
      triples += `hlt:${id} hlt:glycemicIndex "${Number(glycemicIndex)}"^^xsd:float .\n`;
    }

    if (region) {
      triples += `hlt:${id} hlt:isConsumedIn hlt:${region} .\n`;
    }

    if (Array.isArray(prevents)) {
      prevents.forEach(disease => {
        triples += `hlt:${id} hlt:preventsDisease hlt:${disease} .\n`;
      });
    }

    if (Array.isArray(worsens)) {
      worsens.forEach(disease => {
        triples += `hlt:${id} hlt:worsensDisease hlt:${disease} .\n`;
      });
    }

    const updateQuery = `INSERT DATA { ${triples} }`;
    await runUpdateQuery(updateQuery);

    res.status(201).json({
      message: `Aliment "${label}" ajouté avec succès à l'ontologie`,
      id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { recommendFoods, getFoodRisks, createFood };