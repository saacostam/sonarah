import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockLeanPlaylistFactory } from "@/features/playlists/test";
import { renderWithProviders } from "@/shared/tests";
import { MyPlaylists } from "./app";

describe("MyPlaylists [Integration]", () => {
	const onCreatePlaylist = vi.fn();
	const onSearchPlaylist = vi.fn();

	beforeEach(() => {
		onCreatePlaylist.mockReset();
		onSearchPlaylist.mockReset();
	});

	describe("UI", () => {
		describe("Playlists", () => {
			it("should render playlists", async () => {
				const mockData = MockLeanPlaylistFactory(2);

				renderWithProviders(
					<MyPlaylists
						onCreatePlaylist={onCreatePlaylist}
						onSearchPlaylist={onSearchPlaylist}
					/>,
					{
						adapters: {
							routerAdapter: {
								generateRoute: () => "/route",
							},
						},
						repositories: {
							playlist: {
								getAll: async () => ({
									page: 1,
									playlists: mockData,
									total: mockData.length,
								}),
							},
						},
					},
				);

				await waitFor(() => {
					expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull();
					expect(
						screen.getByTestId("my-playlists-content"),
					).toBeInTheDocument();
				});

				const elements =
					await screen.findAllByTestId<HTMLAnchorElement>("playlist-item");
				expect(elements).toHaveLength(mockData.length);

				elements.forEach((el, index) => {
					const playlist = mockData[index];
					expect(
						within(el).getByRole("heading", { name: playlist.name }),
					).toBeInTheDocument();
					expect(new URL(el.href).pathname).toBe("/route");
				});
			});

			it("should render empty-query if zero playlists are found", async () => {
				renderWithProviders(
					<MyPlaylists
						onCreatePlaylist={onCreatePlaylist}
						onSearchPlaylist={onSearchPlaylist}
					/>,
					{
						repositories: {
							playlist: {
								getAll: async () => ({
									page: 1,
									playlists: [],
									total: 0,
								}),
							},
						},
					},
				);

				await waitFor(() => {
					expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull();
					expect(
						screen.getByTestId("my-playlists-content"),
					).toBeInTheDocument();
				});

				expect(screen.getByTestId("empty-query")).toBeInTheDocument();
			});
		});

		describe("Pagination", () => {
			it("should render correct number of pages with 14 per page", async () => {
				const TESTS = [
					{ total: 1, pages: 1 },
					{ total: 15, pages: 2 },
					{ total: 29, pages: 3 },
				];

				for (const { total, pages } of TESTS) {
					renderWithProviders(
						<MyPlaylists
							onCreatePlaylist={onCreatePlaylist}
							onSearchPlaylist={onSearchPlaylist}
						/>,
						{
							adapters: {
								routerAdapter: {
									generateRoute: () => "/route",
								},
							},
							repositories: {
								playlist: {
									getAll: async () => ({
										page: 1,
										playlists: MockLeanPlaylistFactory(total),
										total,
									}),
								},
							},
						},
					);

					await waitFor(() =>
						expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull(),
					);

					const pagination = await screen.findByTestId(
						"my-playlist-pagination",
					);

					const buttons = within(pagination).queryAllByRole("button");
					expect(buttons).toHaveLength(pages);

					cleanup();
				}
			});
		});
	});

	describe("Logic", () => {
		it("should call on-create-playlist when button is clicked", async () => {
			renderWithProviders(
				<MyPlaylists
					onCreatePlaylist={onCreatePlaylist}
					onSearchPlaylist={onSearchPlaylist}
				/>,
				{
					repositories: {
						playlist: {
							getAll: async () => ({
								page: 1,
								playlists: [],
								total: 1,
							}),
						},
					},
				},
			);

			await waitFor(() =>
				expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull(),
			);

			const button = await screen.findByRole("button", { name: /create/i });
			await userEvent.click(button);

			expect(onCreatePlaylist).toHaveBeenCalledTimes(1);
		});

		it("should call on-search-playlist when button is clicked", async () => {
			renderWithProviders(
				<MyPlaylists
					onCreatePlaylist={onCreatePlaylist}
					onSearchPlaylist={onSearchPlaylist}
				/>,
				{
					repositories: {
						playlist: {
							getAll: async () => ({
								page: 1,
								playlists: [],
								total: 1,
							}),
						},
					},
				},
			);

			await waitFor(() =>
				expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull(),
			);

			const button = await screen.findByRole("button", { name: /import/i });
			await userEvent.click(button);

			expect(onSearchPlaylist).toHaveBeenCalledTimes(1);
		});
	});
});
