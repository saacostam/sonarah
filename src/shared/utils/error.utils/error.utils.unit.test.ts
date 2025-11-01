import { describe, expect, it } from "vitest";
import { DomainError, DomainErrorType } from "@/features/errors/domain";
import { getErrorMessage } from "./error.utils";

describe("getErrorMessage [Unit]", () => {
	it("should return the message from a DomainError", () => {
		const error = new DomainError(DomainErrorType.NOT_FOUND, "User not found");
		const result = getErrorMessage(error, "Default message");

		expect(result).toBe("User not found");
	});

	it("should return the default message if the error is not a DomainError", () => {
		const result = getErrorMessage(
			new Error("Random error"),
			"Default message",
		);

		expect(result).toBe("Default message");
	});

	it("should return the default message if the value is not an Error at all", () => {
		const result = getErrorMessage("some string", "Default message");

		expect(result).toBe("Default message");
	});

	it("should handle DomainError with devMsg and still return user-facing message", () => {
		const error = new DomainError(
			DomainErrorType.BAD_REQUEST,
			"Invalid input",
			"Missing required field",
		);
		const result = getErrorMessage(error, "Default message");

		expect(result).toBe("Invalid input");
	});
});
