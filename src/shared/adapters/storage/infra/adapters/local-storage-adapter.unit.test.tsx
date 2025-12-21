import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StorageKeys } from "../../domain";
import { LocalStorageAdapter } from "./local-storage-adapter";

describe("LocalStorageAdapter", () => {
	let adapter: LocalStorageAdapter;

	beforeEach(() => {
		adapter = new LocalStorageAdapter();

		// Reset mocks before each test
		vi.spyOn(Storage.prototype, "getItem").mockReset();
		vi.spyOn(Storage.prototype, "setItem").mockReset();
		vi.spyOn(Storage.prototype, "removeItem").mockReset();
	});

	describe("get", () => {
		it("returns null if key is not found", async () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue(null);

			const result = await adapter.get("missing-key" as StorageKeys);
			expect(result).toBeNull();
		});

		it("parses JSON if value is valid", async () => {
			const stored = JSON.stringify({ foo: "bar" });
			vi.spyOn(localStorage, "getItem").mockReturnValue(stored);

			const result = await adapter.get("some-key" as StorageKeys);
			expect(result).toEqual({ foo: "bar" });
		});

		it("returns null if JSON.parse throws", async () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue("not-json");

			const result = await adapter.get("bad-json" as StorageKeys);
			expect(result).toBeNull();
		});
	});

	describe("set", () => {
		it("stores stringified value", async () => {
			const spy = vi.spyOn(localStorage, "setItem");
			await adapter.set("key" as StorageKeys, { a: 1 });

			expect(spy).toHaveBeenCalledWith("key", JSON.stringify({ a: 1 }));
		});
	});

	describe("remove", () => {
		it("calls localStorage.removeItem", async () => {
			const spy = vi.spyOn(localStorage, "removeItem");
			await adapter.remove("key" as StorageKeys);

			expect(spy).toHaveBeenCalledWith("key");
		});
	});

	describe("unsafeGet", () => {
		it("returns parsed value when present", async () => {
			const val = { test: true };
			vi.spyOn(localStorage, "getItem").mockReturnValue(JSON.stringify(val));

			const result = await adapter.unsafeGet<typeof val>("key" as StorageKeys);
			expect(result).toEqual(val);
		});

		it("returns null if key not found", async () => {
			vi.spyOn(localStorage, "getItem").mockReturnValue(null);

			const result = await adapter.unsafeGet("missing" as StorageKeys);
			expect(result).toBeNull();
		});
	});
});
