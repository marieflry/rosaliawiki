function parsePriceToNumber(text) {
	if (!text) return Number.NaN;
	const digitsOnly = String(text).replace(/[^\d]/g, "");
	if (!digitsOnly) return Number.NaN;
	return Number.parseInt(digitsOnly, 10);
}

function sortSellItemsTableByPriceAsc() {
	const table = document.getElementById("sell-items-table");
	if (!table) return;

	const tbody = table.tBodies?.[0];
	if (!tbody) return;

	const rows = Array.from(tbody.rows);

	rows.sort((rowA, rowB) => {
		const priceA = parsePriceToNumber(rowA.cells?.[2]?.textContent);
		const priceB = parsePriceToNumber(rowB.cells?.[2]?.textContent);

		const a = Number.isFinite(priceA) ? priceA : Number.POSITIVE_INFINITY;
		const b = Number.isFinite(priceB) ? priceB : Number.POSITIVE_INFINITY;
		if (a !== b) return a - b;

		const nameA = (rowA.cells?.[1]?.textContent || "").trim();
		const nameB = (rowB.cells?.[1]?.textContent || "").trim();
		return nameA.localeCompare(nameB, "fr", { sensitivity: "base" });
	});

	for (const row of rows) {
		tbody.appendChild(row);
	}
}

function setHeaderHeightCssVar() {
	const header = document.querySelector("header");
	if (!header) return;
	const height = header.offsetHeight || 0;
	document.documentElement.style.setProperty("--header-height", `${height}px`);
}

function setupNavAutoHide() {
	const nav = document.querySelector("nav");
	if (!nav) return;

	let lastScrollY = window.scrollY;
	let ticking = false;
	const threshold = 10;

	const update = () => {
		ticking = false;
		const currentY = window.scrollY;
		const delta = currentY - lastScrollY;

		if (currentY <= 0) {
			nav.classList.remove("nav-hidden");
		} else if (delta > threshold) {
			nav.classList.add("nav-hidden");
		} else if (delta < -threshold) {
			nav.classList.remove("nav-hidden");
		}

		lastScrollY = currentY;
	};

	window.addEventListener(
		"scroll",
		() => {
			if (!ticking) {
				window.requestAnimationFrame(update);
				ticking = true;
			}
		},
		{ passive: true }
	);
}

document.addEventListener("DOMContentLoaded", () => {
	sortSellItemsTableByPriceAsc();
	setHeaderHeightCssVar();
	setupNavAutoHide();
	window.addEventListener("resize", setHeaderHeightCssVar);
});
