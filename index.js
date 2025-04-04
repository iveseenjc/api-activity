const seed = "foobar";

// For tab contents-------------------------------------------------
function changeTabs(index) {	
	tabContents.forEach(tabContent => {
		const tabIndex = parseInt(tabContent.getAttribute("data-content-index"));
		tabContent.style.display = tabIndex === index ? "block" : "none";
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