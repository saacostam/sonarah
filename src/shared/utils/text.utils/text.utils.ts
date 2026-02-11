export function formatAvatarFallback(
	fallback: string | number | undefined | null,
	defaultValue: string,
): string {
	if (fallback === null || fallback === undefined || fallback === "")
		return defaultValue;

	return String(fallback).split(" ").at(0)?.slice(0, 8) ?? defaultValue;
}
