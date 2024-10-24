// api.js
import { isProduction } from "./config.js";

const apiUrl = "http://localhost:5678/api"; // Définissez l'URL de base de votre API

// Définissez une fonction pour vérifier la disponibilité de l'API
export async function checkApiAvailability() {
  try {
    const response = await fetch("http://localhost:5678/api-docs/");

    if (!response.ok) {
      // La requête a échoué, donc l'API n'est pas disponible
      console.log("L'API ne semble pas accessible à l'adresse suivante : http://localhost:5678/api-docs/ Veuillez contacter l'Administrateur du site");
      return false;
    } else {
      // La requête a réussi, l'API est disponible
      return true;
    }
  } catch (error) {
    // Une erreur s'est produite lors de la requête
    console.log("L'API ne semble pas accessible à l'adresse suivante : http://localhost:5678/api-docs/ Veuillez contacter l'Administrateur du site");
    return false;
  }
}

export async function fetchLogin(email, password) {
  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Gestion des réponses non réussies
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Détails de l'erreur : ${response.status}`, errorData);
      throw new Error("Les informations d'identifications sont incorrectes.");
    }

    // Traitement de la réponse
    const data = await response.json();
    return data; // Retourne les données de connexion
  } catch (error) {
    throw error; // Relance l'erreur pour une gestion ultérieure
  }
}

/**
 * Récupère les " Work "  depuis l'API du serveur.
 * Effectue une requête GET pour obtenir les données des " Work "  et les retourne.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau des " Work " .
 */
export async function fetchWorks() {
  if (!isProduction) console.log("Fonction fetchWorks");
  try {
    // Effectue la requête à l'API des " Work "
    const response = await fetch(`${apiUrl}/works`);
    // Vérifie que la réponse du réseau est ok (statut HTTP 200-299)
    if (!response.ok) {
      throw new Error(`Réponse réseau incorrecte : ${response.status}`);
    }
    // Parse la réponse en JSON
    const data = await response.json();
    return data; // Retourne les données des " Work "
  } catch (error) {
    // Log l'erreur en console si la requête échoue
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}
/**
 * Effectue une requête GET pour récupérer les données des "Work" depuis l'API.
 *
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau des données des "Work".
 * @throws {Error} Une erreur est levée en cas d'échec de la récupération des données avec des détails d'erreur.
 */
export async function fetchAddWork(formData, token) {
  try {
    const response = await fetch(`${apiUrl}/works`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Détails de l'erreur d'ajout:", errorData);
      throw new Error(`Erreur lors de l'ajout : ${response.status} ${JSON.stringify(errorData)}`);
    }

    // Si la réponse est réussie, retournez les données de la réponse.
    return await response.json();
  } catch (error) {
    throw error; // Relance l'erreur pour une gestion ultérieure
  }
}

/**
 * Récupère les catégories depuis l'API du serveur.
 * Effectue une requête GET pour obtenir les données des catégories et les retourne.
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau des catégories.
 */
export async function fetchCategories() {
  if (!isProduction) console.log("Fonction fetchCategories");
  try {
    // Effectue la requête à l'API des catégories
    const response = await fetch(`${apiUrl}/categories`);
    // Vérifie que la réponse du réseau est ok (statut HTTP 200-299)
    if (!response.ok) {
      throw new Error(`Réponse réseau incorrecte : ${response.status}`);
    }
    // Parse la réponse en JSON
    const data = await response.json();
    return data; // Retourne les données des catégories
  } catch (error) {
    // Log l'erreur en console si la requête échoue
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

/**
 * Effectue une requête DELETE pour supprimer un travail par son ID.
 *
 * @param {string} workId - L'ID du travail à supprimer.
 * @param {string} token - Le token d'authentification pour l'autorisation.
 * @returns {Promise<boolean>} Une promesse qui résout à true si la suppression réussit.
 * @throws {Error} Une erreur est levée en cas d'échec de la suppression avec des détails d'erreur.
 */
export async function fetchDeleteWork(workId, token) {
  try {
    const response = await fetch(`${apiUrl}/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifie si la réponse du serveur est OK (statut HTTP 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Récupère le corps de la réponse d'erreur
      console.error("Détails de l'erreur de suppression :", errorData);
      throw new Error(`Erreur lors de la suppression : ${response.status} ${JSON.stringify(errorData)}`);
    }

    if (!isProduction) console.log("Suppression réussie");

    return true; // Indique que la suppression a réussi
  } catch (error) {
    throw error; // Relance l'erreur pour une gestion ultérieure
  }
}

/**
 * Effectue une requête GET pour récupérer les données des "Work" depuis l'API.
 *
 * @returns {Promise<Array>} Une promesse qui résout avec un tableau des données des "Work".
 * @throws {Error} Une erreur est levée en cas d'échec de la récupération des données avec des détails d'erreur.
 */
export async function fetchWorksData() {
  try {
    const response = await fetch(`${apiUrl}/works`);

    // Vérifie si la réponse du serveur est OK (statut HTTP 200-299)
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }

    // Parse la réponse en JSON et retourne les données des "Work"
    return await response.json();
  } catch (error) {
    throw error; // Relance l'erreur pour une gestion ultérieure
  }
}
