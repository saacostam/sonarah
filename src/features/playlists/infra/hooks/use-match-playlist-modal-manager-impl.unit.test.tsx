import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMatchPlaylistModalManagerImpl } from "./use-match-playlist-modal-manager-impl";

describe("useMatchPlaylistModalManagerImpl", () => {
	it("should initialize with type 'browse'", () => {
		const { result } = renderHook(() => useMatchPlaylistModalManagerImpl());

		expect(result.current.status).toEqual({ type: "browse" });
	});

	it("should update status when setStatus is called", () => {
		const { result } = renderHook(() => useMatchPlaylistModalManagerImpl());

		act(() => {
			result.current.setStatus({ type: "browse" });
		});

		expect(result.current.status).toEqual({ type: "browse" });
	});

	it("should return stable references when status doesn't change", () => {
		const { result, rerender } = renderHook(() =>
			useMatchPlaylistModalManagerImpl(),
		);
		const firstReturn = result.current;

		rerender();

		// `useMemo` should preserve the same object reference if `status` didn’t change
		expect(result.current).toBe(firstReturn);
	});
});
