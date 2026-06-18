// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// ---- Limiteur général : pour toutes les routes de lecture (GET) ----
// 100 requêtes par IP toutes les 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes en millisecondes
  max: 100,
  message: { error: 'Trop de requêtes envoyées depuis cette adresse. Réessayez plus tard.' },
  standardHeaders: true,    // renvoie les infos de quota dans les headers HTTP
  legacyHeaders: false
});

// ---- Limiteur strict : pour les routes qui MODIFIENT l'ontologie (POST) ----
// Plus restrictif, car écrire dans le triplestore est plus coûteux et sensible
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives de modification. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, writeLimiter };