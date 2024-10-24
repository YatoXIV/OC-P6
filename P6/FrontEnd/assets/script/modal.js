// modal.js
import { isProduction } from "./config.js";
import { handleFormSubmit, handleFileSelect, fileDropped } from "./utils.js"; // Importation des fonctions utilitaires pour la gestion des fichiers et des soumissions de formulaire
import { deleteWork } from "./utils.js"; // Importation de la fonction pour supprimer une " Work "
import { fetchCategories } from "./api.js"; // Importation de la fonction pour récupérer les catégories depuis l'API

/**
 * Crée et ajoute une modale à la page avec les données fournies.
 * @param {Array} worksData - Les données des " Work "  à afficher dans la modale pour la suppression.
 */

// Fonction pour créer la modale
export function createModal(worksData) {
  if (!isProduction) console.log("Fonction createModal");
  // Créez le conteneur principal de la modale et configurez ses classes et attributs
  var modal = document.createElement("div");
  modal.setAttribute("id", "myModal");
  modal.classList.add("modal");

  // Créez le conteneur de contenu de la modale et ajoutez les classes CSS
  var modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Créez un conteneur pour l'en-tête de la modale
  var modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  // Créez l'icône de retour et ajoutez-la au conteneur d'en-tête (elle est cachée par défaut)
  var backIcon = document.createElement("i");
  backIcon.classList.add("fa-solid", "fa-arrow-left", "back-icon");
  backIcon.setAttribute("title", "Retour");
  backIcon.classList.remove("visible");
  backIcon.onclick = function () {
    // Logique pour revenir en arrière
    const currentModalBody = document.querySelector(".modal-delete");
    const oldModalBody = document.querySelector(".modal-addpicture");
    const backIcon = document.querySelector(".back-icon");
    oldModalBody.remove();
    currentModalBody.style.display = "flex";
    // Rendez l'icône de retour visible
    backIcon.classList.remove("visible");
  };

  modalHeader.appendChild(backIcon);

  // Créez le bouton de fermeture et ajoutez-le au conteneur d'en-tête
  var closeBtn = document.createElement("span");
  closeBtn.classList.add("close-btn");
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("title", "Fermer");
  closeBtn.onclick = function () {
    if (!isProduction) console.log("Closing modal and removing from DOM");
    modal.remove();
  };
  modalHeader.appendChild(closeBtn);

  // Ajoutez le conteneur d'en-tête au début de la modal-content
  modalContent.appendChild(modalHeader);

  // Fonction pour créer la section de suppression dans la modale avec les données fournies
  var modalBody = createModalDelete(worksData);
  modalContent.appendChild(modalBody);

  // Ajoutez le contenu de la modale au conteneur principal de la modale et ajoutez la modale complète au corps de la page
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Logique pour fermer la modale lors d'un clic à l'extérieur de celle-ci
  window.onclick = function (event) {
    if (event.target == modal) {
      if (!isProduction) console.log("Click outside modal, removing from DOM");
      modal.remove();
    }
  };
}

/**
 * Crée la section de suppression dans la modale.
 * @param {Array} worksData - Les données des " Work "  à afficher pour la suppression.
 * @returns {HTMLElement} Le corps de la modale contenant les éléments pour la suppression des " Work " .
 */
function createModalDelete(worksData) {
  if (!isProduction) console.log("Fonction createModalDelete");
  // Création d'un élément div qui servira de corps pour le modal. Il est conçu pour contenir et afficher les éléments spécifiques à la suppression d'un " Work " .
  var modalBody = document.createElement("div");
  modalBody.classList.add("modal-delete");

  // Ajoutez un titre à la modale
  var modalTitle = document.createElement("h2");
  modalTitle.textContent = "Galerie photo";
  modalTitle.classList.add("modal-title");
  modalBody.appendChild(modalTitle);

  // Créez le conteneur des images et remplissez-le avec les images fournies dans worksData
  var imagesContainer = createImagesContainer(worksData);
  modalBody.appendChild(imagesContainer);

  // Ajoutez une div pour centrer le bouton d'ajout de photo
  //var addButtonContainer = createButtonContainer("Ajouter une photo", "btn-modal", createAddImageForm);
  var addButtonContainer = createButtonContainer("Ajouter une photo", "btn-modal", createAddImageForm_DragDrop);
  modalBody.appendChild(addButtonContainer);

  return modalBody;
}

/**
 * Crée le conteneur d'images pour la modale.
 * @param {Array} worksData - Les données des " Work "  à utiliser pour créer les images.
 * @returns {HTMLElement} Le conteneur des images pour la modale.
 */
