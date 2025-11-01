import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToElement } from "./scroll.utils";

describe("scrollToElement [Unit]", () => {
	let mockElement: HTMLElement;
	let scrollToSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockElement = document.createElement("div");
		// @ts-expect-error — we’ll mock it
		mockElement.getBoundingClientRect = vi.fn(() => ({
			top: 100,
			bottom: 200,
			left: 0,
			right: 0,
			width: 100,
			height: 100,
		}));

		scrollToSpy = vi.fn();
		vi.stubGlobal("scrollTo", scrollToSpy);

		Object.defineProperty(window, "scrollY", { value: 50, writable: true });
		Object.defineProperty(window, "innerHeight", {
			value: 500,
			writable: true,
		});
		Object.defineProperty(document.documentElement, "scrollHeight", {
			value: 2000,
			writable: true,
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should not throw or call scrollTo if element is null", () => {
		// @ts-expect-error testing null safety
		scrollToElement(null);
		expect(scrollToSpy).not.toHaveBeenCalled();
	});

	it("should scroll smoothly to the calculated position", () => {
		scrollToElement(mockElement, 16);

		expect(scrollToSpy).toHaveBeenCalledWith({
			top: 134, // 50 + 100 - 16
			behavior: "smooth",
		});
	});

	it("should not scroll past the maximum scroll height", () => {
		// @ts-expect-error — we’ll mock it
		mockElement.getBoundingClientRect = vi.fn(() => ({
			top: 5000,
			bottom: 5100,
			left: 0,
			right: 0,
			width: 100,
			height: 100,
		}));

		scrollToElement(mockElement);

		const expectedMax = 2000 - 500; // scrollHeight - innerHeight
		expect(scrollToSpy).toHaveBeenCalledWith({
			top: expectedMax,
			behavior: "smooth",
		});
	});

	it("should not scroll below 0", () => {
		// @ts-expect-error — we’ll mock it
		mockElement.getBoundingClientRect = vi.fn(() => ({
			top: -500,
			bottom: -400,
			left: 0,
			right: 0,
			width: 100,
			height: 100,
		}));

		scrollToElement(mockElement);
		expect(scrollToSpy).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
