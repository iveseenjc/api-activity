function createElement (htmlTag, classes = [], attributes = {}, appendTo = null) {
	const element = document.createElement(htmlTag);

	if (classes.length > 0) {
		classes.forEach(c => {
			element.classList.add(c);
		});
	}

	for (const key in attributes) {
		element[key] = attributes[key]
	}

	if (appendTo !== null) {
		appendTo.append(element);
	}

	return element;
}

async function getRandomUsers(count = 1, seed = "") {
	try {
		const urlParams = new URLSearchParams({
			seed: seed,
			nat: 'us',
			results: count
		});
		const url = `https://randomuser.me/api/?${urlParams}`;
		console.log(url);
		
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('API request failed');
		}

		const data = await response.json();
		return data.results;
	} 
	catch (error) {
		console.error('Error fetching random users:', error);
		return [];
	}
}
// For tab contents-------------------------------------------------
function changeTabs(index) {	
	tabContents.forEach(tabContent => {
		const tabIndex = parseInt(tabContent.getAttribute("data-content-index"));
		tabContent.style.display = tabIndex === index ? "" : "none";
	});
	
	tabLinks.forEach((tabLink, linkIndex) => {
		tabLink.classList.toggle("selected", linkIndex === index);
	});
}

const tabLinks = document.querySelectorAll(".tab-links");
const tabContents = document.querySelectorAll(".tab-content");

tabLinks.forEach((tabLink, index) => {
	tabLink.addEventListener("click", () => {
		changeTabs(index)
	});
});

tabContents.forEach((tabContent, index) => {
	if (index !== 0) {
		tabContent.style.display = "none";
	}
});

// Show Records ----------------------------------------------------

function fillRecords(peopleList, cleanContainer = true) {
	const recordsContainer = document.querySelector(".records-container");

	if (cleanContainer) {
		recordsContainer.replaceChildren();
	}

	peopleList.forEach(p => {
		const recordCard = createElement("div", ["record-card"]);
		const mugShot = createElement("img",["mugshot"], {
			src: p.picture.large,
			alt: "mugshot"
		});

		const lastNameTag = createElement("p", [], {
			textContent: `${p.name.last.toUpperCase()},`
		});

		const firstNameTag = createElement("p", [], {
			textContent: p.name.first
		});

		recordCard.append(mugShot, lastNameTag, firstNameTag);
		recordsContainer.append(recordCard);
	});
}

let people = [];
getRandomUsers(100, "javascript")
	.then(persons => {
		people.push(...persons);
		fillRecords(people, true);
	});

// Search Records --------------------------------------------------
function fillInfo() {
	searchResults.style.visibility = "visible";
	
	const searchInput = document.querySelector("#name-search");
	const searchResult = document.querySelector(".search-results");
	searchResult.replaceChildren();
	
	const resultInfo = createElement("div", ["result-info"], {}, searchResult);
		
	const inputData = searchInput.value.toLowerCase().split(/, | |,/);
	
	const dataSearched = people.find(value => 
		(value.name.first.toLowerCase() === inputData[0] && value.name.last.toLowerCase() === inputData[1]) ||
		(value.name.first.toLowerCase() === inputData[1] && value.name.last.toLowerCase() === inputData[0])
	)

	console.log(inputData, dataSearched);
	
	const updateResultInfo = (data) => {
		createElement("h1", [], { textContent: "Name" }, resultInfo);
		createElement("h2", [], { 
			textContent: `${data.name.last.toUpperCase()}, ${data.name.first}` 
		}, resultInfo);
		
		createElement("h1", [], { textContent: "Date of Birth" }, resultInfo);
		createElement("h2", [], {
			textContent: new Date(data.dob.date).toLocaleDateString('en-US', {
				year: 'numeric', month: 'long', day: "numeric"
			})
		}, resultInfo);
		
		createElement("h1", [], { textContent: "Address" }, resultInfo);
		createElement("h2", [], {
			textContent: `${data.location.city}, ${data.location.state}`
		}, resultInfo);
		
		createElement("h1", [], { textContent: "Phone Number" }, resultInfo);
		createElement("h2", [], {
			textContent: `${data.phone}`
		}, resultInfo);
		
		createElement("img", [], { src: data.picture.large, alt: "Mug shot"},
			createElement("div", ["img-mask"], {}, searchResult)
		)
	}
	
	if (dataSearched !== undefined) {
		updateResultInfo(dataSearched);
	}
	else {
		resultInfo.replaceChildren();
		createElement("h1", [], { textContent: "No data found!" }, resultInfo);
	}
}

const searchResults = document.querySelector(".search-results");
const searchButton = document.querySelector(".search-options>button");

searchButton.addEventListener("click", fillInfo);
searchResults.style.visibility = "hidden";

