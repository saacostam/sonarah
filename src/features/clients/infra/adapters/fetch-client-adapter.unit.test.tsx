import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type INavigationAdapter,
	RouteName,
} from "@/features/navigation/domain";
import { NavigationAdapter } from "@/features/navigation/infra";
import type { IAuthAdapter } from "@/shared/adapters/auth/domain";
import { DomainErrorType } from "@/shared/adapters/errors/domain";
import type { IRouterAdapter } from "@/shared/adapters/router/domain";
import { FetchClientAdapter } from "./fetch-client-adapter";

describe("FetchClientAdapter [Unit]", () => {
	let fetchMock: ReturnType<typeof vi.fn>;
	let authAdapter: IAuthAdapter;
	let routerAdapter: IRouterAdapter;
	let navigationAdapter: INavigationAdapter;
	let adapter: FetchClientAdapter;

	beforeEach(() => {
		fetchMock = vi.fn();
		// @ts-expect-error: Override global fetch function
		global.fetch = fetchMock;

		authAdapter = { removeToken: vi.fn() } as unknown as IAuthAdapter;
		routerAdapter = {
			push: vi.fn(),
		} as unknown as IRouterAdapter;
		navigationAdapter = new NavigationAdapter();

		adapter = new FetchClientAdapter(
			authAdapter,
			routerAdapter,
			navigationAdapter,
			{
				baseUrl: "https://api.example.com",
				defaultHeaders: { Authorization: "Bearer token" },
			},
		);
	});

	it("builds URL with query params", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: () => Promise.resolve("{}"),
		});

		await adapter.get("/users", { params: { active: true, page: 2 } });

		expect(fetchMock).toHaveBeenCalledWith(
			"https://api.example.com/users?active=true&page=2",
			expect.any(Object),
		);
	});

	it("merges headers correctly", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: () => Promise.resolve("{}"),
		});

		await adapter.post(
			"/users",
			{ name: "John" },
			{ headers: { "X-Test": "yes" } },
		);

		const call = fetchMock.mock.calls[0][1];
		expect(call.headers).toEqual({
			"Content-Type": "application/json",
			Authorization: "Bearer token",
			"X-Test": "yes",
		});
	});

	it("returns parsed JSON on success", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: () => Promise.resolve('{"id":1,"name":"John"}'),
		});

		const data = await adapter.get<{ id: number; name: string }>("/user");
		expect(data).toEqual({ id: 1, name: "John" });
	});

	it("returns empty object for 204", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 204,
			text: () => Promise.resolve(""),
		});

		const data = await adapter.get("/empty");
		expect(data).toEqual({});
	});

	it("throws DomainError on 404", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 404,
			statusText: "Not Found",
			text: () => Promise.resolve("Missing resource"),
		});

		await expect(adapter.get("/missing")).rejects.toMatchObject({
			type: DomainErrorType.NOT_FOUND,
			message: "Not found",
		});
	});

	it("handles 401 by removing token and redirecting home", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
			text: () => Promise.resolve("Unauthorized"),
		});

		await expect(adapter.get("/protected")).rejects.toThrow(
			"HTTP 401 Unauthorized",
		);

		expect(authAdapter.removeToken).toHaveBeenCalled();
		expect(routerAdapter.push).toHaveBeenCalledWith(
			navigationAdapter.generateRoute({
				name: RouteName.HOME,
			}),
		);
	});

	it("throws for invalid JSON responses", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: () => Promise.resolve("not-json"),
		});

		await expect(adapter.get("/invalid")).rejects.toThrow(
			"Invalid JSON response",
		);
	});

	it("throws for other HTTP errors", async () => {
		fetchMock.mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
			text: () => Promise.resolve("Server exploded"),
		});

		await expect(adapter.get("/boom")).rejects.toThrow(
			"HTTP 500 Internal Server Error",
		);
	});
});
