// store.js

// Ce module agit comme un store pour les données des " Work " . Il permet de stocker et de récupérer les " Work "  dans l'application.

// Initialisation d'un tableau pour stocker les données des " Work " .
let worksData = [];

/**
 * Définit les données des " Work "  pour le store.
 * Cette fonction est utilisée pour initialiser ou mettre à jour les données des " Work "  dans l'application.
 * @param {Array} data - Un tableau d'objets d'" Work "  à stocker.
 */
export function setWorksData(data) {
  worksData = data;
}

/**
 * Récupère les données des " Work "  du store.
 * Cette fonction est utilisée pour accéder aux données des " Work "  stockées.
 * @returns {Array} Le tableau d'" Work "  actuellement stocké.
 */
export function getWorksData() {
  return worksData;
}