function createImagesContainer(worksData) {
  if (!isProduction) console.log("Fonction createImagesContainer");
  var imagesContainer = document.createElement("div");
  imagesContainer.classList.add("images-container");

  if (worksData) {
    // Pour chaque " Work "  dans les données fournies, créez un élément d'image et configurez-le
    worksData.forEach((work) => {
      var imageWrapper = document.createElement("div");
      imageWrapper.classList.add("modal-image-wrapper");

      var img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      img.classList.add("modal-image");

      var deleteIconContainer = document.createElement("div");
      deleteIconContainer.classList.add("delete-icon-container");

      var deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-regular", "fa-trash-can");
      deleteIcon.setAttribute("title", "Supprimer le travail");
      deleteIcon.setAttribute("data-id", work.id);

      // Ajoutez un événement de clic sur l'icône de suppression qui appelle deleteWork avec l'ID de l'" Work "
      deleteIcon.addEventListener("click", function () {
        deleteWork(this.getAttribute("data-id"));
      });

      deleteIconContainer.appendChild(deleteIcon);
      imageWrapper.appendChild(img);
      imageWrapper.appendChild(deleteIconContainer);
      imagesContainer.appendChild(imageWrapper);
    });
  }

  return imagesContainer;
}

/**
 * Crée un conteneur de bouton avec un texte personnalisé et une fonction de rappel pour l'événement de clic.
 * @param {string} buttonText - Le texte à afficher sur le bouton.
 * @param {string} buttonClass - La classe CSS à ajouter au bouton.
 * @param {Function} onClickFunction - La fonction à exécuter lors du clic sur le bouton.
 * @returns {HTMLElement} Le conteneur du bouton.
 */
function createButtonContainer(buttonText, buttonClass, onClickFunction) {
  if (!isProduction) console.log("Fonction createButtonContainer");
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  var button = document.createElement("button");
  button.textContent = buttonText;
  button.classList.add(buttonClass);

  // Ajoutez l'événement de clic qui appelle la fonction de rappel fournie
  button.addEventListener("click", onClickFunction);

  buttonContainer.appendChild(button);

  return buttonContainer;
}

/**
 * Crée le formulaire d'ajout d'image
 * La logique inclut la création de la structure du formulaire et l'ajout d'écouteurs d'événements pour la gestion des fichiers.
 */
