import { isProduction } from "./config.js";
import { getWorksData } from "./store.js";

/**
 * Affiche les " Work "  dans la galerie de l'interface utilisateur.
 * Chaque " Work "  est présentée sous forme de figure avec une image et une légende.
 * @param {Array} works - Un tableau d'objets représentant les " Work "  à afficher.
 */
export function displayWorks(works) {
  if (!isProduction) console.log("Fonction displayWorks");
  // Sélectionnez l'élément de la galerie dans le DOM
  const gallery = document.querySelector(".gallery");

  // Vérifiez si l'élément de la galerie existe pour éviter des erreurs
  if (gallery) {
    // Réinitialisez le contenu de la galerie avant d'afficher les nouvelles " Work "
    gallery.innerHTML = "";

    // Créez et ajoutez les éléments pour chaque " Work "  dans le tableau works
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      // Configurez les attributs de l'image et le texte de la légende avec les données de " Work "
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      // Ajoutez l'image et la légende à la figure, puis ajoutez la figure à la galerie
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });

    // Log des informations en mode développement pour le débogage
    if (!isProduction) console.log("Données récupérées et affichées avec succès :", works);
  }
}

/**
 * Affiche les boutons de catégorie dans l'interface utilisateur pour permettre le filtrage des " Work " .
 * Inclut également un bouton "Tous" pour réinitialiser le filtre et montrer toutes les " Work " .
 * @param {Array} categories - Un tableau d'objets catégorie à utiliser pour créer les boutons de filtre.
 */
export function displayCategories(categories) {
  // Log pour le débogage
  if (!isProduction) console.log("Fonction displayCategories");

  // Sélectionnez le conteneur pour les boutons de catégorie
  const categoryButtons = document.querySelector("#category-buttons");
  if (categoryButtons) {
    // Créez et configurez le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.id = "btn-all";
    allButton.textContent = "Tous";
    allButton.classList.add("button-filtre", "active");

    // Ajoutez le bouton "Tous" au début du conteneur des boutons
    categoryButtons.appendChild(allButton);

    // Générez et ajoutez un bouton de catégorie pour chaque catégorie reçue
    categories.forEach((category) => {
      const button = document.createElement("button");
      // Générez un ID basé sur le nom de la catégorie, nettoyé pour être valide en tant qu'ID
      const categoryId = `btn-${category.name.replace(/&/g, "").replace(/\s+/g, "-").toLowerCase()}`;
      button.id = categoryId;
      button.textContent = category.name;
      button.classList.add("button-filtre");

      // Ajoutez le bouton de catégorie au conteneur
      categoryButtons.appendChild(button);
    });

    // Écoutez les clics sur les boutons de catégorie pour activer le filtrage
    categoryButtons.addEventListener("click", function (event) {
      if (event.target.classList.contains("button-filtre")) {
        // Retirez la classe "active" de tous les boutons puis l'ajoutez à celui qui a été cliqué
        document.querySelectorAll(".button-filtre").forEach(function (btn) {
          btn.classList.remove("active");
        });
        event.target.classList.add("active");

        // Filtrer les " Work "  par la catégorie sélectionnée ou réinitialiser le filtre si le bouton "Tous" est cliqué
        filterWorksByCategory(event.target.id, categories);
      }
    });
  }
}

/**
 * Filtre les " Work "  par la catégorie sélectionnée et met à jour l'affichage, ou réinitialise le filtre si nécessaire.
 * @param {string} buttonId - L'ID du bouton de catégorie qui a été cliqué.
 * @param {Array} categories - Les catégories disponibles pour le filtrage.
 */
function filterWorksByCategory(buttonId, categories) {
  if (!isProduction) console.log("Fonction filterWorksByCategory");
  const works = getWorksData(); // Récupérez les données des " Work "  du store
  if (buttonId === "btn-all") {
    // Si le bouton "Tous" est cliqué, affichez tous les travaux
    displayWorks(works);
  } else {
    // Récupérez la catégorie correspondante à partir de l'ID du bouton et filtrez les " Work "
    const category = categories.find((cat) => `btn-${cat.name.replace(/&/g, "").replace(/\s+/g, "-").toLowerCase()}` === buttonId);
    if (category) {
      const filteredWorks = works.filter((work) => work.category.name === category.name);
      displayWorks(filteredWorks);
    }
  }
}

