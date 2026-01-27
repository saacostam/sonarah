import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IClientAdapter } from "@/shared/adapters/clients/domain";
import type { IUser } from "../../domain";
import { UserRepository } from "./user-repository";

describe("UserRepository", () => {
	let clientAdapter: IClientAdapter;
	let repository: UserRepository;

	beforeEach(() => {
		clientAdapter = {
			get: vi.fn(),
			post: vi.fn(),
			put: vi.fn(),
			patch: vi.fn(),
			delete: vi.fn(),
		};

		repository = new UserRepository(clientAdapter);
	});

	it("fetches the user and maps the response correctly", async () => {
		const apiResponse = {
			id: "user-123",
			country: "CO",
			display_name: "Santiago",
			email: "santiago@test.com",
			images: [{ url: "https://img.test/profile.jpg" }],
		};

		vi.mocked(clientAdapter.get).mockResolvedValue(apiResponse);

		const result = await repository.getUser();

		expect(clientAdapter.get).toHaveBeenCalledTimes(1);
		expect(clientAdapter.get).toHaveBeenCalledWith("/v1/me");

		const expected: IUser = {
			id: "user-123",
			country: "CO",
			email: "santiago@test.com",
			name: "Santiago",
			profilePicture: "https://img.test/profile.jpg",
		};

		expect(result).toEqual(expected);
	});

	it("returns undefined profilePicture when images array is empty", async () => {
		vi.mocked(clientAdapter.get).mockResolvedValue({
			id: "user-123",
			country: "CO",
			display_name: "Santiago",
			email: "santiago@test.com",
			images: [],
		});

		const result = await repository.getUser();

		expect(result.profilePicture).toBeUndefined();
	});
});