async function createAddImageForm() {
  if (!isProduction) console.log("Fonction createAddImageForm");
  // Masquez le corps actuel de la modale
  const currentModalBody = document.querySelector(".modal-delete");
  currentModalBody.style.display = "none";

  // Rendez l'icône de retour visible
  const backIcon = document.querySelector(".back-icon");
  backIcon.classList.add("visible");

  // Créez le nouveau corps de la modale pour le formulaire d'ajout
  const addImageModalBody = document.createElement("div");
  addImageModalBody.classList.add("modal-addpicture");
  addImageModalBody.style.display = "flex";

  // Ajoutez un titre à la modale d'ajout de photo
  var modalTitle = document.createElement("h2");
  modalTitle.textContent = "Ajout photo";
  modalTitle.classList.add("modal-title");
  addImageModalBody.appendChild(modalTitle);

  // Créez un élément de formulaire
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "multipart/form-data");
  form.id = "add-form";

  // Conteneur pour le téléchargement de fichier
  const fileUploadContainer = document.createElement("div");
  fileUploadContainer.classList.add("file-upload-container");

  const fileUploadLabel = document.createElement("label");
  fileUploadLabel.classList.add("file-upload-label");

  const fileIcon = document.createElement("i");
  fileIcon.classList.add("fa-regular", "fa-image");

  const uploadText = document.createElement("span");
  uploadText.classList.add("upload-text");
  uploadText.textContent = "+ Ajouter photo";

  const fileFormat = document.createElement("span");
  fileFormat.classList.add("file-format");
  fileFormat.textContent = "jpg, png · 4mo max";

  // Input de type file pour le bouton de téléchargement
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-upload";
  fileInput.name = "file-upload";
  fileInput.accept = ".jpg,.jpeg,.png";
  fileInput.classList.add("file-upload-input");
  fileInput.setAttribute("required", ""); // Ajouter l'attribut required
  fileInput.style.opacity = "0";

  // Ajoutez des écouteurs d'événements pour la gestion des fichiers et la soumission du formulaire
  fileInput.addEventListener("change", (event) => {
    handleFileSelect(event, fileInput, imagePreviewContainer, deleteImageButton, fileUploadLabel);
  });

  fileUploadLabel.appendChild(fileIcon);
  fileUploadLabel.appendChild(uploadText);
  fileUploadLabel.appendChild(fileInput);
  fileUploadLabel.appendChild(fileFormat);

  fileUploadContainer.appendChild(fileUploadLabel);

  // Créez un élément où la prévisualisation de l'image sera affichée
  const imagePreviewContainer = document.createElement("div");
  imagePreviewContainer.classList.add("image-preview-container");
  fileUploadContainer.appendChild(imagePreviewContainer);

  form.appendChild(fileUploadContainer);

  // Ajoutez une croix pour supprimer l'image prévisualisée
  const deleteImageButton = document.createElement("button");
  deleteImageButton.innerHTML = "&times;"; // Utilisez une entité HTML pour la croix ou vous pouvez utiliser une icône
  deleteImageButton.classList.add("delete-image-button");
  deleteImageButton.setAttribute("title", "Supprimer l'image");

  deleteImageButton.onclick = function () {
    // Effacez l'image prévisualisée et réinitialisez le formulaire
    imagePreviewContainer.innerHTML = "";
    fileUploadLabel.style.display = "flex";
    fileInput.value = ""; // Important pour pouvoir supprimer une image et en sélectionner une autre
    imagePreviewContainer.style.display = "none";
  };

  // Créez le champ de saisie pour le titre
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "titre"); // Associez le label à l'input via l'attribut 'for'
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("id", "titre"); // Assurez-vous que l'id correspond à l'attribut 'for' du label
  titleInput.setAttribute("name", "titre"); // Nom du champ pour la soumission du formulaire
  titleInput.classList.add("form-control");
  titleInput.setAttribute("required", ""); // Ajouter l'attribut required
  form.appendChild(titleLabel);
  form.appendChild(titleInput);

  // Créez la liste déroulante pour les catégories
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "categorie"); // Associez le label au select via l'attribut 'for'
  categoryLabel.textContent = "Catégorie";
  const categorySelect = document.createElement("select");
  categorySelect.setAttribute("id", "categorie"); // Assurez-vous que l'id correspond à l'attribut 'for' du label
  categorySelect.setAttribute("name", "categorie"); // Nom du champ pour la soumission du formulaire
  categorySelect.classList.add("form-control");
  categorySelect.setAttribute("required", ""); // Ajouter l'attribut required
  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);

  // Créez un conteneur pour le bouton qui va être utilisé pour appliquer le flex
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Créez le bouton et ajoutez-le au conteneur
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add("btn-modal", "btn-valider");
  submitButton.textContent = "Valider"; // Utilisez textContent au lieu de value
  buttonContainer.appendChild(submitButton);

  // Ajoutez le conteneur de bouton au formulaire
  form.appendChild(buttonContainer);

  // Ajoutez le formulaire au corps de la modale
  addImageModalBody.appendChild(form);

  // Ajoutez le nouveau corps de la modale au contenu de la modale
  const modalContent = document.querySelector(".modal-content");
  modalContent.appendChild(addImageModalBody);

  // Remplacez la logique de peuplement direct par un appel à la nouvelle fonction
  await populateCategoryDropdown(categorySelect);

  // Ajouter un écouteur d'événements pour la soumission du formulaire
  form.addEventListener("submit", (event) => handleFormSubmit(event, fileInput, titleInput, categorySelect));

  // Ajoutez des écouteurs d'événements sur les champs de saisie
  titleInput.addEventListener("input", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));
  categorySelect.addEventListener("change", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));
  fileInput.addEventListener("change", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));

  // Appel initial pour définir l'état correct du bouton lors du chargement initial
  checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton);
}

/**
 * Crée le formulaire d'ajout d'image avec la fonctionnalité de glisser-déposer.
 * La logique inclut la création de la structure du formulaire et l'ajout d'écouteurs d'événements pour la gestion des fichiers.
 */
