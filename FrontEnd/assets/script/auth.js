// auth.js
import { isProduction } from "./config.js";
import { createEditModeDiv, removeEditModeDiv } from "./events.js";
import { createEditModeProjet, removeEditModeProjet } from "./ui.js";
import { fetchLogin } from "./api.js";

/**
 * Gère la soumission du formulaire de connexion.
 * Envoie une demande POST avec l'e-mail et le mot de passe à l'API de connexion et gère la réponse.
 * Stocke le token et l'identifiant de l'utilisateur dans localStorage si la connexion réussit.
 * @param {Event} event - L'événement de soumission du formulaire.
 */
export async function handleLoginFormSubmit(event) {
  if (!isProduction) console.log("Fonction handleLoginFormSubmit");
  event.preventDefault();

  // Récupération des valeurs du formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Tentative de connexion au serveur en utilisant la fonction fetchLogin
    const data = await fetchLogin(email, password);

    // Si les données incluent un token et userId, mettez à jour le localStorage et l'UI
    if (data.token && data.userId) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      if (!isProduction) console.log("userId enregistré dans localStorage:", localStorage.getItem("userId"));
      localStorage.setItem("isLoggedIn", "true");

      // Mise à jour de l'UI
      updateNavigation();
      if (!isProduction) console.log("Redirecting to home page");
      showModal("Connexion réussie.", true, "index.html");
    } else {
      // Gestion de l'absence de token ou userId
      if (!isProduction) console.error("Token or userId is missing in the response");
      throw new Error("Token ou userId manquant dans la réponse.");
    }
  } catch (error) {
    // Gestion des erreurs de connexion
    console.error("Erreur de connexion :", error);
    showModal("Échec de la connexion : " + error.message, false);
  }
}

/**
 * Vérifie l'état de connexion de l'utilisateur.
 * Si l'utilisateur est connecté (basé sur les données stockées dans localStorage),
 * la fonction active le mode d'édition en affichant ou masquant des éléments de l'interface utilisateur.
 * Elle met également à jour la navigation pour refléter l'état de connexion.
 */
export function checkLoginState() {
  if (!isProduction) console.log("Fonction checkLoginState lue");

  // Met à jour les éléments de navigation pour refléter l'état de connexion
  updateNavigation();

  // Vérifie si l'utilisateur est marqué comme connecté dans localStorage
  if (localStorage.getItem("isLoggedIn") === "true") {
    if (!isProduction) console.log("Utilisateur connecté : on crée/affiche les élèments du mode Admin");

    // Crée des éléments d'interface utilisateur pour le mode d'édition
    createEditModeDiv();
    createEditModeProjet();
  } else {
    if (!isProduction) console.log("Utilisateur non connecté : on supprime les élèments du mode Admin");

    // Supprime les éléments d'interface utilisateur du mode d'édition
    removeEditModeDiv();
    removeEditModeProjet();
  }
}

/**
 * Met à jour l'élément de navigation pour refléter l'état de connexion de l'utilisateur.
 * Si l'utilisateur est connecté, le texte du lien de connexion affichera "Log Out",
 * sinon il affichera "Log In". Ceci est déterminé par la valeur de 'isLoggedIn' dans localStorage.
 */
function updateNavigation() {
  if (!isProduction) console.log("Fonction updateNavigation lue");

  // Récupère l'état de connexion à partir de localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Récupère l'élément de lien de connexion dans l'interface utilisateur
  const loginLink = document.getElementById("login-link");

  // Met à jour le texte du lien de connexion selon que l'utilisateur est connecté ou non
  loginLink.textContent = isLoggedIn ? "Log Out" : "Log In";
}

/**
 * Gère la procédure de déconnexion de l'utilisateur.
 * Cette fonction supprime les informations de session stockées dans localStorage,
 * met à jour le texte du lien de connexion pour indiquer que l'utilisateur peut se reconnecter,
 * et réinitialise l'interface utilisateur pour refléter l'état déconnecté.
 * Enfin, elle affiche un modal indiquant que la déconnexion a été réussie.
 */
