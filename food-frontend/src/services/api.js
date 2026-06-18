const API_BASE_URL = 'http://localhost:4000/api';

// Premiere partie: Recommander des aliments selon une maladie 

export async function getRecommendations(disease, region) {
    const params = new URLSearchParams({ disease });
    if (region) {
        params.append('region', region);
    }
    const response = await fetch(`${API_BASE_URL}/recommend?${params}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error|| 'Erreur lors de la recuperation de la recommandation des aliments');
    }
    return data;
}

// deuxieme partie: obtenir les risques/benefices d'un aliment 
export async function getFoodRisks(food) {
    const params = new URLSearchParams({ food });
    const response = await fetch(`${API_BASE_URL}/risks?${params}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recuperation des risques/benefices de l aliment');
    }
    return data;
}

// Ajout de l'aliment a l'ontologie

export async function createFood(foodData) {
    const response = await fetch(`${API_BASE_URL}/foods`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la creation de l aliment');
    }
    return data;        
}