async function createAddImageForm_DragDrop() {
  if (!isProduction) console.log("Fonction createAddImageForm_DragDrop");
  // Masquez le corps actuel de la modale
  const currentModalBody = document.querySelector(".modal-delete");
  currentModalBody.style.display = "none";

  // Rendez l'icône de retour visible
  const backIcon = document.querySelector(".back-icon");
  backIcon.classList.add("visible");

  // Créez le nouveau corps de la modale pour le formulaire d'ajout
  const addImageModalBody = document.createElement("div");
  addImageModalBody.classList.add("modal-addpicture");
  addImageModalBody.style.display = "flex";

  // Ajoutez un titre à la modale d'ajout de photo
  var modalTitle = document.createElement("h2");
  modalTitle.textContent = "Ajout photo";
  modalTitle.classList.add("modal-title");
  addImageModalBody.appendChild(modalTitle);

  // Créez un élément de formulaire
  const form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "multipart/form-data");
  form.id = "add-form";

  // Conteneur pour le téléchargement de fichier avec drag & drop
  const fileUploadContainer = document.createElement("div");
  fileUploadContainer.classList.add("file-upload-container");

  const fileUploadLabel = document.createElement("label");
  fileUploadLabel.classList.add("file-upload-label");

  const fileIcon = document.createElement("i");
  fileIcon.classList.add("fa-regular", "fa-image");

  const uploadText = document.createElement("span");
  uploadText.classList.add("upload-text");
  uploadText.textContent = "+ Glissez-Déposez ou Cliquez pour Sélectionner";

  const fileFormat = document.createElement("span");
  fileFormat.classList.add("file-format");
  fileFormat.textContent = "jpg, png · 4mo max";

  // Input de type file pour le bouton de téléchargement
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "file-upload";
  fileInput.name = "file-upload";
  fileInput.accept = ".jpg,.jpeg,.png";
  fileInput.classList.add("file-upload-input");
  fileInput.setAttribute("required", ""); // Ajouter l'attribut required
  fileInput.style.opacity = "0";

  // Ajoutez des écouteurs d'événements pour la gestion des fichiers et la soumission du formulaire
  fileInput.addEventListener("change", (event) => {
    handleFileSelect(event, fileInput, imagePreviewContainer, deleteImageButton, fileUploadLabel);
  });

  fileUploadLabel.appendChild(fileIcon);
  fileUploadLabel.appendChild(uploadText);
  fileUploadLabel.appendChild(fileInput);
  fileUploadLabel.appendChild(fileFormat);

  fileUploadContainer.appendChild(fileUploadLabel);

  // Créez un élément où la prévisualisation de l'image sera affichée
  const imagePreviewContainer = document.createElement("div");
  imagePreviewContainer.classList.add("image-preview-container");
  fileUploadContainer.appendChild(imagePreviewContainer);

  form.appendChild(fileUploadContainer);

  // Ajoutez une croix pour supprimer l'image prévisualisée
  const deleteImageButton = document.createElement("button");
  deleteImageButton.innerHTML = "&times;"; // Utilisez une entité HTML pour la croix ou vous pouvez utiliser une icône
  deleteImageButton.classList.add("delete-image-button");
  deleteImageButton.setAttribute("title", "Supprimer l'image");

  deleteImageButton.onclick = function () {
    // Effacez l'image prévisualisée et réinitialisez le formulaire
    imagePreviewContainer.innerHTML = "";
    fileUploadLabel.style.display = "flex";
    fileInput.value = ""; // Important pour pouvoir supprimer une image et en sélectionner une autre
    imagePreviewContainer.style.display = "none";
  };

  // Créez le champ de saisie pour le titre
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "titre"); // Associez le label à l'input via l'attribut 'for'
  titleLabel.textContent = "Titre";
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("id", "titre"); // Assurez-vous que l'id correspond à l'attribut 'for' du label
  titleInput.setAttribute("name", "titre"); // Nom du champ pour la soumission du formulaire
  titleInput.classList.add("form-control");
  titleInput.setAttribute("required", ""); // Ajouter l'attribut required
  form.appendChild(titleLabel);
  form.appendChild(titleInput);

  // Créez la liste déroulante pour les catégories
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "categorie"); // Associez le label au select via l'attribut 'for'
  categoryLabel.textContent = "Catégorie";
  const categorySelect = document.createElement("select");
  categorySelect.setAttribute("id", "categorie"); // Assurez-vous que l'id correspond à l'attribut 'for' du label
  categorySelect.setAttribute("name", "categorie"); // Nom du champ pour la soumission du formulaire
  categorySelect.classList.add("form-control");
  categorySelect.setAttribute("required", ""); // Ajouter l'attribut required
  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);

  // Créez un conteneur pour le bouton qui va être utilisé pour appliquer le flex
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Créez le bouton et ajoutez-le au conteneur
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.classList.add("btn-modal", "btn-valider");
  submitButton.textContent = "Valider"; // Utilisez textContent au lieu de value
  buttonContainer.appendChild(submitButton);

  // Ajoutez le conteneur de bouton au formulaire
  form.appendChild(buttonContainer);

  // Ajoutez le formulaire au corps de la modale
  addImageModalBody.appendChild(form);

  // Ajoutez le nouveau corps de la modale au contenu de la modale
  const modalContent = document.querySelector(".modal-content");
  modalContent.appendChild(addImageModalBody);

  // Remplacez la logique de peuplement direct par un appel à la nouvelle fonction
  await populateCategoryDropdown(categorySelect);

  // Configurez les écouteurs d'événements pour le glisser-déposer
  setupDragAndDropListeners(fileUploadContainer, fileInput, imagePreviewContainer, deleteImageButton, fileUploadLabel);

  // Ajouter un écouteur d'événements pour la soumission du formulaire
  form.addEventListener("submit", (event) => handleFormSubmit(event, fileInput, titleInput, categorySelect));

  // Ajoutez des écouteurs d'événements sur les champs de saisie
  titleInput.addEventListener("input", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));
  categorySelect.addEventListener("change", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));
  fileInput.addEventListener("change", () => checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton));

  // Appel initial pour définir l'état correct du bouton lors du chargement initial
  checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton);
}

