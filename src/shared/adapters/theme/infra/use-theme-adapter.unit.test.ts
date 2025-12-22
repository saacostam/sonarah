import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IStorageAdapter } from "@/shared/adapters/storage/domain";
import { StorageKeys } from "@/shared/adapters/storage/domain";
import { IThemeVariant } from "../domain";
import { useThemeAdapterImpl } from "./use-theme-adapter";

function createStorageMock(initial?: unknown): IStorageAdapter {
	return {
		unsafeGet: vi.fn().mockResolvedValue(initial),
		set: vi.fn(),
	} as unknown as IStorageAdapter;
}

describe("useThemeAdapterImpl", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		document.documentElement.className = "";
	});

	it("initializes with DARK theme by default", () => {
		const storage = createStorageMock();

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		expect(result.current.theme).toBe(IThemeVariant.DARK);
	});

	it("loads DARK theme from storage", async () => {
		const storage = createStorageMock(IThemeVariant.DARK);

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		await waitFor(() => {
			expect(result.current.theme).toBe(IThemeVariant.DARK);
		});
	});

	it("falls back to DARK if stored theme is invalid", async () => {
		const storage = createStorageMock("invalid-theme");

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		await waitFor(() => {
			expect(result.current.theme).toBe(IThemeVariant.DARK);
		});
	});

	it("adds the `dark` class to documentElement when theme is dark", async () => {
		const storage = createStorageMock(IThemeVariant.LIGHT);

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		// wait for initial async load to settle
		await waitFor(() => {
			expect(result.current.theme).toBe(IThemeVariant.LIGHT);
		});

		await act(async () => {
			result.current.setTheme(IThemeVariant.DARK);
		});

		await waitFor(() => {
			expect(document.documentElement.classList.contains("dark")).toBe(true);
		});
	});

	it("removes the `dark` class from documentElement when theme is light", async () => {
		const storage = createStorageMock(IThemeVariant.DARK);

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		await waitFor(() => {
			expect(result.current.theme).toBe(IThemeVariant.DARK);
		});

		await act(async () => {
			result.current.setTheme(IThemeVariant.LIGHT);
		});

		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("does not store the theme before initial load finishes", async () => {
		const storage = createStorageMock(IThemeVariant.LIGHT);

		renderHook(() => useThemeAdapterImpl({ storage }));

		// Immediately after render, storage should not be written
		expect(storage.set).not.toHaveBeenCalled();

		await waitFor(() => {
			expect(storage.set).toHaveBeenCalled();
		});
	});

	it("stores the theme after initial load", async () => {
		const storage = createStorageMock(IThemeVariant.LIGHT);

		renderHook(() => useThemeAdapterImpl({ storage }));

		await waitFor(() => {
			expect(storage.set).toHaveBeenCalledWith(
				StorageKeys.THEME,
				IThemeVariant.LIGHT,
			);
		});
	});

	it("stores the theme when it changes after load", async () => {
		const storage = createStorageMock(IThemeVariant.LIGHT);

		const { result } = renderHook(() => useThemeAdapterImpl({ storage }));

		await waitFor(() => {
			expect(result.current.theme).toBe(IThemeVariant.LIGHT);
		});

		await act(async () => {
			result.current.setTheme(IThemeVariant.DARK);
		});

		expect(storage.set).toHaveBeenLastCalledWith(
			StorageKeys.THEME,
			IThemeVariant.DARK,
		);
	});
});