/**
 * Crée un mode édition pour la section projet, permettant l'affichage visuel de l'option de modification.
 * Ajoute un conteneur avec un bouton d'édition près du titre de la section.
 */
export function createEditModeProjet() {
  if (!isProduction) console.log("Fonction createEditModeProjet");

  // Trouver le titre de la section projet pour y ajouter le mode édition
  const title = document.querySelector("#portfolio h2");

  // Créer un conteneur pour grouper le titre avec le bouton d'édition
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  // Créer le texte d'édition et lui assigner un identifiant pour des actions futures
  const editText = document.createElement("span");
  editText.id = "update_projet";

  // Créer une icône d'édition en utilisant Font Awesome
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");

  // Ajouter l'icône au texte d'édition
  editText.appendChild(editIcon);
  editText.append(" modifier"); // Ajouter le texte 'modifier' après l'icône

  // Retirer le titre original de son emplacement pour le réinsérer dans le nouveau conteneur
  title.remove();

  // Ajouter le titre et le bouton d'édition au conteneur
  titleContainer.appendChild(title);
  titleContainer.appendChild(editText);

  // Sélectionner la section du portfolio pour y insérer le conteneur de titre
  const portfolioSection = document.querySelector("#portfolio");

  // Insérer le conteneur de titre au début de la section portfolio
  portfolioSection.insertBefore(titleContainer, portfolioSection.firstChild);
}

/**
 * Supprime le mode édition de la section projet.
 * Cela implique d'enlever le conteneur du titre qui inclut l'option de modification.
 */
export function removeEditModeProjet() {
  if (!isProduction) console.log("Fonction removeEditModeProjet");

  // Trouver le conteneur du titre qui inclut le mode édition
  const titleContainer = document.querySelector("#portfolio span");

  // Si le conteneur du mode édition est trouvé, l'enlever du DOM
  if (titleContainer) {
    titleContainer.remove();
  }

  // const categoryButtons = document.querySelector("#category-buttons");
  // categoryButtons.style.visibility = "visible";
}

/**
 * Crée et ajoute une div indiquant le mode édition au début du corps de la page.
 */
export function createEditModeDiv() {
  if (!isProduction) console.log("Fonction createEditModeDiv");
  const editModeDiv = document.createElement("div");
  editModeDiv.classList.add("edit-mode-div");

  const editModeIcon = document.createElement("i");
  editModeIcon.classList.add("fa-regular", "fa-pen-to-square", "edit-mode-icon");
  editModeDiv.appendChild(editModeIcon);

  const editModeText = document.createElement("p");
  editModeText.textContent = "Mode édition";
  editModeText.classList.add("edit-mode-text");
  editModeDiv.appendChild(editModeText);

  document.body.insertBefore(editModeDiv, document.body.firstChild); // Insère la div en mode édition en haut de la page
  // Pour masquer les boutons de catégorie
  toggleFilterCat(false);
}

/**
 * Supprime la div du mode édition du corps de la page, si elle existe.
 */
export function removeEditModeDiv() {
  if (!isProduction) console.log("Fonction removeEditModeDiv");
  const editModeDiv = document.querySelector(".edit-mode-div");
  if (editModeDiv) {
    editModeDiv.remove(); // Retire la div du mode édition
  }
  // Pour afficher les boutons de catégorie
  toggleFilterCat(true);
}

/**
 * Masque les boutons de filtre sur la page index.html
 */
export function toggleFilterCat(shouldDisplay) {
  const categoryButtons = document.querySelector("#category-buttons");
  if (categoryButtons) {
    categoryButtons.style.visibility = shouldDisplay ? "visible" : "hidden";
  }
}

/**
 * Affiche la modale à l'utilisateur en modifiant son style pour la rendre visible.
 * Si la modale n'existe pas déjà dans le DOM, elle est créée.
 */
export function showModal() {
  if (!isProduction) console.log("Fonction showModal");
  // Tente de récupérer une modale existante par son ID
  var modal = document.getElementById("myModal");

  // Si aucune modale n'existe, en crée une nouvelle
  if (!modal) {
    modal = createModal();
  }

  // Modifie le style de la modale pour la rendre visible
  modal.style.display = "flex";
}