/**
 * Configure les écouteurs d'événements pour la fonctionnalité de glisser-déposer sur le conteneur de téléchargement de fichiers.
 * @param {HTMLElement} fileUploadContainer - Le conteneur sur lequel les événements de glisser-déposer sont écoutés.
 * @param {HTMLInputElement} fileInput - L'input de type fichier qui reçoit les données du fichier déposé.
 * @param {HTMLElement} imagePreviewContainer - Le conteneur où la prévisualisation de l'image sera affichée.
 * @param {HTMLElement} deleteImageButton - Le bouton pour supprimer l'image prévisualisée.
 * @param {HTMLElement} fileUploadLabel - Le label qui contient le texte et l'icône pour le téléchargement de fichier.
 */
function setupDragAndDropListeners(fileUploadContainer, fileInput, imagePreviewContainer, deleteImageButton, fileUploadLabel) {
  if (!isProduction) console.log("Fonction setupDragAndDropListeners");

  // Ajoute un style visuel lorsque le fichier est survolé sur le conteneur.
  fileUploadContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
    fileUploadContainer.classList.add("hover"); // Ajouter la classe pour le retour visuel lors du survol
  });

  // Retire le style visuel lorsque le fichier n'est plus survolé sur le conteneur.
  fileUploadContainer.addEventListener("dragleave", (event) => {
    fileUploadContainer.classList.remove("hover");
  });

  // Écouteur d'événements pour drag & drop
  fileUploadContainer.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  // Assurez-vous que fileInput est bien défini ici
  if (!isProduction) console.log("setup fileInput:", fileInput);

  // Gère le dépôt du fichier : récupère les données du fichier et les affiche en prévisualisation.
  fileUploadContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    fileUploadContainer.classList.remove("hover");
    // Assurez-vous de passer tous les arguments requis à fileDropped.
    fileDropped(event, fileInput, imagePreviewContainer, deleteImageButton, fileUploadLabel);
  });
}

/**
 * Remplit le menu déroulant des catégories avec les options obtenues de l'API.
 * @param {HTMLElement} categorySelect - L'élément select HTML qui sera peuplé avec les catégories.
 */
async function populateCategoryDropdown(categorySelect) {
  if (!isProduction) console.log("Fonction populateCategoryDropdown");
  try {
    // Récupère les catégories depuis l'API et les ajoute comme options du menu déroulant.
    const categories = await fetchCategories();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    // En cas d'erreur, log l'erreur dans la console.
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

/**
 * Vérifie si tous les champs du formulaire sont valides et ajuste l'apparence du bouton de soumission.
 * Si tous les champs sont valides, la classe 'btn-valider' est retirée du bouton pour indiquer qu'il est activé.
 * Si un champ n'est pas valide, la classe 'btn-valider' est ajoutée pour indiquer que le bouton est désactivé.
 * @param {HTMLElement} titleInput - L'input pour le titre.
 * @param {HTMLElement} categorySelect - Le select pour les catégories.
 * @param {HTMLElement} fileInput - L'input pour le fichier image.
 * @param {HTMLElement} submitButton - Le bouton de soumission du formulaire.
 */
function checkFieldsAndAdjustButton(titleInput, categorySelect, fileInput, submitButton) {
  if (!isProduction) console.log("Fonction checkFieldsAndAdjustButton");
  // Vérifie la validité des champs en utilisant la méthode de validation native du navigateur (HTML5)
  if (titleInput.checkValidity() && categorySelect.checkValidity() && fileInput.files.length > 0) {
    // Si tous les champs sont valides, enlevez la classe 'btn-valider'
    submitButton.classList.remove("btn-valider");
  } else {
    // Si tous les champs ne sont pas valides, ajoutez la classe 'btn-valider'
    if (!submitButton.classList.contains("btn-valider")) {
      submitButton.classList.add("btn-valider");
    }
  }
}
