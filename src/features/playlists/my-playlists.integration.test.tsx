import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockLeanPlaylistFactory } from "@/features/playlists/test";
import { RouteName } from "@/shared/adapters/navigation/domain";
import { NavigationAdapter } from "@/shared/adapters/navigation/infra";
import { renderWithProviders } from "@/tests";
import { MyPlaylists } from "./app";

const navigationAdapter = new NavigationAdapter();

describe("MyPlaylists [Integration]", () => {
	const onCreatePlaylist = vi.fn();
	const onSearchPlaylist = vi.fn();
	const onUnfollowPlaylist = vi.fn();

	beforeEach(() => {
		onCreatePlaylist.mockReset();
		onSearchPlaylist.mockReset();
		onUnfollowPlaylist.mockReset();
	});

	describe("UI", () => {
		describe("Playlists", () => {
			it("should render playlists", async () => {
				const mockData = MockLeanPlaylistFactory(2);

				renderWithProviders(
					<MyPlaylists
						onCreatePlaylist={onCreatePlaylist}
						onSearchPlaylist={onSearchPlaylist}
						onUnfollowPlaylist={onUnfollowPlaylist}
					/>,
					{
						adapters: {
							navigationAdapter,
						},
						repositories: {
							playlist: {
								getAll: async () => ({
									page: 1,
									playlists: mockData,
									total: mockData.length,
									limit: 14,
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
					expect(new URL(el.href).pathname).toBe(
						navigationAdapter.generateRoute({
							name: RouteName.PLAYLIST_BY_ID,
							payload: { id: playlist.id },
						}),
					);
				});
			});

			it("should render empty-query if zero playlists are found", async () => {
				renderWithProviders(
					<MyPlaylists
						onCreatePlaylist={onCreatePlaylist}
						onSearchPlaylist={onSearchPlaylist}
						onUnfollowPlaylist={onUnfollowPlaylist}
					/>,
					{
						adapters: {
							navigationAdapter,
						},
						repositories: {
							playlist: {
								getAll: async () => ({
									page: 1,
									playlists: [],
									total: 0,
									limit: 14,
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
			const onCreatePlaylist = vi.fn();
			const onSearchPlaylist = vi.fn();

			const TESTS = [
				{ total: 1, pages: 1 },
				{ total: 14, pages: 1 },
				{ total: 15, pages: 2 },
				{ total: 28, pages: 2 },
				{ total: 29, pages: 3 },
			];

			TESTS.forEach(({ total, pages }) => {
				it(`renders correct number of pages (total=${total} → pages=${pages})`, async () => {
					renderWithProviders(
						<MyPlaylists
							onCreatePlaylist={onCreatePlaylist}
							onSearchPlaylist={onSearchPlaylist}
							onUnfollowPlaylist={onUnfollowPlaylist}
						/>,
						{
							adapters: { navigationAdapter },
							repositories: {
								playlist: {
									getAll: async () => ({
										page: 1,
										playlists: MockLeanPlaylistFactory(total),
										total,
										limit: 14,
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
				});
			});
		});
	});

	describe("Logic", () => {
		it("should call on-create-playlist when button is clicked", async () => {
			renderWithProviders(
				<MyPlaylists
					onCreatePlaylist={onCreatePlaylist}
					onSearchPlaylist={onSearchPlaylist}
					onUnfollowPlaylist={onUnfollowPlaylist}
				/>,
				{
					repositories: {
						playlist: {
							getAll: async () => ({
								page: 1,
								playlists: [],
								total: 1,
								limit: 14,
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
					onUnfollowPlaylist={onUnfollowPlaylist}
				/>,
				{
					repositories: {
						playlist: {
							getAll: async () => ({
								page: 1,
								playlists: [],
								total: 1,
								limit: 14,
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

		it("should call on-unfollow-playlist when unfollow button is clicked", async () => {
			const [playlist] = MockLeanPlaylistFactory(1);

			renderWithProviders(
				<MyPlaylists
					onCreatePlaylist={onCreatePlaylist}
					onSearchPlaylist={onSearchPlaylist}
					onUnfollowPlaylist={onUnfollowPlaylist}
				/>,
				{
					repositories: {
						playlist: {
							getAll: async () => ({
								page: 1,
								playlists: [playlist],
								total: 1,
								limit: 14,
							}),
						},
					},
					adapters: {
						navigationAdapter,
					},
				},
			);

			await waitFor(() =>
				expect(screen.queryByTestId("my-playlist-skeleton")).toBeNull(),
			);

			const playlistItem = await screen.findByTestId("playlist-item");
			const user = userEvent.setup();
			await user.pointer([
				{
					keys: "[MouseRight]",
					target: playlistItem,
				},
			]);

			const unfollowButton = await screen.findByRole("menuitem", {
				name: /Unfollow/i,
			});
			await userEvent.click(unfollowButton);

			expect(onUnfollowPlaylist).toHaveBeenCalledTimes(1);
			expect(onUnfollowPlaylist).toHaveBeenCalledWith(playlist.id);
		});
	});
});
