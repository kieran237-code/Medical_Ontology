
/**
 * Vérifie qu'une chaîne est un identifiant RDF valide :
 * lettres (avec ou sans accent), chiffres, underscore uniquement,
 * commence par une lettre. Rejette tout caractère spécial
 * (espaces, points, accolades, guillemets...) qui pourrait
 * casser la structure d'une requête SPARQL.
 */
function isValidRdfId(value) {
  if (typeof value !== 'string') return false;
  return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9_]*$/.test(value);
}

/**
 * Vérifie qu'une valeur est un nombre valide (pour glycemicIndex par ex.)
 */
function isValidNumber(value) {
  return value !== '' && value !== null && !isNaN(Number(value));
}

/**
 * Échappe les caractères dangereux dans une chaîne destinée
 * à être insérée comme littéral texte RDF (entre guillemets),
 * par exemple le label d'un aliment.
 */
function escapeRdfLiteral(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

module.exports = { isValidRdfId, isValidNumber, escapeRdfLiteral };