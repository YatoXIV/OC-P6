// events.js
import { isProduction } from "./config.js";
import { getWorksData } from "./store.js"; // Importe la fonction pour obtenir les données stockées
import { showModal } from "./ui.js"; // Importe la fonction pour afficher un modal
import { createModal } from "./modal.js"; // Importe la fonction pour créer un modal

/**
 * Configure les écouteurs d'événements pour les actions de l'interface utilisateur, comme la mise à jour des projets.
 */
export function setUpEventListeners() {
  if (!isProduction) console.log("Fonction setUpEventListeners");
  const updateProjectButton = document.getElementById("update_projet");
  if (updateProjectButton) {
    updateProjectButton.onclick = function () {
      const worksData = getWorksData(); // Récupère les données des " Work "  stockées
      createModal(worksData); // Crée un modal pour la mise à jour des projets avec les données récupérées
      showModal(); // Affiche le modal
    };
  }
}

/**
 * Configure le lien de contact pour rediriger vers la section contact de la page principale.
 */
export function setupContactLink() {
  if (!isProduction) console.log("Fonction setupContactLink");
  const contactLink = document.getElementById("contact-link");
  if (contactLink) {
    contactLink.addEventListener("click", () => {
      window.location.href = "index.html#contact"; // Redirige vers la section de contact
    });
  }
}

/**
 * Configure le lien de projet pour rediriger vers la section portfolio de la page principale.
 */
export function setupProjetLink() {
  if (!isProduction) console.log("Fonction setupProjetLink");
  const projetLink = document.getElementById("projet-link");
  if (projetLink) {
    projetLink.addEventListener("click", () => {
      window.location.href = "index.html#portfolio"; // Redirige vers la section de portfolio
    });
  }
}
