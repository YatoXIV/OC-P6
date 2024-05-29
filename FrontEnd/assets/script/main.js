// main.js
import { isProduction } from "./config.js";
import { fetchWorks, fetchCategories } from "./api.js"; // Importe les fonctions API pour récupérer les données
import { setWorksData } from "./store.js"; // Importe la fonction pour stocker les données des travaux
import { displayWorks, displayCategories } from "./ui.js"; // Importe les fonctions pour afficher les données dans l'UI
import { setupLoginLink } from "./auth.js"; // Importe la fonction pour configurer le lien de connexion/déconnexion
import { checkLoginState } from "./auth.js"; // Importe la fonction pour vérifier l'état de connexion
import { setUpEventListeners } from "./events.js"; // Importe la fonction pour configurer les écouteurs d'événements globaux
import { setupContactLink } from "./events.js"; // Importe la fonction pour configurer le lien de contact
import { setupProjetLink } from "./events.js"; // Importe la fonction pour configurer le lien de projet

// Log pour indiquer si les messages de console sont activés ou désactivés selon l'environnement
if (isProduction) {
  console.log("Mode Production main.js : Console.log désactivé");
} else {
  console.log("Mode Développement  main.js : Console.log activé");
}

// Appel de la fonction d'initialisation
initializeApp();
// Puis, après une opération d'ajout ou de suppression réussie, appelez :
refreshWorks();

/**
 * Initialise l'application en récupérant et en affichant les données requises,
 * en vérifiant l'état de connexion et en configurant les liens et les écouteurs d'événements.
 */
async function initializeApp() {
  if (!isProduction) console.log("Fonction initializeApp");
  try {
    // Rafraîchit les données des " Work "  affichées
    refreshWorks();

    // Rafraîchit les données des " Categories "  affichées
    refreshCategories();

    // Vérifie l'état de connexion et met à jour l'interface utilisateur en conséquence
    checkLoginState();
    // Configure les liens et les écouteurs d'événements
    setupLoginLink();
    setupContactLink();
    setupProjetLink();

    // Configure les écouteurs d'événements supplémentaires pour l'application
    setUpEventListeners();
  } catch (error) {
    // Log l'erreur si l'initialisation échoue
    console.error("Erreur lors de l'initialisation de l'application :", error);
  }
}

/**
 * Rafraîchit les " Work "  en les récupérant de nouveau et en mettant à jour l'interface utilisateur.
 */
export async function refreshWorks() {
  if (!isProduction) console.log("Fonction refreshWorks");
  try {
    // Récupère les " Work "  depuis l'API
    const works = await fetchWorks();
    // Stocke les données récupérées dans le store
    setWorksData(works);
    // Affiche les " Work "  dans l'interface utilisateur
    displayWorks(works);
  } catch (error) {
    // Log l'erreur si le rafraîchissement des " Work "  échoue
    console.error("Erreur lors du rafraîchissement des travaux :", error);
  }
}

/**
 * Rafraîchit les " Catégories "  en les récupérant de nouveau et en mettant à jour l'interface utilisateur.
 */
export async function refreshCategories() {
  if (!isProduction) console.log("Fonction refreshCategories");
  try {
    // Récupère les " Categories "  depuis l'API
    const categoriesData = await fetchCategories();

    // Affiche les " Categories "  dans l'interface utilisateur
    displayCategories(categoriesData);
  } catch (error) {
    // Log l'erreur si le rafraîchissement des " Categories "  échoue
    console.error("Erreur lors du rafraîchissement des catégories :", error);
  }
}
