// login.js
import { isProduction } from "./config.js";
import { handleLoginFormSubmit } from "./auth.js"; // Importation de la fonction de gestion de soumission du formulaire de connexion
import { checkLoginState } from "./auth.js"; // Importation de la fonction de vérification de l'état de connexion
import { setupContactLink } from "./events.js"; // Importation de la fonction de configuration du lien de contact
import { setupProjetLink } from "./events.js"; // Importation de la fonction de configuration du lien de projet

// Affichage d'un message pour indiquer si les logs de débogage sont activés ou non en fonction du mode de production
if (isProduction) {
  console.log("Mode Production login.js : Console.log désactivé");
} else {
  console.log("Mode Développement login.js : Console.log activé");
}

/**
 * Initialise le formulaire de connexion en ajoutant un gestionnaire d'événements pour la soumission.
 */
async function initLoginForm() {
  const loginForm = document.querySelector("form"); // Sélection du formulaire dans le DOM

  // Ajout d'un gestionnaire d'événements pour la soumission du formulaire si le formulaire existe
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit);
  }
}

// Initialisation du formulaire de connexion
initLoginForm();

// Vérification de l'état de connexion de l'utilisateur lors du chargement de la page
checkLoginState();

// Configuration des liens de navigation supplémentaires
setupContactLink(); // Assigne un gestionnaire d'événements au lien de contact
setupProjetLink(); // Assigne un gestionnaire d'événements au lien de projet