function handleLogout() {
  if (!isProduction) console.log("Fonction handleLogout lue");

  // Supprime le token du localStorage, effaçant ainsi la session de l'utilisateur
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  // Met à jour le statut de connexion dans localStorage pour indiquer que l'utilisateur n'est plus connecté
  localStorage.setItem("isLoggedIn", "false");
  localStorage.removeItem("isLoggedIn");

  // Récupère l'élément de lien de connexion et met à jour son texte pour "Log In"
  const loginLink = document.getElementById("login-link");
  loginLink.textContent = "Log In";

  // Exécute les fonctions pour supprimer les éléments d'interface utilisateur spécifiques au mode connecté
  removeEditModeDiv();
  removeEditModeProjet();

  // Affiche un modal pour informer l'utilisateur que la déconnexion a été réussie
  showModal("Déconnexion réussie.", true);
}

/**
 * Initialise le comportement du lien de connexion.
 * Cela devrait être exécuté après que le DOM est complètement chargé pour s'assurer que
 * l'élément de lien de connexion est accessible.
 * Cette fonction attache un gestionnaire d'événements au lien de connexion qui gère
 * la connexion et la déconnexion en fonction de l'état actuel de l'utilisateur.
 */
export function setupLoginLink() {
  if (!isProduction) console.log("Fonction setupLoginLink lue");

  // Récupère l'élément du DOM pour le lien de connexion
  const loginLink = document.getElementById("login-link");

  // Attache un gestionnaire d'événement au clic sur le lien de connexion
  loginLink.addEventListener("click", (event) => {
    // Empêche le comportement par défaut du lien (ne navigue pas vers l'URL du href)
    event.preventDefault();

    // Vérifie si l'utilisateur est actuellement connecté
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Si l'utilisateur est connecté, déclenche la fonction de déconnexion
    if (isLoggedIn) {
      handleLogout(); // Déconnecte l'utilisateur
    } else {
      // Sinon, redirige l'utilisateur vers la page de connexion
      window.location.href = "login.html";
    }
  });
}

/**
 * Affiche un modal avec un message personnalisé.
 * Utilise les paramètres pour définir le texte et le style du modal.
 * Peut également rediriger l'utilisateur à une nouvelle URL après fermeture du modal.
 * @param {string} message - Le message à afficher dans le modal.
 * @param {boolean} isSuccess - Indique si le modal est pour une opération réussie (true) ou échouée (false).
 * @param {string} [redirectUrl] - L'URL de redirection après la fermeture du modal (facultatif).
 */
function showModal(message, isSuccess, redirectUrl) {
  if (!isProduction) console.log("Fonction showModal");
  // Crée et configure les éléments du modal
  const modal = document.createElement("div");
  const modalContent = document.createElement("div");
  const closeBtn = document.createElement("span");
  const modalText = document.createElement("p");
  const okButton = document.createElement("button");

  // Définit les classes CSS pour le style du modal
  modal.className = "modal-login";
  modalContent.className = isSuccess ? "modal-content success" : "modal-content failure";

  // Configure le bouton de fermeture du modal
  closeBtn.classList.add("close-btn-confirm");
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("title", "Fermer");
  closeBtn.onclick = handleModalClose;

  // Définit le texte du message et le style du bouton OK
  modalText.classList.add("confirmation-message");
  modalText.textContent = message;
  okButton.classList.add("confirmation-modal-button");
  okButton.textContent = "OK";
  okButton.onclick = handleModalClose;

  // Assemble les composants du modal
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(modalText);
  modalContent.appendChild(okButton);
  modal.appendChild(modalContent);

  // Ajoute le modal au corps de la page
  document.body.appendChild(modal);

  // Fonction pour gérer la fermeture du modal et la redirection si nécessaire
  function handleModalClose() {
    if (!isProduction) console.log("Fonction handleModalClose");
    // Retire le modal de la page
    modal.remove();
    // Redirige l'utilisateur si une URL de redirection a été fournie
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
}
