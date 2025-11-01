import { describe, expect, it } from "vitest";
import { formatTimeFromMilliseconds } from "./time.utils";

describe("formatTimeFromMilliseconds [Unit]", () => {
	it("should format milliseconds less than one minute correctly", () => {
		expect(formatTimeFromMilliseconds(0)).toBe("0:00");
		expect(formatTimeFromMilliseconds(59000)).toBe("0:59");
		expect(formatTimeFromMilliseconds(1000)).toBe("0:01");
	});

	it("should round up fractional seconds using Math.ceil", () => {
		// 1001 ms → 2 seconds after ceil
		expect(formatTimeFromMilliseconds(1001)).toBe("0:02");
	});

	it("should format minutes and seconds correctly", () => {
		expect(formatTimeFromMilliseconds(60_000)).toBe("1:00");
		expect(formatTimeFromMilliseconds(125_000)).toBe("2:05");
	});

	it("should include hours when total time exceeds one hour", () => {
		expect(formatTimeFromMilliseconds(3600_000)).toBe("1:00:00");
		expect(formatTimeFromMilliseconds(3661_000)).toBe("1:01:01");
	});

	it("should handle multiple hours correctly", () => {
		expect(formatTimeFromMilliseconds(7322_000)).toBe("2:02:02");
	});

	it("should treat negative milliseconds as zero", () => {
		expect(formatTimeFromMilliseconds(-5000)).toBe("0:00");
	});
});
