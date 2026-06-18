const express = require('express');
const router = express.Router();
const { recommendFoods, getFoodRisks , createFood} = require('../controllers/ontology.controllers');
const { generalLimiter, writeLimiter } = require('../middlewares/rateLimiter');
// Route pour recommander des aliments en fonction d'une maladie et d'une région
router.get('/recommend',generalLimiter, recommendFoods);

// Route pour obtenir les risques associés à un aliment
router.get('/risks',generalLimiter, getFoodRisks);

// Route pour créer un nouvel aliment
router.post('/foods', writeLimiter, createFood);

module.exports = router;