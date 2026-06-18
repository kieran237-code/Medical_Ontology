// src/services/formatResults.js

/**
 * Transforme la réponse de /api/recommend en texte lisible
 * pour affichage dans le "terminal" (Usage 1 : maladie -> aliments)
 */
export function formatRecommendation(data) {
  const { disease, region, recommended_foods, foods_to_avoid } = data

  let text = `> Maladie recherchée : ${disease}\n`
  text += `> Région : ${region}\n\n`

  if (recommended_foods.length > 0) {
    text += `✓ Aliments recommandés pour prévenir/limiter "${disease}" :\n`
    recommended_foods.forEach(f => {
      const idx = f.glycemicIndex ? ` (index glycémique : ${f.glycemicIndex})` : ''
      text += `   • ${f.label}${idx}\n`
    })
  } else {
    text += `✓ Aucun aliment connu ne prévient spécifiquement "${disease}" pour le moment.\n`
  }

  text += `\n`

  if (foods_to_avoid.length > 0) {
    text += `✗ Aliments à éviter, car ils aggravent "${disease}" :\n`
    foods_to_avoid.forEach(f => {
      text += `   • ${f.label}\n`
    })
  } else {
    text += `✗ Aucun aliment connu n'aggrave "${disease}" pour le moment.\n`
  }

  return text
}

/**
 * Transforme la réponse de /api/risks en texte lisible
 * pour affichage dans le "terminal" (Usage 2 : aliment -> maladies)
 */
export function formatRisks(data) {
  const { food, risks, benefits } = data

  let text = `> Aliment recherché : ${food}\n\n`

  if (benefits.length > 0) {
    text += `✓ "${food}" aide à prévenir les maladies suivantes :\n`
    benefits.forEach(d => {
      text += `   • ${d.label}\n`
    })
  } else {
    text += `✓ Aucun bénéfice connu n'est associé à "${food}" pour le moment.\n`
  }

  text += `\n`

  if (risks.length > 0) {
    text += `✗ Une consommation excessive de "${food}" peut aggraver :\n`
    risks.forEach(d => {
      text += `   • ${d.label}\n`
    })
  } else {
    text += `✗ Aucun risque connu n'est associé à "${food}" pour le moment.\n`
  }

  return text
}