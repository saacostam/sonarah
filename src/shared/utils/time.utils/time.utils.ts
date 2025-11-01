export function formatTimeFromMilliseconds(ms: number) {
	const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return hours > 0
		? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
				.toString()
				.padStart(2, "0")}`
		: `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
