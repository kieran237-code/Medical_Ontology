const express = require('express');
const router = express.Router();
const { recommendFoods, getFoodRisks , createFood} = require('../controllers/ontology.controllers');

// Route pour recommander des aliments en fonction d'une maladie et d'une région
router.get('/recommend', recommendFoods);

// Route pour obtenir les risques associés à un aliment
router.get('/risks', getFoodRisks);

// Route pour créer un nouvel aliment
router.post('/foods', createFood);

module.exports = router;