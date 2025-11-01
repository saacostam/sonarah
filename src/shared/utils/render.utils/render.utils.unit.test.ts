import { describe, expect, it, vi } from "vitest";
import { nestedRequestAnimationFrame } from "./render.utils";

describe("nestedRequestAnimationFrame [Unit]", () => {
	it("should call the function immediately if depth <= 0", () => {
		const fn = vi.fn();
		nestedRequestAnimationFrame(fn, 0);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should schedule the function via requestAnimationFrame once if depth = 1", () => {
		const fn = vi.fn();
		const raf = vi.fn((cb) => {
			cb(); // simulate immediate frame
			return 1;
		});
		vi.stubGlobal("requestAnimationFrame", raf);

		nestedRequestAnimationFrame(fn, 1);

		expect(raf).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.unstubAllGlobals();
	});

	it("should schedule multiple nested frames if depth > 1", () => {
		const fn = vi.fn();
		const raf = vi.fn((cb) => {
			cb(); // recursively invoke immediately
			return 1;
		});
		vi.stubGlobal("requestAnimationFrame", raf);

		nestedRequestAnimationFrame(fn, 3);

		expect(raf).toHaveBeenCalledTimes(3);
		expect(fn).toHaveBeenCalledTimes(1);

		vi.unstubAllGlobals();
	});
});
