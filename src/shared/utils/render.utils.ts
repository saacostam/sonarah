export function nestedRequestAnimationFrame(fn: () => void, depth = 1): void {
	if (depth <= 0) {
		fn();
		return;
	}
	window.requestAnimationFrame(() =>
		nestedRequestAnimationFrame(fn, depth - 1),
	);
}
