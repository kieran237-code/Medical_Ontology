const express = require('express');
const router = express.Router();
const { recommendedFoods, getFoodRisks } = require('../controllers/ontology.controllers');

// Route pour recommander des aliments en fonction d'une maladie et d'une région
router.get('/recommend', recommendedFoods);

// Route pour obtenir les risques associés à un aliment
router.get('/risks', getFoodRisks);

module.exports = router;