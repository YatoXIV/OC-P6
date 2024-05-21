/////////////////////////////////////////////////////
// Gestion de la home page  /////////////////////////
/////////////////////////////////////////////////////
// >>> GENERATION DES PROJETS

const filterContainerDiv = document.getElementById('filters');
for (let i = 0; i < 4; i++) {
	const button = document.createElement('button');
	if (i == 0) {
		button.textContent = 'Tous';
		button.classList.add(
			'filter__btn',
			'filter__btn-id-null',
			'filter__btn--active'
		);
	} else {
		switch (i) {
			case 1:
				button.textContent = 'Objets';
				break;
			case 2:
				button.textContent = 'Appartements';
				break;
			case 3:
				button.textContent = 'Hôtels & restaurants';
				break;
		}
		button.classList.add('filter__btn', 'filter__btn-id-' + i);
	}
	filterContainerDiv.appendChild(button);
}

const btnAll = document.querySelector('.filter__btn-id-null');
const btnId1 = document.querySelector('.filter__btn-id-1');
const btnId2 = document.querySelector('.filter__btn-id-2');
const btnId3 = document.querySelector('.filter__btn-id-3');

const sectionProjets = document.querySelector('.gallery');

let data = null;
let id;
generationProjets(data, null);

// Reset la section projets
function resetSectionProjets() {
	sectionProjets.innerHTML = '';
}

// Génère les projets
async function generationProjets(data, id) {
	try {
		const response = await fetch('http://localhost:5678/api/works');
		data = await response.json();
	} catch {
		const p = document.createElement('p');
		p.classList.add('error');
		p.innerHTML =
			"Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site";
		sectionProjets.appendChild(p);
		await new Promise((resolve) => setTimeout(resolve, 60000));
		window.location.href = 'index.html';
	}

	resetSectionProjets();

	// Filtre les résultats
	if (id) {
		data = data.filter((data) => data.categoryId == id);
	}

	// Change la couleur du bouton en fonction du filtre
	document.querySelectorAll('.filter__btn').forEach((btn) => {
		btn.classList.remove('filter__btn--active');
	});
	document
		.querySelector(`.filter__btn-id-${id}`)
		.classList.add('filter__btn--active');

	if (data.length === 0 || data === undefined) {
		const p = document.createElement('p');
		p.classList.add('error');
		p.innerHTML =
			'Aucun projet à afficher <br><br>Toutes nos excuses pour la gêne occasionnée';
		sectionProjets.appendChild(p);
		return;
	}

	// Génère les projets
	if (id === null || [1, 2, 3].includes(id)) {
		for (let i = 0; i < data.length; i++) {
			const figure = document.createElement('figure');
			sectionProjets.appendChild(figure);
			figure.classList.add(`js-projet-${data[i].id}`); // Ajoute l'id du projet pour le lien vers la modale lors de la supression
			const img = document.createElement('img');
			img.src = data[i].imageUrl;
			img.alt = data[i].title;
			figure.appendChild(img);

			const figcaption = document.createElement('figcaption');
			figcaption.innerHTML = data[i].title;
			figure.appendChild(figcaption);
		}
	}
}

//////////////
// >>> FILTRES

btnAll.addEventListener('click', () => {
	// Tous les projets
	generationProjets(data, null);
});

btnId1.addEventListener('click', () => {
	// Objets
	generationProjets(data, 1);
});

btnId2.addEventListener('click', () => {
	// Appartements
	generationProjets(data, 2);
});

btnId3.addEventListener('click', () => {
	// Hôtels & restaurants
	generationProjets(data, 3);
});
