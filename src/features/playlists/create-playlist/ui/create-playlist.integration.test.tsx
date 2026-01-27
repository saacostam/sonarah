import {
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { IUser } from "@/features/user/domain";
import { DomainError, DomainErrorType } from "@/shared/adapters/errors/domain";
import { renderWithProviders } from "@/tests";
import type { IPlaylistRepositoryPayload } from "../../shared/domain";
import { CreatePlaylist } from "./create-playlist";

describe("CreatePlaylist (repo integration)", () => {
	it("renders skeleton while user query is loading", () => {
		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={vi.fn()} />,
			{
				repositories: {
					user: {
						getUser: vi.fn(() => new Promise<IUser>(() => {})),
					},
				},
			},
		);

		expect(screen.getByTestId("create-playlist-skeleton")).toBeInTheDocument();
	});

	it("renders QueryError and retries fetching user", async () => {
		const error = new DomainError(
			DomainErrorType.APP_ERROR,
			"User message",
			"Internal error",
		);

		const getUser = vi.fn().mockRejectedValue(error);

		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={vi.fn()} />,
			{
				repositories: {
					user: {
						getUser,
					},
				},
			},
		);

		expect(await screen.findByTestId("query-error")).toBeInTheDocument();
		expect(screen.getByText("Unable to fetch user")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: /retry/i }));

		await waitFor(() => {
			expect(getUser).toHaveBeenCalledTimes(2);
		});
	});

	it("creates playlist successfully and calls onSuccess", async () => {
		const onSuccess = vi.fn();

		const createResponse: IPlaylistRepositoryPayload["CreatePlaylistIn"] = {
			userId: "playlist-1",
			name: "My Playlist",
			visibility: "public",
		};
		const create = vi.fn().mockResolvedValue(createResponse);

		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={onSuccess} />,
			{
				repositories: {
					user: {
						getUser: vi.fn().mockResolvedValue({ id: "user-1" }),
					},
					playlist: {
						create,
					},
				},
			},
		);

		await userEvent.type(
			await screen.findByRole("textbox", { name: "Name" }),
			"My Playlist",
		);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		await waitFor(() => {
			expect(create).toHaveBeenCalledWith({
				name: "My Playlist",
				userId: "user-1",
				visibility: "private",
			});
		});

		expect(onSuccess).toHaveBeenCalled();
	});

	it("shows inline form error when playlist creation fails", async () => {
		const error = new DomainError(
			DomainErrorType.APP_ERROR,
			"Unable to create playlist right now.",
			"Internal error",
		);

		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={vi.fn()} />,
			{
				repositories: {
					user: {
						getUser: vi.fn().mockResolvedValue({ id: "user-1" }),
					},
					playlist: {
						create: vi.fn().mockRejectedValue(error),
					},
				},
			},
		);

		await userEvent.type(
			await screen.findByRole("textbox", { name: "Name" }),
			"My Playlist",
		);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		expect(
			await screen.findByText("Unable to create playlist right now."),
		).toBeInTheDocument();
	});

	it("shows zod validation error when name is empty", async () => {
		const create = vi.fn();

		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={vi.fn()} />,
			{
				repositories: {
					user: {
						getUser: vi.fn().mockResolvedValue({ id: "user-1" }),
					},
					playlist: {
						create,
					},
				},
			},
		);

		await waitFor(() => {
			expect(screen.queryByTestId("create-playlist-skeleton")).toBeNull();
		});

		userEvent.click(screen.getByRole("button", { name: "Create" }));
		expect(await screen.findByText("Required")).toBeInTheDocument();
		expect(create).not.toHaveBeenCalled();
	});

	it("shows zod validation error when name exceeds 50 chars", async () => {
		const create = vi.fn();

		renderWithProviders(
			<CreatePlaylist onCancel={vi.fn()} onSuccess={vi.fn()} />,
			{
				repositories: {
					user: {
						getUser: vi.fn().mockResolvedValue({ id: "user-1" }),
					},
					playlist: {
						create,
					},
				},
			},
		);

		await waitForElementToBeRemoved(() =>
			screen.queryByTestId("create-playlist-skeleton"),
		);

		await waitFor(() => {
			screen.getByTestId("create-playlist-content");
		});

		const nameInput = await screen.findByRole("textbox", { name: /name/i });

		await userEvent.type(nameInput, "a".repeat(51));
		await userEvent.click(screen.getByRole("button", { name: /create/i }));

		expect(
			await screen.findByText(
				"Playlist name can't be longer than 50 characters",
			),
		).toBeInTheDocument();

		expect(create).not.toHaveBeenCalled();
	});
});
