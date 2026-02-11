import { describe, expect, it } from "vitest";
import { formatAvatarFallback } from "./text.utils";

describe("formatAvatarFallback [Unit]", () => {
	describe("when fallback is nullish or empty", () => {
		it("should return defaultValue if fallback is undefined", () => {
			expect(formatAvatarFallback(undefined, "DEFAULT")).toBe("DEFAULT");
		});

		it("should return defaultValue if fallback is null", () => {
			expect(formatAvatarFallback(null, "DEFAULT")).toBe("DEFAULT");
		});

		it("should return defaultValue if fallback is empty string", () => {
			expect(formatAvatarFallback("", "DEFAULT")).toBe("DEFAULT");
		});
	});

	describe("when fallback is valid", () => {
		it("should render 0 correctly", () => {
			expect(formatAvatarFallback(0, "DEFAULT")).toBe("0");
		});

		it("should convert numbers to string and truncate to 8 chars", () => {
			expect(formatAvatarFallback(123456789, "DEFAULT")).toBe("12345678");
		});

		it("should return first word only", () => {
			expect(formatAvatarFallback("Santiago Acosta", "DEFAULT")).toBe(
				"Santiago",
			);
		});

		it("should truncate first word to 8 characters", () => {
			expect(formatAvatarFallback("AlexanderTheGreat", "DEFAULT")).toBe(
				"Alexande",
			);
		});
	});
});
