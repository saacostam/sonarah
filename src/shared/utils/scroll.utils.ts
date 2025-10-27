export function scrollToElement(element: HTMLElement, margin = 16) {
	if (!element) return;

	const elementRect = element.getBoundingClientRect();
	const targetY = window.scrollY + elementRect.top - margin;

	const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	const scrollPosition = Math.max(0, Math.min(targetY, maxScroll));

	window.scrollTo({
		top: scrollPosition,
		behavior: "smooth",
	});
}
